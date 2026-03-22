import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedSocket extends Socket {
    user: {
        userId: string;
        role: string;
    };
}

@WebSocketGateway({
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    },
    namespace: 'tracking',
})
@UsePipes(new ValidationPipe({ transform: true }))
export class TrackingGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(TrackingGateway.name);

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = this.extractToken(client);
            if (!token) {
                client.disconnect();
                return;
            }

            const decoded = await this.jwtService.verifyAsync(token);
            (client as AuthenticatedSocket).user = {
                userId: decoded.sub,
                role: decoded.role,
            };

            this.logger.log(`📍 User connected to Tracking: ${decoded.sub}`);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            this.logger.error(`❌ Tracking Connection failed: ${errorMessage}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected from Tracking: ${client.id}`);
    }

    @SubscribeMessage('joinOrderTracking')
    async handleJoinOrderTracking(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { orderId: string },
    ) {
        await client.join(`order_${data.orderId}`);
        this.logger.log(
            `User ${client.user.userId} joined tracking for order ${data.orderId}`,
        );

        // Send current driver location if available
        const order = await this.prisma.order.findUnique({
            where: { orderId: data.orderId },
            select: {
                driverLatitude: true,
                driverLongitude: true,
                deliveryLatitude: true,
                deliveryLongitude: true,
                status: true,
            },
        });

        if (order) {
            client.emit('orderInfo', {
                orderId: data.orderId,
                status: order.status,
                driverLatitude: order.driverLatitude
                    ? Number(order.driverLatitude)
                    : null,
                driverLongitude: order.driverLongitude
                    ? Number(order.driverLongitude)
                    : null,
                deliveryLatitude: order.deliveryLatitude
                    ? Number(order.deliveryLatitude)
                    : null,
                deliveryLongitude: order.deliveryLongitude
                    ? Number(order.deliveryLongitude)
                    : null,
            });
        }
    }

    @SubscribeMessage('updateDriverLocation')
    async handleUpdateDriverLocation(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody()
        data: { orderId: string; latitude: number; longitude: number },
    ) {
        // Update driver location in database
        await this.prisma.order.update({
            where: { orderId: data.orderId },
            data: {
                driverLatitude: data.latitude,
                driverLongitude: data.longitude,
            },
        });

        // Broadcast to all clients watching this order
        this.server.to(`order_${data.orderId}`).emit('driverLocationUpdate', {
            orderId: data.orderId,
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: new Date().toISOString(),
        });

        this.logger.log(
            `📍 Driver location updated for order ${data.orderId}: [${data.latitude}, ${data.longitude}]`,
        );
    }

    @SubscribeMessage('leaveOrderTracking')
    async handleLeaveOrderTracking(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { orderId: string },
    ) {
        await client.leave(`order_${data.orderId}`);
        this.logger.log(
            `User ${client.user.userId} left tracking for order ${data.orderId}`,
        );
    }

    private extractToken(client: Socket): string | undefined {
        const handshakeToken = client.handshake.auth?.token;
        if (handshakeToken && typeof handshakeToken === 'string')
            return handshakeToken;

        const authHeader = client.handshake.headers.authorization;
        if (authHeader && typeof authHeader === 'string') {
            return authHeader.split(' ')[1];
        }

        const cookieHeader = client.handshake.headers.cookie;
        if (cookieHeader) {
            const match = cookieHeader.match(/(^|;)\s*accessToken\s*=\s*([^;]+)/);
            return match ? match[2] : undefined;
        }

        return undefined;
    }
}

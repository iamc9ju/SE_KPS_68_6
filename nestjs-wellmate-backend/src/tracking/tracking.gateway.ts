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

    // ===============================
    // JOIN TRACKING
    // ===============================
    @SubscribeMessage('joinOrderTracking')
    async handleJoinOrderTracking(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { orderId: string },
    ) {
        await client.join(`order_${data.orderId}`);

        const order = await this.prisma.order.findUnique({
            where: { orderId: data.orderId },
            select: {
                // ✅ เปลี่ยนจาก driver เป็น delivery ทั้งหมด
                deliveryLatitude: true,
                deliveryLongitude: true,
                status: true,
            },
        });

        if (order) {
            client.emit('orderInfo', {
                orderId: data.orderId,
                status: order.status,
                // ✅ ปรับชื่อ property ให้ตรงกับที่ดึงมาจาก DB
                deliveryLatitude:
                    order.deliveryLatitude !== null
                        ? Number(order.deliveryLatitude)
                        : null,
                deliveryLongitude:
                    order.deliveryLongitude !== null
                        ? Number(order.deliveryLongitude)
                        : null,
            });
        }
    }

    // ===============================
    // UPDATE DELIVERY LOCATION (เปลี่ยนชื่อจาก Driver)
    // ===============================
    @SubscribeMessage('updateDriverLocation')
    async handleUpdateDriverLocation(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody()
        data: { orderId: string; latitude: number; longitude: number },
    ) {
        const lat =
            data.latitude !== undefined ? Number(data.latitude) : null;
        const lng =
            data.longitude !== undefined ? Number(data.longitude) : null;

        await this.prisma.order.update({
            where: { orderId: data.orderId },
            data: {
                // ✅ แก้เป็นชื่อฟิลด์ที่ถูกต้องใน Schema
                deliveryLatitude: lat,
                deliveryLongitude: lng,
            },
        });

        // แจ้งเตือนไปยังทุกคนที่ติดตาม order นี้ (รวมถึงหน้าบ้านที่รอรับของ)
        this.server.to(`order_${data.orderId}`).emit('driverLocationUpdate', {
            orderId: data.orderId,
            latitude: lat,
            longitude: lng,
            timestamp: new Date().toISOString(),
        });

        this.logger.log(
            `📍 Location updated: ${data.orderId} → [${lat}, ${lng}]`,
        );
    }

    // ===============================
    // LEAVE
    // ===============================
    @SubscribeMessage('leaveOrderTracking')
    async handleLeaveOrderTracking(
        @ConnectedSocket() client: AuthenticatedSocket,
        @MessageBody() data: { orderId: string },
    ) {
        await client.leave(`order_${data.orderId}`);
    }

    // ===============================
    // TOKEN EXTRACT
    // ===============================
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
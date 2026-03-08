import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';

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
  namespace: 'notifications',
})
@UsePipes(new ValidationPipe({ transform: true }))
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

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

      await client.join(`user_${decoded.sub}`);

      this.logger.log(`🔔 User connected to Notifications: ${decoded.sub}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`❌ Notifications Connection failed: ${errorMessage}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from Notifications: ${client.id}`);
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

  sendToUser(userId: string, event: string, payload: Record<string, unknown>) {
    this.server.to(`user_${userId}`).emit(event, payload);
  }
}

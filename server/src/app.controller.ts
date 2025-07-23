import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('heartbeat')
  public getHeartbeat(@Req() request: Request): { status: string; timestamp: string; activeUsers: number } {
    // Extract IP address from request, handling potential proxy headers
    const ipAddress = this.getClientIpAddress(request);
    return this.appService.getHeartbeat(ipAddress);
  }

  @Get('stats')
  public getUserStats(): { totalTracked: number; activeUsers: number; oldestActivity: Date | null } {
    return this.appService.getUserActivityStats();
  }

  private getClientIpAddress(request: Request): string {
    // Check for IP address in common proxy headers first
    const forwardedFor = request.headers['x-forwarded-for'];
    const realIp = request.headers['x-real-ip'];
    const clientIp = request.headers['x-client-ip'];

    if (forwardedFor) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
      return ips.split(',')[0].trim();
    }

    if (realIp && typeof realIp === 'string') {
      return realIp;
    }

    if (clientIp && typeof clientIp === 'string') {
      return clientIp;
    }

    // Fallback to connection remote address
    return request.connection.remoteAddress || 
           request.socket.remoteAddress || 
           (request.connection as any)?.socket?.remoteAddress || 
           'unknown';
  }
}

import { Injectable } from '@nestjs/common';

interface UserActivity {
  ipAddress: string;
  lastSeen: Date;
}

@Injectable()
export class AppService {
  private userActivities: Map<string, UserActivity> = new Map();
  private readonly ACTIVITY_WINDOW_HOURS = 24;

  public getHeartbeat(ipAddress: string): { status: string; timestamp: string; activeUsers: number } {
    // Update or add the IP address activity
    this.updateUserActivity(ipAddress);
    
    // Clean up old activities and get current active user count
    const activeUserCount = this.getActiveUserCount();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      activeUsers: activeUserCount
    };
  }

  private updateUserActivity(ipAddress: string): void {
    this.userActivities.set(ipAddress, {
      ipAddress,
      lastSeen: new Date()
    });
  }

  private getActiveUserCount(): number {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - this.ACTIVITY_WINDOW_HOURS);

    // Remove expired activities
    for (const [ip, activity] of this.userActivities.entries()) {
      if (activity.lastSeen < cutoffTime) {
        this.userActivities.delete(ip);
      }
    }

    return this.userActivities.size;
  }

  // Optional: Get detailed user activity information for debugging/monitoring
  public getUserActivityStats(): { totalTracked: number; activeUsers: number; oldestActivity: Date | null } {
    const activeUserCount = this.getActiveUserCount();
    let oldestActivity: Date | null = null;

    if (this.userActivities.size > 0) {
      oldestActivity = Array.from(this.userActivities.values())
        .reduce((oldest, current) => 
          oldest.lastSeen < current.lastSeen ? oldest : current
        ).lastSeen;
    }

    return {
      totalTracked: this.userActivities.size,
      activeUsers: activeUserCount,
      oldestActivity
    };
  }
}

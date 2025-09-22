// Security logging utility for financial applications
import { isDevelopment } from './environment';

interface SecurityEvent {
  type: 'AUTH_FAILURE' | 'RATE_LIMIT' | 'SUSPICIOUS_ACTIVITY' | 'SESSION_TIMEOUT' | 'CSRF_ATTEMPT';
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: number;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events in memory

  log(event: Omit<SecurityEvent, 'timestamp'>) {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (isDevelopment()) {
      console.warn('Security Event:', securityEvent);
    }

    // In production, you would send this to a security monitoring service
    this.sendToMonitoringService(securityEvent);
  }

  private sendToMonitoringService(_event: SecurityEvent) {
    // In production, implement actual monitoring service integration
    // Examples: Sentry, DataDog, AWS CloudWatch, etc.
    
    if (import.meta.env?.PROD) {
      // Example: Send to external monitoring service
      // fetch('/api/security-events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // }).catch(console.error);
    }
  }

  getRecentEvents(type?: SecurityEvent['type'], limit = 50): SecurityEvent[] {
    let filtered = this.events;
    
    if (type) {
      filtered = this.events.filter(event => event.type === type);
    }
    
    return filtered
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  getEventStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    
    this.events.forEach(event => {
      stats[event.type] = (stats[event.type] || 0) + 1;
    });
    
    return stats;
  }
}

// Singleton instance
export const securityLogger = new SecurityLogger();

// Helper functions for common security events
export const logAuthFailure = (userId: string, reason: string, ip?: string) => {
  securityLogger.log({
    type: 'AUTH_FAILURE',
    userId,
    ip,
    userAgent: navigator.userAgent,
    details: { reason },
  });
};

export const logRateLimit = (identifier: string, attempts: number, ip?: string) => {
  securityLogger.log({
    type: 'RATE_LIMIT',
    ip,
    userAgent: navigator.userAgent,
    details: { identifier, attempts },
  });
};

export const logSuspiciousActivity = (activity: string, details: Record<string, any>, ip?: string) => {
  securityLogger.log({
    type: 'SUSPICIOUS_ACTIVITY',
    ip,
    userAgent: navigator.userAgent,
    details: { activity, ...details },
  });
};

export const logSessionTimeout = (userId: string, sessionDuration: number) => {
  securityLogger.log({
    type: 'SESSION_TIMEOUT',
    userId,
    details: { sessionDuration },
  });
};

export const logCSRFAttempt = (target: string, ip?: string) => {
  securityLogger.log({
    type: 'CSRF_ATTEMPT',
    ip,
    userAgent: navigator.userAgent,
    details: { target },
  });
};

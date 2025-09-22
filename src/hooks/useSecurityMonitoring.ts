import { useEffect, useCallback, useRef } from 'react';
import { securityLogger, logSuspiciousActivity } from '@/utils/securityLogger';
import { isSessionExpired } from '@/utils/secureStorage';

interface SecurityMonitoringConfig {
  enableConsoleLogging?: boolean;
  enableNetworkMonitoring?: boolean;
  enableDOMMonitoring?: boolean;
  enableErrorMonitoring?: boolean;
  sessionCheckInterval?: number;
}

export const useSecurityMonitoring = (config: SecurityMonitoringConfig = {}) => {
  const {
    enableConsoleLogging = true,
    enableNetworkMonitoring = true,
    enableDOMMonitoring = true,
    enableErrorMonitoring = true,
    sessionCheckInterval = 30000, // 30 seconds
  } = config;

  const sessionCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor console access attempts
  const monitorConsoleAccess = useCallback(() => {
    if (!enableConsoleLogging) return;

    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
    };

    // Override console methods to detect suspicious usage
    console.log = (...args) => {
      logSuspiciousActivity('Console access attempt', { method: 'log', args: args.length });
      originalConsole.log(...args);
    };

    console.warn = (...args) => {
      logSuspiciousActivity('Console access attempt', { method: 'warn', args: args.length });
      originalConsole.warn(...args);
    };

    console.error = (...args) => {
      logSuspiciousActivity('Console access attempt', { method: 'error', args: args.length });
      originalConsole.error(...args);
    };

    console.info = (...args) => {
      logSuspiciousActivity('Console access attempt', { method: 'info', args: args.length });
      originalConsole.info(...args);
    };

    return () => {
      Object.assign(console, originalConsole);
    };
  }, [enableConsoleLogging]);

  // Monitor network requests
  const monitorNetworkRequests = useCallback(() => {
    if (!enableNetworkMonitoring) return;

    const originalFetch = window.fetch;
    const originalXHROpen = XMLHttpRequest.prototype.open;

    // Monitor fetch requests
    window.fetch = async (...args) => {
      const [resource, config] = args;
      const url = typeof resource === 'string' ? resource : (resource as Request).url;
      
      // Log suspicious external requests
      if (url.includes('http') && !url.includes(window.location.origin)) {
        logSuspiciousActivity('External network request', { 
          url, 
          method: config?.method || 'GET',
          timestamp: Date.now()
        });
      }

      try {
        const response = await originalFetch(...args);
        
        // Log failed requests
        if (!response.ok) {
          logSuspiciousActivity('Failed network request', {
            url,
            status: response.status,
            statusText: response.statusText
          });
        }

        return response;
      } catch (error) {
        logSuspiciousActivity('Network request error', {
          url,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
      }
    };

    // Monitor XMLHttpRequest
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null) {
      const urlString = typeof url === 'string' ? url : url.toString();
      if (urlString.includes('http') && !urlString.includes(window.location.origin)) {
        logSuspiciousActivity('External XHR request', { 
          url: urlString, 
          method,
          timestamp: Date.now()
        });
      }
      return originalXHROpen.call(this, method, url, async ?? true, username, password);
    };

    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXHROpen;
    };
  }, [enableNetworkMonitoring]);

  // Monitor DOM modifications
  const monitorDOMModifications = useCallback(() => {
    if (!enableDOMMonitoring) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Check for suspicious script injections
              if (element.tagName === 'SCRIPT' && element.getAttribute('src')?.includes('http')) {
                logSuspiciousActivity('Suspicious script injection detected', {
                  src: element.getAttribute('src'),
                  innerHTML: element.innerHTML.substring(0, 100)
                });
              }

              // Check for suspicious iframe injections
              if (element.tagName === 'IFRAME') {
                logSuspiciousActivity('Iframe injection detected', {
                  src: element.getAttribute('src'),
                  sandbox: element.getAttribute('sandbox')
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'onclick', 'onload']
    });

    return () => observer.disconnect();
  }, [enableDOMMonitoring]);

  // Monitor global errors
  const monitorErrors = useCallback(() => {
    if (!enableErrorMonitoring) return;

    const handleError = (event: ErrorEvent) => {
      logSuspiciousActivity('JavaScript error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logSuspiciousActivity('Unhandled promise rejection', {
        reason: event.reason,
        promise: event.promise
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enableErrorMonitoring]);

  // Session monitoring
  const monitorSession = useCallback(() => {
    const checkSession = () => {
      if (isSessionExpired()) {
        logSuspiciousActivity('Session expired', {
          lastActivity: localStorage.getItem('lastActivity'),
          currentTime: Date.now()
        });
        
        // Clear session and redirect
        localStorage.clear();
        window.location.href = '/auth/login';
      }
    };

    sessionCheckRef.current = setInterval(checkSession, sessionCheckInterval);

    // Track user activity
    const updateLastActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateLastActivity, true);
    });

    return () => {
      if (sessionCheckRef.current) {
        clearInterval(sessionCheckRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, updateLastActivity, true);
      });
    };
  }, [sessionCheckInterval]);

  // Initialize monitoring
  useEffect(() => {
    const cleanupFunctions = [
      monitorConsoleAccess(),
      monitorNetworkRequests(),
      monitorDOMModifications(),
      monitorErrors(),
      monitorSession(),
    ].filter(Boolean);

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup?.());
    };
  }, [
    monitorConsoleAccess,
    monitorNetworkRequests,
    monitorDOMModifications,
    monitorErrors,
    monitorSession,
  ]);

  // Manual security checks
  const performSecurityCheck = useCallback(() => {
    const checks = {
      devToolsOpen: false,
      suspiciousExtensions: false,
      localStorageTampered: false,
      sessionValid: !isSessionExpired(),
    };

    // Check if dev tools are open
    const threshold = 160;
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      checks.devToolsOpen = true;
      logSuspiciousActivity('Dev tools detected', { threshold });
    }

    // Check for suspicious browser extensions
    const suspiciousPatterns = ['chrome-extension://', 'moz-extension://', 'safari-extension://'];
    const scripts = Array.from(document.scripts);
    const hasSuspiciousExtensions = scripts.some(script => 
      suspiciousPatterns.some(pattern => script.src.includes(pattern))
    );
    
    if (hasSuspiciousExtensions) {
      checks.suspiciousExtensions = true;
      logSuspiciousActivity('Suspicious browser extensions detected', { scripts: scripts.length });
    }

    // Check localStorage integrity
    try {
      const testKey = '__security_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (error) {
      checks.localStorageTampered = true;
      logSuspiciousActivity('LocalStorage tampered', { error: error instanceof Error ? error.message : 'Unknown' });
    }

    return checks;
  }, []);

  return {
    performSecurityCheck,
    getSecurityStats: () => securityLogger.getEventStats(),
    getRecentEvents: (type?: string) => securityLogger.getRecentEvents(type as any),
  };
};

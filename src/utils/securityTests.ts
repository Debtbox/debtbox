// Frontend Security Testing Framework
import { securityLogger } from './securityLogger';
import { validateIBAN } from './ibanValidation';
import { sanitizeInput, escapeHtml } from './securityValidation';

export interface SecurityTestResult {
  testName: string;
  passed: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
}

export class SecurityTestSuite {
  private results: SecurityTestResult[] = [];

  // XSS Protection Tests
  testXSSProtection(): SecurityTestResult {
    const testName = 'XSS Protection';
    const maliciousInputs = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(\'xss\')">',
      '<svg onload="alert(\'xss\')">',
      '"><script>alert("xss")</script>',
    ];

    try {
      maliciousInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        const escaped = escapeHtml(input);
        
        if (sanitized.includes('<script>') || escaped.includes('<script>')) {
          throw new Error(`XSS protection failed for input: ${input}`);
        }
      });

      return {
        testName,
        passed: true,
        severity: 'high',
        message: 'XSS protection is working correctly',
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        severity: 'critical',
        message: `XSS protection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Input Validation Tests
  testInputValidation(): SecurityTestResult {
    const testName = 'Input Validation';
    
    try {
      // Test IBAN validation
      const validIBAN = 'SA0380000000608010167519';
      const invalidIBAN = 'INVALID_IBAN';
      
      const validResult = validateIBAN(validIBAN);
      const invalidResult = validateIBAN(invalidIBAN);
      
      if (!validResult.isValid || invalidResult.isValid) {
        throw new Error('IBAN validation is not working correctly');
      }

      // Test input sanitization
      const maliciousInput = '<script>alert("test")</script>';
      const sanitized = sanitizeInput(maliciousInput);
      
      if (sanitized.includes('<script>')) {
        throw new Error('Input sanitization is not working correctly');
      }

      return {
        testName,
        passed: true,
        severity: 'high',
        message: 'Input validation is working correctly',
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        severity: 'high',
        message: `Input validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Local Storage Security Tests
  testLocalStorageSecurity(): SecurityTestResult {
    const testName = 'Local Storage Security';
    
    try {
      // Test if sensitive data is stored in localStorage
      const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
      const localStorageKeys = Object.keys(localStorage);
      
      const hasSensitiveData = localStorageKeys.some(key => 
        sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))
      );
      
      if (hasSensitiveData) {
        return {
          testName,
          passed: false,
          severity: 'high',
          message: 'Sensitive data found in localStorage',
          details: { sensitiveKeys: localStorageKeys.filter(key => 
            sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))
          )},
        };
      }

      return {
        testName,
        passed: true,
        severity: 'medium',
        message: 'No sensitive data found in localStorage',
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        severity: 'medium',
        message: `LocalStorage security test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Cookie Security Tests
  testCookieSecurity(): SecurityTestResult {
    const testName = 'Cookie Security';
    
    try {
      const cookies = document.cookie.split(';');
      // const insecureCookies: string[] = [];
      
      cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        
        // Check for sensitive cookies without secure flag
        if (name && (name.includes('token') || name.includes('auth') || name.includes('session'))) {
          // Note: We can't directly check cookie flags from JavaScript
          // This is a basic check - real security testing should be done server-side
          if (value && value.length > 0) {
            // Log for monitoring
            securityLogger.log({
              type: 'SUSPICIOUS_ACTIVITY',
              details: { 
                activity: 'Cookie security check',
                cookieName: name,
                hasValue: !!value
              }
            });
          }
        }
      });

      return {
        testName,
        passed: true,
        severity: 'medium',
        message: 'Cookie security check completed',
        details: { totalCookies: cookies.length },
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        severity: 'medium',
        message: `Cookie security test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Content Security Policy Tests
  testCSPCompliance(): SecurityTestResult {
    const testName = 'CSP Compliance';
    
    try {
      // Check if CSP is properly configured
      const metaCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      const cspHeader = document.querySelector('meta[name="csp-report-only"]');
      
      if (!metaCSP && !cspHeader) {
        return {
          testName,
          passed: false,
          severity: 'high',
          message: 'No Content Security Policy detected',
        };
      }

      // Test inline script execution (should be blocked by CSP)
      const testScript = document.createElement('script');
      testScript.textContent = 'window.cspTest = true;';
      
      let cspWorking = false;
      const originalError = window.onerror;
      
      window.onerror = (message) => {
        if (typeof message === 'string' && message.includes('Content Security Policy')) {
          cspWorking = true;
        }
        return false;
      };
      
      document.head.appendChild(testScript);
      document.head.removeChild(testScript);
      
      window.onerror = originalError;

      return {
        testName,
        passed: cspWorking,
        severity: 'high',
        message: cspWorking ? 'CSP is working correctly' : 'CSP may not be properly configured',
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        severity: 'high',
        message: `CSP test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Network Security Tests
  testNetworkSecurity(): SecurityTestResult {
    const testName = 'Network Security';
    
    try {
      // Check if running on HTTPS
      const isHTTPS = window.location.protocol === 'https:';
      
      if (!isHTTPS && window.location.hostname !== 'localhost') {
        return {
          testName,
          passed: false,
          severity: 'critical',
          message: 'Application is not running on HTTPS',
        };
      }

      // Check for mixed content
      const images = document.querySelectorAll('img[src^="http:"]');
      const scripts = document.querySelectorAll('script[src^="http:"]');
      const links = document.querySelectorAll('link[href^="http:"]');
      
      const mixedContent = [...images, ...scripts, ...links];
      
      if (mixedContent.length > 0) {
        return {
          testName,
          passed: false,
          severity: 'high',
          message: 'Mixed content detected (HTTP resources on HTTPS page)',
          details: { mixedContentCount: mixedContent.length },
        };
      }

      return {
        testName,
        passed: true,
        severity: 'high',
        message: 'Network security is properly configured',
      };
    } catch (error) {
      return {
        testName,
        passed: false,
        severity: 'high',
        message: `Network security test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  // Run all security tests
  async runAllTests(): Promise<SecurityTestResult[]> {
    this.results = [];
    
    const tests = [
      () => this.testXSSProtection(),
      () => this.testInputValidation(),
      () => this.testLocalStorageSecurity(),
      () => this.testCookieSecurity(),
      () => this.testCSPCompliance(),
      () => this.testNetworkSecurity(),
    ];

    for (const test of tests) {
      try {
        const result = test();
        this.results.push(result);
        
        // Log failed tests
        if (!result.passed) {
          securityLogger.log({
            type: 'SUSPICIOUS_ACTIVITY',
            details: {
              activity: 'Security test failed',
              testName: result.testName,
              severity: result.severity,
              message: result.message
            }
          });
        }
      } catch (error) {
        this.results.push({
          testName: 'Unknown Test',
          passed: false,
          severity: 'critical',
          message: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      }
    }

    return this.results;
  }

  // Get test results summary
  getTestSummary(): {
    total: number;
    passed: number;
    failed: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  } {
    const summary = {
      total: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length,
      critical: this.results.filter(r => !r.passed && r.severity === 'critical').length,
      high: this.results.filter(r => !r.passed && r.severity === 'high').length,
      medium: this.results.filter(r => !r.passed && r.severity === 'medium').length,
      low: this.results.filter(r => !r.passed && r.severity === 'low').length,
    };

    return summary;
  }

  // Get failed tests
  getFailedTests(): SecurityTestResult[] {
    return this.results.filter(r => !r.passed);
  }
}

// Export singleton instance
export const securityTestSuite = new SecurityTestSuite();

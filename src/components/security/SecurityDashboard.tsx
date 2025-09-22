import React, { useState, useEffect } from 'react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { securityTestSuite } from '@/utils/securityTests';
import type { SecurityTestResult } from '@/utils/securityTests';
import { isDevelopment } from '@/utils/environment';
import { testApiConnection, testApiEndpoints } from '@/utils/apiTest';

interface SecurityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ isOpen, onClose }) => {
  const { performSecurityCheck, getSecurityStats, getRecentEvents } = useSecurityMonitoring();
  const [testResults, setTestResults] = useState<SecurityTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [securityCheck, setSecurityCheck] = useState<Record<string, boolean> | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [recentEvents, setRecentEvents] = useState<Array<{ type: string; timestamp: number; details: Record<string, unknown> }>>([]);

  useEffect(() => {
    if (isOpen) {
      loadSecurityData();
    }
  }, [isOpen]);

  const loadSecurityData = async () => {
    setStats(getSecurityStats());
    setRecentEvents(getRecentEvents());
    setSecurityCheck(performSecurityCheck());
  };

  const runSecurityTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await securityTestSuite.runAllTests();
      setTestResults(results);
    } catch (error) {
      // Log security test failure
      if (isDevelopment()) {
        console.error('Security tests failed:', error);
      }
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleTestApiConnection = async () => {
    if (isDevelopment()) {
      console.log('🔍 Testing API Connection...');
      await testApiConnection();
      await testApiEndpoints();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTestStatusIcon = (passed: boolean) => {
    return passed ? (
      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Tests */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Security Tests</h3>
                <button
                  onClick={runSecurityTests}
                  disabled={isRunningTests}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunningTests ? 'Running...' : 'Run Tests'}
                </button>
              </div>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getTestStatusIcon(result.passed)}
                        <div>
                          <p className="font-medium text-gray-900">{result.testName}</p>
                          <p className="text-sm text-gray-600">{result.message}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(result.severity)}`}>
                        {result.severity}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Security Check */}
              {securityCheck && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Current Security Status</h4>
                  <div className="space-y-2">
                    {Object.entries(securityCheck).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          value ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
                        }`}>
                          {value ? 'Detected' : 'Safe'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Security Events */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Security Events</h3>
              
              {/* Event Stats */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(stats).map(([type, count]) => (
                  <div key={type} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-gray-900">{count as number}</p>
                  </div>
                ))}
              </div>

              {/* Recent Events */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Recent Events</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentEvents.slice(0, 10).map((event, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {event.type?.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {String(event.details?.activity || event.details?.reason || 'Security event detected')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-4">
            {isDevelopment() && (
              <button
                onClick={handleTestApiConnection}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Test API
              </button>
            )}
            <button
              onClick={loadSecurityData}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Refresh Data
            </button>
            <button
              onClick={() => {
                const failedTests = testResults.filter(t => !t.passed);
                if (failedTests.length > 0 && isDevelopment()) {
                  console.warn('Security Issues Detected:', failedTests);
                }
              }}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;

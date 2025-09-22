import { axios } from '@/lib/axios';
import { API_BASE_URL } from '@/utils/const';

/**
 * Test API connection and configuration
 */
export const testApiConnection = async () => {
  console.log('🔍 Testing API Connection...');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    // Test basic connectivity
    const response = await axios.get('/health', { 
      timeout: 5000,
      validateStatus: () => true // Accept any status code for testing
    });
    
    console.log('✅ API Connection Test Results:');
    console.log('- Status:', response.status);
    console.log('- Headers:', response.headers);
    console.log('- Data:', response.data);
    
    return {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ API Connection Test Failed:');
    console.error('- Error:', error.message);
    console.error('- Code:', error.code);
    console.error('- Config:', error.config);
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

/**
 * Test different API endpoints
 */
export const testApiEndpoints = async () => {
  const endpoints = [
    '/health',
    '/status',
    '/ping',
    '/api/health',
    '/v0.0.1/api/health'
  ];
  
  console.log('🔍 Testing API Endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint, { 
        timeout: 3000,
        validateStatus: () => true
      });
      
      console.log(`✅ ${endpoint}:`, response.status, response.data);
    } catch (error: any) {
      console.log(`❌ ${endpoint}:`, error.message);
    }
  }
};

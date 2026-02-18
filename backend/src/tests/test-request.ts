/**
 * Test Request Utilities - Section 2: Test Infrastructure
 * MASTER_TESTING_PLAN_REVISED.md
 * 
 * Utilities for making authenticated HTTP requests in integration tests
 * using Supertest
 */

import request from 'supertest';
import { Express } from 'express';

/**
 * HTTP Request wrapper with optional authentication
 */
export class TestRequest {
  private app: Express;
  private accessToken?: string;

  constructor(app: Express, accessToken?: string) {
    this.app = app;
    this.accessToken = accessToken;
  }

  /**
   * Set authentication token for subsequent requests
   */
  setToken(token: string) {
    this.accessToken = token;
    return this;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.accessToken = undefined;
    return this;
  }

  /**
   * POST request with optional authentication
   */
  post(endpoint: string, data?: any) {
    let req = request(this.app).post(endpoint);
    
    if (this.accessToken) {
      req = req.set('Authorization', `Bearer ${this.accessToken}`);
    }
    
    if (data) {
      req = req.send(data);
    }
    
    return req;
  }

  /**
   * GET request with optional authentication
   */
  get(endpoint: string) {
    let req = request(this.app).get(endpoint);
    
    if (this.accessToken) {
      req = req.set('Authorization', `Bearer ${this.accessToken}`);
    }
    
    return req;
  }

  /**
   * PUT request with optional authentication
   */
  put(endpoint: string, data?: any) {
    let req = request(this.app).put(endpoint);
    
    if (this.accessToken) {
      req = req.set('Authorization', `Bearer ${this.accessToken}`);
    }
    
    if (data) {
      req = req.send(data);
    }
    
    return req;
  }

  /**
   * DELETE request with optional authentication
   */
  delete(endpoint: string) {
    let req = request(this.app).delete(endpoint);
    
    if (this.accessToken) {
      req = req.set('Authorization', `Bearer ${this.accessToken}`);
    }
    
    return req;
  }

  /**
   * PATCH request with optional authentication
   */
  patch(endpoint: string, data?: any) {
    let req = request(this.app).patch(endpoint);
    
    if (this.accessToken) {
      req = req.set('Authorization', `Bearer ${this.accessToken}`);
    }
    
    if (data) {
      req = req.send(data);
    }
    
    return req;
  }
}

/**
 * Test response matcher utilities
 */
export const ResponseMatchers = {
  /**
   * Assert successful response (200-299)
   */
  isSuccess: (response: any) => {
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);
  },

  /**
   * Assert created response (201)
   */
  isCreated: (response: any) => {
    expect(response.status).toBe(201);
  },

  /**
   * Assert no content response (204)
   */
  isNoContent: (response: any) => {
    expect(response.status).toBe(204);
  },

  /**
   * Assert bad request (400)
   */
  isBadRequest: (response: any) => {
    expect(response.status).toBe(400);
  },

  /**
   * Assert unauthorized (401)
   */
  isUnauthorized: (response: any) => {
    expect(response.status).toBe(401);
  },

  /**
   * Assert forbidden (403)
   */
  isForbidden: (response: any) => {
    expect(response.status).toBe(403);
  },

  /**
   * Assert not found (404)
   */
  isNotFound: (response: any) => {
    expect(response.status).toBe(404);
  },

  /**
   * Assert conflict (409)
   */
  isConflict: (response: any) => {
    expect(response.status).toBe(409);
  },

  /**
   * Assert server error (500)
   */
  isServerError: (response: any) => {
    expect(response.status).toBe(500);
  },

  /**
   * Assert response has data property
   */
  hasData: (response: any) => {
    expect(response.body).toHaveProperty('data');
  },

  /**
   * Assert response has error property
   */
  hasError: (response: any) => {
    expect(response.body).toHaveProperty('error');
  },

  /**
   * Assert response is JSON
   */
  isJSON: (response: any) => {
    expect(response.type).toMatch(/json/);
  },
};

/**
 * Common API test assertions
 */
export const APIAssertions = {
  /**
   * Assert standard success response structure
   */
  assertSuccessResponse: (response: any, expectedStatus = 200) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('data');
    ResponseMatchers.isJSON(response);
  },

  /**
   * Assert standard error response structure
   */
  assertErrorResponse: (response: any, expectedStatus = 400) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('error');
    ResponseMatchers.isJSON(response);
  },

  /**
   * Assert paginated response
   */
  assertPaginatedResponse: (response: any) => {
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
    expect(response.body.pagination).toHaveProperty('page');
    expect(response.body.pagination).toHaveProperty('limit');
    expect(response.body.pagination).toHaveProperty('total');
  },

  /**
   * Assert array response
   */
  assertArrayResponse: (response: any, minItems = 0) => {
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThanOrEqual(minItems);
  },
};

export default {
  TestRequest,
  ResponseMatchers,
  APIAssertions,
};



import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

test.describe('API Tests: Car Creation', () => {
  let requestContext;

  test.beforeAll(async ({ playwright }) => {
    const storageStatePath = path.resolve(__dirname, '../auth/storageState.json'); 
    
    try {
      await import(storageStatePath, { assert: { type: 'json' } });
    } catch (e) {
      throw new Error(`storageState.json not found at ${storageStatePath}. Please run 'node e2e/auth/loginSetup.js' first.`);
    }

    requestContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL,
      storageState: storageStatePath,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    });
    console.log('API Tests: Authenticated via storageState.json');
  });

  test.afterAll(async () => {
    await requestContext.dispose();
  });

  test('should successfully create a new car with valid data', async () => {
    const carData = {
      carBrandId: 1,
      carModelId: 1,
      mileage: Math.floor(Math.random() * 100000) + 1
    };

    const response = await requestContext.post('/api/cars', {
      data: carData,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('status', 'ok');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody.data).toHaveProperty('id'); 
    expect(responseBody.data.carBrandId).toBe(carData.carBrandId);
    expect(responseBody.data.carModelId).toBe(carData.carModelId);
    expect(responseBody.data.mileage).toBe(carData.mileage);
  });

  test('should not create a car with invalid data (required mileage)', async () => {
    const invalidCarData = {
      carBrandId: 3, 
      carModelId: 13,
    };

    const response = await requestContext.post('/api/cars', {
      data: invalidCarData,
    });

    expect(response.status()).toBe(400); 
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('status', 'error');
    expect(responseBody).toHaveProperty('message', 'Mileage is required'); 
  });

  test('should not create a car with non-existent carBrandId', async () => {
    const nonExistentCarData = {
      carBrandId: 99999,
      carModelId: 1,
      mileage: 1000
    };

    const response = await requestContext.post('/api/cars', {
      data: nonExistentCarData,
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('status', 'error');
    expect(responseBody).toHaveProperty('message', 'Brand not found'); 
  });

});
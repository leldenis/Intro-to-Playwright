import { test, expect } from '@playwright/test';
import axios from 'axios';

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';

axios.interceptors.request.use(config => {
  console.log(`[Axios Request] ${config.method.toUpperCase()} ${config.url}`);
  if (config.data) {
    console.log('Request Body:', config.data);
  }
  return config;
}, error => {
  console.error('[Axios Request Error]', error.message);
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  console.log(`[Axios Response] ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
  console.log('Response Data:', response.data);
  return response;
}, error => {
  console.error('[Axios Response Error]', error.response ? `Status: ${error.response.status}, URL: ${error.config.url}` : error.message);
  if (error.response && error.response.data) {
    console.error('Error Response Data:', error.response.data);
  }
  return Promise.reject(error);
});


test.describe('JSONPlaceholder API Tests', () => {

  test('should retrieve all posts', async () => {
    const response = await axios.get('/posts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0]).toHaveProperty('userId');
    expect(response.data[0]).toHaveProperty('id');
    expect(response.data[0]).toHaveProperty('title');
    expect(response.data[0]).toHaveProperty('body');
  });

  test('should retrieve a single post by ID', async () => {
    const postId = 1;
    const response = await axios.get(`/posts/${postId}`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', postId);
    expect(response.data).toHaveProperty('title');
    expect(response.data).toHaveProperty('body');
  });

  test('should create a new post', async () => {
    const newPostData = {
      title: 'Тестовий Заголовок Поста',
      body: 'Це тіло нового тестового поста.',
      userId: 1,
    };
    const response = await axios.post('/posts', newPostData);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('title', newPostData.title);
    expect(response.data).toHaveProperty('body', newPostData.body);
    expect(response.data).toHaveProperty('userId', newPostData.userId);
  });

  test('should retrieve comments for a specific post', async () => {
    const postId = 1;
    const response = await axios.get(`/posts/${postId}/comments`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data[0]).toHaveProperty('postId', postId);
    expect(response.data[0]).toHaveProperty('id');
    expect(response.data[0]).toHaveProperty('name');
    expect(response.data[0]).toHaveProperty('email');
    expect(response.data[0]).toHaveProperty('body');
  });

  test('should create a new comment for a post', async () => {
    const postId = 1;
    const newCommentData = {
      name: 'Test Comment Name',
      email: 'test@example.com',
      body: 'This is a new test comment.',
      postId: postId,
    };
    const response = await axios.post(`/posts/${postId}/comments`, newCommentData);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id'); 
    expect(response.data).toHaveProperty('name', newCommentData.name);
    expect(response.data).toHaveProperty('email', newCommentData.email);
    expect(response.data).toHaveProperty('body', newCommentData.body);
  });

});
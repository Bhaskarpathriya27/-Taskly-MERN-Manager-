import { apiClient, authorizedHeaders } from './api-client';

export const getTasks = (token, params = {}) =>
  apiClient.get('/api/tasks', {
    ...authorizedHeaders(token),
    params,
  });

export const getTaskById = (token, id) =>
  apiClient.get(`/api/tasks/${id}`, {
    ...authorizedHeaders(token),
  });

export const createTask = (token, payload) =>
  apiClient.post('/api/tasks', payload, {
    ...authorizedHeaders(token),
  });

export const updateTask = (token, id, payload) =>
  apiClient.put(`/api/tasks/${id}`, payload, {
    ...authorizedHeaders(token),
  });

export const deleteTask = (token, id) =>
  apiClient.delete(`/api/tasks/${id}`, {
    ...authorizedHeaders(token),
  });


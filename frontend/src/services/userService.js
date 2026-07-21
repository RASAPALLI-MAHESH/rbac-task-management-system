import apiClient from '../api/axios';
import { getApiVersion } from '../utils/helpers';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const apiOrigin = configuredBaseUrl.replace(/\/api\/v\d+\/?$/, '');

const getTaskEndpoint = (path) => {
  const version = getApiVersion();
  return `${apiOrigin}/api/${version}/tasks${path}`;
};

const userService = {
  async getTasks() {
    const response = await apiClient.get(getTaskEndpoint('/getTasks'));
    return response.data?.tasks || [];
  },

  async updateTaskStatus(taskId, status) {
    const response = await apiClient.patch(getTaskEndpoint(`/updateStatus/${taskId}`), { status });
    return response.data?.task;
  },
};

export default userService;
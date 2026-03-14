import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/features/auth/store/auth';
import type { OriginalRequest } from '../types';

const base = import.meta.env.VITE_BASE_URL;

const api: AxiosInstance = axios.create({
    baseURL: base,
    withCredentials: true,
});


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token: string | null = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh token logic
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: OriginalRequest = error.config as OriginalRequest;


        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('Access token expired, attempting to refresh...');

                const res = await axios.post<{ token: string }>(
                    `${base}/auth/api/v1/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken: string = res.data.token;

                console.log('Token refreshed successfully');

                useAuthStore.getState().setAccessToken(newToken);


                return api.request(originalRequest);
            } catch (err) {
                console.error('Refresh token failed:', err);
                console.log('Response:', (err as AxiosError).response?.data);


                useAuthStore.getState().removeAccessToken();
                useAuthStore.persist.clearStorage();
                //window.location.href = '/login';

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
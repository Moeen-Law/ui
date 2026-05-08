import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/features/auth/store/auth';
import type { OriginalRequest } from '../types';

const base = import.meta.env.VITE_BASE_URL;
const refreshPath = '/auth/api/v1/auth/refresh';

let refreshPromise: Promise<string> | null = null;

const api: AxiosInstance = axios.create({
    baseURL: base,
    withCredentials: true,
});

const setAuthorizationHeader = (config: InternalAxiosRequestConfig, token: string) => {
    config.headers.Authorization = `Bearer ${token}`;
};

const clearAuthAndRedirect = () => {
    useAuthStore.getState().removeAccessToken();
    useAuthStore.persist.clearStorage();
    window.location.href = '/';
};

export const refreshAccessToken = async (): Promise<string> => {
    if (!refreshPromise) {
        console.log('[auth-refresh] starting refresh request');

        refreshPromise = axios
            .post<{ accessToken: string }>(
                `${base}${refreshPath}`,
                {},
                { withCredentials: true }
            )
            .then((res) => {
                const newToken = res.data.accessToken;
                console.log('[auth-refresh] refresh succeeded');
                useAuthStore.getState().setAccessToken(newToken);
                return newToken;
            })
            .catch((err) => {
                console.error('[auth-refresh] refresh failed', err);
                clearAuthAndRedirect();
                throw err;
            })
            .finally(() => {
                console.log('[auth-refresh] refresh lock cleared');
                refreshPromise = null;
            });
    } else {
        console.log('[auth-refresh] reusing in-flight refresh request');
    }

    return refreshPromise;
};

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token: string | null = useAuthStore.getState().accessToken;

    if (token) {
        setAuthorizationHeader(config, token);
    }
    return config;
});

// Refresh token logic
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: OriginalRequest | undefined = error.config as OriginalRequest | undefined;

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const currentToken = useAuthStore.getState().accessToken;
                const requestToken = originalRequest.headers.Authorization;

                console.log('[auth-refresh] handling 401', {
                    url: originalRequest.url,
                    hasCurrentToken: Boolean(currentToken),
                    usedStaleToken: Boolean(
                        currentToken &&
                        requestToken &&
                        requestToken !== `Bearer ${currentToken}`
                    ),
                });

                if (
                    currentToken &&
                    requestToken &&
                    requestToken !== `Bearer ${currentToken}`
                ) {
                    console.log('[auth-refresh] retrying stale request with current token', {
                        url: originalRequest.url,
                    });
                    setAuthorizationHeader(originalRequest, currentToken);
                    return api.request(originalRequest);
                }

                const newToken = await refreshAccessToken();
                console.log('[auth-refresh] retrying original request after refresh', {
                    url: originalRequest.url,
                });
                setAuthorizationHeader(originalRequest, newToken);
                return api.request(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

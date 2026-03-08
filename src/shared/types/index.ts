
import type { InternalAxiosRequestConfig } from 'axios';


export interface OriginalRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}












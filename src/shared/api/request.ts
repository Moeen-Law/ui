import { AxiosError, type AxiosResponse } from "axios";


const request = async <T>(promise: Promise<AxiosResponse<T>>) => {
    try {
        const response = await promise;
        return response.data;
        
    } catch (error: unknown) {
        if (error instanceof AxiosError) throw error.response?.data;
        throw error;
    }
}

export default request;
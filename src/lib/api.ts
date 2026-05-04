import axios from "axios";

const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_URL,
    withCredentials:true
});

api.interceptors.request.use((config) => {
    const token = getAccessToken();

    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
});

let isRefreshing = false;
let failedQueue:{
    resolve: (token:string) => void;
    reject:(err:unknown) => void;
}[] = [];

const processQueue = (error:unknown, token:string | null) => {
    failedQueue.forEach((p) => {
        if (error) p.reject(error);
        else p.resolve(token!);
    });
    failedQueue = [];
};

api.interceptors.response.use(
     (response) => response,
     async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve,reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest)
                })
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials:true }
                );

                const newToken = data.accessToken;
                setAccessToken(newToken);
                processQueue(null,newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return api(originalRequest);
            } catch(refreshError) {
                processQueue(refreshError, null);
                clearAccessToken();
                window.location.href = "/login";
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
     }
);

let _accessToken:string | null = null;

export const getAccessToken = () => _accessToken;
export const setAccessToken = (token:string) => { _accessToken = token };
export const clearAccessToken = () => { _accessToken = null; };

export default api;

import axios from "axios";
import BASE_URL from "../constants/urls";
import Cookies from "js-cookie";

const AXIOS_INSTANCE = axios.create({
    baseURL: BASE_URL,
    // withCredentials: true,
});

AXIOS_INSTANCE.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
        async (error) => {
        const originalRequest = error.config;
        if (error.response) {
            if (
                error.response.status === 401 &&
                originalRequest.url === "/token/refresh/"
            ) {
                // Redirect to login page if token refresh fails
                window.location.href = "/login/";
                return Promise.reject(error);
            }
    
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const refreshToken = Cookies.get("refresh_token");
                if (refreshToken) {
                    try {
                        const response = await AXIOS_INSTANCE.post("/token/refresh/", {
                        refresh: refreshToken,
                        });
                        Cookies.set("access_token", response.data.access);
                        AXIOS_INSTANCE.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
                        originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
                        return AXIOS_INSTANCE(originalRequest);
                    } catch (refreshError) {
                        window.location.href = "/login/";
                        return Promise.reject(refreshError);
                    }
                }
            }
        }
        return Promise.reject(error);
        }
);

export default AXIOS_INSTANCE;
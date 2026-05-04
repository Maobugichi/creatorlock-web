import { create } from 'zustand';
import { setAccessToken, clearAccessToken } from '@/lib/api';
import api from '@/lib/api';

export interface User {
    id:string;
    email:string;
    name:string;
    role:"creator" | "buyer" | "admin"
}

interface AuthState {
    user:User | null;
    isLoading: boolean;
    isAuthenticated:boolean;
    setUser: (user:User, token:string) => void;
    logout:() => Promise<void>;
    rehydrate:() => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user:null,
    isLoading:true,
    isAuthenticated:false,

    setUser: (user, token) => {
        setAccessToken(token);
        set({ user, isAuthenticated:true, isLoading:false});
    },

    logout:async () => {
        try {
            await api.post('/auth/logout');
        } catch {

        } finally {
            clearAccessToken();
            set({user:null, isAuthenticated:false, isLoading:false});
            window.location.href = '/login'
        }
    },

    rehydrate: async () => {
        try {
            const { data } = await api.post('/auth/refresh');
            const tokenData = data.data;

            const profile = await api.get('/auth/me');

            setAccessToken(tokenData.accessToken);
            set({
                user:profile.data.data,
                isAuthenticated:true,
                isLoading:false
            })
        } catch {
            clearAccessToken();
            set({ user:null, isAuthenticated:false, isLoading:false})
        }
    }
})
)
import { create } from 'zustand';

interface User {
    id:          number;
    username:    string;
    email:       string;
    firstname:   string;
    lastname:    string;
    phoneNumber: string | null;
    avatarUrl:   string | null;
    roles:       { id: number; name: string; createdAt: string; }[];
}

interface AuthStore {
    user:     User | null;
    token:    string | null;
    setAuth:  (user: User, token: string) => void;
    logout:   () => void;
    isAuth:   () => boolean;
    hasRole:  (role: string) => boolean;
}

const storedToken = localStorage.getItem('token');

export const useAuthStore = create<AuthStore>((set, get) => ({
    user:  null,
    token: storedToken || null,

    setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
    },

    isAuth: () => get().token !== null,

    hasRole: (role) => get().user?.roles.includes(role) ?? false,
}));
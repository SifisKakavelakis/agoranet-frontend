import api from './axios';

export const toggleWishlistApi = async (productId: number) => {
    const { data } = await api.post(`/wishlist/${productId}`);
    return data;
};

export const getWishlistApi = async () => {
    const { data } = await api.get('/wishlist');
    return data;
};

export const checkWishlistApi = async (productId: number) => {
    const { data } = await api.get(`/wishlist/${productId}/check`);
    return data;
};
import api from './axios';

export const createOrderApi = async (productId: number) => {
    const { data } = await api.post('/orders', { productId });
    return data;
};

export const getMyOrdersApi = async () => {
    const { data } = await api.get('/orders/my');
    return data;
};

export const cancelOrderApi = async (orderId: number) => {
    const { data } = await api.put(`/orders/${orderId}/cancel`);
    return data;
};

export const getSellerOrdersApi = async () => {
    const { data } = await api.get('/orders/selling');
    return data;
};

export const updateOrderStatusApi = async (orderId: number, status: 'confirmed' | 'cancelled') => {
    const { data } = await api.put(`/orders/${orderId}/status`, { status });
    return data;
};
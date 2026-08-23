import api from './axios';

export const getProductsApi = async (filters?: {
    category?: number;
    search?:   string;
    page?:     number;
    limit?:    number;
}) => {
    const { data } = await api.get('/products', { params: filters });
    return data;
};

export const getProductByIdApi = async (id: number) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const getMyProductsApi = async () => {
    const { data } = await api.get('/products/my/selling');
    return data;
};

export const createProductApi = async (payload: {
    title:        string;
    description?: string;
    price:        number;
    categoryId:   number;
}) => {
    const { data } = await api.post('/products', payload);
    return data;
};

export const updateProductApi = async (id: number, payload: {
    title?:       string;
    description?: string;
    price?:       number;
    categoryId?:  number;
    isActive?:    boolean;
}) => {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
};

export const deleteProductApi = async (id: number) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};

export const uploadProductImagesApi = async (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const { data } = await api.post(`/products/${id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

export const deleteProductImageApi = async (productId: number, imageId: number) => {
    const { data } = await api.delete(`/products/${productId}/images/${imageId}`);
    return data;
};
import { fetchAPI } from './index';

export interface Product {
    id: number;
    name: string;
    description: string;
    image_url?: string;
    features: string[];
    created_at: string;
}

export const productsApi = {
    create: async (data: any): Promise<Product> => {
        return fetchAPI('/products', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

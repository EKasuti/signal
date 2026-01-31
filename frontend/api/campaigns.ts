import { fetchAPI } from './index';

export interface Campaign {
    id: number;
    objective: string;
    platform: string;
    duration_seconds: number;
    brand_tone?: string;
    status: string;
    product_intent?: any;
    creative_persona?: any;
    sora_prompt?: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
    };
    product?: {
        id: number;
        name: string;
    };
}

export const campaignsApi = {
    getAll: async (): Promise<Campaign[]> => {
        return fetchAPI('/campaigns');
    },

    getById: async (id: string | number): Promise<Campaign> => {
        return fetchAPI(`/campaigns/${id}`);
    },

    create: async (data: any): Promise<Campaign> => {
        return fetchAPI('/campaigns', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    generate: async (id: number): Promise<Campaign> => {
        return fetchAPI(`/campaigns/${id}/generate`, {
            method: 'POST',
        });
    },
};

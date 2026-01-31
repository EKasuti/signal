import { fetchAPI } from './index';

export interface User {
    id: number;
    name: string;
    created_at: string;
    demographics?: any;
    psychographics?: any;
    lifestyle?: any;
    media_preferences?: any;
}

export const usersApi = {
    getAll: async (): Promise<User[]> => {
        return fetchAPI('/users');
    },

    getById: async (id: string | number): Promise<User> => {
        return fetchAPI(`/users/${id}`);
    },

    create: async (data: any): Promise<User> => {
        return fetchAPI('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string | number, data: any): Promise<User> => {
        return fetchAPI(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

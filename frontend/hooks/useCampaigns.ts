import { useState, useEffect } from 'react';
import { Campaign, campaignsApi } from '../api/campaigns';

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const data = await campaignsApi.getAll();
            setCampaigns(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch campaigns');
        } finally {
            setLoading(false);
        }
    };

    return { campaigns, loading, error, refetch: fetchCampaigns };
}

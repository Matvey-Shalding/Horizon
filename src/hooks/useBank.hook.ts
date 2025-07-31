// hooks/useBank.hook.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchBanks = async () => {
  try {
    const res = await axios.get('/api/user/banks');
    console.log('Banks in hook', res);
    if (!res.data || Object.keys(res.data).length === 0) {
      return [];
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching banks:', error);
    return []; // fallback to empty array on error
  }
};

export function useBank({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['banks'],
    queryFn: fetchBanks,
    enabled, // delay initial fetch if needed
    refetchOnMount: true,
    staleTime: 0,
  });
}

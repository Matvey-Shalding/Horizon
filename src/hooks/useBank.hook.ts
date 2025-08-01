// hooks/useBank.hook.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Fetches user banks from the API.
 * @returns Array of banks or empty array on error/empty response.
 */
const fetchBanks = async () => {
  try {
    const { data } = await axios.get('/api/user/banks');
    return data && Object.keys(data).length ? data : [];
  } catch (error) {
    console.error('Error fetching banks:', error);
    return [];
  }
};

/**
 * Custom hook for fetching user banks using React Query.
 * @param options - Configuration options.
 * @param options.enabled - Whether the query is enabled (default: true).
 * @returns React Query result object for banks.
 */
export function useBank({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['banks'],
    queryFn: fetchBanks,
    enabled,
    refetchOnMount: true,
    staleTime: 0,
  });
}

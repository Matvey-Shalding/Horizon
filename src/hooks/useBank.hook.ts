import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "state/store";

const fetchBanks = async () => {
  try {
    const res = await axios.get("/api/user/banks");
    if (!res.data || Object.keys(res.data).length === 0) {
      return [];
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching banks:", error);
  }
};

export function useBank() {
  const banks = useSelector((state: RootState) => state.bank.banks);

  return useQuery({
    queryKey: ["banks"],
    refetchOnMount: true,
    queryFn: fetchBanks,
    staleTime: 0, // 5 minutes fresh
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // refetchOnMount: false,
    // retry: false,
  });
}

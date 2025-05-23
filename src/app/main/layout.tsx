"use client";

import { useBank } from "hooks/useBank.hook";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBanks } from "state/main/bankSlice";
import { LayoutProvider } from "./layoutProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [enabled, setEnabled] = useState(false);

  // Delay enabling the query by 1 second
  useEffect(() => {
    const timer = setTimeout(() => setEnabled(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { data: serverBanks, isLoading: queryLoading } = useBank({ enabled });

  // Dispatch bank data to Redux when available
  useEffect(() => {
    if (serverBanks) {
      dispatch(setBanks(serverBanks));
    }
  }, [serverBanks]);

  // Show loader during the delay or query
  const isLoading = !enabled || queryLoading;

  return <LayoutProvider isLoading={isLoading}>{children}</LayoutProvider>;
}

"use client";

import { useBank } from "hooks/useBank.hook";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBanks } from "state/main/bankSlice";
import { LayoutProvider } from "./layoutProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data: serverBanks, isLoading } = useBank();
  console.log(serverBanks);
  useEffect(() => {
    dispatch(setBanks(serverBanks ?? []));
  }, [serverBanks]);
  return <LayoutProvider isLoading={isLoading}>{children}</LayoutProvider>;
}

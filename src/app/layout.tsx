"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "state/store";
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          staleTime: 1 * 60 * 60 * 1000,
          retry: 1,
        },
      },
    }),
  );
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/img/registration/logo.svg"
          type="image/svg"
        ></link>
      </head>
      <body>
        <QueryClientProvider client={queryClient.current!}>
          <Provider store={store}>
            {/* <PersistGate loading={null} persistor={persistor}> */}
            {children}
            {/* </PersistGate> */}
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

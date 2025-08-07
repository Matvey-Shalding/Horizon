'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { domAnimation, LazyMotion } from 'framer-motion';
import { queryClient } from 'lib/queryClient';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <div id="portal-root"></div>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <LazyMotion features={domAnimation}>{children}</LazyMotion>
            </Provider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

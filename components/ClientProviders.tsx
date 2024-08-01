// components/ClientProviders.tsx
"use client";

import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import store from "../redux/store";
import { HeaderMegaMenu } from "@/components/header/HeaderMegaMenu";
import Script from "next/script";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <MantineProvider>
        <Notifications position="bottom-right" />
        <HeaderMegaMenu />
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </MantineProvider>
    </Provider>
  );
}

'use client'
import { Provider } from "react-redux"
import store from "../store/store";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({ children }: Readonly<{children:React.ReactNode}>) {
  return (
    <ClerkProvider> 
      <Provider store={store}>
        <Toaster />
        {children}
      </Provider>
    </ClerkProvider>

  );
}

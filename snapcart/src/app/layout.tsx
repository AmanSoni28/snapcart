import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/ClientProvider";
import { Toaster }from "react-hot-toast";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";


export const metadata: Metadata = {
  title: "snapcart | 10 min grocery delivery app",
  description: "10 min grocery delivery app",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

  

  return (
    <html lang="en" >
      <body className="w-full min-h-screen bg-linear-to-b from-green-100 to-white">
        <ClientProvider>
          <StoreProvider>
            <InitUser/>
            {children}
          </StoreProvider>
        </ClientProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: "#16a34a",
                color: "#fff",
                border: "1px solid #15803d",
              },
              iconTheme: {
                primary: "#fff",
                secondary: "#16a34a",
              },
            },

            error: {
              style: {
                background: "#dc2626",
                color: "#fff"
              }
             }
          }}
        />
      </body>
    </html>
  );
}

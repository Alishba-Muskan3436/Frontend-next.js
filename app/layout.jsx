import { AppProvider } from "@/context/Appcontext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientOnly from "@/components/ClientOnly";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "HomeFix - Reliable Home Maintenance Services",
  description: "Find trusted plumbers, electricians, cleaners, and more — all in one directory.",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <ClientOnly>
          <AppProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster position="top-right" />
          </AppProvider>
        </ClientOnly>
      </body>
    </html>
  );
}


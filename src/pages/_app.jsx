"use client";

import React from "react";
import { AppProvider } from "../../context/Appcontext";
import { Toaster } from "react-hot-toast";
import "../../src/App.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <Toaster />
    </AppProvider>
  );
}

import Header from "@/components/Header";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "@/components/Footer";
import { ChakraProvider } from "@chakra-ui/react";
import Nav from "@/components/Nav";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <EventProvider>
          <Header />
          <Nav />
          <Component {...pageProps} />
          <Footer />
        </EventProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
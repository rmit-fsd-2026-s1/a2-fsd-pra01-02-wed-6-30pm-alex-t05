import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthProvider>
        <EventProvider>
          <Component {...pageProps} />
        </EventProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

// import '@/styles/globals.css'
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { api } from "~/utils/api";

import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google"
import { cn } from "~/lib/utils"
import { ThemeProvider } from "next-themes";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <html lang="en" suppressHydrationWarning>
      // <head />
      
      <main
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkProvider {...pageProps}>
              <Component {...pageProps} />
            </ClerkProvider>
          </ThemeProvider>
        
      </main>
    // </html>
    
  );
}
// export default MyApp;

export default api.withTRPC(MyApp);

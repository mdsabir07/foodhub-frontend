import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { Navbar } from "../components/shared/Navbar";
import { Footer } from "../components/shared/Footer";
import { Toaster } from "react-hot-toast";
import { SuspensionInterceptor } from "../components/shared/SuspensionInterceptor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodHub | Discover & Order Delicious Meals",
  description: "Browse curated menus from various food providers and place orders instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-200`}>
        <ThemeProvider>
          <AuthProvider>
            <SuspensionInterceptor>
              {/* Place the Toaster here so it inherits theme styles and works on all subpages */}
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  // Optional: styling clean defaults that look fantastic in dark and light themes
                  className: "dark:bg-slate-900 dark:text-slate-100 border dark:border-slate-800 text-xs font-bold rounded-2xl",
                }}
              />
              <Navbar />
              <main className="min-h-[calc(100vh-4rem)]">
                {children}
              </main>
              <Footer />
            </SuspensionInterceptor>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
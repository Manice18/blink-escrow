import { Inter, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";

import { Toaster } from "sonner";

import { constructMetaData } from "@/lib/metadata";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import Navbar from "@/components/Common/Navbar";

const WalletMultiButtonDynamic = dynamic(
  async () => await import("../contexts/WalletContextProvider"),
  { ssr: false },
);

const inter = Inter({ subsets: ["latin"] });
const dmSans = DM_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata = constructMetaData();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${dmSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="blink-escrow-theme"
        >
          <WalletMultiButtonDynamic>
            <Toaster position="bottom-center" richColors />
            <Navbar />
            {children}
          </WalletMultiButtonDynamic>
        </ThemeProvider>
      </body>
    </html>
  );
}

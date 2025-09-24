import type { Metadata } from "next";
import { Inter } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import "@/styles/global.css";

// font definitions
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// site metadata - what shows up on embeds
export const metadata: Metadata = {
  title: "Project Name",
  description: "Description of project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sans.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
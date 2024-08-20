// import { cn } from "@/lib/utils";
// import { Inter as FontSans } from "next/font/google";

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        // className={cn(
        //   "min-h-screen bg-background font-sans antialiased",
        //   fontSans.variable
        // )}
      >
      {children}
      </body>
    </html>
  );
}

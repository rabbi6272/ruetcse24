import { Toaster } from "react-hot-toast";
import "./globals.css";
import { lato } from "./ui/fonts";

export const metadata = {
  title: "CSE-24 | RUET",
  description: "RUET CSE 24 Student Information Showcase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/brands.min.css"
        />
      </head>
      <body className={`${lato.className}`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}

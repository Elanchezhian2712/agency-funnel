import React from "react";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/nextjs";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>{children}</ClerkProvider>
  );
};

export default Layout;

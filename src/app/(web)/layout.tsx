import Header from "@/components/web/header";
import Footer from "@/components/web/footer";
import type { ReactNode } from "react";

export default function WebLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

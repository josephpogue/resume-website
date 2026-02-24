import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-val-dark flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[calc(2px+4rem)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
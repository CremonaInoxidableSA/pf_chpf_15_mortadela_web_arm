"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

import HeaderPrincipal from "@/components/header&footer/headerPrincipal";
//import Navbar2 from "@/components/footer&header/navbar2";
import Footer from "@/components/header&footer/footer";

import { I18nextProvider } from "react-i18next";
import { i18n } from "@/i18n";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderFooter = [
    "/signup",
    "/login",
    "/login/recuperacion",
  ].includes(pathname);

  const isDesmoldeoPage = pathname === "/desmoldeo";

  // On client mount, restore previously selected language (default to Spanish)
  useEffect(() => {
    try {
      const saved =
        (typeof window !== "undefined" &&
          (localStorage.getItem("selectedLanguage") ||
            Cookies.get("selectedLanguage"))) ||
        null;
      const lang = saved === "en" || saved === "es" ? saved : "es";
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="flex flex-col grow min-h-screen">
        <div className="sticky top-0 left-0 w-full z-999">
          {!hideHeaderFooter && <HeaderPrincipal currentPath={pathname} />}
          {/* {!hideHeaderFooter && showHeader2 && <Navbar2 />} */}
        </div>
        <main
          className={`grow ${isDesmoldeoPage ? "pl-67.5" : ""} ${
            pathname === "/login" || pathname === "/login/recuperacion"
              ? "flex justify-center items-center"
              : ""
          }`}
        >
          {children}
        </main>
        <div className={isDesmoldeoPage ? "pl-67.5" : ""}>
          {!hideHeaderFooter && <Footer />}
        </div>
      </div>
    </I18nextProvider>
  );
}

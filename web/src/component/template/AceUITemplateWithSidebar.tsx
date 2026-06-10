import logo from "@/component/asset/logo rain-guard.png";
import logoWhite from "@/component/asset/logo rain-guard white.png";
import { ArrowRight, LogOut, Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export type MenuItem = {
  title: string;
  link: string;
};

type AceUITemplateWithSidebarProps = {
  appname: string;
  children: React.ReactNode;
  listMenu?: MenuItem[];
  account?: boolean;
  accountName?: string;
  accountImage?: string;
  accountRole?: string;
  header?: string;
  logoutfunc: () => void;
};

function AceUITemplateWithSidebar({
  appname,
  listMenu = [],
  children,
  account = false,
  accountName = "",
  accountImage = "",
  accountRole = "",
  logoutfunc,
  header,
}: AceUITemplateWithSidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleDark() {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }
  const profileNameClass = "max-w-[10rem] truncate text-lg font-semibold leading-tight text-text";
  const profileRoleClass = "text-sm text-text/70 leading-tight";
  return (
    <>
      <div className="md:grid grid-cols-5 h-screen bg-background text-text">
        {/* Desktop */}
        <div className="hidden md:flex col-span-1 p-6 flex-col gap-6">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex-shrink-0">
              <Image src={dark ? logoWhite : logo} alt="Logo" width={40} height={40} />
            </div>
            <h1 className="text-3xl font-bold truncate">{appname}</h1>
          </div>
          <nav>
            <ul className="flex flex-col gap-1">
              {listMenu.map((item, index) => {
                const isActive = router.pathname === item.link;
                return (
                  <li key={index}>
                    <Link
                      href={item.link}
                      className={`flex items-center h-12 rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? "text-text font-semibold translate-x-2"
                          : "text-text/70 hover:bg-secondary/30 hover:text-text hover:translate-x-1"
                      } px-4`}
                    >
                      <span className={`inline-block w-[3px] h-5 rounded-r-full transition-all duration-300 mr-3 shrink-0 ${
                        isActive ? "bg-primary" : "bg-secondary/20"
                      }`} />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="container mx-auto mt-auto flex flex-col gap-2">
            <button
              onClick={toggleDark}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-text hover:bg-secondary transition-all w-full"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm font-medium">{dark ? "Mode Terang" : "Mode Gelap"}</span>
            </button>
            {account && (
              <div
                className={`relative ${isProfilePopupOpen ? "p-2 absolute rounded-b-2xl mb-2 bg-background border border-secondary shadow-[0_8px_30px_rgb(0,0,0,0.12)]" : ""}`}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
                  onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                >
                  <img
                    src={accountImage}
                    alt={accountName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h2 className={profileNameClass}>{accountName}</h2>
                    <p className={profileRoleClass}>{accountRole}</p>
                  </div>
                </div>
                {isProfilePopupOpen && (
                  <div className="absolute bottom-full left-0 w-full bg-background border border-secondary shadow-t-[0_8px_30px_rgb(0,0,0,0.12)] rounded-t-xl p-2 z-50">
                    <button
                      onClick={() => {
                        if (logoutfunc) {
                          logoutfunc();
                        } else {
                          alert("Logout berhasil diklik!");
                        }
                        setIsProfilePopupOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 font-medium hover:bg-secondary rounded-lg transition-colors flex items-center justify-between"
                    >
                      <div className="flex gap-2">
                        <LogOut></LogOut>
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Sidebar Mobile */}
        <div
          onClick={() => setIsOpen(false)}
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden z-40 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        />
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-background shadow-2xl p-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isOpen ? "translate-x-0" : "-translate-x-full "
          }`}
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-2">
            <Image src={dark ? logoWhite : logo} alt="Logo" width={32} height={32} />
            <h1 className="text-3xl font-bold">{appname}</h1>
          </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-background transition-colors"
            >
              <ArrowRight className="rotate-180" />
            </button>
          </div>
          <nav>
            <ul className="flex flex-col gap-1">
              {listMenu.map((item, index) => {
                const isActive = router.pathname === item.link;
                return (
                  <li key={index}>
                    <Link
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center h-12 rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? "text-text font-semibold translate-x-2"
                          : "text-text/70 hover:bg-secondary/30 hover:text-text hover:translate-x-1"
                      } px-4`}
                    >
                      <span className={`inline-block w-[3px] h-5 rounded-r-full transition-all duration-300 mr-3 shrink-0 ${
                        isActive ? "bg-primary" : "bg-secondary/20"
                      }`} />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="container mx-auto mt-auto flex flex-col gap-2">
            <button
              onClick={toggleDark}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-text hover:bg-secondary transition-all w-full"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="text-sm font-medium">{dark ? "Mode Terang" : "Mode Gelap"}</span>
            </button>
            {account && (
              <div
                className={`relative ${isProfilePopupOpen ? "p-2 absolute rounded-b-2xl mb-2 bg-background border border-secondary shadow-[0_8px_30px_rgb(0,0,0,0.12)]" : ""}`}
              >
                <div
                  className="flex items-center gap-2 cursor-pointer p-2 -ml-2 rounded-xl hover:bg-secondary transition-colors"
                  onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                >
                  <img
                    src={accountImage}
                    alt={accountName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h2 className={profileNameClass}>{accountName}</h2>
                    <p className={profileRoleClass}>{accountRole}</p>
                  </div>
                </div>
                {isProfilePopupOpen && (
                  <div className="absolute bottom-full left-0 w-full bg-background border border-secondary rounded-t-xl p-2 z-50">
                    <button
                      onClick={() => {
                        logoutfunc();
                        setIsProfilePopupOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 font-medium hover:bg-secondary rounded-lg transition-colors flex items-center justify-between"
                    >
                      <div className="flex gap-2">
                        <LogOut></LogOut>
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-span-4">
          <div className="p-1 md:hidden">
            <div className="flex gap-2 items-center p-2">
              <button
                className="p-2 rounded-lg hover:bg-secondary hover:text-primary"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu />
              </button>
              <h1 className="font-bold text-2xl">{header}</h1>
            </div>
          </div>
          <div className="bg-background rounded-l-3xl h-screen overflow-y-auto  md:p-10 p-5 ">
            <div className="flex justify-between items-center mb-4">
              <h1 className="hidden md:block text-3xl font-bold">{header}</h1>
            </div>
            <div className="md:container mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AceUITemplateWithSidebar;

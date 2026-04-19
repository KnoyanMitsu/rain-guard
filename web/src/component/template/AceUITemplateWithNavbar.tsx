/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import Link from "next/link";
import { LogOut, Menu } from "lucide-react";

export type MenuItem = {
  title: string;
  link: string;
};

type AceUITemplateWithNavbarProps = {
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

function AceUITemplateWithNavbar({
  appname,
  listMenu = [],
  children,
  account = false,
  accountName = "",
  accountImage = "",
  accountRole = "",
  logoutfunc,
  header,
}: AceUITemplateWithNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col h-screen">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-background dark:bg-text text-text dark:text-background z-10 relative w-full">
          <div className="grid grid-cols-3 items-center w-full">
            <div>
              <h1 className="text-2xl ">{appname}</h1>
            </div>
            <nav>
              <ul className="flex items-center justify-center">
                {listMenu.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link
                        href={item.link}
                        className={`px-4 py-2 flex items-center rounded-lg font-medium transition-all duration-300 hover:bg-secondary hover:text-primary dark:hover:bg-accent dark:hover:text-background`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {account && (
              <div className="relative">
                <div
                  className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-colors ${isProfilePopupOpen ? "bg-secondary dark:bg-accent" : "hover:bg-secondary dark:hover:bg-accent"}`}
                  onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                >
                  <img
                    src={accountImage}
                    alt={accountName}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <div className="hidden lg:block text-left">
                    <h2 className="text-sm font-medium leading-tight text-text dark:text-background">
                      {accountName}
                    </h2>
                    <p className="text-xs text-text/70 dark:text-background/70">
                      {accountRole}
                    </p>
                  </div>
                </div>
                {isProfilePopupOpen && (
                  <div className="absolute top-full mt-2 right-0 min-w-[200px] bg-background dark:bg-text border border-secondary dark:border-accent shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl z-50 overflow-hidden">
                    <button
                      onClick={() => {
                        if (logoutfunc) {
                          logoutfunc();
                        } else {
                          alert("Logout berhasil diklik!");
                        }
                        setIsProfilePopupOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-red-500 font-medium hover:bg-secondary dark:hover:bg-accent transition-colors flex items-center justify-start gap-3"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Header & Navbar */}
        <div className="md:hidden flex flex-col bg-background dark:bg-text text-text dark:text-background border-none relative z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-2 items-center">
              <button
                className="p-2 rounded-lg hover:bg-secondary hover:text-primary dark:hover:bg-accent dark:hover:text-background transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu />
              </button>
              <h1 className="font-bold text-xl">{appname}</h1>
            </div>
            {account && (
              <div className="flex items-center">
                <img
                  src={accountImage}
                  alt={accountName}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer shadow-sm border border-secondary dark:border-accent"
                  onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                />
              </div>
            )}
          </div>

          {/* Mobile Profile Menu */}
          {isProfilePopupOpen && account && (
            <div className="md:hidden border-t border-secondary dark:border-accent bg-background dark:bg-text">
              <div className="p-4 border-b border-secondary dark:border-accent flex items-center gap-3">
                <img
                  src={accountImage}
                  alt={accountName}
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h2 className="text-base font-medium text-text dark:text-background">
                    {accountName}
                  </h2>
                  <p className="text-sm text-text/70 dark:text-background/70">
                    {accountRole}
                  </p>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    if (logoutfunc) {
                      logoutfunc();
                    } else {
                      alert("Logout berhasil diklik!");
                    }
                    setIsProfilePopupOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-500 font-medium hover:bg-secondary dark:hover:bg-accent rounded-lg transition-colors flex items-center gap-3"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <nav className="border-t border-secondary dark:border-accent bg-background dark:bg-text">
              <ul className="flex flex-col p-2 gap-1">
                {listMenu.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 flex items-center rounded-lg font-medium transition-all duration-300 hover:bg-secondary hover:text-primary dark:hover:bg-accent dark:hover:text-background`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-secondary/30 dark:bg-text/50 rounded-t-2xl overflow-y-auto">
          <div className="md:p-10 p-5 min-h-full text-text dark:text-background">
            <div className="flex justify-between items-center mb-6">
              <h1 className="hidden md:block text-3xl font-bold">{header}</h1>
            </div>
            <div className="md:container mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AceUITemplateWithNavbar;

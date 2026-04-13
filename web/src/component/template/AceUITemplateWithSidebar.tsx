import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react";
import { Menu } from "lucide-react";

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
};

function AceUITemplateWithSidebar({
  appname,
  listMenu = [],
  children,
  account = false,
  accountName = "",
  accountImage = "",
  accountRole = "",

  header,
}: AceUITemplateWithSidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="md:grid grid-cols-5 h-screen">
        {/* Desktop */}
        <div className="hidden md:flex col-span-1 p-6 flex-col gap-6">
          <h1 className="text-3xl font-bold mb-10">{appname}</h1>
          <nav>
            <ul className="flex flex-col gap-2">
              {listMenu.map((item, index) => {
                const isActive = router.pathname === item.link;
                return (
                  <li key={index}>
                    <Link
                      href={item.link}
                      className={`block px-4 py-2 h-12 flex items-center rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-blue-100 text-blue-800 shadow-md shadow-blue-500/20"
                          : "text-gray-600 hover:bg-[#f0f7ff] hover:text-blue-600"
                      }`}
                    >
                      {item.title}

                      {isActive && <ArrowRight className="ml-auto" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="container mx-auto mt-auto">
            {account && (
              <div className="flex items-center gap-2">
                <img
                  src={accountImage}
                  alt={accountName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-medium">{accountName}</h2>
                  <p className="text-sm text-gray-500">{accountRole}</p>
                </div>
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
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl p-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isOpen ? "translate-x-0" : "-translate-x-full "
          }`}
        >
          <div className="flex justify-between items-center mb-10">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-gray-100 rounded-full"
            >
              <ArrowRight className="rotate-180" />
            </button>
          </div>
          <nav>
            <ul className="flex flex-col gap-2">
              {listMenu.map((item, index) => {
                const isActive = router.pathname === item.link;
                return (
                  <li key={index}>
                    <Link
                      href={item.link}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2 h-12 flex items-center rounded-lg font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-blue-100 text-blue-800 shadow-md shadow-blue-500/20"
                          : "text-gray-600 hover:bg-[#f0f7ff] hover:text-blue-600"
                      }`}
                    >
                      {item.title}

                      {isActive && <ArrowRight className="ml-auto" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="container mx-auto mt-auto">
            {account && (
              <div className="flex items-center gap-2">
                <img
                  src={accountImage}
                  alt={accountName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-medium">{accountName}</h2>
                  <p className="text-sm text-gray-500">{accountRole}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-4">
          <div className="p-1 md:hidden">
            <div className="flex gap-2 items-center p-2">
              <button
                className="p-2 rounded-lg hover:bg-[#f0f7ff] hover:text-blue-600"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu />
              </button>
              <h1 className="font-bold text-2xl">{header}</h1>
            </div>
          </div>
          <div className="bg-[#f0f7ff] rounded-l-3xl h-screen overflow-y-auto  md:p-10 p-5 ">
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

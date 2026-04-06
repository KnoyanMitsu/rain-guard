import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react";

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
};

function AceUITemplateWithSidebar({
  appname,
  listMenu = [],
  children,
  account = false,
  accountName = "",
  accountImage = "",
  accountRole = "",
}: AceUITemplateWithSidebarProps) {
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-1 p-6 flex flex-col gap-6">
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
        <div className="col-span-4 p-10 bg-[#f0f7ff] rounded-l-3xl overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Last updated: 2 minutes ago</p>
          </div>
          <div className="container mx-auto">{children}</div>
        </div>
      </div>
    </>
  );
}

export default AceUITemplateWithSidebar;

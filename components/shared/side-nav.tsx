"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navLinks } from "@/constants";

const SideNav = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav">
      <ul className="sidebar-nav_elements">
        {navLinks.slice(0, 6).map((link) => {
          const isActive = link.route === pathname;

          return (
            <li
              key={link.route}
              className={`sidebar-nav_element group ${
                isActive ? "bg-purple-gradient text-white" : "text-gray-700"
              }`}
            >
              <Link className="sidebar-link" href={link.route}>
                <Image
                  src={link.icon}
                  alt="logo"
                  width={24}
                  height={24}
                  className={`${isActive && "brightness-200"}`}
                />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="sidebar-nav_elements">
        {navLinks.slice(6).map((link) => {
          const isActive = link.route === pathname;

          return (
            <li
              key={link.route}
              className={`sidebar-nav_element group ${
                isActive ? "bg-purple-gradient text-white" : "text-gray-700"
              }`}
            >
              <Link className="sidebar-link" href={link.route}>
                <Image
                  src={link.icon}
                  alt="logo"
                  width={24}
                  height={24}
                  className={`${isActive && "brightness-200"}`}
                />
                {link.label}
              </Link>
            </li>
          );
        })}
        <li className="flex-center cursor-pointer gap-2 p-4 w-full">
          {children}
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;

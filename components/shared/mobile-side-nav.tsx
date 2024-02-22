"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navLinks } from "@/constants";

const MobileSideNav = () => {
  const pathname = usePathname();

  return (
    <nav className="sidebar-nav">
      <ul className="header-nav_elements">
        {navLinks.map((link) => {
          const isActive = link.route === pathname;

          return (
            <li
              key={link.route}
              className={`sidebar-nav_element group ${
                isActive && "gradient-text"
              } p-18 flex whitespace-nowrap text-dark-700`}
            >
              <Link className="sidebar-link cursor-pointer" href={link.route}>
                <Image src={link.icon} alt="logo" width={24} height={24} />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileSideNav;

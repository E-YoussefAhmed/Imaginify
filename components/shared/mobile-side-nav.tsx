"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { navLinks } from "@/constants";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const MobileSideNav = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Image
          src="/assets/icons/menu.svg"
          alt="menu"
          width={32}
          height={32}
          className="cursor-pointer"
        />
      </SheetTrigger>
      <SheetContent className="sheet-content sm:w-64">
        <>
          <Image
            src="/assets/images/logo-text.svg"
            alt="logo"
            width={152}
            height={23}
          />
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
                    <Link
                      className="sidebar-link cursor-pointer"
                      href={link.route}
                      onClick={() => setOpen(false)}
                    >
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSideNav;

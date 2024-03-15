import Link from "next/link";
import Image from "next/image";

import { auth } from "@/auth";

import { Button } from "@/components/ui/button";
import UserButton from "@/components/auth/user-button";
import MobileSideNav from "@/components/shared/mobile-side-nav";

const MobileNav = async () => {
  const session = await auth();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>
      <nav className="flex gap-2">
        {session ? (
          <>
            <UserButton />
            <MobileSideNav />
          </>
        ) : (
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
};

export default MobileNav;

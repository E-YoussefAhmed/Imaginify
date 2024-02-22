import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import SideNav from "@/components/shared/side-nav";
import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";

const Sidebar = async () => {
  const session = await auth();

  return (
    <aside className="sidebar">
      <div className="flex size-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <Image
            src="/assets/images/logo-text.svg"
            alt="logo"
            width={180}
            height={28}
          />
        </Link>
        {session ? (
          <SideNav>
            <UserButton withName />
          </SideNav>
        ) : (
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

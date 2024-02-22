import { FaUser, FaGear } from "react-icons/fa6";
import { PiSignOutBold } from "react-icons/pi";

import { signOut, auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const UserButton = async ({ withName }: { withName?: boolean }) => {
  const session = await auth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none w-full flex items-center justify-start">
        <Avatar>
          <AvatarImage src={session?.user?.image || ""} alt="Profile picture" />
          <AvatarFallback className="bg-slate-300">
            <FaUser />
          </AvatarFallback>
        </Avatar>
        {withName && <p className="font-semibold mx-4">{session?.user.name}</p>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top">
        <DropdownMenuLabel className="w-full flex items-center justify-start">
          <Avatar>
            <AvatarImage
              src={session?.user?.image || ""}
              alt="Profile picture"
            />
            <AvatarFallback className="bg-slate-300">
              <FaUser />
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold mx-4">{session?.user.name}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form
            action={async () => {
              "use server";

              await signOut();
            }}
            className="w-full p-0"
          >
            <Button variant="ghost" className="w-full" type="submit">
              <PiSignOutBold className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </form>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/settings" className="w-full">
            <Button variant="ghost" className="w-full" type="submit">
              <FaGear className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;

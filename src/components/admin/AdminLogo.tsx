"use client";
import { useSearchParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { LuGithub, LuLock } from "react-icons/lu";

const AdminLogo = () => {
  const admin = useSearchParams().get("admin");

  if (true) {
    return (
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="https://github.com/krabhi4/waste-my-internet"
              target="_blank"
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <LuGithub className="h-5 w-5" />
              <span className="sr-only">Github Repo</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Github Repo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/admin"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <LuLock className="h-5 w-5" />
              <span className="sr-only">Admin</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Admin</TooltipContent>
        </Tooltip>
      </nav>
    );
  }
  return null;
};

export default AdminLogo;

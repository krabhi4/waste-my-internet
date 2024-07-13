"use client";
import { useSearchParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { LuLock } from "react-icons/lu";

const AdminLogo = () => {
  const admin = useSearchParams().get("admin");

  if (admin === "true") {
    return (
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
    );
  }
  return null;
};

export default AdminLogo;

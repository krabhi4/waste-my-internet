import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LuHome,
  LuPackage,
  LuUploadCloud,
  LuTrash2,
  LuGithub,
  LuSignal,
} from "react-icons/lu";
import AdminLogo from "./admin/AdminLogo";
import { Suspense } from "react";

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <LuTrash2 className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">WMI</span>
        </Link>
        {[
          {
            href: "/",
            icon: <LuHome className="h-5 w-5" />,
            label: "Home",
            disabled: true,
          },
          {
            href: "/generate-file",
            icon: <LuPackage className="h-5 w-5" />,
            label: "Generate File",
            disabled: false,
          },
          {
            href: "/send-to-void",
            icon: <LuUploadCloud className="h-5 w-5" />,
            label: "Upload File",
            disabled: false,
          },
          {
            href: "/data-waster",
            icon: <LuSignal className="h-5 w-5" />,
            label: "Data Waster",
            disabled: false,
          },
        ].map((item, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <button
                disabled={item.disabled}
                className="disabled:pointer-events-none disabled:hidden disabled:cursor-not-allowed"
              >
                <Link
                  href={item.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </Link>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
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
        <Suspense fallback={null}>
          <AdminLogo />
        </Suspense>
      </nav>
    </aside>
  );
};

export default Sidebar;

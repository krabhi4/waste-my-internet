"use client";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  LuPackage,
  LuPanelLeft,
  LuTrash2,
  LuUploadCloud,
} from "react-icons/lu";
import { useBreadcrumbStore } from "@/store";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggler";

const Header = () => {
  const { breadcrumbs } = useBreadcrumbStore();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-background sm:px-6">
      <Sheet open={open} onOpenChange={(value) => setOpen(value)}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <LuPanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <LuTrash2 className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">WMI</span>
            </Link>
            {[
              // {
              //   href: "/",
              //   icon: <LuHome className="h-5 w-5" />,
              //   label: "Home",
              // },
              {
                href: "/generate-file",
                icon: <LuPackage className="h-5 w-5" />,
                label: "Generate File",
              },
              {
                href: "/send-to-void",
                icon: <LuUploadCloud className="h-5 w-5" />,
                label: "Upload File",
              },
            ].map((item, idx) => (
              <Link key={idx} href={item.href}>
                <div
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, idx) => (
            <>
              <BreadcrumbItem key={idx}>
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.link}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <ThemeToggle />
    </header>
  );
};

export default Header;

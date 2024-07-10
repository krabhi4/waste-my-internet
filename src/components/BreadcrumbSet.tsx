"use client";

import { useBreadcrumbStore } from "@/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const BreadcrumbSet = ({ page }: { page: "home" | "dashboard" }) => {
  const pathname = usePathname();
  const { setBreadcrumbs } = useBreadcrumbStore();
  useEffect(
    () =>
      setBreadcrumbs(
        page === "home"
          ? [
              {
                label: "Home",
                link: "/",
              },
            ]
          : page === "dashboard"
            ? [
                {
                  label: "Home",
                  link: "/",
                },
                {
                  label: "Dashboard",
                  link: "/dashboard",
                },
              ]
            : [],
      ),
    [setBreadcrumbs, pathname, page],
  );
  return null;
};

export default BreadcrumbSet;

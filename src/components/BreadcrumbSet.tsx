"use client";

import { useBreadcrumbStore } from "@/store";
import { useEffect } from "react";

const BreadcrumbSet = ({
  page,
}: {
  page: "home" | "generate-file" | "upload-file" | "admin";
}) => {
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
          : page === "generate-file"
            ? [
                {
                  label: "Home",
                  link: "/",
                },
                {
                  label: "Generate File",
                  link: "/generate-file",
                },
              ]
            : page === "upload-file"
              ? [
                  {
                    label: "Home",
                    link: "/",
                  },
                  {
                    label: "Upload File",
                    link: "/upload-file",
                  },
                ]
              : page === "admin"
                ? [
                    {
                      label: "Home",
                      link: "/",
                    },
                    {
                      label: "Admin",
                      link: "/admin",
                    },
                  ]
                : [],
      ),
    [setBreadcrumbs, page],
  );
  return null;
};

export default BreadcrumbSet;

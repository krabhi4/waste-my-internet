import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { create } from "zustand";

interface Breadcrumb {
  link: string;
  label: string;
}

interface BreadcrumbStore {
  breadcrumbs: Breadcrumb[];
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));

const TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const STORAGE_KEY = "isVerified";

export const useIsVerifiedStore = create<{
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
}>((set) => ({
  isVerified: getLocalStorage(STORAGE_KEY) ?? false,
  setIsVerified: (isVerified: boolean) => {
    setLocalStorage(STORAGE_KEY, isVerified, TTL);
    set({ isVerified });
  },
}));

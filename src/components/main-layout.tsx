import { type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        <>{children}</>
      </div>
    </div>
  );
};

export default MainLayout;

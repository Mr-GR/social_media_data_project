import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import TopBar from "@/components/shared/TopBar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-1">
        <LeftSidebar />
        <section className="flex flex-1">
          <Outlet />
        </section>
      </div>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header className="flex-none" />
        <div className="flex-grow overflow-auto">
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
}

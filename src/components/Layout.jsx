import { Outlet } from "react-router-dom";
import { Navbar } from "@components/NavBar";

export function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
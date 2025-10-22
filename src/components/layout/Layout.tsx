import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 ml-60 pt-16 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

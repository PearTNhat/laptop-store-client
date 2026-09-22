import { Outlet } from "react-router-dom";
import SideBar from "./Component/SideBar";

function UserProfile() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/70 antialiased">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-72 md:min-h-screen md:sticky md:top-0 md:h-screen flex-shrink-0 bg-white border-r border-gray-100 shadow-sm z-30">
        <SideBar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:h-screen md:overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default UserProfile;

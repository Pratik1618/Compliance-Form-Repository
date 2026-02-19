import { useState } from "react";
import Dashboard from "./Dashboard";
import BranchMapping from "./BranchMapping";



export default function Layout() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Compliance Panel</h2>
        </div>

        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              activePage === "dashboard"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActivePage("mapping")}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              activePage === "mapping"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Branch Mapping
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "mapping" && <BranchMapping />}
      </main>
    </div>
  );
}

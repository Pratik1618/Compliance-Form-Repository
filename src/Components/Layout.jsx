import { useEffect, useState } from "react";
import { defaultAuthorisedSignatories } from "../Constants/authorisedSignatories";
import AuthorisedSignatories from "./AuthorisedSignatories";
import ClientComplianceChecklist from "./ClientComplianceChecklist";
import Dashboard from "./Dashboard";
import BranchMapping from "./BranchMapping";
import Login from "./Login";

export default function Layout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authorisedSignatories, setAuthorisedSignatories] = useState(() => {
    const storedSignatories = window.localStorage.getItem(
      "authorised-signatories",
    );

    if (!storedSignatories) {
      return defaultAuthorisedSignatories;
    }

    try {
      const parsedSignatories = JSON.parse(storedSignatories);
      const sanitizedSignatories = parsedSignatories.filter(
        (signatory) =>
          !(
            signatory.name === "Manoj Mohan Kambli" &&
            signatory.designation === "HR-Director"
          ),
      );

      return sanitizedSignatories.length > 0
        ? sanitizedSignatories
        : defaultAuthorisedSignatories;
    } catch {
      return defaultAuthorisedSignatories;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(
      "authorised-signatories",
      JSON.stringify(authorisedSignatories),
    );
  }, [authorisedSignatories]);

  const handleAddSignatory = (signatory) => {
    const signatoryId = `${signatory.name}-${signatory.designation}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    setAuthorisedSignatories((prev) => [
      ...prev,
      {
        id: `${signatoryId}-${Date.now()}`,
        ...signatory,
      },
    ]);
  };

  const handleRemoveSignatory = (signatoryId) => {
    setAuthorisedSignatories((prev) =>
      prev.filter((signatory) => signatory.id !== signatoryId),
    );
  };

  if (!isAuthenticated) {
    return <Login onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Compliance Panel</h2>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="mt-2 rounded-md bg-red-100 px-3 py-1 text-sm text-red-700 hover:bg-red-200"
          >
            Logout
          </button>
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

          <button
            onClick={() => setActivePage("client-checklist")}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              activePage === "client-checklist"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Client Checklist
          </button>

          <button
            onClick={() => setActivePage("signatories")}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
              activePage === "signatories"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Authorised Signatories
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "mapping" && (
          <BranchMapping signatories={authorisedSignatories} />
        )}
        {activePage === "client-checklist" && <ClientComplianceChecklist />}
        {activePage === "signatories" && (
          <AuthorisedSignatories
            signatories={authorisedSignatories}
            onAddSignatory={handleAddSignatory}
            onRemoveSignatory={handleRemoveSignatory}
          />
        )}
      </main>
    </div>
  );
}

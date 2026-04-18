import React, { useMemo, useRef, useState } from "react";
import {
  clientComplianceFormMapping,
  clientComplianceOptions,
} from "../Constants/clientComplianceChecklist";

const MAHINDRA_CLIENT = "Mahindra and Mahindra Finance Limited";

const getFileType = (filePath) => {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".pdf")) {
    return { label: "PDF", classes: "bg-red-50 text-red-700 border-red-100" };
  }
  if (lower.endsWith(".doc") || lower.endsWith(".docx")) {
    return {
      label: "DOCX",
      classes: "bg-blue-50 text-blue-700 border-blue-100",
    };
  }
  if (lower.endsWith(".xls") || lower.endsWith(".xlsx")) {
    return {
      label: "XLS",
      classes: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }
  return {
    label: "FILE",
    classes: "bg-slate-100 text-slate-700 border-slate-200",
  };
};

export default function ClientComplianceChecklist() {
  const [selectedClient, setSelectedClient] = useState(
    clientComplianceOptions[0] || "",
  );
  const [selectedFormLabel, setSelectedFormLabel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [selectedStateFilter, setSelectedStateFilter] = useState("");

  const formDropdownRef = useRef(null);

  const clientForms = useMemo(
    () => clientComplianceFormMapping[selectedClient] || [],
    [selectedClient],
  );

  const isMahindraClient = selectedClient === MAHINDRA_CLIENT;

  const availableStates = useMemo(() => {
    if (!isMahindraClient) {
      return [];
    }

    return [...new Set(clientForms.flatMap((form) => form.states || []))].sort();
  }, [clientForms, isMahindraClient]);

  const filteredForms = useMemo(() => {
    const normalizedTerm = searchTerm.toLowerCase();

    return clientForms.filter((form) => {
      const matchesSearch =
        !normalizedTerm ||
        form.label.toLowerCase().includes(normalizedTerm) ||
        form.category.toLowerCase().includes(normalizedTerm);

      if (!matchesSearch) {
        return false;
      }

      if (!isMahindraClient || !selectedStateFilter) {
        return true;
      }

      return (form.states || []).includes(selectedStateFilter);
    });
  }, [clientForms, isMahindraClient, searchTerm, selectedStateFilter]);

  const groupedForms = useMemo(
    () =>
      filteredForms.reduce((acc, form) => {
        if (!acc[form.category]) {
          acc[form.category] = [];
        }
        acc[form.category].push(form);
        return acc;
      }, {}),
    [filteredForms],
  );

  const selectedForm =
    clientForms.find((form) => form.label === selectedFormLabel) || null;

  React.useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        formDropdownRef.current &&
        !formDropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  React.useEffect(() => {
    setSelectedFormLabel("");
    setSearchTerm("");
    setError("");
    setSelectedStateFilter("");
  }, [selectedClient]);

  const handleDownload = async () => {
    if (!selectedForm) {
      setError("Select a form before downloading.");
      return;
    }

    if (!selectedForm.path) {
      setError("This file is not available in public/Compliance yet.");
      return;
    }

    setError("");
    const filePath = encodeURI(`/Compliance-Form-Repository/Compliance/${selectedForm.path}`);

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error("File missing");

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        throw new Error("Invalid path");
      }

      const blob = await response.blob();
      if (blob.size === 0) throw new Error("Empty file");

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedForm.path.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Unable to download this form. Please verify file availability.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            Client Compliance Forms
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Download client-specific compliance forms from the repository.
          </p>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Client
            </label>
            <select
              value={selectedClient}
              onChange={(event) => setSelectedClient(event.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            >
              {clientComplianceOptions.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          </div>

          {isMahindraClient ? (
            <div className="lg:col-span-3">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                State
              </label>
              <select
                value={selectedStateFilter}
                onChange={(event) => setSelectedStateFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">All states</option>
                {availableStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div
            className={`relative ${isMahindraClient ? "lg:col-span-4" : "lg:col-span-7"}`}
            ref={formDropdownRef}
          >
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Form
            </label>
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <span className="truncate">
                {selectedForm?.label || "Select form by category or search"}
              </span>
            </button>

            <div
              className={`absolute z-30 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg transition-all duration-150 ${
                showDropdown
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <div className="border-b border-slate-100 p-2">
                <input
                  type="text"
                  placeholder="Search forms or categories..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="max-h-80 overflow-y-auto py-1">
                {Object.keys(groupedForms).length === 0 ? (
                  <p className="px-3 py-4 text-sm text-slate-500">
                    No forms found for this search.
                  </p>
                ) : (
                  Object.keys(groupedForms)
                    .sort()
                    .map((category) => (
                      <div key={category} className="pb-1">
                        <div className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {category}
                        </div>
                        {groupedForms[category].map((form) => {
                          const type = form.path ? getFileType(form.path) : null;
                          return (
                            <button
                              key={form.label}
                              type="button"
                              onClick={() => {
                                setSelectedFormLabel(form.label);
                                setShowDropdown(false);
                              }}
                              className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-slate-50"
                            >
                              <span className="truncate pr-3 text-sm text-slate-700">
                                {form.label}
                              </span>
                              {type ? (
                                <span
                                  className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${type.classes}`}
                                >
                                  {type.label}
                                </span>
                              ) : (
                                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-700">
                                  MISSING
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <button
              onClick={handleDownload}
              className="h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              Download
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {isMahindraClient ? (
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Forms: {filteredForms.length}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              States: {availableStates.length}
            </span>
            {selectedStateFilter ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                Filtered by: {selectedStateFilter}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Client Form Mapping
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">No.</th>
                <th className="px-4 py-3 text-left font-medium">Form Name</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                {isMahindraClient ? (
                  <th className="px-4 py-3 text-left font-medium">State Count</th>
                ) : null}
                {isMahindraClient ? (
                  <th className="px-4 py-3 text-left font-medium">Not Applicable</th>
                ) : null}
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredForms.map((form, index) => (
                <tr key={form.label} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-700">{index + 1}</td>
                  <td className="px-4 py-3 text-slate-700">{form.label}</td>
                  <td className="px-4 py-3 text-slate-700">{form.category}</td>
                  {isMahindraClient ? (
                    <td className="px-4 py-3 text-slate-700">
                      {form.stateCount || form.states?.length || 0}
                    </td>
                  ) : null}
                  {isMahindraClient ? (
                    <td className="px-4 py-3 text-slate-700">
                      {form.notApplicableStates?.length ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          {form.notApplicableStates.length} state(s)
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          None
                        </span>
                      )}
                    </td>
                  ) : null}
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        form.path
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {form.path ? "Available" : "Missing"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isMahindraClient && selectedStateFilter ? (
          <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
            Showing Mahindra records applicable to <span className="font-semibold">{selectedStateFilter}</span>.
          </div>
        ) : null}
      </div>
    </div>
  );
}

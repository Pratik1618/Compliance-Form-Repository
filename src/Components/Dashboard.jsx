import React, { useEffect, useMemo, useRef, useState } from "react";
import { stateExcelMapping } from "../../stateExcelMapping.auto";

const stampOptions = [
  { value: "company", label: "Company" },
  { value: "contractor", label: "Contractor" },
  { value: "site", label: "Site" },
  { value: "branch", label: "Branch" },
];

// AI search intelligence mapping
const AI_KEYWORDS = {
  muster: ["muster", "attendance", "roll"],
  wages: ["wage", "salary", "payment"],
  contractor: ["clra", "contractor"],
  gratuity: ["gratuity"],
  bonus: ["bonus"],
  maternity: ["maternity"],
  shop: ["shop", "establishment"],
  factory: ["factory"],
  register: ["register", "form"],
};

function Dashboard() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [excelFiles, setExcelFiles] = useState([]);
  const [selectedExcel, setSelectedExcel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState("");
  const [error, setError] = useState("");

  const formDropdownRef = useRef(null);

  useEffect(() => {
    setStates(Object.keys(stateExcelMapping).sort());
  }, []);

  useEffect(() => {
    if (!selectedState) {
      setExcelFiles([]);
      setSelectedExcel("");
      setSearchTerm("");
      return;
    }

    setExcelFiles(stateExcelMapping[selectedState] || []);
    setSelectedExcel("");
    setSearchTerm("");
    setError("");
  }, [selectedState]);

  useEffect(() => {
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

  const getCategory = (path) => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length >= 3) return parts[1];
    if (parts.length >= 2) return "General";
    return "Others";
  };

  const getFileType = (file) => {
    const lower = file.toLowerCase();
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

  const selectedFileName = selectedExcel ? selectedExcel.split("/").pop() : "";
    const selectedCategory = selectedExcel ? getCategory(selectedExcel) : "";


const filteredFiles = useMemo(() => {
  if (!searchTerm) return excelFiles;

  const term = searchTerm.toLowerCase();

  // direct filename match
  const directMatches = excelFiles.filter((file) =>
    file.toLowerCase().includes(term)
  );

  // AI intent match
  const aiMatches = excelFiles.filter((file) => {
    const lowerFile = file.toLowerCase();

    return Object.keys(AI_KEYWORDS).some((intent) => {
      if (term.includes(intent)) {
        return AI_KEYWORDS[intent].some((keyword) =>
          lowerFile.includes(keyword)
        );
      }
      return false;
    });
  });

  // merge & remove duplicates
  return [...new Set([...directMatches, ...aiMatches])];
}, [excelFiles, searchTerm]);

  const groupedFiles = useMemo(
    () =>
      filteredFiles.reduce((acc, file) => {
        const category = getCategory(file);
        if (!acc[category]) acc[category] = [];
        acc[category].push(file);
        return acc;
      }, {}),
    [filteredFiles]
  );

  const handleExcelDownload = async () => {
    if (!selectedExcel) {
      setError("Select a form before downloading.");
      return;
    }

    setError("");
    const filePath = encodeURI(`/Compliance${selectedExcel}`);

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
      a.download = selectedExcel.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Unable to download this form. Please verify file availability.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]   w-full">
      <div className=" rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            Compliance Form Repository
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, select and download statutory compliance forms
          </p>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              State
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
        
            </div>
          </div>

          <div className="relative lg:col-span-6" ref={formDropdownRef}>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Form
            </label>
            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <span className="truncate">
                {selectedFileName || "Select form by category or search"}
              </span>
              {/* <span className="ml-3 text-slate-400">{showDropdown ? "^" : "v"}</span> */}
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
                />
              </div>

              <div className="max-h-80 overflow-y-auto py-1">
                {Object.keys(groupedFiles).length === 0 ? (
                  <p className="px-3 py-4 text-sm text-slate-500">
                    No forms found for this search.
                  </p>
                ) : (
                  Object.keys(groupedFiles)
                    .sort()
                    .map((category) => (
                      <div key={category} className="pb-1">
                        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                          {category}
                        </div>
                        {groupedFiles[category].map((file) => {
                          const type = getFileType(file);
                          return (
                            <button
                              key={file}
                              type="button"
                              onClick={() => {
                                setSelectedExcel(file);
                                setShowDropdown(false);
                              }}
                              className="flex w-full items-center justify-between px-3 py-2 text-left transition hover:bg-slate-50"
                            >
                              <span className="truncate pr-3 text-sm text-slate-700">
                                {file.split("/").pop()}
                              </span>
                              <span
                                className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${type.classes}`}
                              >
                                {type.label}
                              </span>
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
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Stamp
            </label>
            <div className="relative">
              <select
                value={selectedStamp}
                onChange={(e) => setSelectedStamp(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Select stamp</option>
                {stampOptions.map((stamp) => (
                  <option key={stamp.value} value={stamp.value}>
                    {stamp.label}
                  </option>
                ))}
              </select>
              {/* <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                v
              </span> */}
            </div>
          </div>

          <div >
            <button
              onClick={handleExcelDownload}
              className="h-11  rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
      </div>
         {selectedFileName ? (
              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-700">
                <span className="font-semibold  text-slate-600">Selected form:</span>{" "}
                <span className="font-semibold break-all">{selectedCategory}/ {selectedFileName}</span>
              </div>
            ) : null}
    </div>
  );
}

export default Dashboard;
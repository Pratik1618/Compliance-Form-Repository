import React, { useState } from "react";

export default function BranchMapping() {
  const branches = [
    "Mumbai Branch",
    "Pune Branch",
    "Ahmedabad Branch",
    "Bangalore Branch",
    "Delhi Branch",
  ];

  const states = ["Maharashtra", "Gujarat", "Karnataka", "Delhi"];

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [mappings, setMappings] = useState([]);

  const handleAddMapping = () => {
    if (!selectedBranch || !selectedState) return;

    const newMapping = {
      id: Date.now(),
      branch: selectedBranch,
      state: selectedState,
    };

    setMappings((prev) => [...prev, newMapping]);
    setSelectedBranch("");
    setSelectedState("");
  };

  const removeMapping = (id) => {
    setMappings((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full">
      
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            Branch Mapping
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Map branches with states for compliance applicability.
          </p>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
          
          {/* Branch */}
          <div className="lg:col-span-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">Select branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="lg:col-span-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              State
            </label>
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

          {/* Button */}
          <div className="lg:col-span-2">
            <button
              onClick={handleAddMapping}
              className="h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              Add Mapping
            </button>
          </div>
        </div>
      </div>

      {/* Mapping Table */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Branch</th>
              <th className="text-left px-4 py-3 font-medium">State</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {mappings.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center px-4 py-6 text-slate-500">
                  No branch mappings created yet.
                </td>
              </tr>
            ) : (
              mappings.map((map) => (
                <tr key={map.id} className="border-t">
                  <td className="px-4 py-3">{map.branch}</td>
                  <td className="px-4 py-3">{map.state}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeMapping(map.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import {
  branchMappings,
  branchMappingStates,
  getBranchesForState,
} from "../Constants/branchMappings";

export default function BranchMapping() {
  const states = branchMappingStates;

  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [mappings, setMappings] = useState(
    branchMappings.map((item, index) => ({
      id: index + 1,
      ...item,
    })),
  );

  const availableBranches = useMemo(
    () => getBranchesForState(selectedState),
    [selectedState],
  );

  useEffect(() => {
    if (availableBranches.length === 1) {
      setSelectedBranch(availableBranches[0].branch);
      return;
    }

    setSelectedBranch("");
  }, [availableBranches]);

  const handleAddMapping = () => {
    if (!selectedBranch || !selectedState || !selectedAddress) return;

    const newMapping = {
      id: Date.now(),
      branch: selectedBranch,
      state: selectedState,
      address: selectedAddress,
    };

    setMappings((prev) => [...prev, newMapping]);
    setSelectedBranch("");
    setSelectedState("");
    setSelectedAddress("");
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
          <div className="lg:col-span-3">
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

          <div className="lg:col-span-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={!selectedState || availableBranches.length === 0}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 shadow-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">
                {!selectedState
                  ? "Select state first"
                  : availableBranches.length === 0
                    ? "No branches mapped"
                    : "Select branch"}
              </option>
              {availableBranches.map((item) => (
                <option key={`${item.state}-${item.branch}`} value={item.branch}>
                  {item.branch}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="lg:col-span-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Address
            </label>
            <input
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              placeholder="Enter branch address"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            />
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
              <th className="text-left px-4 py-3 font-medium">State</th>
              <th className="text-left px-4 py-3 font-medium">Branch</th>
              <th className="text-left px-4 py-3 font-medium">Address</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {mappings.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center px-4 py-6 text-slate-500">
                  No branch mappings created yet.
                </td>
              </tr>
            ) : (
              mappings.map((map) => (
                <tr key={map.id} className="border-t">
                  <td className="px-4 py-3">{map.state}</td>
                  <td className="px-4 py-3">{map.branch}</td>
                  <td className="px-4 py-3">{map.address}</td>
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

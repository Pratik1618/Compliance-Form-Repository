import React, { useState } from "react";

export default function AuthorisedSignatories({
  signatories,
  onAddSignatory,
  onRemoveSignatory,
}) {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");

  const handleSignatureChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSignatureDataUrl("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSignatureDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSignatory = () => {
    if (!name.trim() || !designation.trim()) return;

    onAddSignatory({
      name: name.trim(),
      designation: designation.trim(),
      signatureDataUrl,
    });

    setName("");
    setDesignation("");
    setSignatureDataUrl("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            Authorised Signatories
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Add signatory details once and reuse them from branch mapping.
          </p>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Authorised Signatory
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter name"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Designation
            </label>
            <input
              value={designation}
              onChange={(event) => setDesignation(event.target.value)}
              placeholder="Enter designation"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="lg:col-span-4">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Signature
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureChange}
              className="block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              onClick={handleAddSignatory}
              className="h-11 w-full rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              Add Signatory
            </button>
          </div>
        </div>

        {signatureDataUrl ? (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-slate-600">
              Signature Preview
            </p>
            <img
              src={signatureDataUrl}
              alt="Signature preview"
              className="h-16 rounded-lg border border-slate-200 bg-white px-3 py-2"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Authorised Signatory</th>
              <th className="px-4 py-3 text-left font-medium">Designation</th>
              <th className="px-4 py-3 text-left font-medium">Signature</th>
              <th className="px-4 py-3 text-left font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {signatories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                  No authorised signatories added yet.
                </td>
              </tr>
            ) : (
              signatories.map((signatory) => (
                <tr key={signatory.id} className="border-t">
                  <td className="px-4 py-3">{signatory.name}</td>
                  <td className="px-4 py-3">{signatory.designation}</td>
                  <td className="px-4 py-3">
                    {signatory.signatureDataUrl ? (
                      <img
                        src={signatory.signatureDataUrl}
                        alt={`${signatory.name} signature`}
                        className="h-12 rounded-md border border-slate-200 bg-white px-2 py-1"
                      />
                    ) : (
                      <span className="text-slate-500">No signature uploaded</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onRemoveSignatory(signatory.id)}
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

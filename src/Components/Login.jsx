import { useState } from "react";

const DEFAULT_CREDENTIALS = {
  username: "admin",
  password: "password",
};

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
      setError("");
      onSuccess();
    } else {
      setError("Invalid username or password. Please use admin / password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-800">Sign In</h1>
        {error && <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            placeholder="admin"
            autoComplete="username"
          />

          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            placeholder="password"
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Login
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-slate-500">Default: <strong>admin</strong> / <strong>password</strong></p>
      </div>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";

type AdminLoginResponse = { success: boolean; error: string };

type AdminLoginPageProps = {
  isAuthenticated: boolean;
  onLogin: (email: string, password: string) => Promise<AdminLoginResponse>;
  onGoogleLogin: () => Promise<AdminLoginResponse>;
  authError: string;
  isLoading: boolean;
};

export default function AdminLoginPage({
  isAuthenticated,
  onLogin,
  onGoogleLogin,
  authError,
  isLoading,
}: AdminLoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const response = await onLogin(email, password);
    if (response.success) {
      navigate("/admin");
      return;
    }
    setError(response.error || "Invalid admin credentials.");
  };

  const continueWithGoogle = async () => {
    setError("");
    const response = await onGoogleLogin();
    if (response.success) {
      navigate("/admin");
      return;
    }
    setError(response.error || "Google sign-in failed.");
  };

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
      <p className="mt-2 text-sm text-slate-600">Only admins can upload course data to Firebase.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="admin_email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="admin_email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="ui-input"
            placeholder="admin@example.com"
          />
        </div>
        <div>
          <label htmlFor="admin_password" className="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="admin_password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="ui-input pr-20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {showPassword ? "Hide" : "View"}
            </button>
          </div>
        </div>

        <AlertMessage tone="danger" message={error} />
        <AlertMessage tone="danger" message={authError} />

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-700"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-xs text-slate-500">OR</span>
          </div>
        </div>

        <button
          type="button"
          onClick={continueWithGoogle}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Continue with Google
        </button>
      </form>
    </section>
  );
}


import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";

type LandingPageProps = {
  onRestoreByCode: (code: string) => Promise<any>;
  payableAmount: number;
};

export default function LandingPage({ onRestoreByCode, payableAmount }: LandingPageProps) {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");
  const [restoreError, setRestoreError] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);

  const handleCodeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRestoreError("");
    setIsRestoring(true);

    try {
      const session = await onRestoreByCode(accessCode);
      if (!session) {
        setRestoreError("Code not found. Confirm the code sent to your email.");
        return;
      }
      navigate("/results");
    } catch (error: any) {
      setRestoreError(error.message || "Unable to load code.");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
        Start a new calculation or continue with your access code
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
        New users pay KES {payableAmount}, then receive a unique code by email to reopen saved results later.
      </p>
      <div className="mt-6 flex flex-row items-center gap-4">
        <div className="mt-8">
          <Link
            to="/calculator"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-700"
          >
            Get Started
          </Link>
        </div>

        <form onSubmit={handleCodeSubmit} className="max-w-xl space-y-3 rounded-xl">
          <label htmlFor="access_code" className="block text-sm font-medium text-slate-700">
            Have an access code? Paste it here
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="access_code"
              type="text"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
              placeholder="e.g. 8F3KQ2P9"
              className="ui-input"
              required
            />
            <button
              type="submit"
              disabled={isRestoring}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-6 py-2 text-sm font-semibold text-white transition enabled:hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {isRestoring ? "Opening..." : "Open"}
            </button>
          </div>
          <AlertMessage tone="danger" message={restoreError} />
        </form>
      </div>
    </section>
  );
}


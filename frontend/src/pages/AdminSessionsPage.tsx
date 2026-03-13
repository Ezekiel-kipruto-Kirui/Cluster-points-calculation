import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw,
  Square,
  Trash2,
  X,
} from "lucide-react";
import AlertMessage from "../components/common/AlertMessage";
import {
  deleteClusterSessionByCode,
  deleteClusterSessionsByCodes,
  fetchAllClusterSessions,
  updateClusterSessionByCode,
} from "../lib/realtimeDb";

const PAGE_SIZE = 20;
const coreSubjects = ["BIO", "CHE", "MAT"];

const emptyEditForm = {
  code: "",
  email: "",
  phoneNumber: "",
  amountPaid: "0",
  medicineEligible: false,
};

const formatDateTime = (value) => {
  if (!value) return "Unknown";
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Unknown";
  return new Date(timestamp).toLocaleString();
};

const formatScore = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(3) : "0.000";
};

const getClusterEntries = (results) => {
  const normalized = results && typeof results === "object" ? results : {};
  return Array.from({ length: 20 }, (_, index) => {
    const cluster = index + 1;
    return {
      cluster,
      score: Number(normalized[cluster] ?? normalized[String(cluster)] ?? 0),
    };
  }).map((entry) => ({
    ...entry,
    score: Number.isFinite(entry.score) ? entry.score : 0,
  }));
};

const getTopClusters = (results, limit = 3) =>
  getClusterEntries(results)
    .sort((first, second) => second.score - first.score || first.cluster - second.cluster)
    .slice(0, limit);

const buildSearchKey = (session) =>
  [
    session.code,
    session.email,
    session.phoneNumber,
    session.amountPaid,
    session.createdAt,
    session.medicineEligible ? "eligible" : "not-eligible",
  ]
    .join(" ")
    .toLowerCase();

const getQualificationBadgeClass = (qualified) =>
  qualified
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-rose-200 bg-rose-50 text-rose-700";

const getVisiblePages = (currentPage, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
  const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
  return Array.from({ length: 7 }, (_, index) => start + index);
};

export default function AdminSessionsPage({ firebaseConfigured }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [query, setQuery] = useState("");
  const [expandedCode, setExpandedCode] = useState("");
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editing, setEditing] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [rowDeletingCode, setRowDeletingCode] = useState("");

  const loadSessions = useCallback(async () => {
    if (!firebaseConfigured) {
      setLoading(false);
      setError("Firebase is not configured.");
      setSessions([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const allSessions = await fetchAllClusterSessions();
      setSessions(allSessions);
    } catch (requestError) {
      setError(requestError.message || "Unable to load cluster sessions.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [firebaseConfigured]);

  useEffect(() => {
    loadSessions().catch(() => {
      // loadSessions updates state with user-facing errors.
    });
  }, [loadSessions]);

  const filteredSessions = useMemo(() => {
    const search = String(query || "").trim().toLowerCase();
    if (!search) return sessions;
    return sessions.filter((session) => buildSearchKey(session).includes(search));
  }, [query, sessions]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE)),
    [filteredSessions.length],
  );

  const pagedSessions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredSessions.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredSessions]);

  const summary = useMemo(() => {
    const uniqueUsers = new Set(
      filteredSessions.map((session) => session.email || session.phoneNumber || session.code),
    ).size;
    const medicineQualifiedCount = filteredSessions.filter((session) => session.medicineEligible).length;
    return {
      totalSessions: filteredSessions.length,
      uniqueUsers,
      medicineQualifiedCount,
    };
  }, [filteredSessions]);

  const selectedSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);
  const currentPageCodes = useMemo(() => pagedSessions.map((session) => session.code), [pagedSessions]);
  const allCurrentPageSelected =
    currentPageCodes.length > 0 && currentPageCodes.every((code) => selectedSet.has(code));

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    const availableCodes = new Set(filteredSessions.map((session) => session.code));
    setSelectedCodes((current) => current.filter((code) => availableCodes.has(code)));
    if (expandedCode && !availableCodes.has(expandedCode)) {
      setExpandedCode("");
    }
    if (editForm.code && !availableCodes.has(editForm.code)) {
      setEditForm(emptyEditForm);
    }
  }, [editForm.code, expandedCode, filteredSessions]);

  const toggleCodeSelection = (code) => {
    setSelectedCodes((current) => {
      const set = new Set(current);
      if (set.has(code)) set.delete(code);
      else set.add(code);
      return Array.from(set);
    });
  };

  const toggleSelectAllCurrentPage = () => {
    setSelectedCodes((current) => {
      const set = new Set(current);
      if (allCurrentPageSelected) {
        currentPageCodes.forEach((code) => set.delete(code));
      } else {
        currentPageCodes.forEach((code) => set.add(code));
      }
      return Array.from(set);
    });
  };

  const openEdit = (session) => {
    setActionError("");
    setActionMessage("");
    setEditForm({
      code: session.code,
      email: session.email || "",
      phoneNumber: session.phoneNumber || "",
      amountPaid: String(session.amountPaid ?? 0),
      medicineEligible: Boolean(session.medicineEligible),
    });
  };

  const closeEdit = () => {
    if (editing) return;
    setEditForm(emptyEditForm);
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editForm.code) return;

    setActionError("");
    setActionMessage("");
    const amount = Number(editForm.amountPaid);
    if (!Number.isFinite(amount) || amount < 0) {
      setActionError("Amount paid must be a valid number equal to or greater than 0.");
      return;
    }

    setEditing(true);
    try {
      await updateClusterSessionByCode(editForm.code, {
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        amountPaid: amount,
        medicineEligible: editForm.medicineEligible,
      });
      setActionMessage(`Session ${editForm.code} updated successfully.`);
      setEditForm(emptyEditForm);
      await loadSessions();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to update session.");
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteOne = async (code) => {
    if (!code) return;
    setActionError("");
    setActionMessage("");
    if (!window.confirm(`Delete session ${code}?`)) return;

    setRowDeletingCode(code);
    try {
      await deleteClusterSessionByCode(code);
      setActionMessage(`Session ${code} deleted.`);
      setSelectedCodes((current) => current.filter((entry) => entry !== code));
      if (expandedCode === code) setExpandedCode("");
      await loadSessions();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to delete session.");
    } finally {
      setRowDeletingCode("");
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedCodes.length) return;
    setActionError("");
    setActionMessage("");
    if (!window.confirm(`Delete ${selectedCodes.length} selected session(s)?`)) return;

    setBulkDeleting(true);
    try {
      const count = await deleteClusterSessionsByCodes(selectedCodes);
      setActionMessage(`${count} session(s) deleted.`);
      setSelectedCodes([]);
      if (expandedCode && selectedCodes.includes(expandedCode)) {
        setExpandedCode("");
      }
      await loadSessions();
    } catch (requestError) {
      setActionError(requestError.message || "Unable to delete selected sessions.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const visiblePages = useMemo(() => getVisiblePages(currentPage, totalPages), [currentPage, totalPages]);
  const pageStart = filteredSessions.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const pageEnd = Math.min(filteredSessions.length, currentPage * PAGE_SIZE);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="inline-flex rounded-full border border-cyan-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Admin Analytics
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Calculated Users Table</h1>
            <p className="mt-2 text-sm text-slate-600">
              Review users who calculated cluster points and manage records safely.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadSessions()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <Link
              to="/admin"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Link>
          </div>
        </div>

        
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">User Calculations</h2>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by email, code, phone..."
              className="ui-input w-full max-w-sm"
            />
            <button
              type="button"
              onClick={toggleSelectAllCurrentPage}
              disabled={!currentPageCodes.length}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {allCurrentPageSelected ? <Square className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
              {allCurrentPageSelected ? "Unselect Page" : "Select Page"}
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={!selectedCodes.length || bulkDeleting}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition enabled:hover:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Trash2 className="h-4 w-4" />
              {bulkDeleting ? "Deleting..." : `Delete Selected (${selectedCodes.length})`}
            </button>
          </div>
        </div>

        <AlertMessage className="mt-3" tone="danger" message={error} />
        <AlertMessage className="mt-3" tone="danger" message={actionError} />
        <AlertMessage className="mt-3" tone="success" message={actionMessage} />
        {loading ? <AlertMessage className="mt-3" tone="info" message="Loading sessions..." /> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-3 font-semibold">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={toggleSelectAllCurrentPage}
                    aria-label="Select all on current page"
                    className="ui-checkbox"
                  />
                </th>
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-3 py-3 font-semibold">Access Code</th>
                <th className="px-3 py-3 font-semibold">User</th>
                <th className="px-3 py-3 font-semibold">Best Cluster</th>
                <th className="px-3 py-3 font-semibold">Top 3 Cluster Points</th>
                
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
              {!loading && !pagedSessions.length ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-sm text-slate-500">
                    No calculation sessions found.
                  </td>
                </tr>
              ) : null}

              {pagedSessions.map((session) => {
                const topClusters = getTopClusters(session.results);
                const bestCluster = topClusters[0];
                const gradeEntries = Object.entries(session.grades || {}).filter(([, grade]) => grade);
                const deletingRow = rowDeletingCode === session.code;

                return (
                  <Fragment key={session.code}>
                    <tr>
                      <td className="whitespace-nowrap px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSet.has(session.code)}
                          onChange={() => toggleCodeSelection(session.code)}
                          aria-label={`Select ${session.code}`}
                          className="ui-checkbox"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">{formatDateTime(session.createdAt)}</td>
                      <td className="whitespace-nowrap px-3 py-3 font-mono font-semibold text-slate-900">
                        {session.code}
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-900">{session.email || "No email"}</p>
                        <p className="text-xs text-slate-500">{session.phoneNumber || "No phone"}</p>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {bestCluster ? `C${bestCluster.cluster}: ${formatScore(bestCluster.score)}` : "N/A"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {topClusters.map((entry) => (
                            <span
                              key={`${session.code}-${entry.cluster}`}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700"
                            >
                              C{entry.cluster}: {formatScore(entry.score)}
                            </span>
                          ))}
                        </div>
                      </td>
                      
                      <td className="whitespace-nowrap px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setExpandedCode((current) => (current === session.code ? "" : session.code))}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                          >
                            {expandedCode === session.code ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            {expandedCode === session.code ? "Hide" : "View"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteOne(session.code)}
                            disabled={deletingRow}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition enabled:hover:bg-rose-100 disabled:cursor-not-allowed disabled:text-rose-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingRow ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedCode === session.code ? (
                      <tr className="bg-slate-50/70">
                        <td colSpan={8} className="px-3 py-4">
                          <div className="grid gap-4 lg:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-white p-3">
                              <h3 className="text-sm font-semibold text-slate-900">Qualification Details</h3>
                              <p className="mt-2 text-xs text-slate-600">Medicine core subjects (BIO, CHE, MAT):</p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {coreSubjects.map((subject) => (
                                  <span
                                    key={`${session.code}-${subject}`}
                                    className={`rounded-full border px-2 py-1 text-xs font-medium ${
                                      session.grades?.[subject]
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border-rose-200 bg-rose-50 text-rose-700"
                                    }`}
                                  >
                                    {subject}: {session.grades?.[subject] || "Missing"}
                                  </span>
                                ))}
                              </div>
                              <p className="mt-3 text-xs text-slate-500">Amount Paid: KES {session.amountPaid || 0}</p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-white p-3 lg:col-span-2">
                              <h3 className="text-sm font-semibold text-slate-900">All Cluster Points</h3>
                              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                                {getClusterEntries(session.results).map((entry) => (
                                  <div
                                    key={`${session.code}-cluster-${entry.cluster}`}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs"
                                  >
                                    <p className="font-semibold text-slate-700">Cluster {entry.cluster}</p>
                                    <p className="mt-1 font-mono text-slate-900">{formatScore(entry.score)}</p>
                                  </div>
                                ))}
                              </div>
                              <p className="mt-3 text-xs text-slate-500">
                                Graded subjects: {gradeEntries.length}{" "}
                                {gradeEntries.length
                                  ? `(${gradeEntries.map(([code, grade]) => `${code}:${grade}`).join(", ")})`
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Showing {pageStart}-{pageEnd} of {filteredSessions.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </button>
            {visiblePages.map((page) => (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-sm font-semibold transition ${
                  page === currentPage
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {editForm.code ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Edit Session {editForm.code}</h3>
            <p className="mt-1 text-sm text-slate-600">
              Update user contact details, payment amount, and qualification flag.
            </p>
            <form onSubmit={saveEdit} className="mt-4 grid gap-4">
              <div>
                <label htmlFor="edit_session_email" className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="edit_session_email"
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))}
                  className="ui-input"
                />
              </div>
              <div>
                <label htmlFor="edit_session_phone" className="mb-1 block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  id="edit_session_phone"
                  type="text"
                  value={editForm.phoneNumber}
                  onChange={(event) => setEditForm((current) => ({ ...current, phoneNumber: event.target.value }))}
                  className="ui-input"
                />
              </div>
              <div>
                <label htmlFor="edit_session_amount" className="mb-1 block text-sm font-medium text-slate-700">
                  Amount Paid
                </label>
                <input
                  id="edit_session_amount"
                  type="number"
                  min={0}
                  step="0.01"
                  value={editForm.amountPaid}
                  onChange={(event) => setEditForm((current) => ({ ...current, amountPaid: event.target.value }))}
                  className="ui-input"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={editForm.medicineEligible}
                  onChange={(event) =>
                    setEditForm((current) => ({ ...current, medicineEligible: event.target.checked }))
                  }
                  className="ui-checkbox"
                />
                Medicine Eligible
              </label>

              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={editing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editing}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <CheckSquare className="h-4 w-4" />
                  {editing ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

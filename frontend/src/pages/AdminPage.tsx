import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import bundledCoursesCsvUrl from "../courses.csv?url";
import AlertMessage from "../components/common/AlertMessage";
import CsvUploadPanel from "../components/admin/CsvUploadPanel";
import type { AdminProfile, NormalizedCatalog } from "../lib/realtimeDb";

const emptyAdminForm = { name: "", email: "", password: "" };
const emptyCourseForm = {
  cluster: "",
  name: "",
  requirementsText: "",
  universityName: "",
  courseCode: "",
  cutoff: "",
};

const parseRequirementsInput = (value: string): Record<string, string> => {
  const requirements: Record<string, string> = {};
  String(value || "")
    .split(/\r?\n|;/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .forEach((entry) => {
      const separatorIndex = entry.indexOf(":");
      if (separatorIndex < 0) return;
      const subject = entry.slice(0, separatorIndex).trim();
      const grade = entry.slice(separatorIndex + 1).trim().toUpperCase();
      if (!subject || !grade) return;
      requirements[subject] = grade;
    });
  return requirements;
};

const summarizeCatalog = (catalog: NormalizedCatalog) => {
  const clusters = Object.keys(catalog || {}).length;
  let courses = 0;
  let universities = 0;

  Object.values(catalog || {}).forEach((entries) => {
    if (!Array.isArray(entries)) return;
    courses += entries.length;
    entries.forEach((course) => {
      universities += Array.isArray(course?.universities) ? course.universities.length : 0;
    });
  });

  return { clusters, courses, universities };
};

type AdminPageProps = {
  firebaseConfigured: boolean;
  onUploadCatalog: (catalog: any) => Promise<void>;
  onAddSingleCourse: (payload: any) => Promise<void>;
  onLogout: () => Promise<void>;
  onAddRegularAdmin: (payload: { name: string; email: string; password: string }) => Promise<{ user: any }>;
  adminProfile: AdminProfile | null;
  adminEmail: string;
  authError: string;
  courseCatalog: NormalizedCatalog;
};

export default function AdminPage({
  firebaseConfigured,
  onUploadCatalog,
  onAddSingleCourse,
  onLogout,
  onAddRegularAdmin,
  adminProfile,
  adminEmail,
  authError,
  courseCatalog,
}: AdminPageProps) {
  const [form, setForm] = useState(emptyAdminForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [courseSuccess, setCourseSuccess] = useState("");

  const canManageAdmins = adminProfile?.role === "super";
  const catalogSummary = useMemo(() => summarizeCatalog(courseCatalog), [courseCatalog]);

  const updateField = (key: keyof typeof emptyAdminForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateCourseField = (key: keyof typeof emptyCourseForm, value: string) => {
    setCourseForm((current) => ({ ...current, [key]: value }));
  };

  const submitRegularAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!canManageAdmins) {
      setFormError("Only a super admin can add regular admins.");
      return;
    }

    if (!form.email || !form.password) {
      setFormError("Email and password are required.");
      return;
    }

    setFormLoading(true);
    try {
      const response = await onAddRegularAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setFormSuccess(`Regular admin added: ${response.user.email}`);
      setForm(emptyAdminForm);
    } catch (error: any) {
      setFormError(error.message || "Unable to add regular admin.");
    } finally {
      setFormLoading(false);
    }
  };

  const submitSingleCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCourseError("");
    setCourseSuccess("");

    if (!firebaseConfigured) {
      setCourseError("Firebase is not configured.");
      return;
    }

    const cluster = Number(courseForm.cluster);
    if (!Number.isInteger(cluster) || cluster < 1) {
      setCourseError("Cluster must be a whole number greater than 0.");
      return;
    }

    const courseName = String(courseForm.name || "").trim();
    if (!courseName) {
      setCourseError("Course name is required.");
      return;
    }

    const universityName = String(courseForm.universityName || "").trim();
    if (!universityName) {
      setCourseError("University name is required.");
      return;
    }

    const cutoffRaw = String(courseForm.cutoff || "").trim();
    const cutoff = cutoffRaw ? Number(cutoffRaw) : 0;
    if (!Number.isFinite(cutoff) || cutoff < 0) {
      setCourseError("Cutoff must be a number equal to or greater than 0.");
      return;
    }

    setCourseLoading(true);
    try {
      await onAddSingleCourse({
        cluster,
        name: courseName,
        requirements: parseRequirementsInput(courseForm.requirementsText),
        universities: [
          {
            name: universityName,
            courseCode: String(courseForm.courseCode || "").trim(),
            cutoff,
          },
        ],
      });
      setCourseSuccess(`Saved "${courseName}" in cluster ${cluster}.`);
      setCourseForm((current) => ({
        ...current,
        universityName: "",
        courseCode: "",
        cutoff: "",
      }));
    } catch (error: any) {
      setCourseError(error.message || "Unable to save course.");
    } finally {
      setCourseLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 p-6 shadow-sm">
        <div className="pointer-events-none absolute -top-14 -right-12 h-44 w-44 rounded-full bg-cyan-200/40 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-emerald-200/50 blur-2xl" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="inline-flex rounded-full border border-cyan-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-700">
                Control Center
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Manage admins and maintain course catalog content for calculator results and eligibility checks.
              </p>
              <p className="mt-3 text-xs font-medium text-slate-500">
                Signed in as: {adminEmail || "unknown"} ({adminProfile?.role || "regular"} admin)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/sessions"
                className="inline-flex items-center justify-center rounded-xl border border-cyan-300 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                View Calculated Users
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Clusters</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{catalogSummary.clusters}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">Courses</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{catalogSummary.courses}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">University Entries</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{catalogSummary.universities}</p>
            </div>
          </div>
        </div>
        <AlertMessage className="mt-3" tone="danger" message={authError} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Admin Users</h2>
          <p className="mt-1 text-sm text-slate-600">
            Create regular admin accounts that can log in and access admin tools.
          </p>
          {!canManageAdmins ? (
            <AlertMessage
              className="mt-3"
              tone="warning"
              message="Only a super admin can add regular admin users."
            />
          ) : null}

          <form onSubmit={submitRegularAdmin} className="mt-5 grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="regular_admin_name" className="mb-1 block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="regular_admin_name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="ui-input"
                placeholder="Admin Name"
              />
            </div>
            <div>
              <label htmlFor="regular_admin_email" className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="regular_admin_email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
                className="ui-input"
                placeholder="newadmin@example.com"
              />
            </div>
            <div>
              <label htmlFor="regular_admin_password" className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="regular_admin_password"
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                required
                minLength={6}
                className="ui-input"
                placeholder="At least 6 characters"
              />
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={!canManageAdmins || formLoading}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-slate-800 enabled:hover:to-slate-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {formLoading ? "Creating..." : "Add Regular Admin"}
              </button>
            </div>
          </form>
          <AlertMessage className="mt-3" tone="danger" message={formError} />
          <AlertMessage className="mt-3" tone="success" message={formSuccess} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Add Single Course</h2>
          <p className="mt-1 text-sm text-slate-600">
            Add one course entry at a time. If the course already exists in the same cluster, the university entry is
            merged into it.
          </p>
          {!firebaseConfigured ? (
            <AlertMessage className="mt-3" tone="warning" message="Firebase is not configured for catalog writes." />
          ) : null}

          <form onSubmit={submitSingleCourse} className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="single_course_cluster" className="mb-1 block text-sm font-medium text-slate-700">
                Cluster
              </label>
              <input
                id="single_course_cluster"
                type="number"
                min={1}
                value={courseForm.cluster}
                onChange={(event) => updateCourseField("cluster", event.target.value)}
                required
                className="ui-input"
                placeholder="e.g. 2"
              />
            </div>
            <div>
              <label htmlFor="single_course_name" className="mb-1 block text-sm font-medium text-slate-700">
                Course Name
              </label>
              <input
                id="single_course_name"
                type="text"
                value={courseForm.name}
                onChange={(event) => updateCourseField("name", event.target.value)}
                required
                className="ui-input"
                placeholder="BACHELOR OF COMMERCE"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="single_course_requirements" className="mb-1 block text-sm font-medium text-slate-700">
                Minimum Subject Requirements
              </label>
              <textarea
                id="single_course_requirements"
                value={courseForm.requirementsText}
                onChange={(event) => updateCourseField("requirementsText", event.target.value)}
                rows={4}
                className="ui-textarea"
                placeholder={"Mathematics: C+\nEnglish/Kiswahili: B"}
              />
            </div>
            <div>
              <label htmlFor="single_course_university" className="mb-1 block text-sm font-medium text-slate-700">
                University
              </label>
              <input
                id="single_course_university"
                type="text"
                value={courseForm.universityName}
                onChange={(event) => updateCourseField("universityName", event.target.value)}
                required
                className="ui-input"
                placeholder="University of Nairobi"
              />
            </div>
            <div>
              <label htmlFor="single_course_code" className="mb-1 block text-sm font-medium text-slate-700">
                Course Code
              </label>
              <input
                id="single_course_code"
                type="text"
                value={courseForm.courseCode}
                onChange={(event) => updateCourseField("courseCode", event.target.value)}
                className="ui-input"
                placeholder="1263134"
              />
            </div>
            <div>
              <label htmlFor="single_course_cutoff" className="mb-1 block text-sm font-medium text-slate-700">
                Cutoff Points
              </label>
              <input
                id="single_course_cutoff"
                type="number"
                step="0.001"
                min={0}
                value={courseForm.cutoff}
                onChange={(event) => updateCourseField("cutoff", event.target.value)}
                className="ui-input"
                placeholder="32.613"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={courseLoading || !firebaseConfigured}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-emerald-500 enabled:hover:to-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {courseLoading ? "Saving..." : "Save Course Entry"}
              </button>
            </div>
          </form>
          <AlertMessage className="mt-3" tone="danger" message={courseError} />
          <AlertMessage className="mt-3" tone="success" message={courseSuccess} />
        </div>
      </div>

      <CsvUploadPanel
        firebaseConfigured={firebaseConfigured}
        onUploadCatalog={onUploadCatalog}
        bundledCoursesCsvUrl={bundledCoursesCsvUrl}
      />
    </section>
  );
}


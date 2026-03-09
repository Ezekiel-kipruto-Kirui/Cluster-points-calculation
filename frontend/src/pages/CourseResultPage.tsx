import { Link, Navigate, useSearchParams } from "react-router-dom";
import { checkSubjectRequirements } from "../lib/courseCheck";
import type { NormalizedCatalog } from "../lib/realtimeDb";

type CourseResultPageProps = {
  results: Record<string, number> | null;
  grades: Record<string, string> | null;
  courseCatalog: NormalizedCatalog;
};

export default function CourseResultPage({ results, grades, courseCatalog }: CourseResultPageProps) {
  const [searchParams] = useSearchParams();
  const cluster = Number(searchParams.get("cluster") || 0);
  const courseName = searchParams.get("course") || "";

  if (!results || !grades) return <Navigate to="/" replace />;
  if (!cluster || !courseName) return <Navigate to="/results" replace />;

  const courses = courseCatalog[cluster] || [];
  const course = courses.find((entry) => entry.name === courseName);
  if (!course) return <Navigate to="/results" replace />;

  const points = Number(results[cluster] ?? results[String(cluster)] ?? 0);
  const subjectCheck = checkSubjectRequirements(grades, course.requirements);
  const qualified: { name: string; cutoff: number }[] = [];
  const formatPoint = (value: number | string) => Number(value || 0).toFixed(3).replace(/\.?0+$/, "");

  if (subjectCheck.passed) {
    for (const uni of course.universities || []) {
      if (points >= Number(uni.cutoff)) qualified.push(uni as any);
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">{courseName}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Cluster:</span> {cluster}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Cluster Points:</span> {points}
          </p>
        </div>
      </div>

      {subjectCheck.passed ? (
        qualified.length ? (
          <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-900">Qualified Universities</h2>
            <p className="mt-1 text-sm text-slate-600">
              You qualify for {qualified.length} {qualified.length === 1 ? "university" : "universities"} based on your
              cluster points.
            </p>

            <div className="mt-4 overflow-x-auto rounded-xl border border-emerald-100">
              <table className="min-w-full divide-y divide-emerald-100 text-sm">
                <thead className="bg-emerald-50 text-left text-emerald-900">
                  <tr>
                    <th className="px-3 py-2 font-semibold">University</th>
                    <th className="px-3 py-2 font-semibold">Cutoff</th>
                    <th className="px-3 py-2 font-semibold">Your Points</th>
                    <th className="px-3 py-2 font-semibold">Margin</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-50 bg-white text-slate-700">
                  {qualified
                    .slice()
                    .sort((a, b) => Number(b.cutoff) - Number(a.cutoff))
                    .map((uni) => (
                      <tr key={`${uni.name}-${uni.cutoff}`} className="hover:bg-emerald-50/40">
                        <td className="px-3 py-2 font-medium text-slate-900">{uni.name}</td>
                        <td className="px-3 py-2">{formatPoint(uni.cutoff)}</td>
                        <td className="px-3 py-2">{formatPoint(points)}</td>
                        <td className="px-3 py-2 text-emerald-700">+{formatPoint(points - Number(uni.cutoff))}</td>
                        <td className="px-3 py-2">
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
                            Qualified
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-900">Not Qualified for Any University</h2>
            <p className="mt-2 text-sm text-amber-900">
              Based on your current cluster points, you do not qualify for any listed university for this course.
            </p>
          </article>
        )
      ) : (
        <div className="space-y-4">
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-900">Not Qualified for Any University</h2>
            <p className="mt-2 text-sm text-amber-900">
              You do not meet subject requirements for this course, so you are not qualified for any listed university.
            </p>
          </article>

          <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <h2 className="text-lg font-semibold text-rose-900">Subject Requirements Not Met</h2>
            <ul className="mt-3 space-y-1 text-sm text-rose-900">
              {subjectCheck.failed.map((item) => (
                <li key={`${item.subject}-${item.required}`}>
                  {item.subject} required &gt;= {item.required}
                  {item.studentSubject
                    ? ` (you had ${item.studentSubject}: ${item.studentGrade})`
                    : " (subject not done)"}
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}

      <div>
        <Link to="/results" className="text-sm font-medium text-slate-700 hover:text-slate-900">
          Back to Results
        </Link>
      </div>
    </section>
  );
}


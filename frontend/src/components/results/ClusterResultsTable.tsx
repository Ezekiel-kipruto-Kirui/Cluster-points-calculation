type ClusterResultsTableProps = {
  clusters: number[];
  getScore: (cluster: number) => number;
  courseCatalog: Record<number, { name: string }[]>;
  selectedCourses: Record<number, string>;
  onSelectCourse: (cluster: number, courseName: string) => void;
  onCheckCourse: (cluster: number, courseName: string) => void;
};

export default function ClusterResultsTable({
  clusters,
  getScore,
  courseCatalog,
  selectedCourses,
  onSelectCourse,
  onCheckCourse,
}: ClusterResultsTableProps) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-left text-slate-700">
          <tr>
            <th className="px-3 py-2 font-semibold">Cluster</th>
            <th className="px-3 py-2 font-semibold">Points</th>
            <th className="px-3 py-2 font-semibold">Course Check</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
          {clusters.map((cluster) => {
            const available = courseCatalog[cluster] || [];
            return (
              <tr key={cluster} className="align-top hover:bg-slate-50">
                <td className="px-3 py-2 font-medium text-slate-900">{cluster}</td>
                <td className="px-3 py-2">{getScore(cluster)}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={selectedCourses[cluster] || ""}
                      onChange={(event) => onSelectCourse(cluster, event.target.value)}
                      className="ui-select sm:max-w-sm"
                    >
                      <option value="">Select Course</option>
                      {available.map((course) => (
                        <option key={course.name} value={course.name}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={!selectedCourses[cluster]}
                      onClick={() => onCheckCourse(cluster, selectedCourses[cluster])}
                      className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      Check
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


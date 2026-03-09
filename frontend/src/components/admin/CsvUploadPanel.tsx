import { useState, type ChangeEvent } from "react";
import AlertMessage from "../common/AlertMessage";
import { parseCourseCsvToCatalog, summarizeCourseCatalog } from "../../lib/courseCsv";
import { readFileAsText } from "../../utils/fileUtils";

type CsvUploadPanelProps = {
  firebaseConfigured: boolean;
  onUploadCatalog: (catalog: any) => Promise<void>;
  bundledCoursesCsvUrl: string;
};

export default function CsvUploadPanel({
  firebaseConfigured,
  onUploadCatalog,
  bundledCoursesCsvUrl,
}: CsvUploadPanelProps) {
  const [uploadError, setUploadError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadCatalogText = async (csvText: string, sourceName: string) => {
    setUploadError("");
    setUploadMessage("");
    setIsUploading(true);

    try {
      const catalog = parseCourseCsvToCatalog(csvText);
      await onUploadCatalog(catalog);
      const summary = summarizeCourseCatalog(catalog);
      setUploadMessage(
        `${sourceName} uploaded: ${summary.clusters} clusters, ${summary.courses} courses, ${summary.universities} universities.`,
      );
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload course catalog.");
    } finally {
      setIsUploading(false);
    }
  };

  const uploadSelectedCsv = async () => {
    if (!selectedFile) {
      setUploadError("Select a CSV file first.");
      return;
    }

    try {
      const csvText = await readFileAsText(selectedFile);
      await uploadCatalogText(csvText, selectedFile.name);
    } catch (error: any) {
      setUploadError(error.message || "Failed to read selected CSV file.");
    }
  };

  const uploadBundledCsv = async () => {
    try {
      const response = await fetch(bundledCoursesCsvUrl);
      if (!response.ok) throw new Error(`Unable to load bundled CSV (status ${response.status}).`);
      const csvText = await response.text();
      await uploadCatalogText(csvText, "courses.csv");
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload bundled courses.csv.");
    }
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight">Courses Upload</h2>
      <p className="mt-1 text-sm text-slate-600">
        Upload a `courses.csv` compatible file through backend API into Firebase realtime database.
      </p>

      {!firebaseConfigured ? (
        <AlertMessage
          className="mt-4"
          tone="warning"
          message="Backend Firebase integration is not available."
        />
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:max-w-md">
          <label htmlFor="admin_csv_upload" className="mb-1 block text-sm font-medium text-slate-700">
            Select CSV file
          </label>
          <input
            id="admin_csv_upload"
            type="file"
            accept=".csv,text/csv"
            onChange={onFileChange}
            className="ui-file-input"
          />
        </div>
        <button
          type="button"
          onClick={uploadSelectedCsv}
          disabled={isUploading || !firebaseConfigured}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Upload Selected CSV
        </button>
        <button
          type="button"
          onClick={uploadBundledCsv}
          disabled={isUploading || !firebaseConfigured}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition enabled:hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Upload Bundled courses.csv
        </button>
      </div>

      <AlertMessage className="mt-3" tone="danger" message={uploadError} />
      <AlertMessage className="mt-3" tone="success" message={uploadMessage} />
    </section>
  );
}

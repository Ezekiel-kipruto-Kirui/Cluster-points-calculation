import { useCallback, useMemo, useState, type ReactElement } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import AlertMessage from "./components/common/AlertMessage";
import { GRADE_OPTIONS, PAYABLE_AMOUNT } from "./config/appConfig";
import { useAdminAuth } from "./hooks/useAdminAuth";
import { SUBJECTS } from "./lib/clusterEngine";
import { fetchClusterSessionByCode, isFirebaseReady } from "./lib/realtimeDb";
import { useCourseCatalog } from "./hooks/useCourseCatalog";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import AdminSessionsPage from "./pages/AdminSessionsPage";
import CalculatorPage from "./pages/CalculatorPage";
import CourseResultPage from "./pages/CourseResultPage";
import LandingPage from "./pages/LandingPage";
import ResultsPage from "./pages/ResultsPage";

const emptyGrades = () => Object.fromEntries(Object.keys(SUBJECTS).map((code) => [code, ""]));

export default function App() {
  const location = useLocation();
  const [finalGrades, setFinalGrades] = useState<Record<string, string> | null>(null);
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const [calcSource, setCalcSource] = useState("local-engine");
  const [accessCode, setAccessCode] = useState("");
  const [sessionMessage, setSessionMessage] = useState("");

  const firebaseConfigured = useMemo(() => isFirebaseReady(), []);

  const isAdminRoute = location.pathname.startsWith("/admin");

  const { courseCatalog, catalogLoading, courseCatalogError, saveCatalog, saveSingleCourse } = useCourseCatalog({
    mode: isAdminRoute ? "admin" : "public",
  });
  const {
    adminUser,
    adminProfile,
    authLoading,
    authWorking,
    authError,
    isAdminAuthenticated,
    login,
    loginWithGoogle,
    logout,
    addRegularAdmin,
  } = useAdminAuth({ enabled: isAdminRoute });

  const restoreByCode = useCallback(async (code: string) => {
    const session = await fetchClusterSessionByCode(code);
    if (!session || !session.results) return null;

    setFinalGrades(session.grades || (emptyGrades() as Record<string, string>));
    setResults(session.results || null);
    setCalcSource("saved-session");
    setAccessCode(session.code);
    setSessionMessage(
      session.createdAt
        ? `Loaded ${session.storage === "local" ? "local" : "saved"} session from ${new Date(
            session.createdAt,
          ).toLocaleString()}.`
        : `Loaded ${session.storage === "local" ? "local" : "saved"} session.`,
    );

    return session;
  }, []);

  const handleCatalogUpload = useCallback(
    async (catalog: any) => {
      await saveCatalog(catalog);
    },
    [saveCatalog],
  );

  const handleSingleCourseSave = useCallback(
    async (coursePayload: any) => {
      await saveSingleCourse(coursePayload);
    },
    [saveSingleCourse],
  );

  const handleAdminLogin = useCallback(
    async (email: string, password: string) => {
      const response = await login(email, password);
      return response;
    },
    [login],
  );

  const handleAdminGoogleLogin = useCallback(async () => {
    const response = await loginWithGoogle();
    return response;
  }, [loginWithGoogle]);

  const handleAdminLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  const renderAdminProtected = useCallback(
    (element: ReactElement) => {
      if (authLoading) {
        return (
          <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <AlertMessage tone="info" message="Checking admin authentication..." />
          </section>
        );
      }
      if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />;
      return element;
    },
    [authLoading, isAdminAuthenticated],
  );

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<LandingPage onRestoreByCode={restoreByCode} payableAmount={PAYABLE_AMOUNT} />} />
        <Route
          path="/admin/login"
          element={
            <AdminLoginPage
              isAuthenticated={isAdminAuthenticated}
              onLogin={handleAdminLogin}
              onGoogleLogin={handleAdminGoogleLogin}
              authError={authError}
              isLoading={authWorking || authLoading}
            />
          }
        />
        <Route
          path="/admin"
          element={renderAdminProtected(
            <AdminPage
              firebaseConfigured={firebaseConfigured}
              onUploadCatalog={handleCatalogUpload}
              onAddSingleCourse={handleSingleCourseSave}
              onLogout={handleAdminLogout}
              onAddRegularAdmin={addRegularAdmin}
              adminProfile={adminProfile}
              adminEmail={adminUser?.email || ""}
              authError={authError}
              courseCatalog={courseCatalog}
            />,
          )}
        />
        <Route
          path="/admin/sessions"
          element={renderAdminProtected(<AdminSessionsPage firebaseConfigured={firebaseConfigured} />)}
        />
        <Route
          path="/calculator"
          element={
            <CalculatorPage
              gradeOptions={GRADE_OPTIONS}
              payableAmount={PAYABLE_AMOUNT}
              onCalculationReady={({
                grades,
                results: nextResults,
                source,
                accessCode: nextCode,
                sessionMessage: nextMessage,
              }) => {
                setFinalGrades(grades);
                setResults(nextResults);
                setCalcSource(source);
                setAccessCode(nextCode || "");
                setSessionMessage(nextMessage || "");
              }}
            />
          }
        />
        <Route path="/payment" element={<Navigate to="/calculator" replace />} />
        <Route
          path="/results"
          element={
            <ResultsPage
              results={results}
              grades={finalGrades}
              source={calcSource}
              courseCatalog={courseCatalog}
              courseCatalogError={courseCatalogError}
              catalogLoading={catalogLoading}
              accessCode={accessCode}
              sessionMessage={sessionMessage}
            />
          }
        />
        <Route
          path="/course-result"
          element={<CourseResultPage results={results} grades={finalGrades} courseCatalog={courseCatalog} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

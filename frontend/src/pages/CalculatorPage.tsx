import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../components/common/AlertMessage";
import { SUBJECT_GROUPS, SUBJECTS } from "../lib/clusterEngine";
import { ChevronDown } from "lucide-react";
import {
  calculateLocally,
  calculateClusterPointsAfterPayment,
  initiateDarajaPayment,
  sendServiceEmail,
  waitForSuccessfulPayment,
} from "../lib/api";
import { saveClusterSessionWithFallback } from "../lib/realtimeDb";
import { buildAccessCodeEmailMessage } from "../utils/messages";
import { normalizePhone, isValidEmail } from "../utils/validators";

type SubjectCode = keyof typeof SUBJECTS;

const emptyGrades = () => Object.fromEntries(Object.keys(SUBJECTS).map((code) => [code, ""]));

const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow";
const toggleButtonClass =
  "mt-3 inline-flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100";
const selectClass = "ui-select";

type CalculatorPageProps = {
  onCalculationReady: (payload: {
    grades: Record<string, string>;
    results: Record<string, number>;
    source: string;
    accessCode: string;
    sessionMessage: string;
  }) => void;
  payableAmount: number;
  gradeOptions: string[];
};

export default function CalculatorPage({ onCalculationReady, payableAmount, gradeOptions }: CalculatorPageProps) {
  const navigate = useNavigate();
  const [grades, setGrades] = useState<Record<string, string>>(emptyGrades());
  const [openDropdownByGroup, setOpenDropdownByGroup] = useState<Record<string, boolean>>(
    Object.fromEntries(SUBJECT_GROUPS.map((group, index) => [group.title, index === 0])),
  );
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [pendingPayload, setPendingPayload] = useState<Record<string, string> | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const updateGrade = (subjectCode: string, grade: string) => {
    setGrades((current) => ({ ...current, [subjectCode]: grade }));
  };

  const getSubjectLabel = (subjectCode: string) => SUBJECTS[subjectCode as SubjectCode] || subjectCode;

  const getGradedSubjects = () =>
    Object.entries(grades)
      .filter(([, grade]) => grade && grade !== "")
      .map(([code]) => code);

  const toggleDropdown = (groupTitle: string) => {
    setOpenDropdownByGroup((current) => {
      const next = Object.fromEntries(Object.keys(current).map((key) => [key, false]));
      next[groupTitle] = !current[groupTitle];
      return next;
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setDialogError("");
    setDialogMessage("");

    const gradedSubjects = getGradedSubjects();
    if (gradedSubjects.length < 7) {
      setFormError("Select grades for at least 7 subjects across all groups to compute cluster points.");
      return;
    }

    const payload = emptyGrades();
    gradedSubjects.forEach((subjectCode) => {
      payload[subjectCode] = grades[subjectCode];
    });

    const normalizedEmail = String(email || "").trim();
    if (!isValidEmail(normalizedEmail)) {
      setFormError("Enter a valid email address.");
      return;
    }

    setPendingPayload(payload);
    setPendingEmail(normalizedEmail);

    setPhoneDialogOpen(true);
  };

  const confirmPhoneAndProcess = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDialogError("");
    setDialogMessage("");

    if (!pendingPayload) {
      setDialogError("Please submit your grades and email first.");
      return;
    }

    if (!pendingEmail) {
      setDialogError("Enter a valid email before continuing.");
      return;
    }

    const normalizedPhone = normalizePhone(phoneNumber);
    if (!normalizedPhone) {
      setDialogError("Enter a valid M-Pesa phone number e.g. 0712345678 or 254712345678.");
      return;
    }

    setIsLoading(true);
    try {
      setDialogMessage("Sending the STK push to your phone...");
      const paymentResponse = await initiateDarajaPayment({
        amount: payableAmount,
        phone_number: normalizedPhone,
        phone: normalizedPhone,
        phoneNumber: normalizedPhone,
        "phone number": normalizedPhone,
      });

      const checkoutRequestId = String(paymentResponse?.CheckoutRequestID || paymentResponse?.checkoutRequestId || "").trim();
      const merchantRequestId = String(paymentResponse?.MerchantRequestID || paymentResponse?.merchantRequestId || "").trim();
      if (!checkoutRequestId && !merchantRequestId) {
        throw new Error("STK push response did not include a payment reference.");
      }

      setDialogMessage("STK push sent. Complete the payment on your phone. Waiting for confirmation...");
      const paymentStatus = await waitForSuccessfulPayment({
        checkoutRequestId,
        merchantRequestId,
        onStatus: (status) => {
          if (status?.status === "pending") {
            setDialogMessage("Waiting for M-Pesa confirmation. Complete the prompt on your phone to continue.");
          }
        },
      });

      setDialogMessage("Payment confirmed. Calculating cluster points...");
      let calculated: {
        source: string;
        results: Record<string, number>;
        medicineEligible: boolean;
      };
      let calculationWarning = "";
      try {
        calculated = await calculateClusterPointsAfterPayment({
          grades: pendingPayload,
          checkoutRequestId,
          merchantRequestId,
        });
      } catch (calculationError: any) {
        calculated = calculateLocally(pendingPayload) as any;
        calculationWarning =
          String(calculationError?.message || "").trim() ||
          "Backend calculation API was unavailable, so a local verified fallback was used.";
      }

      const { session: savedSession, storage, warning } = await saveClusterSessionWithFallback({
        email: pendingEmail,
        phoneNumber: normalizedPhone,
        amountPaid: payableAmount,
        grades: pendingPayload,
        results: calculated.results,
        medicineEligible: calculated.medicineEligible,
        paymentResponse: {
          initiation: paymentResponse,
          confirmation: paymentStatus,
        },
      });

      const statusMessages = ["Payment confirmed."];
      if (calculationWarning) {
        statusMessages.push(`Cluster points calculated locally (${calculationWarning}).`);
      }
      if (storage === "local") {
        statusMessages.push(
          warning ||
            "Firebase save failed. Session was saved on this browser only, so code restore works only on this device.",
        );
      } else {
        statusMessages.push("Session saved to Firebase.");
      }

      try {
        await sendServiceEmail({
          email: pendingEmail,
          subject: "KUCCPS Cluster Calculator Results",
          message: buildAccessCodeEmailMessage({
            code: savedSession.code,
            results: calculated.results,
            medicineEligible: calculated.medicineEligible,
          }),
        });
        statusMessages.push(`Results email sent to ${pendingEmail}.`);
      } catch (emailError) {
        const emailMessage = emailError instanceof Error ? emailError.message : "";
        statusMessages.push(
          emailMessage
            ? `Email delivery failed (${emailMessage}). Save this code: ${savedSession.code}.`
            : `Email delivery failed. Save this code: ${savedSession.code}.`,
        );
      }

      onCalculationReady({
        grades: pendingPayload,
        results: calculated.results,
        source: calculated.source,
        accessCode: savedSession.code,
        sessionMessage: statusMessages.join(" "),
      });
      setPhoneDialogOpen(false);
      setDialogError("");
      setDialogMessage("");
      setFormError("");
      navigate("/results");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Payment or calculation failed.";
      setDialogError(message);
      setFormError(message);
      setDialogMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Cluster Points Calculator</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter your grades and email, then start payment. Cluster points are only shown after the M-Pesa payment is confirmed.
      </p>
      <p className="mt-1 text-sm font-medium text-emerald-700">Amount: KES {payableAmount}</p>
      

      <form onSubmit={submit} className="mt-6 space-y-6">
        <AlertMessage tone="danger" message={formError} />

        <div className="grid gap-5 xl:grid-cols-2">
          {SUBJECT_GROUPS.map((group) => (
            <article key={group.title} className={cardClass}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{group.title}</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {group.required
                      ? "Core group. Enter grades for all listed subjects."
                      : "Optional group. Fill available subjects."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleDropdown(group.title)}
                className={toggleButtonClass}
              >
                <span>{openDropdownByGroup[group.title] ? "Hide grade fields" : "Show grade fields"}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    openDropdownByGroup[group.title] ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {openDropdownByGroup[group.title] ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {group.subjects.map((subjectCode) => (
                    <div key={subjectCode}>
                      <label
                        htmlFor={`${group.title}-${subjectCode}`}
                        className="mb-1 block text-sm font-medium text-slate-700"
                      >
                        {getSubjectLabel(subjectCode)}
                        {group.required ? <span className="text-rose-600"> *</span> : null}
                      </label>
                      <select
                        id={`${group.title}-${subjectCode}`}
                        value={grades[subjectCode]}
                        onChange={(event) => updateGrade(subjectCode, event.target.value)}
                        required={group.required}
                        className={selectClass}
                      >
                        <option value="">Select grade</option>
                        {gradeOptions.map((grade) => (
                          <option key={grade} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email Address (for access code)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="ui-input"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:from-slate-800 hover:to-slate-700"
        >
          {isLoading ? "Processing..." : "Calculate Cluster Points"}
        </button>
      </form>

      {phoneDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Enter M-Pesa Phone Number</h2>
            <p className="mt-1 text-sm text-slate-600">
              We will send an STK push for KES {payableAmount}. Your cluster points remain locked until the payment is confirmed.
            </p>

            <form onSubmit={confirmPhoneAndProcess} className="mt-4 space-y-4">
              <div>
                <label htmlFor="dialog_phone_number" className="mb-1 block text-sm font-medium text-slate-700">
                  M-Pesa Phone Number
                </label>
                <input
                  id="dialog_phone_number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  placeholder="0712345678"
                  autoFocus
                  required
                  className="ui-input"
                />
              </div>

              <AlertMessage tone="info" message={dialogMessage} />
              <AlertMessage tone="danger" message={dialogError} />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!isLoading) {
                      setPhoneDialogOpen(false);
                      setDialogError("");
                    }
                  }}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:from-slate-800 enabled:hover:to-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isLoading ? "Processing..." : "Send STK Push"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

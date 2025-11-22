import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom"; 
import { PrimaryButton } from "@/components/PrimaryButton";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const requestSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

const verifySchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, "Enter OTP"),
});

const resetSchema = z
  .object({
    email: z.string().email(),
    otp: z.string(),
    password: z.string().regex(passwordRegex, "Password must be ≥8 chars and include lower/upper/number/special"),
    confirmPassword: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.password !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type RequestForm = z.infer<typeof requestSchema>;
type VerifyForm = z.infer<typeof verifySchema>;
type ResetForm = z.infer<typeof resetSchema>;

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

// Helper: safe fetch wrapper
async function safeFetch(path: string, opts?: RequestInit) {
  try {
    const res = await fetch(`${apiBase}${path}`, opts);
    return res;
  } catch (err) {
    // backend unreachable
    return null;
  }
}

export default function ForgotPassword() {
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [emailForFlow, setEmailForFlow] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const reqForm = useForm<RequestForm>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" },
  });

  const verifyForm = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: "", otp: "" },
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "", otp: "", password: "", confirmPassword: "" },
  });

  // Step 1: request OTP
  const onRequest = async (data: RequestForm) => {
    setSubmitting(true);
    setEmailForFlow(data.email);

    // call backend: POST /auth/forgot (body { email })
    const res = await safeFetch("/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email }),
    });

    if (res === null) {
      // backend not available -> demo fallback (use static OTP 123456)
      toast.success("OTP (demo) sent to your email — use code 123456");
      verifyForm.setValue("email", data.email);
      resetForm.setValue("email", data.email);
      setStep("verify");
      setSubmitting(false);
      return;
    }

    if (res.ok) {
      toast.success("OTP sent to your email");
      verifyForm.setValue("email", data.email);
      resetForm.setValue("email", data.email);
      setStep("verify");
    } else {
      const payload = await res.json().catch(() => null);
      toast.error(payload?.message || "Could not send OTP");
    }
    setSubmitting(false);
  };

  // Step 2: verify OTP
  const onVerify = async (data: VerifyForm) => {
    setSubmitting(true);
    // call backend: POST /auth/verify-otp (body { email, otp })
    const res = await safeFetch("/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, otp: data.otp }),
    });

    if (res === null) {
      // demo fallback: accept OTP = 123456
      if (data.otp === "123456") {
        toast.success("OTP verified (demo)");
        resetForm.setValue("email", data.email);
        resetForm.setValue("otp", data.otp);
        setStep("reset");
      } else {
        toast.error("Invalid OTP (demo)");
      }
      setSubmitting(false);
      return;
    }

    if (res.ok) {
      toast.success("OTP verified");
      resetForm.setValue("email", data.email);
      resetForm.setValue("otp", data.otp);
      setStep("reset");
    } else {
      const payload = await res.json().catch(() => null);
      toast.error(payload?.message || "OTP verification failed");
    }
    setSubmitting(false);
  };

  // Step 3: reset password
  const onReset = async (data: ResetForm) => {
    setSubmitting(true);
    // call backend: POST /auth/reset-password (body { email, otp, newPassword })
    const res = await safeFetch("/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, otp: data.otp, newPassword: data.password }),
    });

    if (res === null) {
      // demo fallback: accept and redirect
      toast.success("Password reset (demo). Please log in with new password.");
      navigate("/");
      setSubmitting(false);
      return;
    }

    if (res.ok) {
      toast.success("Password changed successfully. Please log in.");
      navigate("/");
    } else {
      const payload = await res.json().catch(() => null);
      toast.error(payload?.message || "Could not reset password");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <h2 className="text-xl font-semibold text-center mb-2 text-foreground">Forgot Password</h2>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Follow the steps to reset your password. We'll send an OTP to your registered email.
          </p>

          {step === "request" && (
            <form onSubmit={reqForm.handleSubmit(onRequest)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  {...reqForm.register("email")}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border"
                  placeholder="you@example.com"
                />
                {reqForm.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{reqForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <Link to="/" className="text-sm text-muted-foreground hover:underline">Back to login</Link>
                <PrimaryButton type="submit" disabled={submitting}>
                  {submitting ? "Sending…" : "Send OTP"}
                </PrimaryButton>
              </div>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  {...verifyForm.register("email")}
                  type="email"
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">OTP</label>
                <input
                  {...verifyForm.register("otp")}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border"
                  placeholder="Enter OTP"
                />
                {verifyForm.formState.errors.otp && (
                  <p className="text-xs text-red-500 mt-1">{verifyForm.formState.errors.otp.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button type="button" className="text-sm text-muted-foreground hover:underline" onClick={() => setStep("request")}>
                  Change email
                </button>
                <PrimaryButton type="submit" disabled={submitting}>
                  {submitting ? "Verifying…" : "Verify OTP"}
                </PrimaryButton>
              </div>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input {...resetForm.register("email")} type="email" readOnly className="w-full px-4 py-3 rounded-xl bg-input border border-border" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">OTP</label>
                <input {...resetForm.register("otp")} className="w-full px-4 py-3 rounded-xl bg-input border border-border" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                <input {...resetForm.register("password")} type="password" className="w-full px-4 py-3 rounded-xl bg-input border border-border" placeholder="New password" />
                {resetForm.formState.errors.password && <p className="text-xs text-red-500 mt-1">{resetForm.formState.errors.password.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <input {...resetForm.register("confirmPassword")} type="password" className="w-full px-4 py-3 rounded-xl bg-input border border-border" placeholder="Confirm new password" />
                {resetForm.formState.errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{resetForm.formState.errors.confirmPassword.message as string}</p>}
              </div>

              <div className="flex justify-between items-center">
                <button type="button" className="text-sm text-muted-foreground hover:underline" onClick={() => setStep("verify")}>
                  Back to OTP
                </button>
                <PrimaryButton type="submit" disabled={submitting}>
                  {submitting ? "Resetting…" : "Reset Password"}
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

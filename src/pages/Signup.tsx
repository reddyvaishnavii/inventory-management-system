import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PrimaryButton } from "@/components/PrimaryButton";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
// explanation:
// - (?=.*[a-z])  -> at least one lowercase
// - (?=.*[A-Z])  -> at least one uppercase
// - (?=.*\d)     -> at least one digit
// - (?=.*[^\w\s]) -> at least one special char
// - .{8,}        -> minimum length 8

const signupSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    loginId: z
      .string()
      .min(6, "Login ID must be 6–12 characters")
      .max(12, "Login ID must be 6–12 characters")
      .regex(/^[A-Za-z0-9_.-]+$/, "Login ID can use letters, numbers, _ . -"),
    email: z.string().email("Enter a valid email"),
    password: z
      .string()
      .regex(passwordRegex, "Password must be ≥8 chars and include lowercase, uppercase, number and special char"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", loginId: "", email: "", password: "", confirmPassword: "" },
  });

  // Async uniqueness checks (backend endpoints expected):
  // GET /api/auth/check-login?loginId=xxx  -> { available: true|false }
  // GET /api/auth/check-email?email=xxx   -> { available: true|false }
  // If backend is not available, these functions will return { available: true } so demo works.
  async function checkLoginIdUnique(loginId: string) {
    try {
      const base = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
      const res = await fetch(`${base}/auth/check-login?loginId=${encodeURIComponent(loginId)}`);
      if (!res.ok) return { available: true }; // fallback permissive
      return (await res.json()) as { available: boolean };
    } catch (e) {
      // backend unreachable -> allow for demo, UI will still validate locally
      return { available: true };
    }
  }

  async function checkEmailUnique(email: string) {
    try {
      const base = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
      const res = await fetch(`${base}/auth/check-email?email=${encodeURIComponent(email)}`);
      if (!res.ok) return { available: true };
      return (await res.json()) as { available: boolean };
    } catch (e) {
      return { available: true };
    }
  }

  const onSubmit = async (data: SignupForm) => {
    setSubmitting(true);

    // 1) loginId uniqueness
    const loginCheck = await checkLoginIdUnique(data.loginId);
    if (!loginCheck.available) {
      setError("loginId", { type: "manual", message: "Login ID already taken" });
      setSubmitting(false);
      return;
    }

    // 2) email uniqueness
    const emailCheck = await checkEmailUnique(data.email);
    if (!emailCheck.available) {
      setError("email", { type: "manual", message: "Email already registered" });
      setSubmitting(false);
      return;
    }

    // 3) All good — call signup endpoint (if available)
    try {
      const base = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
      const res = await fetch(`${base}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          loginId: data.loginId,
          email: data.email,
          password: data.password,
        }),
      });

      if (res.ok) {
        toast.success("Account created successfully");
        // either auto-login or redirect to login page
        navigate("/");
      } else {
        // backend returned an error (show message if present)
        const payload = await res.json().catch(() => null);
        const msg = payload?.message || "Signup failed — try again";
        toast.error(msg);
      }
    } catch (err) {
      // network/backend not available — allow local demo
      toast.success("Account created locally (demo mode)");
      // optionally store locally or just redirect to login
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <UserPlus className="text-primary" size={32} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-foreground mb-2">Create an account</h1>
          <p className="text-center text-muted-foreground mb-6">Sign up to manage your inventory and warehouses.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full name</label>
              <input
                {...register("name")}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your full name"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Login ID</label>
              <input
                {...register("loginId")}
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="6-12 chars (letters & numbers)"
              />
              {errors.loginId && <p className="text-xs text-red-500 mt-1">{errors.loginId.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Minimum 8 chars, include upper/lower/number/special"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm password</label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Re-enter password"
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message as string}</p>}
            </div>

            <PrimaryButton type="submit" className="mt-2 w-full" disabled={submitting}>
              {submitting ? "Creating…" : "Create Account"}
            </PrimaryButton>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

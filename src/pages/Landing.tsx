// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Users, UserCheck } from "lucide-react";

/*
  Optional local screenshot displayed on the landing page.
  The developer environment will transform this path when packaging for demo:
  /mnt/data/Screenshot 2025-11-22 at 09.52.18.png
*/
const HERO_IMG = "/mnt/data/Screenshot 2025-11-22 at 09.52.18.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: hero / description */}
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
            <img
              src={HERO_IMG}
              alt="Inventory dashboard preview"
              className="w-full h-56 object-cover rounded-md mb-6 shadow-sm"
            />
            <h1 className="text-3xl font-bold text-foreground mb-3">Welcome to StockMaster</h1>
            <p className="text-muted-foreground mb-4">
              Choose your role to continue. Inventory Managers and Warehouse Staff have
              different workflows and dashboards. Pick the option that matches your role.
            </p>
            <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
              <li>Managers: manage receipts, deliveries, reordering rules, and KPIs.</li>
              <li>Staff: pick, transfer, count and update stock locations.</li>
            </ul>
          </div>

          {/* Right: role cards */}
          <div className="space-y-6">
            {/* Manager card */}
            <section className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <UserCheck className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Inventory Manager</h3>
                  <p className="text-sm text-muted-foreground">Manage stock, approvals, and KPIs</p>
                </div>
              </div>

              <div className="mt-3 flex gap-3">
                <Link to="/manager/login" aria-label="Manager login" className="flex-1">
                  <PrimaryButton className="w-full">Manager Log in</PrimaryButton>
                </Link>

                <Link to="/manager/signup" aria-label="Manager signup" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition"
                  >
                    Manager Sign up
                  </button>
                </Link>
              </div>
            </section>

            {/* Staff card */}
            <section className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Warehouse Staff</h3>
                  <p className="text-sm text-muted-foreground">Pick, transfer, and update physical stock</p>
                </div>
              </div>

              <div className="mt-3 flex gap-3">
                <Link to="/staff/login" aria-label="Staff login" className="flex-1">
                  <PrimaryButton className="w-full">Staff Log in</PrimaryButton>
                </Link>

                <Link to="/staff/signup" aria-label="Staff signup" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition"
                  >
                    Staff Sign up
                  </button>
                </Link>
              </div>
            </section>

            {/* Small footer */}
            <p className="text-xs text-muted-foreground text-center">
              If you are unsure which role to pick, contact your admin or ask the team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

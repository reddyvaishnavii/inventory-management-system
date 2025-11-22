import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PrimaryButton } from "@/components/PrimaryButton";
import { User, LogOut } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <div className="max-w-2xl">
            {/* Profile Section */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="text-primary" size={32} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">John Doe</h2>
                  <p className="text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              
              <PrimaryButton fullWidth={false} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                Edit Profile
              </PrimaryButton>
            </div>

            {/* Actions Section */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Actions</h3>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors duration-200 font-medium"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;

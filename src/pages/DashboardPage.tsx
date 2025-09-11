import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { Chatbot } from "@/components/Chatbot";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Dashboard />
      <Chatbot />
    </div>
  );
};

export default DashboardPage;
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { Chatbot } from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <Chatbot />
    </div>
  );
};

export default Index;

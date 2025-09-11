import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { Upload, BarChart3, Home } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold bg-primary-gradient bg-clip-text text-transparent">
              AutoML Platform
            </h1>
            <div className="flex items-center space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`
                }
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </NavLink>
              <NavLink 
                to="/upload" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`
                }
              >
                <Upload className="h-4 w-4" />
                <span>Upload Dataset</span>
              </NavLink>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                  }`
                }
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </NavLink>
            </div>
          </div>
          <Button variant="outline">Get Started</Button>
        </div>
      </div>
    </nav>
  );
};
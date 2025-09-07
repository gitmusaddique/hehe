import { Home, Dumbbell, Utensils, TrendingUp, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { useHaptic } from "@/hooks/use-haptic";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "nutrition", label: "Nutrition", icon: Utensils },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "profile", label: "Profile", icon: User },
];

export function BottomNavigation() {
  const { currentView, setCurrentView } = useApp();
  const { triggerHaptic } = useHaptic();

  const handleNavigation = (viewId: string) => {
    triggerHaptic('light');
    setCurrentView(viewId);
  };

  return (
    <nav className="bg-transparent p-2 flex justify-between items-center w-full overflow-hidden">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <Button
            key={item.id}
            variant="ghost"
            className={`nav-item flex flex-col items-center py-2 px-1 min-w-0 flex-1 haptic-feedback ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => handleNavigation(item.id)}
            data-testid={`nav-${item.id}`}
          >
            <Icon className="h-5 w-5 mb-1 shrink-0" />
            <span className="text-xs truncate w-full text-center">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}

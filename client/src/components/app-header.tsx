import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";

export function AppHeader() {
  const { user } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="bg-transparent p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=50&h=50" 
          alt="User profile" 
          className="w-10 h-10 rounded-full object-cover"
          data-testid="user-avatar"
        />
        <div>
          <h1 className="font-bold text-lg">
            {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Alex'}!
          </h1>
          <p className="text-sm text-muted-foreground">Ready to crush your goals?</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full haptic-feedback"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs"></span>
        </Button>
      </div>
    </header>
  );
}

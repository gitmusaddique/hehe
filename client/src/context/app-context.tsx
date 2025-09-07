import { createContext, useContext, useState, ReactNode } from "react";
import { type User } from "@shared/schema";

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  isOnboardingComplete: boolean;
  setIsOnboardingComplete: (complete: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(
    localStorage.getItem('fitlife_onboarding_complete') === 'true'
  );

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      currentView,
      setCurrentView,
      isOnboardingComplete,
      setIsOnboardingComplete,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

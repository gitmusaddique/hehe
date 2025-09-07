import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { type User } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

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

  // Load user from localStorage on app start
  useEffect(() => {
    const userId = localStorage.getItem('fitlife_user_id');
    if (userId && isOnboardingComplete) {
      // The user will be loaded via the query below
      return;
    }
  }, [isOnboardingComplete]);

  // Fetch user data if we have a user ID
  const userId = localStorage.getItem('fitlife_user_id');
  const { data: userData } = useQuery({
    queryKey: ['/api/users', userId],
    enabled: !!userId && isOnboardingComplete && !user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set user when data is loaded
  useEffect(() => {
    if (userData && !user) {
      setUser(userData);
    }
  }, [userData, user]);

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

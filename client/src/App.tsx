import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/app-context";
import { AppHeader } from "@/components/app-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { FloatingActionButton } from "@/components/floating-action-button";
import { QuickActionsModal } from "@/components/quick-actions-modal";
import { OnboardingPage } from "@/pages/onboarding";
import { DashboardPage } from "@/pages/dashboard";
import { WorkoutsPage } from "@/pages/workouts";
import { NutritionPage } from "@/pages/nutrition";
import { ProgressPage } from "@/pages/progress";
import { ProfilePage } from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function AppContent() {
  const { currentView, isOnboardingComplete } = useApp();
  const [showQuickActions, setShowQuickActions] = useState(false);

  if (!isOnboardingComplete) {
    return <OnboardingPage />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'workouts':
        return <WorkoutsPage />;
      case 'nutrition':
        return <NutritionPage />;
      case 'progress':
        return <ProgressPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="h-full flex flex-col max-w-md mx-auto relative bg-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-40 bg-background border-b border-border mobile-header">
        <AppHeader />
      </div>
      
      {/* Main Content with proper padding for fixed header/bottom */}
      <main className="flex-1 overflow-hidden pt-20 pb-20">
        <div className="h-full overflow-y-auto mobile-scroll hide-scrollbar">
          {renderCurrentView()}
        </div>
      </main>

      <FloatingActionButton onQuickActions={() => setShowQuickActions(true)} />
      
      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-40 bg-background border-t border-border mobile-bottom-nav overflow-hidden">
        <BottomNavigation />
      </div>
      
      <QuickActionsModal 
        open={showQuickActions} 
        onOpenChange={setShowQuickActions} 
      />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <AppContent />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <div className="min-h-screen bg-background text-foreground antialiased">
            <Toaster />
            <Router />
          </div>
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

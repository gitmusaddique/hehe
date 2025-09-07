import { 
  Edit, Settings, Bell, Shield, Download, Users, Trophy, Share, 
  Crown, HelpCircle, Star, Info, LogOut, ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/app-context";
import { useHaptic } from "@/hooks/use-haptic";

export function ProfilePage() {
  const { user } = useApp();
  const { triggerHaptic } = useHaptic();

  const handleMenuClick = (action: string) => {
    triggerHaptic('light');
    console.log(`Profile action: ${action}`);
    // TODO: Implement actual functionality
  };

  const handleSignOut = () => {
    triggerHaptic('medium');
    localStorage.removeItem('fitlife_onboarding_complete');
    localStorage.removeItem('fitlife_onboarding_data');
    window.location.reload();
  };

  const menuItems = [
    { 
      icon: Settings, 
      label: "Account Settings", 
      action: "settings",
      color: "text-primary" 
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      action: "notifications",
      color: "text-chart-2" 
    },
    { 
      icon: Shield, 
      label: "Privacy & Security", 
      action: "privacy",
      color: "text-chart-3" 
    },
    { 
      icon: Download, 
      label: "Export Data", 
      action: "export",
      color: "text-chart-4" 
    },
  ];

  const socialItems = [
    {
      icon: Users,
      label: "Friends",
      description: "Connect with 12 friends",
      action: "friends",
      color: "text-chart-1"
    },
    {
      icon: Trophy,
      label: "Challenges",
      description: "Join community challenges",
      action: "challenges",
      color: "text-chart-3"
    },
    {
      icon: Share,
      label: "Share Progress",
      description: "Post to social media",
      action: "share",
      color: "text-chart-5"
    },
  ];

  const supportItems = [
    { 
      icon: HelpCircle, 
      label: "Help & Support", 
      action: "help" 
    },
    { 
      icon: Star, 
      label: "Rate App", 
      action: "rate" 
    },
    { 
      icon: Info, 
      label: "About FitLife Pro", 
      action: "about",
      extra: "v2.1.0" 
    },
  ];

  return (
    <div className="h-full overflow-y-auto hide-scrollbar p-4 space-y-6">
      
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80" 
              alt="Profile photo" 
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
              data-testid="img-profile-photo"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold" data-testid="text-user-name">
                {user?.fullName || "Alex Johnson"}
              </h2>
              <p className="opacity-80">@alexfit2024</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span>
                  <strong data-testid="text-total-workouts">247</strong> workouts
                </span>
                <span>
                  <strong data-testid="text-streak-days">12</strong> day streak
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="bg-white/20 backdrop-blur-sm text-primary-foreground hover:bg-white/30"
              onClick={() => handleMenuClick('edit-profile')}
              data-testid="button-edit-profile"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Achievement Level */}
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-80">Fitness Level</span>
              <span className="text-sm font-medium">Intermediate</span>
            </div>
            <Progress value={68} className="h-2 bg-white/20" />
            <div className="text-xs opacity-60 mt-1">32% to Advanced level</div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary" data-testid="text-total-calories">52,847</div>
            <div className="text-sm text-muted-foreground">Calories burned</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-2" data-testid="text-total-hours">187</div>
            <div className="text-sm text-muted-foreground">Hours trained</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-chart-3" data-testid="text-total-achievements">23</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Options */}
      <Card>
        <CardContent className="p-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <Button
                key={item.action}
                variant="ghost"
                className={`w-full p-4 flex items-center justify-between h-auto rounded-none ${
                  index !== menuItems.length - 1 ? 'border-b border-border' : ''
                } hover:bg-muted`}
                onClick={() => handleMenuClick(item.action)}
                data-testid={`menu-${item.action}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-left">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Social Features */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Social</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          {socialItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Button
                key={item.action}
                variant="ghost"
                className="w-full p-3 flex items-center justify-between h-auto bg-muted rounded-lg hover:bg-muted/80"
                onClick={() => handleMenuClick(item.action)}
                data-testid={`social-${item.action}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Premium Features */}
      <Card className="bg-gradient-to-r from-chart-3 to-chart-5 text-white border-0">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Crown className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Upgrade to Premium</h3>
              <p className="text-sm opacity-80">Unlock advanced analytics & AI coaching</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4 text-sm opacity-90">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <span>Advanced ML predictions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <span>Personalized meal plans</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <span>Unlimited data exports</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-white text-chart-5 font-bold hover:bg-white/90"
            onClick={() => handleMenuClick('premium')}
            data-testid="button-premium-trial"
          >
            Start Free Trial
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="p-0">
          {supportItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <Button
                key={item.action}
                variant="ghost"
                className={`w-full p-4 flex items-center justify-between h-auto rounded-none ${
                  index !== supportItems.length - 1 ? 'border-b border-border' : ''
                } hover:bg-muted`}
                onClick={() => handleMenuClick(item.action)}
                data-testid={`support-${item.action}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-left">{item.label}</span>
                </div>
                {item.extra ? (
                  <span className="text-sm text-muted-foreground">{item.extra}</span>
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button 
        variant="destructive"
        className="w-full p-4 font-medium"
        onClick={handleSignOut}
        data-testid="button-sign-out"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>

    </div>
  );
}

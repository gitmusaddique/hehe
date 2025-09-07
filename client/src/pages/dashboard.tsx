import { Flame, Utensils, TrendingUp, Dumbbell, Camera, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarWithLabels } from "@/components/chart-bar";
import { useApp } from "@/context/app-context";

export function DashboardPage() {
  const { setCurrentView } = useApp();

  // Mock data - in a real app, this would come from API
  const weeklyData = [65, 80, 45, 95, 30, 55, 75];
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="h-full overflow-y-auto hide-scrollbar p-4 space-y-6">
      
      {/* Daily Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary to-chart-1 text-primary-foreground border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Flame className="h-6 w-6" />
              <span className="text-sm opacity-80">Today</span>
            </div>
            <div className="text-2xl font-bold" data-testid="text-calories-burned">1,247</div>
            <div className="text-sm opacity-80">Calories burned</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Utensils className="h-6 w-6 text-chart-2" />
              <span className="text-sm text-muted-foreground">Nutrition</span>
            </div>
            <div className="text-2xl font-bold" data-testid="text-calories-consumed">1,850</div>
            <div className="text-sm text-muted-foreground">Calories consumed</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <TrendingUp className="h-5 w-5 text-primary mr-2" />
            This Week's Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartBarWithLabels 
            data={weeklyData} 
            labels={weekDays}
            height={96}
            color="bg-primary"
          />
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="p-4 h-auto text-left justify-start haptic-feedback"
          onClick={() => setCurrentView('workouts')}
          data-testid="quick-action-workout"
        >
          <div className="flex flex-col items-start space-y-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <div className="font-medium">Start Workout</div>
            <div className="text-sm text-muted-foreground">Push Day • 45 min</div>
          </div>
        </Button>
        
        <Button
          variant="outline"
          className="p-4 h-auto text-left justify-start haptic-feedback"
          onClick={() => setCurrentView('nutrition')}
          data-testid="quick-action-nutrition"
        >
          <div className="flex flex-col items-start space-y-2">
            <Camera className="h-6 w-6 text-chart-2" />
            <div className="font-medium">Log Meal</div>
            <div className="text-sm text-muted-foreground">Scan or search food</div>
          </div>
        </Button>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Trophy className="h-5 w-5 text-chart-3 mr-2" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-4">
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-chart-3 to-chart-1 rounded-full flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">7-Day Streak!</div>
              <div className="text-sm text-muted-foreground">Logged workouts every day</div>
            </div>
            <span className="text-xs text-muted-foreground">2 days ago</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-chart-2 rounded-full flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium">New PR: Bench Press</div>
              <div className="text-sm text-muted-foreground">80kg × 5 reps</div>
            </div>
            <span className="text-xs text-muted-foreground">1 week ago</span>
          </div>
        </CardContent>
      </Card>

      {/* Social Feed Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Users className="h-5 w-5 text-chart-1 mr-2" />
            Community Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <div className="flex items-start space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" 
              alt="Sarah's profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Sarah M.</span>
                <span className="text-xs text-muted-foreground">completed a workout</span>
              </div>
              <div className="text-sm text-muted-foreground">Full body strength training • 52 min</div>
            </div>
            <span className="text-xs text-muted-foreground">5m</span>
          </div>
          
          <div className="flex items-start space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=40&h=40" 
              alt="Mike's profile" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">Mike R.</span>
                <span className="text-xs text-muted-foreground">reached a goal</span>
              </div>
              <div className="text-sm text-muted-foreground">Lost 5kg this month! 🎉</div>
            </div>
            <span className="text-xs text-muted-foreground">1h</span>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

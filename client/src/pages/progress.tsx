import { Weight, Target, Calendar, TrendingDown, Camera, Trophy, Zap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarWithLabels } from "@/components/chart-bar";

export function ProgressPage() {
  const weightData = [74.5, 74.1, 73.8, 73.5, 73.2, 72.8, 72.5, 72.3];
  const chartLabels = ['Aug', 'Sep', 'Oct', 'Nov'];

  const bodyMeasurements = [
    { name: "Chest", value: 98.5, unit: "cm", change: +1.2, trend: "up" },
    { name: "Waist", value: 82.1, unit: "cm", change: -3.4, trend: "down" },
    { name: "Arms", value: 34.2, unit: "cm", change: +0.8, trend: "up" },
    { name: "Thighs", value: 58.7, unit: "cm", change: +1.1, trend: "up" },
  ];

  const performanceInsights = [
    { 
      icon: Trophy, 
      color: "text-chart-3", 
      title: "Strength Gains", 
      description: "Average +15% this month",
      bgColor: "bg-chart-3/10"
    },
    { 
      icon: Zap, 
      color: "text-destructive", 
      title: "Calorie Burn", 
      description: "2,847 cal this week",
      bgColor: "bg-destructive/10"
    },
    { 
      icon: Heart, 
      color: "text-chart-5", 
      title: "Recovery", 
      description: "Optimal rest periods",
      bgColor: "bg-chart-5/10"
    },
  ];

  return (
    <div className="h-full overflow-y-auto hide-scrollbar p-4 space-y-6">
      
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-primary to-chart-1 text-primary-foreground border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Weight className="h-5 w-5" />
              <span className="text-xs opacity-80">Current</span>
            </div>
            <div className="text-2xl font-bold" data-testid="text-current-weight">72.3</div>
            <div className="text-sm opacity-80">kg</div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>-2.1kg this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-chart-2" />
              <span className="text-xs text-muted-foreground">Goal</span>
            </div>
            <div className="text-2xl font-bold" data-testid="text-goal-weight">68.0</div>
            <div className="text-sm text-muted-foreground">kg</div>
            <div className="flex items-center mt-2 text-xs text-chart-2">
              <Calendar className="h-3 w-3 mr-1" />
              <span>4.3kg to go</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Progress Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Weight Progress</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="default" className="text-xs px-3 py-1 h-auto">3M</Button>
            <Button size="sm" variant="outline" className="text-xs px-3 py-1 h-auto">6M</Button>
            <Button size="sm" variant="outline" className="text-xs px-3 py-1 h-auto">1Y</Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <ChartBarWithLabels 
            data={weightData} 
            labels={chartLabels}
            height={160}
            color="bg-chart-1"
          />
        </CardContent>
      </Card>

      {/* Body Measurements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Body Measurements</CardTitle>
          <Button size="sm" variant="ghost" className="text-primary" data-testid="add-measurement">
            <span className="text-xs">+ Add</span>
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-4">
            {bodyMeasurements.map((measurement) => (
              <div key={measurement.name} className="p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">{measurement.name}</div>
                <div className="font-bold">{measurement.value} {measurement.unit}</div>
                <div className={`text-xs ${
                  measurement.trend === 'up' && measurement.name !== 'Waist' 
                    ? 'text-chart-2' 
                    : measurement.trend === 'down' && measurement.name === 'Waist'
                    ? 'text-destructive'
                    : 'text-chart-2'
                }`}>
                  {measurement.change > 0 ? '+' : ''}{measurement.change}cm
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Photos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Progress Photos</CardTitle>
          <Button size="sm" variant="ghost" className="text-primary" data-testid="take-photo">
            <Camera className="h-4 w-4 mr-1" />
            <span className="text-xs">Take Photo</span>
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=160" 
                alt="Front view progress photo" 
                className="w-full h-20 object-cover rounded-lg"
              />
              <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">Front</span>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=160" 
                alt="Side view progress photo" 
                className="w-full h-20 object-cover rounded-lg"
              />
              <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">Side</span>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=160" 
                alt="Back view progress photo" 
                className="w-full h-20 object-cover rounded-lg"
              />
              <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-1 rounded">Back</span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Last updated: 3 days ago
          </div>
        </CardContent>
      </Card>

      {/* Performance Analytics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          {performanceInsights.map((insight, index) => {
            const Icon = insight.icon;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer haptic-feedback hover:bg-muted/80">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${insight.bgColor} rounded-lg`}>
                    <Icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                  <div>
                    <div className="font-medium">{insight.title}</div>
                    <div className="text-sm text-muted-foreground">{insight.description}</div>
                  </div>
                </div>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            );
          })}
        </CardContent>
      </Card>

    </div>
  );
}

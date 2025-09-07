import { Play, Pause, SkipForward, Clock, Dumbbell, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function WorkoutsPage() {
  const [activeWorkout, setActiveWorkout] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All" },
    { id: "strength", label: "Strength" },
    { id: "cardio", label: "Cardio" },
    { id: "flexibility", label: "Flexibility" },
    { id: "sports", label: "Sports" },
  ];

  const workoutTemplates = [
    {
      id: 1,
      name: "Push Day - Upper Body",
      description: "8 exercises • 45-60 min • Intermediate",
      category: "strength",
      icon: Dumbbell,
      color: "from-primary to-chart-1",
      estimatedCalories: 280,
    },
    {
      id: 2,
      name: "HIIT Cardio Blast",
      description: "6 exercises • 25-30 min • All levels",
      category: "cardio",
      icon: Zap,
      color: "from-chart-2 to-chart-3",
      estimatedCalories: 350,
    },
    {
      id: 3,
      name: "Full Body Stretch",
      description: "12 poses • 20-25 min • Beginner",
      category: "flexibility",
      icon: Heart,
      color: "from-chart-4 to-chart-5",
      estimatedCalories: 120,
    },
  ];

  const recentWorkouts = [
    {
      name: "Push Day - Upper Body",
      date: "2 days ago",
      duration: 52,
      exercises: 8,
      calories: 1247,
      badges: ["Personal Record", "Great Form"],
    },
    {
      name: "HIIT Cardio Blast",
      date: "4 days ago", 
      duration: 28,
      exercises: 6,
      calories: 324,
      badges: ["High Intensity"],
    },
  ];

  return (
    <div className="h-full overflow-y-auto hide-scrollbar p-4 space-y-6">
      
      {/* Active Workout Card */}
      {activeWorkout && (
        <Card className="bg-gradient-to-r from-primary to-chart-1 text-primary-foreground border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span className="font-medium">Workout in Progress</span>
              </div>
              <span className="text-sm opacity-80" data-testid="text-workout-timer">23:45</span>
            </div>
            <div className="text-lg font-bold mb-1">Push Day - Upper Body</div>
            <div className="text-sm opacity-80 mb-4">Exercise 3 of 8 • Bench Press</div>
            
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                className="flex-1 bg-white/20 backdrop-blur-sm text-primary-foreground hover:bg-white/30"
                data-testid="button-pause-workout"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button 
                variant="ghost" 
                className="flex-1 bg-white/20 backdrop-blur-sm text-primary-foreground hover:bg-white/30"
                data-testid="button-next-exercise"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workout Categories */}
      <div>
        <h3 className="font-semibold mb-3">Workout Categories</h3>
        <div className="flex space-x-3 overflow-x-auto hide-scrollbar">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="whitespace-nowrap haptic-feedback"
              onClick={() => setSelectedCategory(category.id)}
              data-testid={`category-${category.id}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Start Templates */}
      <div>
        <h3 className="font-semibold mb-3">Quick Start</h3>
        <div className="space-y-3">
          {workoutTemplates.map((template) => {
            const Icon = template.icon;
            
            return (
              <Card key={template.id} className="cursor-pointer haptic-feedback hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ~{template.estimatedCalories} calories
                      </div>
                    </div>
                    <Button 
                      size="icon"
                      className="haptic-feedback"
                      onClick={() => setActiveWorkout(true)}
                      data-testid={`start-workout-${template.id}`}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Exercise Library Preview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Exercise Library</h3>
          <Button variant="ghost" className="text-primary haptic-feedback" data-testid="view-all-exercises">
            View All
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer haptic-feedback hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="w-full h-20 bg-muted rounded-lg mb-2 flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="font-medium text-sm">Bench Press</div>
              <div className="text-xs text-muted-foreground">Chest, Triceps</div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer haptic-feedback hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="w-full h-20 bg-muted rounded-lg mb-2 flex items-center justify-center">
                <Play className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="font-medium text-sm">Pull-ups</div>
              <div className="text-xs text-muted-foreground">Back, Biceps</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Workouts */}
      <div>
        <h3 className="font-semibold mb-3">Recent Workouts</h3>
        <div className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{workout.name}</span>
                  <span className="text-sm text-muted-foreground">{workout.date}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2 flex items-center space-x-4">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {workout.duration} min
                  </span>
                  <span>{workout.exercises} exercises</span>
                  <span>{workout.calories} calories</span>
                </div>
                <div className="flex space-x-2">
                  {workout.badges.map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}

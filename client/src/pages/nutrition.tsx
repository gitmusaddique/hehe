import { useState } from "react";
import { Search, Utensils, Plus, Sun, Moon, Coffee, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/progress-ring";
import { FoodSearchModal } from "@/components/food-search-modal";
import { CreateFoodModal } from "@/components/create-food-modal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useApp } from "@/context/app-context";

export function NutritionPage() {
  const { user } = useApp();
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [showCreateFood, setShowCreateFood] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const queryClient = useQueryClient();

  // Get today's date for filtering
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch nutrition logs for today
  const { data: nutritionLogs = [], isLoading } = useQuery({
    queryKey: ["/api/nutrition-logs/user", user?.id, today],
    enabled: !!user?.id,
  });

  // Delete nutrition log mutation
  const deleteFoodMutation = useMutation({
    mutationFn: async (logId: string) => {
      return apiRequest(`/api/nutrition-logs/${logId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition-logs/user", user?.id] });
    },
  });

  // Group logs by meal type
  const mealGroups = (nutritionLogs as any[]).reduce((acc: any, log: any) => {
    if (!acc[log.mealType]) {
      acc[log.mealType] = [];
    }
    acc[log.mealType].push(log);
    return acc;
  }, {});

  // Calculate totals
  const totals = (nutritionLogs as any[]).reduce(
    (acc: any, log: any) => {
      acc.calories += log.calories || 0;
      acc.protein += log.protein || 0;
      acc.carbs += log.carbs || 0;
      acc.fat += log.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // User's targets (could come from user profile)
  const targets = {
    calories: user?.weight ? Math.round(user.weight * 25) : 2200, // rough estimate
    protein: user?.weight ? Math.round(user.weight * 1.6) : 150,
    carbs: 300,
    fat: 87,
  };

  const macros = [
    { 
      name: "Protein", 
      current: Math.round(totals.protein), 
      target: targets.protein, 
      percentage: Math.round((totals.protein / targets.protein) * 100), 
      color: "text-chart-1" 
    },
    { 
      name: "Carbs", 
      current: Math.round(totals.carbs), 
      target: targets.carbs, 
      percentage: Math.round((totals.carbs / targets.carbs) * 100), 
      color: "text-chart-3" 
    },
    { 
      name: "Fat", 
      current: Math.round(totals.fat), 
      target: targets.fat, 
      percentage: Math.round((totals.fat / targets.fat) * 100), 
      color: "text-chart-5" 
    },
  ];

  const mealTypes = [
    { type: "breakfast", icon: Sun, color: "text-chart-3", label: "Breakfast" },
    { type: "lunch", icon: Sun, color: "text-chart-2", label: "Lunch" },
    { type: "dinner", icon: Moon, color: "text-chart-1", label: "Dinner" },
    { type: "snack", icon: Coffee, color: "text-chart-4", label: "Snacks" },
  ];

  const handleAddFood = (mealType: string) => {
    setSelectedMealType(mealType);
    setShowFoodSearch(true);
  };

  const handleDeleteFood = (logId: string) => {
    deleteFoodMutation.mutate(logId);
  };

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Please log in to track nutrition</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto hide-scrollbar p-4 space-y-6">
      
      {/* Daily Nutrition Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today's Nutrition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          
          {/* Calorie Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Calories</span>
              <span className="text-sm text-muted-foreground">
                <span data-testid="text-calories-consumed">{Math.round(totals.calories)}</span> / 
                <span data-testid="text-calorie-goal"> {targets.calories}</span>
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-1">
              <div 
                className="bg-gradient-to-r from-chart-2 to-primary h-3 rounded-full" 
                style={{ width: `${Math.min((totals.calories / targets.calories) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-sm text-muted-foreground">
              {totals.calories >= targets.calories 
                ? `${Math.round(totals.calories - targets.calories)} calories over` 
                : `${Math.round(targets.calories - totals.calories)} calories remaining`
              }
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="grid grid-cols-3 gap-4">
            {macros.map((macro) => (
              <div key={macro.name} className="text-center">
                <ProgressRing 
                  percentage={macro.percentage} 
                  size={64} 
                  color={macro.color}
                >
                  <span className="text-xs font-bold">{macro.percentage}%</span>
                </ProgressRing>
                <div className="text-xs text-muted-foreground mt-2">{macro.name}</div>
                <div className="text-sm font-medium">{macro.current}g</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Options */}
      <div>
        <h3 className="font-semibold mb-3">Quick Add</h3>
        <div className="grid grid-cols-2 gap-3">
          
          <Button 
            variant="outline" 
            className="p-4 h-auto text-left justify-start haptic-feedback"
            onClick={() => setShowFoodSearch(true)}
            data-testid="quick-add-search"
          >
            <div className="flex flex-col items-start space-y-2">
              <Search className="h-5 w-5 text-chart-2" />
              <div className="font-medium">Search Food</div>
              <div className="text-sm text-muted-foreground">Database search</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="p-4 h-auto text-left justify-start haptic-feedback"
            onClick={() => setShowCreateFood(true)}
            data-testid="quick-add-recipe"
          >
            <div className="flex flex-col items-start space-y-2">
              <Utensils className="h-5 w-5 text-chart-3" />
              <div className="font-medium">Create Food</div>
              <div className="text-sm text-muted-foreground">Custom nutrition</div>
            </div>
          </Button>
          
        </div>
      </div>

      {/* Today's Meals */}
      <div>
        <h3 className="font-semibold mb-3">Today's Meals</h3>
        <div className="space-y-3">
          {mealTypes.map((mealType) => {
            const Icon = mealType.icon;
            const mealLogs = mealGroups[mealType.type] || [];
            const mealCalories = mealLogs.reduce((sum: number, log: any) => sum + (log.calories || 0), 0);
            
            return (
              <Card key={mealType.type}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${mealType.color}`} />
                      <span className="font-medium">{mealType.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{Math.round(mealCalories)} cal</span>
                  </div>
                  
                  {mealLogs.length > 0 ? (
                    <div className="space-y-2">
                      {mealLogs.map((log: any) => (
                        <div key={log.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                              <Utensils className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">Food Entry</div>
                              <div className="text-xs text-muted-foreground">{Math.round(log.quantity)}g</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{Math.round(log.calories)} cal</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteFood(log.id)}
                              data-testid={`delete-food-${log.id}`}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <Utensils className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <div className="text-sm">No meals logged yet</div>
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-3 text-primary haptic-feedback"
                    onClick={() => handleAddFood(mealType.type)}
                    data-testid={`add-food-${mealType.type}`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <FoodSearchModal
        open={showFoodSearch}
        onOpenChange={setShowFoodSearch}
        mealType={selectedMealType}
        userId={user.id}
      />
      
      <CreateFoodModal
        open={showCreateFood}
        onOpenChange={setShowCreateFood}
      />

    </div>
  );
}

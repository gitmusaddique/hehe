import { useState } from "react";
import { Search, Plus, Camera, Clock, Utensils, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Food } from "@shared/schema";

interface FoodSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealType: string;
  userId: string;
}

export function FoodSearchModal({ open, onOpenChange, mealType, userId }: FoodSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState("100");
  const queryClient = useQueryClient();

  const { data: foods = [], isLoading } = useQuery({
    queryKey: ["/api/foods", { search: searchQuery }],
    queryFn: async () => {
      return apiRequest(`/api/foods?search=${encodeURIComponent(searchQuery)}`);
    },
    enabled: searchQuery.length > 2,
  });

  const { data: recentFoods = [] } = useQuery({
    queryKey: ["/api/nutrition-logs/user", userId],
    select: (logs: any[]) => {
      // Get unique foods from recent logs
      const foodMap = new Map();
      logs.forEach(log => {
        if (!foodMap.has(log.foodId)) {
          foodMap.set(log.foodId, log);
        }
      });
      return Array.from(foodMap.values()).slice(0, 5);
    }
  });

  const addFoodMutation = useMutation({
    mutationFn: async (data: any) => {
      const quantityGrams = parseFloat(quantity);
      const nutritionData = {
        userId,
        foodId: selectedFood!.id,
        mealType,
        quantity: quantityGrams,
        calories: (selectedFood!.caloriesPer100g * quantityGrams) / 100,
        protein: (selectedFood!.proteinPer100g * quantityGrams) / 100,
        carbs: (selectedFood!.carbsPer100g * quantityGrams) / 100,
        fat: (selectedFood!.fatPer100g * quantityGrams) / 100,
      };
      
      return apiRequest("/api/nutrition-logs", {
        method: "POST",
        body: JSON.stringify(nutritionData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/nutrition-logs/user", userId] });
      onOpenChange(false);
      setSelectedFood(null);
      setQuantity("100");
      setSearchQuery("");
    },
  });

  const handleAddFood = () => {
    if (selectedFood && quantity) {
      addFoodMutation.mutate({});
    }
  };

  if (selectedFood) {
    const quantityGrams = parseFloat(quantity) || 0;
    const calories = Math.round((selectedFood.caloriesPer100g * quantityGrams) / 100);
    const protein = Math.round((selectedFood.proteinPer100g * quantityGrams) / 100);
    const carbs = Math.round((selectedFood.carbsPer100g * quantityGrams) / 100);
    const fat = Math.round((selectedFood.fatPer100g * quantityGrams) / 100);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md" data-testid="food-details-modal">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Add {selectedFood.name}</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setSelectedFood(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Quantity (grams)</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                data-testid="input-food-quantity"
              />
            </div>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Nutrition per {quantity}g</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calories: <span className="font-medium">{calories}</span></div>
                  <div>Protein: <span className="font-medium">{protein}g</span></div>
                  <div>Carbs: <span className="font-medium">{carbs}g</span></div>
                  <div>Fat: <span className="font-medium">{fat}g</span></div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleAddFood} 
              className="w-full" 
              disabled={addFoodMutation.isPending}
              data-testid="button-add-food"
            >
              {addFoodMutation.isPending ? "Adding..." : `Add to ${mealType}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto" data-testid="food-search-modal">
        <DialogHeader>
          <DialogTitle>Add Food to {mealType}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-food-search"
            />
          </div>

          {/* Quick Options */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="h-auto p-3" data-testid="button-scan-barcode">
              <div className="flex flex-col items-center space-y-1">
                <Camera className="h-4 w-4" />
                <span className="text-xs">Scan Barcode</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-3" data-testid="button-create-recipe">
              <div className="flex flex-col items-center space-y-1">
                <Utensils className="h-4 w-4" />
                <span className="text-xs">Create Recipe</span>
              </div>
            </Button>
          </div>

          {/* Show some popular foods when no search */}
          {!searchQuery && (
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Popular Foods
              </h3>
              <div className="space-y-2">
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setSearchQuery("chicken")}>
                  <CardContent className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">Search "chicken"</div>
                      <div className="text-sm text-muted-foreground">Popular protein</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setSearchQuery("rice")}>
                  <CardContent className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">Search "rice"</div>
                      <div className="text-sm text-muted-foreground">Popular carb</div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setSearchQuery("banana")}>
                  <CardContent className="p-3">
                    <div className="flex justify-between">
                      <div className="font-medium">Search "banana"</div>
                      <div className="text-sm text-muted-foreground">Popular fruit</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery.length > 2 && (
            <div>
              <h3 className="font-medium mb-2">Search Results</h3>
              {isLoading ? (
                <div className="text-center py-4 text-muted-foreground">Searching...</div>
              ) : foods.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No foods found. 
                  <Button variant="link" className="p-1" data-testid="button-create-custom-food">
                    Create custom food
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {foods.map((food: Food) => (
                    <Card 
                      key={food.id} 
                      className="cursor-pointer hover:bg-muted/50" 
                      onClick={() => setSelectedFood(food)}
                      data-testid={`food-item-${food.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{food.name}</div>
                            {food.brand && (
                              <div className="text-sm text-muted-foreground">{food.brand}</div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(food.caloriesPer100g)} cal/100g
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
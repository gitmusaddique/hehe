import { useState } from "react";
import { Search, Plus, Edit, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useApp } from "@/context/app-context";
import { type Food, type InsertFood } from "@shared/schema";

export function ManageFoodsPage() {
  const { setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [formData, setFormData] = useState<InsertFood>({
    name: "",
    brand: "",
    caloriesPer100g: 0,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0,
    fiberPer100g: 0,
    sugarPer100g: 0,
  });
  const queryClient = useQueryClient();

  const { data: allFoods = [], isLoading } = useQuery({
    queryKey: ["/api/foods"],
  });

  const filteredFoods = allFoods.filter((food: Food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.brand && food.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const updateFoodMutation = useMutation({
    mutationFn: async (data: { id: string; food: InsertFood }) => {
      return apiRequest(`/api/foods/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data.food),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/foods"] });
      setShowEditDialog(false);
      setEditingFood(null);
    },
  });

  const deleteFoodMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/foods/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/foods"] });
    },
  });

  const handleEdit = (food: Food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      brand: food.brand || "",
      caloriesPer100g: food.caloriesPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
      fiberPer100g: food.fiberPer100g || 0,
      sugarPer100g: food.sugarPer100g || 0,
    });
    setShowEditDialog(true);
  };

  const handleSave = () => {
    if (editingFood) {
      updateFoodMutation.mutate({
        id: editingFood.id,
        food: formData,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this food item?")) {
      deleteFoodMutation.mutate(id);
    }
  };

  const updateFormData = (field: keyof InsertFood, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView("nutrition")}
          data-testid="button-back"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Manage Foods</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-foods"
        />
      </div>

      {/* Foods List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading foods...</div>
        ) : filteredFoods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No foods found matching your search" : "No foods in database"}
          </div>
        ) : (
          filteredFoods.map((food: Food) => (
            <Card key={food.id} data-testid={`food-card-${food.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{food.name}</div>
                    {food.brand && (
                      <div className="text-sm text-muted-foreground">{food.brand}</div>
                    )}
                    <div className="text-sm text-muted-foreground mt-1">
                      {Math.round(food.caloriesPer100g)} cal/100g • 
                      P: {Math.round(food.proteinPer100g)}g • 
                      C: {Math.round(food.carbsPer100g)}g • 
                      F: {Math.round(food.fatPer100g)}g
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(food)}
                      data-testid={`button-edit-${food.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(food.id)}
                      data-testid={`button-delete-${food.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md" data-testid="edit-food-dialog">
          <DialogHeader>
            <DialogTitle>Edit Food</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                data-testid="input-edit-name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-brand">Brand (optional)</Label>
              <Input
                id="edit-brand"
                value={formData.brand}
                onChange={(e) => updateFormData("brand", e.target.value)}
                data-testid="input-edit-brand"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-calories">Calories (per 100g)</Label>
                <Input
                  id="edit-calories"
                  type="number"
                  value={formData.caloriesPer100g}
                  onChange={(e) => updateFormData("caloriesPer100g", parseFloat(e.target.value) || 0)}
                  data-testid="input-edit-calories"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-protein">Protein (g)</Label>
                <Input
                  id="edit-protein"
                  type="number"
                  value={formData.proteinPer100g}
                  onChange={(e) => updateFormData("proteinPer100g", parseFloat(e.target.value) || 0)}
                  data-testid="input-edit-protein"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-carbs">Carbs (g)</Label>
                <Input
                  id="edit-carbs"
                  type="number"
                  value={formData.carbsPer100g}
                  onChange={(e) => updateFormData("carbsPer100g", parseFloat(e.target.value) || 0)}
                  data-testid="input-edit-carbs"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-fat">Fat (g)</Label>
                <Input
                  id="edit-fat"
                  type="number"
                  value={formData.fatPer100g}
                  onChange={(e) => updateFormData("fatPer100g", parseFloat(e.target.value) || 0)}
                  data-testid="input-edit-fat"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-fiber">Fiber (g)</Label>
                <Input
                  id="edit-fiber"
                  type="number"
                  value={formData.fiberPer100g}
                  onChange={(e) => updateFormData("fiberPer100g", parseFloat(e.target.value) || 0)}
                  data-testid="input-edit-fiber"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-sugar">Sugar (g)</Label>
                <Input
                  id="edit-sugar"
                  type="number"
                  value={formData.sugarPer100g}
                  onChange={(e) => updateFormData("sugarPer100g", parseFloat(e.target.value) || 0)}
                  data-testid="input-edit-sugar"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={updateFoodMutation.isPending}
                data-testid="button-save-food"
              >
                {updateFoodMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFoodSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

interface CreateFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const createFoodSchema = insertFoodSchema.extend({
  caloriesPer100g: z.number().min(0),
  proteinPer100g: z.number().min(0),
  carbsPer100g: z.number().min(0),
  fatPer100g: z.number().min(0),
});

export function CreateFoodModal({ open, onOpenChange }: CreateFoodModalProps) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createFoodSchema),
    defaultValues: {
      name: "",
      brand: "",
      barcode: "",
      caloriesPer100g: 0,
      proteinPer100g: 0,
      carbsPer100g: 0,
      fatPer100g: 0,
      fiberPer100g: 0,
      sugarPer100g: 0,
      servingSizes: [],
    },
  });

  const createFoodMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("/api/foods", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/foods"] });
      onOpenChange(false);
      form.reset();
    },
  });

  const onSubmit = (data: any) => {
    createFoodMutation.mutate(data);
  };

  const proteinValue = form.watch("proteinPer100g") || 0;
  const carbsValue = form.watch("carbsPer100g") || 0;
  const fatValue = form.watch("fatPer100g") || 0;
  
  const macrosTotal = proteinValue * 4 + carbsValue * 4 + fatValue * 9;
  
  // Automatically update calories when macros change
  useEffect(() => {
    if (macrosTotal > 0) {
      form.setValue("caloriesPer100g", Math.round(macrosTotal));
    }
  }, [macrosTotal, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto" data-testid="create-food-modal">
        <DialogHeader>
          <DialogTitle>Create Custom Food</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Info */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Food Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Greek Yogurt" {...field} data-testid="input-food-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Chobani" {...field} data-testid="input-food-brand" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barcode (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123456789012" {...field} data-testid="input-food-barcode" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nutrition per 100g */}
            <div>
              <h3 className="font-medium mb-2">Nutrition per 100g</h3>
              
              {/* Auto-calculated calories display */}
              {macrosTotal > 0 && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium">Calories (auto-calculated): {Math.round(macrosTotal)}</div>
                  <div className="text-xs text-muted-foreground">Based on: Protein × 4 + Carbs × 4 + Fat × 9</div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">

                <FormField
                  control={form.control}
                  name="proteinPer100g"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-protein"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carbsPer100g"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbs (g)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-carbs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fatPer100g"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-fat"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fiberPer100g"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fiber (g)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-fiber"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sugarPer100g"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sugar (g)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-sugar"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>


            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createFoodMutation.isPending}
                className="flex-1"
                data-testid="button-create-food"
              >
                {createFoodMutation.isPending ? "Creating..." : "Create Food"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
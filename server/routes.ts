import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertWorkoutSchema, insertNutritionLogSchema, 
  insertBodyMetricSchema, insertFoodSchema, insertMLPredictionSchema
} from "@shared/schema";
// Import ML functions from shared location
const predictCalorieBurn = (input: any) => {
  const MET_VALUES: Record<string, number> = {
    'running': 11.5, 'walking': 3.8, 'cycling': 8.0, 'swimming': 10.0,
    'strength_training': 6.0, 'yoga': 3.0, 'hiit': 12.0, 'default': 6.0
  };
  
  const { exerciseType, duration, weight, age, gender } = input;
  const met = MET_VALUES[exerciseType.toLowerCase()] || MET_VALUES.default;
  let calories = met * weight * (duration / 60);
  
  const ageAdjustment = 1 - ((age - 25) * 0.002);
  calories *= Math.max(0.8, ageAdjustment);
  const genderAdjustment = gender === 'male' ? 1.1 : 1.0;
  calories *= genderAdjustment;
  
  return Math.round(calories);
};

const predictWeightLoss = (input: any) => {
  const { currentWeight, targetWeight, weeklyCalorieDeficit, activityLevel } = input;
  const weightToLose = currentWeight - targetWeight;
  const totalCaloriesNeeded = weightToLose * 3500;
  let weeksNeeded = totalCaloriesNeeded / weeklyCalorieDeficit;
  
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2, 'lightly_active': 1.0, 'moderately_active': 0.9, 'very_active': 0.8
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.0;
  weeksNeeded *= multiplier;
  const adaptationFactor = 1 + (weightToLose * 0.02);
  weeksNeeded *= adaptationFactor;
  
  return Math.round(weeksNeeded);
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const { category } = req.query;
      let exercises;
      
      if (category) {
        exercises = await storage.getExercisesByCategory(category as string);
      } else {
        exercises = await storage.getAllExercises();
      }
      
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exercise = await storage.getExercise(req.params.id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Workout routes
  app.get("/api/workouts/user/:userId", async (req, res) => {
    try {
      const workouts = await storage.getUserWorkouts(req.params.userId);
      res.json(workouts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.json(workout);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/workouts/:id", async (req, res) => {
    try {
      const updates = req.body;
      const workout = await storage.updateWorkout(req.params.id, updates);
      res.json(workout);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      await storage.deleteWorkout(req.params.id);
      res.json({ message: "Workout deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Workout template routes
  app.get("/api/workout-templates", async (req, res) => {
    try {
      const { category } = req.query;
      let templates;
      
      if (category) {
        templates = await storage.getWorkoutTemplatesByCategory(category as string);
      } else {
        templates = await storage.getAllWorkoutTemplates();
      }
      
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Food routes
  app.get("/api/foods", async (req, res) => {
    try {
      const { search, barcode } = req.query;
      let foods;
      
      if (barcode) {
        const food = await storage.getFoodByBarcode(barcode as string);
        foods = food ? [food] : [];
      } else if (search) {
        foods = await storage.searchFoods(search as string);
      } else {
        foods = await storage.getAllFoods();
      }
      
      res.json(foods);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/foods", async (req, res) => {
    try {
      const foodData = insertFoodSchema.parse(req.body);
      const food = await storage.createFood(foodData);
      res.json(food);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Nutrition log routes
  app.get("/api/nutrition-logs/user/:userId", async (req, res) => {
    try {
      const { date } = req.query;
      const logs = await storage.getUserNutritionLogs(req.params.userId, date as string);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/nutrition-logs", async (req, res) => {
    try {
      const logData = insertNutritionLogSchema.parse(req.body);
      const log = await storage.createNutritionLog(logData);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/nutrition-logs/:id", async (req, res) => {
    try {
      await storage.deleteNutritionLog(req.params.id);
      res.json({ message: "Nutrition log deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Body metrics routes
  app.get("/api/body-metrics/user/:userId", async (req, res) => {
    try {
      const metrics = await storage.getUserBodyMetrics(req.params.userId);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/body-metrics/user/:userId/latest", async (req, res) => {
    try {
      const metric = await storage.getLatestBodyMetric(req.params.userId);
      res.json(metric);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/body-metrics", async (req, res) => {
    try {
      const metricData = insertBodyMetricSchema.parse(req.body);
      const metric = await storage.createBodyMetric(metricData);
      res.json(metric);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Achievement routes
  app.get("/api/achievements/user/:userId", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.userId);
      res.json(achievements);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ML prediction routes
  app.post("/api/predictions/calorie-burn", async (req, res) => {
    try {
      const { userId, exerciseType, duration, weight, age, gender } = req.body;
      
      const prediction = predictCalorieBurn({
        exerciseType,
        duration,
        weight,
        age,
        gender
      });
      
      const mlPrediction = await storage.createMLPrediction({
        userId,
        predictionType: "calorie_burn",
        inputData: { exerciseType, duration, weight, age, gender },
        prediction,
        confidence: 0.85
      });
      
      res.json(mlPrediction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/predictions/weight-loss", async (req, res) => {
    try {
      const { userId, currentWeight, targetWeight, weeklyCalorieDeficit, activityLevel } = req.body;
      
      const prediction = predictWeightLoss({
        currentWeight,
        targetWeight,
        weeklyCalorieDeficit,
        activityLevel
      });
      
      const mlPrediction = await storage.createMLPrediction({
        userId,
        predictionType: "weight_loss",
        inputData: { currentWeight, targetWeight, weeklyCalorieDeficit, activityLevel },
        prediction,
        confidence: 0.75
      });
      
      res.json(mlPrediction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/predictions/user/:userId", async (req, res) => {
    try {
      const { type } = req.query;
      const predictions = await storage.getUserMLPredictions(req.params.userId, type as string);
      res.json(predictions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

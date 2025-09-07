import { 
  type User, type InsertUser, type Exercise, type InsertExercise,
  type Workout, type InsertWorkout, type WorkoutTemplate, type InsertWorkoutTemplate,
  type Food, type InsertFood, type NutritionLog, type InsertNutritionLog,
  type BodyMetric, type InsertBodyMetric, type Achievement, type InsertAchievement,
  type MLPrediction, type InsertMLPrediction
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Exercise methods
  getAllExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  // Workout methods
  getUserWorkouts(userId: string): Promise<Workout[]>;
  getWorkout(id: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout>;
  deleteWorkout(id: string): Promise<void>;

  // Workout template methods
  getAllWorkoutTemplates(): Promise<WorkoutTemplate[]>;
  getWorkoutTemplatesByCategory(category: string): Promise<WorkoutTemplate[]>;
  createWorkoutTemplate(template: InsertWorkoutTemplate): Promise<WorkoutTemplate>;

  // Food methods
  getAllFoods(): Promise<Food[]>;
  searchFoods(query: string): Promise<Food[]>;
  getFoodByBarcode(barcode: string): Promise<Food | undefined>;
  createFood(food: InsertFood): Promise<Food>;

  // Nutrition log methods
  getUserNutritionLogs(userId: string, date?: string): Promise<NutritionLog[]>;
  createNutritionLog(log: InsertNutritionLog): Promise<NutritionLog>;
  deleteNutritionLog(id: string): Promise<void>;

  // Body metrics methods
  getUserBodyMetrics(userId: string): Promise<BodyMetric[]>;
  getLatestBodyMetric(userId: string): Promise<BodyMetric | undefined>;
  createBodyMetric(metric: InsertBodyMetric): Promise<BodyMetric>;

  // Achievement methods
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // ML prediction methods
  createMLPrediction(prediction: InsertMLPrediction): Promise<MLPrediction>;
  getUserMLPredictions(userId: string, type?: string): Promise<MLPrediction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private exercises: Map<string, Exercise> = new Map();
  private workouts: Map<string, Workout> = new Map();
  private workoutTemplates: Map<string, WorkoutTemplate> = new Map();
  private foods: Map<string, Food> = new Map();
  private nutritionLogs: Map<string, NutritionLog> = new Map();
  private bodyMetrics: Map<string, BodyMetric> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private mlPredictions: Map<string, MLPrediction> = new Map();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample exercises
    const sampleExercises: InsertExercise[] = [
      {
        name: "Push-ups",
        category: "strength",
        muscleGroups: ["chest", "triceps", "shoulders"],
        equipment: "bodyweight",
        difficulty: "beginner",
        instructions: "Start in plank position, lower body until chest nearly touches floor, push back up",
      },
      {
        name: "Bench Press",
        category: "strength", 
        muscleGroups: ["chest", "triceps", "shoulders"],
        equipment: "barbell",
        difficulty: "intermediate",
        instructions: "Lie on bench, lower bar to chest, press back up",
      },
      {
        name: "Pull-ups",
        category: "strength",
        muscleGroups: ["back", "biceps"],
        equipment: "pull-up bar",
        difficulty: "intermediate",
        instructions: "Hang from bar, pull body up until chin over bar",
      },
      {
        name: "Running",
        category: "cardio",
        muscleGroups: ["legs", "core"],
        equipment: "none",
        difficulty: "beginner",
        instructions: "Maintain steady pace, land on forefoot",
      },
    ];

    sampleExercises.forEach(exercise => {
      const id = randomUUID();
      this.exercises.set(id, { ...exercise, id });
    });

    // Initialize workout templates
    const sampleTemplates: InsertWorkoutTemplate[] = [
      {
        name: "Push Day - Upper Body",
        description: "Focus on pushing movements for chest, shoulders, and triceps",
        category: "strength",
        difficulty: "intermediate",
        estimatedDuration: 45,
        exercises: [
          { exerciseId: Array.from(this.exercises.keys())[1], sets: 4, reps: 8, restTime: 90 },
          { exerciseId: Array.from(this.exercises.keys())[0], sets: 3, reps: 12, restTime: 60 },
        ],
        isPublic: true,
      },
      {
        name: "HIIT Cardio Blast",
        description: "High-intensity interval training for maximum calorie burn",
        category: "cardio",
        difficulty: "intermediate",
        estimatedDuration: 25,
        exercises: [
          { exerciseId: Array.from(this.exercises.keys())[3], sets: 6, reps: 30, restTime: 30 },
        ],
        isPublic: true,
      },
    ];

    sampleTemplates.forEach(template => {
      const id = randomUUID();
      this.workoutTemplates.set(id, { ...template, id });
    });

    // Initialize sample foods
    const sampleFoods: InsertFood[] = [
      {
        name: "Chicken Breast",
        brand: "Generic",
        caloriesPer100g: 165,
        proteinPer100g: 31,
        carbsPer100g: 0,
        fatPer100g: 3.6,
        fiberPer100g: 0,
        servingSizes: [
          { name: "1 breast (4 oz)", grams: 113 },
          { name: "1 cup diced", grams: 140 }
        ],
      },
      {
        name: "Oats",
        brand: "Quaker",
        caloriesPer100g: 389,
        proteinPer100g: 16.9,
        carbsPer100g: 66.3,
        fatPer100g: 6.9,
        fiberPer100g: 10.6,
        servingSizes: [
          { name: "1/2 cup dry", grams: 40 },
          { name: "1 cup cooked", grams: 234 }
        ],
      },
    ];

    sampleFoods.forEach(food => {
      const id = randomUUID();
      this.foods.set(id, { ...food, id });
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      onboardingComplete: false,
      streakDays: 0,
      totalWorkouts: 0,
      totalCaloriesBurned: 0,
      totalWorkoutHours: 0,
      achievementsUnlocked: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Exercise methods
  async getAllExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(ex => ex.category === category);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = randomUUID();
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }

  // Workout methods
  async getUserWorkouts(userId: string): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(w => w.userId === userId);
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = randomUUID();
    const workout: Workout = { 
      ...insertWorkout, 
      id, 
      createdAt: new Date(),
      completed: false 
    };
    this.workouts.set(id, workout);
    return workout;
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout> {
    const workout = this.workouts.get(id);
    if (!workout) throw new Error('Workout not found');
    
    const updatedWorkout = { ...workout, ...updates };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async deleteWorkout(id: string): Promise<void> {
    this.workouts.delete(id);
  }

  // Workout template methods
  async getAllWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    return Array.from(this.workoutTemplates.values()).filter(t => t.isPublic);
  }

  async getWorkoutTemplatesByCategory(category: string): Promise<WorkoutTemplate[]> {
    return Array.from(this.workoutTemplates.values()).filter(t => t.category === category && t.isPublic);
  }

  async createWorkoutTemplate(insertTemplate: InsertWorkoutTemplate): Promise<WorkoutTemplate> {
    const id = randomUUID();
    const template: WorkoutTemplate = { ...insertTemplate, id };
    this.workoutTemplates.set(id, template);
    return template;
  }

  // Food methods
  async getAllFoods(): Promise<Food[]> {
    return Array.from(this.foods.values());
  }

  async searchFoods(query: string): Promise<Food[]> {
    return Array.from(this.foods.values()).filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.brand?.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getFoodByBarcode(barcode: string): Promise<Food | undefined> {
    return Array.from(this.foods.values()).find(food => food.barcode === barcode);
  }

  async createFood(insertFood: InsertFood): Promise<Food> {
    const id = randomUUID();
    const food: Food = { ...insertFood, id };
    this.foods.set(id, food);
    return food;
  }

  // Nutrition log methods
  async getUserNutritionLogs(userId: string, date?: string): Promise<NutritionLog[]> {
    const logs = Array.from(this.nutritionLogs.values()).filter(log => log.userId === userId);
    
    if (date) {
      const targetDate = new Date(date);
      return logs.filter(log => {
        const logDate = new Date(log.loggedAt!);
        return logDate.toDateString() === targetDate.toDateString();
      });
    }
    
    return logs;
  }

  async createNutritionLog(insertLog: InsertNutritionLog): Promise<NutritionLog> {
    const id = randomUUID();
    const log: NutritionLog = { 
      ...insertLog, 
      id, 
      loggedAt: new Date() 
    };
    this.nutritionLogs.set(id, log);
    return log;
  }

  async deleteNutritionLog(id: string): Promise<void> {
    this.nutritionLogs.delete(id);
  }

  // Body metrics methods
  async getUserBodyMetrics(userId: string): Promise<BodyMetric[]> {
    return Array.from(this.bodyMetrics.values())
      .filter(metric => metric.userId === userId)
      .sort((a, b) => new Date(b.recordedAt!).getTime() - new Date(a.recordedAt!).getTime());
  }

  async getLatestBodyMetric(userId: string): Promise<BodyMetric | undefined> {
    const metrics = await this.getUserBodyMetrics(userId);
    return metrics[0];
  }

  async createBodyMetric(insertMetric: InsertBodyMetric): Promise<BodyMetric> {
    const id = randomUUID();
    const metric: BodyMetric = { 
      ...insertMetric, 
      id, 
      recordedAt: new Date() 
    };
    this.bodyMetrics.set(id, metric);
    return metric;
  }

  // Achievement methods
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime());
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = { 
      ...insertAchievement, 
      id, 
      unlockedAt: new Date() 
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // ML prediction methods
  async createMLPrediction(insertPrediction: InsertMLPrediction): Promise<MLPrediction> {
    const id = randomUUID();
    const prediction: MLPrediction = { 
      ...insertPrediction, 
      id, 
      createdAt: new Date() 
    };
    this.mlPredictions.set(id, prediction);
    return prediction;
  }

  async getUserMLPredictions(userId: string, type?: string): Promise<MLPrediction[]> {
    const predictions = Array.from(this.mlPredictions.values()).filter(p => p.userId === userId);
    
    if (type) {
      return predictions.filter(p => p.predictionType === type);
    }
    
    return predictions;
  }
}

export const storage = new MemStorage();

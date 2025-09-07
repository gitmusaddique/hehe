import { 
  type User, type InsertUser, type Exercise, type InsertExercise,
  type Workout, type InsertWorkout, type WorkoutTemplate, type InsertWorkoutTemplate,
  type Food, type InsertFood, type NutritionLog, type InsertNutritionLog,
  type BodyMetric, type InsertBodyMetric, type Achievement, type InsertAchievement,
  type MLPrediction, type InsertMLPrediction,
  users, exercises, workouts, workoutTemplates, foods, nutritionLogs, 
  bodyMetrics, achievements, mlPredictions
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, and, sql } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  // Exercise methods
  async getAllExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return await db.select().from(exercises).where(eq(exercises.category, category));
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise || undefined;
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db.insert(exercises).values(insertExercise).returning();
    return exercise;
  }

  // Workout methods
  async getUserWorkouts(userId: string): Promise<Workout[]> {
    return await db.select().from(workouts).where(eq(workouts.userId, userId)).orderBy(desc(workouts.createdAt));
  }

  async getWorkout(id: string): Promise<Workout | undefined> {
    const [workout] = await db.select().from(workouts).where(eq(workouts.id, id));
    return workout || undefined;
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const [workout] = await db.insert(workouts).values(insertWorkout).returning();
    return workout;
  }

  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout> {
    const [workout] = await db.update(workouts).set(updates).where(eq(workouts.id, id)).returning();
    return workout;
  }

  async deleteWorkout(id: string): Promise<void> {
    await db.delete(workouts).where(eq(workouts.id, id));
  }

  // Workout template methods
  async getAllWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    return await db.select().from(workoutTemplates).where(eq(workoutTemplates.isPublic, true));
  }

  async getWorkoutTemplatesByCategory(category: string): Promise<WorkoutTemplate[]> {
    return await db.select().from(workoutTemplates).where(
      and(eq(workoutTemplates.category, category), eq(workoutTemplates.isPublic, true))
    );
  }

  async createWorkoutTemplate(insertTemplate: InsertWorkoutTemplate): Promise<WorkoutTemplate> {
    const [template] = await db.insert(workoutTemplates).values(insertTemplate).returning();
    return template;
  }

  // Food methods
  async getAllFoods(): Promise<Food[]> {
    return await db.select().from(foods).limit(100);
  }

  async searchFoods(query: string): Promise<Food[]> {
    return await db.select().from(foods).where(
      like(foods.name, `%${query}%`)
    ).limit(20);
  }

  async getFoodByBarcode(barcode: string): Promise<Food | undefined> {
    const [food] = await db.select().from(foods).where(eq(foods.barcode, barcode));
    return food || undefined;
  }

  async createFood(insertFood: InsertFood): Promise<Food> {
    const [food] = await db.insert(foods).values(insertFood).returning();
    return food;
  }

  // Nutrition log methods
  async getUserNutritionLogs(userId: string, date?: string): Promise<NutritionLog[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await db.select().from(nutritionLogs).where(
        and(
          eq(nutritionLogs.userId, userId),
          sql`${nutritionLogs.loggedAt} >= ${startOfDay}`,
          sql`${nutritionLogs.loggedAt} <= ${endOfDay}`
        )
      ).orderBy(desc(nutritionLogs.loggedAt));
    }
    
    return await db.select().from(nutritionLogs).where(eq(nutritionLogs.userId, userId)).orderBy(desc(nutritionLogs.loggedAt));
  }

  async createNutritionLog(insertLog: InsertNutritionLog): Promise<NutritionLog> {
    const [log] = await db.insert(nutritionLogs).values(insertLog).returning();
    return log;
  }

  async deleteNutritionLog(id: string): Promise<void> {
    await db.delete(nutritionLogs).where(eq(nutritionLogs.id, id));
  }

  // Body metrics methods
  async getUserBodyMetrics(userId: string): Promise<BodyMetric[]> {
    return await db.select().from(bodyMetrics).where(eq(bodyMetrics.userId, userId)).orderBy(desc(bodyMetrics.recordedAt));
  }

  async getLatestBodyMetric(userId: string): Promise<BodyMetric | undefined> {
    const [metric] = await db.select().from(bodyMetrics).where(eq(bodyMetrics.userId, userId)).orderBy(desc(bodyMetrics.recordedAt)).limit(1);
    return metric || undefined;
  }

  async createBodyMetric(insertMetric: InsertBodyMetric): Promise<BodyMetric> {
    const [metric] = await db.insert(bodyMetrics).values(insertMetric).returning();
    return metric;
  }

  // Achievement methods
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.unlockedAt));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db.insert(achievements).values(insertAchievement).returning();
    return achievement;
  }

  // ML prediction methods
  async createMLPrediction(insertPrediction: InsertMLPrediction): Promise<MLPrediction> {
    const [prediction] = await db.insert(mlPredictions).values(insertPrediction).returning();
    return prediction;
  }

  async getUserMLPredictions(userId: string, type?: string): Promise<MLPrediction[]> {
    const conditions = [eq(mlPredictions.userId, userId)];
    if (type) {
      conditions.push(eq(mlPredictions.predictionType, type));
    }
    
    return await db.select().from(mlPredictions).where(and(...conditions)).orderBy(desc(mlPredictions.createdAt));
  }
}
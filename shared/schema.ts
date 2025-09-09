import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  age: integer("age"),
  height: real("height"), // in cm
  weight: real("weight"), // in kg
  activityLevel: text("activity_level"), // sedentary, lightly_active, moderately_active, very_active
  goal: text("goal"), // weight_loss, muscle_gain, maintenance, performance
  targetWeight: real("target_weight"),
  targetTimeline: text("target_timeline"),
  onboardingComplete: integer("onboarding_complete", { mode: 'boolean' }).default(false),
  streakDays: integer("streak_days").default(0),
  totalWorkouts: integer("total_workouts").default(0),
  totalCaloriesBurned: integer("total_calories_burned").default(0),
  totalWorkoutHours: integer("total_workout_hours").default(0),
  achievementsUnlocked: integer("achievements_unlocked").default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  category: text("category").notNull(), // strength, cardio, flexibility, sports
  muscleGroups: text("muscle_groups", { mode: 'json' }).$type<string[]>().notNull(),
  equipment: text("equipment"), // bodyweight, dumbbells, barbells, machines, etc.
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  instructions: text("instructions"),
  videoUrl: text("video_url"),
});

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type"), // strength, cardio, flexibility, sports
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  exercises: text("exercises", { mode: 'json' }).$type<{exerciseId: string, sets: number, reps: number, weight?: number, duration?: number}[]>().notNull(),
  notes: text("notes"),
  completed: integer("completed", { mode: 'boolean' }).default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const workoutTemplates = sqliteTable("workout_templates", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  exercises: text("exercises", { mode: 'json' }).$type<{exerciseId: string, sets: number, reps: number, restTime?: number}[]>().notNull(),
  isPublic: integer("is_public", { mode: 'boolean' }).default(true),
});

export const foods = sqliteTable("foods", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  brand: text("brand"),
  barcode: text("barcode"),
  caloriesPer100g: real("calories_per_100g").notNull(),
  proteinPer100g: real("protein_per_100g").notNull(),
  carbsPer100g: real("carbs_per_100g").notNull(),
  fatPer100g: real("fat_per_100g").notNull(),
  fiberPer100g: real("fiber_per_100g"),
  sugarPer100g: real("sugar_per_100g"),
  servingSizes: text("serving_sizes", { mode: 'json' }).$type<{name: string, grams: number}[]>(),
});

export const nutritionLogs = sqliteTable("nutrition_logs", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  foodId: text("food_id").references(() => foods.id).notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  quantity: real("quantity").notNull(), // in grams
  calories: real("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  loggedAt: integer("logged_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const bodyMetrics = sqliteTable("body_metrics", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  weight: real("weight"),
  bodyFat: real("body_fat"),
  muscleMass: real("muscle_mass"),
  measurements: text("measurements", { mode: 'json' }).$type<{chest?: number, waist?: number, arms?: number, thighs?: number}>(),
  photoUrls: text("photo_urls", { mode: 'json' }).$type<{front?: string, side?: string, back?: string}>(),
  recordedAt: integer("recorded_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // streak, pr, weight_loss, consistency, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  unlockedAt: integer("unlocked_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const mlPredictions = sqliteTable("ml_predictions", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  userId: text("user_id").references(() => users.id).notNull(),
  predictionType: text("prediction_type").notNull(), // calorie_burn, weight_prediction, etc.
  inputData: text("input_data", { mode: 'json' }).notNull(),
  prediction: real("prediction").notNull(),
  confidence: real("confidence"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertWorkoutSchema = createInsertSchema(workouts).omit({ id: true, createdAt: true });
export const insertWorkoutTemplateSchema = createInsertSchema(workoutTemplates).omit({ id: true });
export const insertFoodSchema = createInsertSchema(foods).omit({ id: true });
export const insertNutritionLogSchema = createInsertSchema(nutritionLogs).omit({ id: true, loggedAt: true });
export const insertBodyMetricSchema = createInsertSchema(bodyMetrics).omit({ id: true, recordedAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, unlockedAt: true });
export const insertMLPredictionSchema = createInsertSchema(mlPredictions).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type InsertWorkoutTemplate = z.infer<typeof insertWorkoutTemplateSchema>;
export type Food = typeof foods.$inferSelect;
export type InsertFood = z.infer<typeof insertFoodSchema>;
export type NutritionLog = typeof nutritionLogs.$inferSelect;
export type InsertNutritionLog = z.infer<typeof insertNutritionLogSchema>;
export type BodyMetric = typeof bodyMetrics.$inferSelect;
export type InsertBodyMetric = z.infer<typeof insertBodyMetricSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type MLPrediction = typeof mlPredictions.$inferSelect;
export type InsertMLPrediction = z.infer<typeof insertMLPredictionSchema>;
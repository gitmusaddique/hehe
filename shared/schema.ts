import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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
  onboardingComplete: boolean("onboarding_complete").default(false),
  streakDays: integer("streak_days").default(0),
  totalWorkouts: integer("total_workouts").default(0),
  totalCaloriesBurned: integer("total_calories_burned").default(0),
  totalWorkoutHours: integer("total_workout_hours").default(0),
  achievementsUnlocked: integer("achievements_unlocked").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // strength, cardio, flexibility, sports
  muscleGroups: json("muscle_groups").$type<string[]>().notNull(),
  equipment: text("equipment"), // bodyweight, dumbbells, barbells, machines, etc.
  difficulty: text("difficulty"), // beginner, intermediate, advanced
  instructions: text("instructions"),
  videoUrl: text("video_url"),
});

export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type"), // strength, cardio, flexibility, sports
  duration: integer("duration"), // in minutes
  caloriesBurned: integer("calories_burned"),
  exercises: json("exercises").$type<{exerciseId: string, sets: number, reps: number, weight?: number, duration?: number}[]>().notNull(),
  notes: text("notes"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workoutTemplates = pgTable("workout_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  estimatedDuration: integer("estimated_duration"), // in minutes
  exercises: json("exercises").$type<{exerciseId: string, sets: number, reps: number, restTime?: number}[]>().notNull(),
  isPublic: boolean("is_public").default(true),
});

export const foods = pgTable("foods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand"),
  barcode: text("barcode"),
  caloriesPer100g: real("calories_per_100g").notNull(),
  proteinPer100g: real("protein_per_100g").notNull(),
  carbsPer100g: real("carbs_per_100g").notNull(),
  fatPer100g: real("fat_per_100g").notNull(),
  fiberPer100g: real("fiber_per_100g"),
  sugarPer100g: real("sugar_per_100g"),
  servingSizes: json("serving_sizes").$type<{name: string, grams: number}[]>(),
});

export const nutritionLogs = pgTable("nutrition_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  foodId: varchar("food_id").references(() => foods.id).notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  quantity: real("quantity").notNull(), // in grams
  calories: real("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export const bodyMetrics = pgTable("body_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  weight: real("weight"),
  bodyFat: real("body_fat"),
  muscleMass: real("muscle_mass"),
  measurements: json("measurements").$type<{chest?: number, waist?: number, arms?: number, thighs?: number}>(),
  photoUrls: json("photo_urls").$type<{front?: string, side?: string, back?: string}>(),
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // streak, pr, weight_loss, consistency, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const mlPredictions = pgTable("ml_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  predictionType: text("prediction_type").notNull(), // calorie_burn, weight_prediction, etc.
  inputData: json("input_data").notNull(),
  prediction: real("prediction").notNull(),
  confidence: real("confidence"),
  createdAt: timestamp("created_at").defaultNow(),
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

import { db } from "./db";
import { foods, exercises, workoutTemplates } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if we already have data
    const existingFoods = await db.select().from(foods).limit(1);
    if (existingFoods.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // No pre-defined foods - only user-added foods will appear
    const sampleFoods: any[] = [];

    if (sampleFoods.length > 0) {
      await db.insert(foods).values(sampleFoods);
    }

    // Seed exercises
    const sampleExercises = [
      {
        name: "Push-ups",
        category: "strength",
        muscleGroups: ["chest", "triceps", "shoulders"],
        equipment: "bodyweight",
        difficulty: "beginner",
        instructions: "Start in plank position, lower body until chest nearly touches floor, push back up",
        videoUrl: null
      },
      {
        name: "Squats",
        category: "strength",
        muscleGroups: ["legs", "glutes"],
        equipment: "bodyweight",
        difficulty: "beginner",
        instructions: "Stand with feet hip-width apart, lower as if sitting back into a chair, return to standing",
        videoUrl: null
      },
      {
        name: "Running",
        category: "cardio",
        muscleGroups: ["legs", "core"],
        equipment: "none",
        difficulty: "beginner",
        instructions: "Maintain steady pace, land on forefoot",
        videoUrl: null
      },
      {
        name: "Bench Press",
        category: "strength",
        muscleGroups: ["chest", "triceps", "shoulders"],
        equipment: "barbell",
        difficulty: "intermediate",
        instructions: "Lie on bench, lower bar to chest, press back up",
        videoUrl: null
      }
    ];

    await db.insert(exercises).values(sampleExercises);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
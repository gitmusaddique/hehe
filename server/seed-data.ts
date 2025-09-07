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

    // Seed foods
    const sampleFoods = [
      {
        name: "Chicken Breast",
        brand: "Generic",
        caloriesPer100g: 165,
        proteinPer100g: 31,
        carbsPer100g: 0,
        fatPer100g: 3.6,
        fiberPer100g: 0,
        sugarPer100g: 0,
        servingSizes: [
          { name: "1 breast (175g)", grams: 175 },
          { name: "1 cup diced (140g)", grams: 140 }
        ]
      },
      {
        name: "Brown Rice",
        brand: "Generic",
        caloriesPer100g: 111,
        proteinPer100g: 2.6,
        carbsPer100g: 23,
        fatPer100g: 0.9,
        fiberPer100g: 1.8,
        sugarPer100g: 0.4,
        servingSizes: [
          { name: "1 cup cooked (195g)", grams: 195 },
          { name: "1/2 cup cooked (95g)", grams: 95 }
        ]
      },
      {
        name: "Broccoli",
        brand: "Generic",
        caloriesPer100g: 34,
        proteinPer100g: 2.8,
        carbsPer100g: 7,
        fatPer100g: 0.4,
        fiberPer100g: 2.6,
        sugarPer100g: 1.5,
        servingSizes: [
          { name: "1 cup (91g)", grams: 91 },
          { name: "1 medium stalk (148g)", grams: 148 }
        ]
      },
      {
        name: "Greek Yogurt",
        brand: "Chobani",
        caloriesPer100g: 59,
        proteinPer100g: 10,
        carbsPer100g: 3.6,
        fatPer100g: 0.4,
        fiberPer100g: 0,
        sugarPer100g: 3.2,
        servingSizes: [
          { name: "1 container (170g)", grams: 170 },
          { name: "1/2 cup (125g)", grams: 125 }
        ]
      },
      {
        name: "Banana",
        brand: "Generic",
        caloriesPer100g: 89,
        proteinPer100g: 1.1,
        carbsPer100g: 23,
        fatPer100g: 0.3,
        fiberPer100g: 2.6,
        sugarPer100g: 12.2,
        servingSizes: [
          { name: "1 medium (118g)", grams: 118 },
          { name: "1 large (136g)", grams: 136 }
        ]
      },
      {
        name: "Almonds",
        brand: "Generic",
        caloriesPer100g: 579,
        proteinPer100g: 21.2,
        carbsPer100g: 21.6,
        fatPer100g: 49.9,
        fiberPer100g: 12.5,
        sugarPer100g: 4.4,
        servingSizes: [
          { name: "1 oz (28g)", grams: 28 },
          { name: "24 nuts (28g)", grams: 28 }
        ]
      },
      {
        name: "Salmon",
        brand: "Generic",
        caloriesPer100g: 208,
        proteinPer100g: 25.4,
        carbsPer100g: 0,
        fatPer100g: 12.4,
        fiberPer100g: 0,
        sugarPer100g: 0,
        servingSizes: [
          { name: "1 fillet (154g)", grams: 154 },
          { name: "3 oz (85g)", grams: 85 }
        ]
      },
      {
        name: "Oatmeal",
        brand: "Quaker",
        caloriesPer100g: 68,
        proteinPer100g: 2.4,
        carbsPer100g: 12,
        fatPer100g: 1.4,
        fiberPer100g: 1.7,
        sugarPer100g: 0.3,
        servingSizes: [
          { name: "1 cup cooked (234g)", grams: 234 },
          { name: "1/2 cup dry (40g)", grams: 40 }
        ]
      },
      {
        name: "Sweet Potato",
        brand: "Generic",
        caloriesPer100g: 86,
        proteinPer100g: 1.6,
        carbsPer100g: 20.1,
        fatPer100g: 0.1,
        fiberPer100g: 3,
        sugarPer100g: 4.2,
        servingSizes: [
          { name: "1 medium (128g)", grams: 128 },
          { name: "1 cup cubed (133g)", grams: 133 }
        ]
      },
      {
        name: "Eggs",
        brand: "Generic",
        caloriesPer100g: 155,
        proteinPer100g: 13,
        carbsPer100g: 1.1,
        fatPer100g: 11,
        fiberPer100g: 0,
        sugarPer100g: 1.1,
        servingSizes: [
          { name: "1 large egg (50g)", grams: 50 },
          { name: "2 large eggs (100g)", grams: 100 }
        ]
      }
    ];

    await db.insert(foods).values(sampleFoods);

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
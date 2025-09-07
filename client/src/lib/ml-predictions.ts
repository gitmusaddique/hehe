// Basic ML prediction functions for calorie estimation and workout optimization

interface CalorieBurnInput {
  exerciseType: string;
  duration: number; // minutes
  weight: number; // kg
  age: number;
  gender: 'male' | 'female';
}

interface WeightLossInput {
  currentWeight: number;
  targetWeight: number;
  weeklyCalorieDeficit: number;
  activityLevel: string;
}

// MET (Metabolic Equivalent of Task) values for different exercises
const MET_VALUES: Record<string, number> = {
  'running': 11.5,
  'walking': 3.8,
  'cycling': 8.0,
  'swimming': 10.0,
  'strength_training': 6.0,
  'yoga': 3.0,
  'hiit': 12.0,
  'basketball': 8.0,
  'tennis': 8.0,
  'dancing': 5.0,
  'default': 6.0
};

export function predictCalorieBurn(input: CalorieBurnInput): number {
  const { exerciseType, duration, weight, age, gender } = input;
  
  // Get MET value for exercise type
  const met = MET_VALUES[exerciseType.toLowerCase()] || MET_VALUES.default;
  
  // Basic calorie calculation: MET × weight (kg) × duration (hours)
  let calories = met * weight * (duration / 60);
  
  // Adjust for age (metabolism slows with age)
  const ageAdjustment = 1 - ((age - 25) * 0.002);
  calories *= Math.max(0.8, ageAdjustment);
  
  // Adjust for gender (males typically burn more calories)
  const genderAdjustment = gender === 'male' ? 1.1 : 1.0;
  calories *= genderAdjustment;
  
  // Add some randomness to simulate ML prediction variance
  const variance = 0.1; // 10% variance
  const randomFactor = 1 + (Math.random() - 0.5) * 2 * variance;
  calories *= randomFactor;
  
  return Math.round(calories);
}

export function predictWeightLoss(input: WeightLossInput): number {
  const { currentWeight, targetWeight, weeklyCalorieDeficit, activityLevel } = input;
  
  // Basic calculation: 1 pound = 3500 calories
  const weightToLose = currentWeight - targetWeight;
  const totalCaloriesNeeded = weightToLose * 3500; // assuming kg to calories conversion
  
  // Calculate weeks needed based on weekly deficit
  let weeksNeeded = totalCaloriesNeeded / weeklyCalorieDeficit;
  
  // Adjust based on activity level
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2,
    'lightly_active': 1.0,
    'moderately_active': 0.9,
    'very_active': 0.8
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.0;
  weeksNeeded *= multiplier;
  
  // Account for metabolic adaptation (weight loss slows over time)
  const adaptationFactor = 1 + (weightToLose * 0.02);
  weeksNeeded *= adaptationFactor;
  
  return Math.round(weeksNeeded);
}

export function generateWorkoutRecommendation(userGoal: string, experience: string): {
  exercises: string[];
  duration: number;
  frequency: number;
} {
  const recommendations: Record<string, any> = {
    'weight_loss': {
      beginner: {
        exercises: ['walking', 'bodyweight_squats', 'push_ups', 'planks'],
        duration: 30,
        frequency: 3
      },
      intermediate: {
        exercises: ['running', 'burpees', 'mountain_climbers', 'jumping_jacks'],
        duration: 45,
        frequency: 4
      },
      advanced: {
        exercises: ['hiit', 'battle_ropes', 'kettlebell_swings', 'box_jumps'],
        duration: 60,
        frequency: 5
      }
    },
    'muscle_gain': {
      beginner: {
        exercises: ['push_ups', 'squats', 'lunges', 'planks'],
        duration: 45,
        frequency: 3
      },
      intermediate: {
        exercises: ['bench_press', 'deadlifts', 'squats', 'pull_ups'],
        duration: 60,
        frequency: 4
      },
      advanced: {
        exercises: ['heavy_compound_lifts', 'progressive_overload', 'isolation_exercises'],
        duration: 75,
        frequency: 5
      }
    }
  };

  return recommendations[userGoal]?.[experience] || recommendations['weight_loss']['beginner'];
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/app-context";
import { Weight, Target, Dumbbell, TrendingUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface OnboardingData {
  age: number;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
  targetWeight?: number;
  targetTimeline: string;
}

export function OnboardingPage() {
  const { setIsOnboardingComplete, setCurrentView, setUser } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    age: 25,
    height: 175,
    weight: 70,
    activityLevel: '',
    goal: '',
    targetTimeline: ''
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: (user: any) => {
      setUser(user);
      localStorage.setItem('fitlife_onboarding_complete', 'true');
      localStorage.setItem('fitlife_user_id', user.id);
      setIsOnboardingComplete(true);
      setCurrentView('dashboard');
    },
  });

  const completeOnboarding = () => {
    const userData = {
      username: `user_${Date.now()}`, // Generate a unique username
      email: `user_${Date.now()}@fitlife.com`, // Generate a unique email
      password: 'temp_password', // In a real app, this would be properly handled
      fullName: 'FitLife User',
      age: data.age,
      height: data.height,
      weight: data.weight,
      activityLevel: data.activityLevel,
      goal: data.goal,
      targetWeight: data.targetWeight,
      targetTimeline: data.targetTimeline,
      onboardingComplete: true,
    };
    
    createUserMutation.mutate(userData);
  };

  const goals = [
    { id: 'weight_loss', label: 'Weight Loss', desc: 'Shed excess pounds', icon: Weight, color: 'text-destructive' },
    { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Build strength', icon: Dumbbell, color: 'text-primary' },
    { id: 'maintenance', label: 'Maintenance', desc: 'Stay healthy', icon: Target, color: 'text-chart-2' },
    { id: 'performance', label: 'Performance', desc: 'Athletic goals', icon: TrendingUp, color: 'text-chart-3' },
  ];

  return (
    <div className="h-full flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-xl font-bold text-primary">FitLife Pro</h1>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-2">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-muted-foreground mb-6">Help us personalize your fitness journey</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age}
                  onChange={(e) => updateData({ age: parseInt(e.target.value) })}
                  placeholder="25"
                  data-testid="input-age"
                />
              </div>
              
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={data.height}
                  onChange={(e) => updateData({ height: parseInt(e.target.value) })}
                  placeholder="175"
                  data-testid="input-height"
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={data.weight}
                  onChange={(e) => updateData({ weight: parseInt(e.target.value) })}
                  placeholder="70"
                  data-testid="input-weight"
                />
              </div>
              
              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={data.activityLevel} onValueChange={(value) => updateData({ activityLevel: value })}>
                  <SelectTrigger data-testid="select-activity">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very active (hard exercise 6-7 days/week)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goal Definition */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What's your goal?</h2>
              <p className="text-muted-foreground mb-6">Choose your primary fitness objective</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = data.goal === goal.id;
                
                return (
                  <Button
                    key={goal.id}
                    variant={isSelected ? "default" : "outline"}
                    className={`p-4 h-auto text-center haptic-feedback ${
                      isSelected ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => updateData({ goal: goal.id })}
                    data-testid={`goal-${goal.id}`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`h-6 w-6 ${isSelected ? '' : goal.color}`} />
                      <div className="font-medium">{goal.label}</div>
                      <div className="text-sm opacity-80">{goal.desc}</div>
                    </div>
                  </Button>
                );
              })}
            </div>

            <div>
              <Label htmlFor="timeline">Target Timeline</Label>
              <Select value={data.targetTimeline} onValueChange={(value) => updateData({ targetTimeline: value })}>
                <SelectTrigger data-testid="select-timeline">
                  <SelectValue placeholder="Select your timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3_months">3 months</SelectItem>
                  <SelectItem value="6_months">6 months</SelectItem>
                  <SelectItem value="1_year">1 year</SelectItem>
                  <SelectItem value="long_term">Long-term (2+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {data.goal === 'weight_loss' && (
              <div>
                <Label htmlFor="target-weight">Target Weight (kg)</Label>
                <Input
                  id="target-weight"
                  type="number"
                  value={data.targetWeight || ''}
                  onChange={(e) => updateData({ targetWeight: parseInt(e.target.value) })}
                  placeholder="65"
                  data-testid="input-target-weight"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Notifications & Preferences */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Stay motivated</h2>
              <p className="text-muted-foreground mb-6">Set up notifications to keep you on track</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-medium">Workout reminders</h3>
                  <p className="text-sm text-muted-foreground">Get notified when it's time to exercise</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-medium">Progress updates</h3>
                  <p className="text-sm text-muted-foreground">Weekly summaries of your fitness journey</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-medium">Meal logging reminders</h3>
                  <p className="text-sm text-muted-foreground">Don't forget to track your nutrition</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Equipment & Preferences */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available equipment</h2>
              <p className="text-muted-foreground mb-6">Tell us what you have access to</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {['Dumbbells', 'Barbell', 'Resistance bands', 'Pull-up bar', 'Kettlebells', 'Treadmill', 'Yoga mat', 'No equipment'].map((equipment) => (
                <Button
                  key={equipment}
                  variant="outline"
                  className="p-4 h-auto text-center"
                  onClick={() => {}}
                >
                  {equipment}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Final Setup */}
        {currentStep === 5 && (
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Almost ready!</h2>
              <p className="text-muted-foreground">
                We're setting up your personalized fitness experience...
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm">Creating your profile</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm">Generating workout recommendations</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm">Setting up nutrition tracking</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-border flex justify-between">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={currentStep === 1}
          data-testid="button-prev"
        >
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={(currentStep === 2 && (!data.goal || !data.targetTimeline)) || (currentStep > 2 && createUserMutation.isPending)}
          data-testid="button-next"
        >
          {createUserMutation.isPending ? 'Setting up...' : (currentStep === totalSteps ? 'Get Started' : 'Continue')}
        </Button>
      </div>
    </div>
  );
}

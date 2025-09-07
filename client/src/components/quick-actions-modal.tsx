import { Play, Camera, Weight, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useApp } from "@/context/app-context";
import { useHaptic } from "@/hooks/use-haptic";

interface QuickActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickActionsModal({ open, onOpenChange }: QuickActionsModalProps) {
  const { setCurrentView } = useApp();
  const { triggerHaptic } = useHaptic();

  const handleAction = (action: string, view?: string) => {
    triggerHaptic('light');
    onOpenChange(false);
    
    if (view) {
      setCurrentView(view);
    }
    
    // Handle specific actions
    switch (action) {
      case 'workout':
        // TODO: Start quick workout
        console.log('Starting quick workout');
        break;
      case 'scan':
        // TODO: Open barcode scanner
        console.log('Opening barcode scanner');
        break;
      case 'weight':
        // TODO: Open weight logging modal
        console.log('Opening weight logger');
        break;
      case 'photo':
        // TODO: Open camera for progress photo
        console.log('Opening camera for progress photo');
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Quick Actions</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            className="bg-primary text-primary-foreground p-6 rounded-xl text-center haptic-feedback h-auto flex-col"
            onClick={() => handleAction('workout', 'workouts')}
            data-testid="quick-action-workout"
          >
            <Play className="h-6 w-6 mb-2" />
            <div className="font-medium">Start Workout</div>
          </Button>
          
          <Button
            className="bg-chart-2 text-white p-6 rounded-xl text-center haptic-feedback h-auto flex-col"
            onClick={() => handleAction('scan', 'nutrition')}
            data-testid="quick-action-scan"
          >
            <Camera className="h-6 w-6 mb-2" />
            <div className="font-medium">Scan Food</div>
          </Button>
          
          <Button
            className="bg-chart-3 text-white p-6 rounded-xl text-center haptic-feedback h-auto flex-col"
            onClick={() => handleAction('weight', 'progress')}
            data-testid="quick-action-weight"
          >
            <Weight className="h-6 w-6 mb-2" />
            <div className="font-medium">Log Weight</div>
          </Button>
          
          <Button
            className="bg-chart-4 text-white p-6 rounded-xl text-center haptic-feedback h-auto flex-col"
            onClick={() => handleAction('photo', 'progress')}
            data-testid="quick-action-photo"
          >
            <Image className="h-6 w-6 mb-2" />
            <div className="font-medium">Progress Photo</div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

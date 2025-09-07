import { Plus, Play, Camera, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";
import { useHaptic } from "@/hooks/use-haptic";

interface FloatingActionButtonProps {
  onQuickActions: () => void;
}

export function FloatingActionButton({ onQuickActions }: FloatingActionButtonProps) {
  const { currentView } = useApp();
  const { triggerHaptic } = useHaptic();

  const getIcon = () => {
    switch (currentView) {
      case 'workouts':
        return <Play className="h-5 w-5" />;
      case 'nutrition':
        return <Camera className="h-5 w-5" />;
      case 'progress':
        return <Weight className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  const handleClick = () => {
    triggerHaptic('medium');
    onQuickActions();
  };

  return (
    <div className="fixed bottom-24 right-4 z-30">
      <Button
        size="icon"
        className="w-14 h-14 rounded-full shadow-lg floating-action haptic-feedback bg-primary hover:bg-primary/90 text-primary-foreground"
        onClick={handleClick}
        data-testid="fab-main"
      >
        {getIcon()}
      </Button>
    </div>
  );
}

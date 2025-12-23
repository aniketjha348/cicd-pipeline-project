import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface PrintProgressProps {
  isVisible: boolean;
  onComplete: () => void;
  onCancel: () => void;
  cardCount: number;
}

const PrintProgress = ({ isVisible, onComplete, onCancel, cardCount }: PrintProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Preparing documents...');

  useEffect(() => {
    if (!isVisible) {
      setProgress(0);
      setCurrentStep('Preparing documents...');
      return;
    }

    const steps = [
      'Preparing documents...',
      'Rendering ID cards...',
      'Optimizing for print...',
      'Sending to printer...',
      'Printing in progress...',
      'Print completed!'
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (steps.length * 10));
        
        if (newProgress >= (currentStepIndex + 1) * (100 / steps.length) && currentStepIndex < steps.length - 1) {
          currentStepIndex++;
          setCurrentStep(steps[currentStepIndex]);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Printing ID Cards</CardTitle>
          <CardDescription>
            Printing {cardCount} ID card{cardCount > 1 ? 's' : ''}...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentStep}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={progress > 80}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrintProgress;

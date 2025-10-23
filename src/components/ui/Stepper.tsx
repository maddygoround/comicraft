import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isUpcoming = currentStep < step.id;

        return (
          <div
            key={step.id}
            onClick={() => onStepClick?.(step.id)}
            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[#B7A3E3]/20 to-[#FF8F8F]/20 border-[#B7A3E3]/50 shadow-lg shadow-[#B7A3E3]/20'
                : isCompleted
                ? 'bg-[#C2E2FA]/10 border-[#C2E2FA]/30 hover:border-[#C2E2FA]/50'
                : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive
                  ? 'bg-gradient-to-r from-[#B7A3E3] to-[#FF8F8F] text-white'
                  : isCompleted
                  ? 'bg-[#C2E2FA] text-gray-800'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {isCompleted ? <Check size={20} /> : step.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  isActive ? 'text-white' : isCompleted ? 'text-[#C2E2FA]' : 'text-gray-300'
                }`}>
                  {step.name}
                </h3>
                <p className={`text-sm ${
                  isActive ? 'text-gray-200' : isCompleted ? 'text-[#C2E2FA]/80' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

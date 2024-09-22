// Stepper.tsx
import React from 'react';

interface StepperProps {
    currentStep: number;
    teamsLength: number;
    nextStep: () => void;
    prevStep: () => void;
}

const Stepper: React.FC<StepperProps> = ({currentStep, teamsLength, nextStep, prevStep}) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 bg-gray-200 rounded ${currentStep === 1 && 'opacity-50'}`}
            >
                Previous
            </button>
            {'Step ' + currentStep}
            <button
                onClick={nextStep}
                disabled={teamsLength < 2}
                className={`px-4 py-2 bg-gray-200 rounded ${teamsLength < 2 && 'opacity-50'}`}
            >
                Next
            </button>
        </div>
    );
};

export default Stepper;

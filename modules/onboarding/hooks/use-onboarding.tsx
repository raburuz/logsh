"use client"
import { useMemo, useCallback, useState } from "react"
import { useOnboardingData } from "../store";
import { useSubscription } from "@/modules/shared/store/subscription";
import { useProject } from "@/modules/shared/store/project";
import { useEvent } from "@/modules/shared/store/event";
import { StepDashboard, StepFirstEvent, StepNotifications, StepPlan, StepWelcome } from "../components/steps";

// types.ts
interface StepConfig {
  component: React.ReactElement;
  action: () => Promise<void>;
  cta: string;
}

const STEP_KEYS = {
  WELCOME: 0,
  NOTIFICATIONS: 1,
  FIRST_EVENT: 2,
  DASHBOARD: 3,
  PLAN: 4,
} as const;


export const useOnboarding = () => {

  const onboardingData = useOnboardingData();
  const subs = useSubscription();
  const project = useProject();
  const event = useEvent();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
    setError(null);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setError(null);
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    setError(null);
  }, []);

  const steps: Record<number, StepConfig> = useMemo(
    () => ({
      [STEP_KEYS.WELCOME]: {
        component: <StepWelcome />,
        cta: "Let's go",
        action: async () => {
          const workspaceName = onboardingData.getWorkspace()?.trim();

          if (!workspaceName) {
            console.warn('Workspace name is empty, skipping workspace creation');
            return;
          }

          try {
            await project.createWorkspace(workspaceName);
            nextStep();
          } catch (error) {
            console.error('Failed to create workspace:', error);
            throw new Error('Could not create workspace. Please try again.');
          }
        },
      },

      [STEP_KEYS.NOTIFICATIONS]: {
        component: <StepNotifications />,
        cta: "Continue",
        action: async () => {
          nextStep();
        },
      },

      [STEP_KEYS.FIRST_EVENT]: {
        component: <StepFirstEvent />,
        cta: "Send my first event",
        action: async () => {
          const workspaceName = onboardingData.getWorkspace().trim();

          if (!workspaceName) {
            return;
          }

          await event.sendTestEvent({
            body: { workspace: workspaceName },
          });

          nextStep();

        },
      },

      [STEP_KEYS.DASHBOARD]: {
        component: <StepDashboard />,
        cta: "Continue",
        action: async () => {
          await onboardingData.markUserAsOnboarded(),
          nextStep();
        },
      },

      [STEP_KEYS.PLAN]: {
        component: <StepPlan />,
        cta: "Start 14-day free trial",
        action: async () => {
          const price = onboardingData.getPrice();

          if (!price) {
            console.warn('No plan selected, skipping checkout');
            return;
          }
          await subs.checkout({
            isAnnual: price.isAnnual ?? false,
            planName: price.plan,
          });
        },
      },
    }),
    [onboardingData, project, event, subs, nextStep]
  );

  const handleStepAction = useCallback(async (action: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await action();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Step action failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const totalSteps = Object.keys(steps).length;
  const currentStepConfig = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const executeCurrentStep = useCallback(async () => {
    if (currentStepConfig?.action) {
      await handleStepAction(currentStepConfig.action);
    }
  }, [currentStepConfig, handleStepAction]);


  return {
    // Current state
    currentStep,
    currentStepConfig,
    isLoading,
    error,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    executeCurrentStep,
    
    // Metadata
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    
    // All steps
    steps,
    STEP_KEYS,
  }

}
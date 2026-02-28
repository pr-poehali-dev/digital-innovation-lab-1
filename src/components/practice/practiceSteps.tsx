export type { PracticeStep } from "./practiceStepTypes"
export { colorMap, borderMap } from "./practiceStepTypes"

import { stepMarketAnalysis, stepSignalFormation } from "./practiceStepsMarketSignal"
import { stepRiskManagement, stepBotAutomation } from "./practiceStepsRiskBot"
import { stepFullChecklist } from "./practiceStepsChecklist"
import type { PracticeStep } from "./practiceStepTypes"

export const steps: PracticeStep[] = [
  stepMarketAnalysis,
  stepSignalFormation,
  stepRiskManagement,
  stepBotAutomation,
  stepFullChecklist,
]

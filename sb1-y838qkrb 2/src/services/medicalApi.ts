import { TraumaAssessmentRequest, TraumaAssessmentResponse } from '../types';
import { getTraumaAssessment as getGeminiAssessment } from './googleAI';

export async function getTraumaAssessment(request: TraumaAssessmentRequest): Promise<TraumaAssessmentResponse> {
  return getGeminiAssessment(request);
}
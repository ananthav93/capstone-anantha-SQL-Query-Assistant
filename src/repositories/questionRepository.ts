import type { BusinessQuestion } from '../domain/businessQuestion';

export interface QuestionRepository {
  getAllQuestions(): readonly BusinessQuestion[];
  getQuestionById(id: string): BusinessQuestion | undefined;
}

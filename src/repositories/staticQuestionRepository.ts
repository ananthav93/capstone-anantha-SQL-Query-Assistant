import type { BusinessQuestion } from '../domain/businessQuestion';
import type { QuestionRepository } from './questionRepository';

function assertCatalogIsValid(questions: readonly BusinessQuestion[]) {
  const ids = new Set<string>();

  for (const question of questions) {
    if (!question.id.trim() || !question.label.trim() || !question.sql.trim() || !question.explanation.trim()) {
      throw new Error('Question records must have non-empty required fields.');
    }
    if (ids.has(question.id)) {
      throw new Error(`Question IDs must be unique: ${question.id}`);
    }
    ids.add(question.id);
  }
}

export class StaticQuestionRepository implements QuestionRepository {
  private readonly questions: readonly BusinessQuestion[];

  constructor(questions: readonly BusinessQuestion[]) {
    assertCatalogIsValid(questions);
    this.questions = questions.map((question) => ({ ...question }));
  }

  getAllQuestions(): readonly BusinessQuestion[] {
    return this.questions.map((question) => ({ ...question }));
  }

  getQuestionById(id: string): BusinessQuestion | undefined {
    const question = this.questions.find((candidate) => candidate.id === id);
    return question ? { ...question } : undefined;
  }
}

import { describe, expect, it } from 'vitest';
import { fixtureQuestions } from '../test/fixtures/businessQuestions';
import { StaticQuestionRepository } from './staticQuestionRepository';

describe('StaticQuestionRepository', () => {
  it('lists every fixture in order', () => {
    const repository = new StaticQuestionRepository(fixtureQuestions);

    expect(repository.getAllQuestions().map((question) => question.id)).toEqual(
      fixtureQuestions.map((question) => question.id),
    );
  });

  it('returns a complete record for every known ID', () => {
    const repository = new StaticQuestionRepository(fixtureQuestions);

    for (const question of fixtureQuestions) {
      expect(repository.getQuestionById(question.id)).toEqual(question);
    }
  });

  it('returns no record for an unknown ID', () => {
    const repository = new StaticQuestionRepository(fixtureQuestions);

    expect(repository.getQuestionById('missing-question')).toBeUndefined();
  });

  it('does not expose mutable catalog state', () => {
    const repository = new StaticQuestionRepository(fixtureQuestions);
    const firstRead = repository.getAllQuestions();
    Object.defineProperty(firstRead[0], 'label', { value: 'Changed locally', writable: true });

    expect(repository.getQuestionById(fixtureQuestions[0].id)?.label).toBe(fixtureQuestions[0].label);
  });

  it('rejects duplicate IDs and blank required fields', () => {
    expect(() => new StaticQuestionRepository([
      ...fixtureQuestions,
      { ...fixtureQuestions[0], label: 'Duplicate ID' },
    ])).toThrow(/unique/i);

    expect(() => new StaticQuestionRepository([
      { ...fixtureQuestions[0], label: '   ' },
    ])).toThrow(/non-empty/i);
  });
});

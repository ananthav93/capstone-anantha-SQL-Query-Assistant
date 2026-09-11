import { describe, expect, it } from 'vitest';
import { businessQuestions } from './businessQuestions';

const expectedIds = [
  'sales-by-region',
  'monthly-revenue',
  'top-customers',
  'awaiting-fulfillment',
  'below-reorder-point',
];

describe('business question catalog', () => {
  it('contains exactly the five questions in the documented order', () => {
    expect(businessQuestions).toHaveLength(5);
    expect(businessQuestions.map((question) => question.id)).toEqual(expectedIds);
  });

  it('provides complete static content for every record', () => {
    for (const question of businessQuestions) {
      expect(question.label.trim()).not.toBe('');
      expect(question.sql.trim()).not.toBe('');
      expect(question.explanation.trim()).not.toBe('');
      expect(question.sql).toMatch(/\b(SELECT|FROM)\b/i);
      expect(question.sql).toMatch(/\b(customers|orders|products)\b/i);
    }
  });

  it('uses the reference schema and PostgreSQL-specific month grouping where required', () => {
    expect(businessQuestions.map((question) => question.sql).join('\n')).toContain('customers');
    expect(businessQuestions.map((question) => question.sql).join('\n')).toContain('products');
    expect(businessQuestions.find((question) => question.id === 'monthly-revenue')?.sql).toContain("DATE_TRUNC('month'");
  });
});

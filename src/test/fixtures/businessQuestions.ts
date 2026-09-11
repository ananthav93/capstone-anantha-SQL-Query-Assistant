import type { BusinessQuestion } from '../../domain/businessQuestion';

export const fixtureQuestions: readonly BusinessQuestion[] = [
  {
    id: 'sales-by-region',
    label: 'What is total revenue by region?',
    sql: 'SELECT region, SUM(total_amount) AS total_revenue\nFROM orders\nGROUP BY region;',
    explanation: 'Groups order revenue by region and totals each group.',
  },
  {
    id: 'monthly-revenue',
    label: 'How has revenue changed by month?',
    sql: "SELECT DATE_TRUNC('month', order_date) AS revenue_month\nFROM orders;",
    explanation: 'Places orders into calendar months for comparison.',
  },
  {
    id: 'top-customers',
    label: 'Which customers generated the most revenue?',
    sql: 'SELECT customer_id, SUM(total_amount) AS total_revenue\nFROM orders\nGROUP BY customer_id\nLIMIT 10;',
    explanation: 'Ranks customers by their total order revenue.',
  },
  {
    id: 'awaiting-fulfillment',
    label: 'Which orders are awaiting fulfillment?',
    sql: "SELECT order_id\nFROM orders\nWHERE status = 'awaiting_fulfillment';",
    explanation: 'Finds orders whose status is awaiting fulfillment.',
  },
  {
    id: 'below-reorder-point',
    label: 'Which products are below their reorder point?',
    sql: 'SELECT product_name\nFROM products\nWHERE stock_quantity < reorder_point;',
    explanation: 'Finds products whose stock is below the reorder threshold.',
  },
];

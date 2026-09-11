import type { BusinessQuestion } from '../domain/businessQuestion';

export const businessQuestions: readonly BusinessQuestion[] = [
  {
    id: 'sales-by-region',
    label: 'What is total revenue by region?',
    sql: `SELECT c.region,
       SUM(o.total_amount) AS total_revenue
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
GROUP BY c.region
ORDER BY total_revenue DESC;`,
    explanation: 'This joins each order to its customer, adds the order totals for every region, and places the highest-revenue regions first.',
  },
  {
    id: 'monthly-revenue',
    label: 'How has revenue changed by month?',
    sql: `SELECT DATE_TRUNC('month', order_date) AS revenue_month,
       SUM(total_amount) AS total_revenue
FROM orders
GROUP BY revenue_month
ORDER BY revenue_month ASC;`,
    explanation: 'This buckets order dates into calendar months, totals the revenue in each bucket, and sorts the result from earliest to latest.',
  },
  {
    id: 'top-customers',
    label: 'Which customers generated the most revenue?',
    sql: `SELECT c.customer_id,
       c.customer_name,
       SUM(o.total_amount) AS total_revenue
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.customer_name
ORDER BY total_revenue DESC
LIMIT 10;`,
    explanation: 'This joins orders to customer names, ranks customers by summed revenue, and keeps the ten highest totals.',
  },
  {
    id: 'awaiting-fulfillment',
    label: 'Which orders are awaiting fulfillment?',
    sql: `SELECT o.order_id,
       o.order_date,
       c.customer_name,
       o.total_amount
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
WHERE o.status = 'awaiting_fulfillment'
ORDER BY o.order_date ASC;`,
    explanation: 'This joins each matching order to its customer, keeps only the awaiting-fulfillment status, and lists the oldest orders first.',
  },
  {
    id: 'below-reorder-point',
    label: 'Which products are below their reorder point?',
    sql: `SELECT product_id,
       product_name,
       stock_quantity,
       reorder_point
FROM products
WHERE stock_quantity < reorder_point
ORDER BY stock_quantity ASC;`,
    explanation: 'This compares current stock with each product’s reorder point and shows the products with the least available stock first.',
  },
];

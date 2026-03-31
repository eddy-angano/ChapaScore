import { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-01-05', type: 'IN', amount: 1500, category: 'Business', description: 'Customer Payment - Veggies' },
  { id: '2', date: '2024-01-06', type: 'OUT', amount: 800, category: 'Personal', description: 'Airtime Purchase' },
  { id: '3', date: '2024-01-10', type: 'IN', amount: 2500, category: 'Business', description: 'Wholesale Sale' },
  { id: '4', date: '2024-01-15', type: 'OUT', amount: 1200, category: 'Utility', description: 'KPLC Token' },
  { id: '5', date: '2024-01-20', type: 'OUT', amount: 500, category: 'Savings', description: 'M-Shwari Deposit' },
  { id: '6', date: '2024-02-02', type: 'IN', amount: 3000, category: 'Business', description: 'Event Catering' },
  { id: '7', date: '2024-02-10', type: 'OUT', amount: 1500, category: 'Utility', description: 'Nairobi Water' },
  { id: '8', date: '2024-02-15', type: 'IN', amount: 4500, category: 'Business', description: 'Bulk Order' },
  { id: '9', date: '2024-02-20', type: 'OUT', amount: 1000, category: 'Loan Repayment', description: 'Fuliza Repayment' },
  { id: '10', date: '2024-03-01', type: 'IN', amount: 2200, category: 'Business', description: 'Daily Sales' },
];

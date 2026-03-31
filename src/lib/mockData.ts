import { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  // January 2024
  { id: '1', date: '2024-01-05', type: 'IN', amount: 1500, category: 'Business', description: 'Customer Payment - Veggies' },
  { id: '2', date: '2024-01-06', type: 'OUT', amount: 800, category: 'Personal', description: 'Airtime Purchase' },
  { id: '3', date: '2024-01-10', type: 'IN', amount: 2500, category: 'Business', description: 'Wholesale Sale' },
  { id: '4', date: '2024-01-15', type: 'OUT', amount: 1200, category: 'Utility', description: 'KPLC Token' },
  { id: '5', date: '2024-01-20', type: 'OUT', amount: 500, category: 'Savings', description: 'M-Shwari Deposit' },
  { id: 'j1', date: '2024-01-25', type: 'IN', amount: 3500, category: 'Business', description: 'Market Day Sales' },
  { id: 'j2', date: '2024-01-28', type: 'OUT', amount: 2000, category: 'Business', description: 'Restock Inventory' },

  // February 2024
  { id: '6', date: '2024-02-02', type: 'IN', amount: 3000, category: 'Business', description: 'Event Catering' },
  { id: '7', date: '2024-02-10', type: 'OUT', amount: 1500, category: 'Utility', description: 'Nairobi Water' },
  { id: '8', date: '2024-02-15', type: 'IN', amount: 4500, category: 'Business', description: 'Bulk Order' },
  { id: '9', date: '2024-02-20', type: 'OUT', amount: 1000, category: 'Loan Repayment', description: 'Fuliza Repayment' },
  { id: 'f1', date: '2024-02-22', type: 'OUT', amount: 800, category: 'Savings', description: 'M-Shwari Deposit' },
  { id: 'f2', date: '2024-02-25', type: 'IN', amount: 2800, category: 'Business', description: 'Daily Sales' },
  { id: 'f3', date: '2024-02-28', type: 'OUT', amount: 1200, category: 'Utility', description: 'KPLC Token' },

  // March 2024
  { id: '10', date: '2024-03-01', type: 'IN', amount: 2200, category: 'Business', description: 'Daily Sales' },
  { id: 'm1', date: '2024-03-05', type: 'IN', amount: 5000, category: 'Business', description: 'Wedding Supply' },
  { id: 'm2', date: '2024-03-10', type: 'OUT', amount: 1500, category: 'Utility', description: 'Nairobi Water' },
  { id: 'm3', date: '2024-03-12', type: 'IN', amount: 3200, category: 'Business', description: 'Restaurant Supply' },
  { id: 'm4', date: '2024-03-15', type: 'OUT', amount: 1000, category: 'Loan Repayment', description: 'Fuliza Repayment' },
  { id: 'm5', date: '2024-03-18', type: 'OUT', amount: 2500, category: 'Business', description: 'New Stock Purchase' },
  { id: 'm6', date: '2024-03-22', type: 'IN', amount: 4100, category: 'Business', description: 'Weekend Market' },
  { id: 'm7', date: '2024-03-25', type: 'OUT', amount: 1000, category: 'Savings', description: 'M-Shwari Deposit' },
  { id: 'm8', date: '2024-03-28', type: 'OUT', amount: 1200, category: 'Utility', description: 'KPLC Token' },
];

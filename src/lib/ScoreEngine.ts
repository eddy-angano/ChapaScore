import { Transaction } from '../types';

export function calculateCreditScore(transactions: Transaction[], businessYears: number) {
  if (transactions.length === 0) return 300;

  let score = 500; // Base score

  // 1. Consistency of Income (IN transactions)
  const incomeTransactions = transactions.filter(t => t.type === 'IN');
  const monthlyIncome: Record<string, number> = {};
  
  incomeTransactions.forEach(t => {
    const month = t.date.substring(0, 7);
    monthlyIncome[month] = (monthlyIncome[month] || 0) + t.amount;
  });

  const months = Object.keys(monthlyIncome);
  const avgIncome = months.reduce((acc, m) => acc + monthlyIncome[m], 0) / months.length;
  
  // Bonus for high average income
  if (avgIncome > 50000) score += 100;
  else if (avgIncome > 20000) score += 50;

  // 2. Savings behavior
  const savings = transactions.filter(t => t.category === 'Savings').length;
  score += savings * 10;

  // 3. Utility payment consistency
  const utilities = transactions.filter(t => t.category === 'Utility').length;
  score += utilities * 5;

  // 4. Business experience
  score += Math.min(businessYears * 20, 100);

  // 5. Debt repayment history (simulated)
  const repayments = transactions.filter(t => t.category === 'Loan Repayment').length;
  score += repayments * 15;

  // Cap score at 850
  return Math.min(score, 850);
}

export function getCreditLimit(score: number, avgIncome: number) {
  if (score < 500) return 0;
  const multiplier = (score - 400) / 100;
  return Math.floor(avgIncome * 0.3 * multiplier);
}

export function generateInsights(score: number, transactions: Transaction[]) {
  const insights = [];
  
  if (score > 700) {
    insights.push("Excellent repayment history and consistent income.");
  } else if (score > 500) {
    insights.push("Good potential. Increasing your M-Pesa savings could boost your score.");
  } else {
    insights.push("Consider paying utilities via M-Pesa regularly to build your profile.");
  }

  const utilityCount = transactions.filter(t => t.category === 'Utility').length;
  if (utilityCount < 3) {
    insights.push("Low utility payment history detected. Link your KPLC/Water bills.");
  }

  return insights;
}

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
  
  // 1. Overall Score Insights
  if (score > 750) {
    insights.push("Exceptional profile. You qualify for our 'Gold' interest rates.");
  } else if (score > 650) {
    insights.push("Strong credit health. Maintaining this for 3 more months will unlock a higher limit.");
  } else if (score > 500) {
    insights.push("Good progress. Your consistent business income is your strongest asset.");
  } else {
    insights.push("Profile building phase. Focus on making all business payments via M-Pesa to increase visibility.");
  }

  // 2. Savings Insights
  const savingsCount = transactions.filter(t => t.category === 'Savings').length;
  const totalSavings = transactions.filter(t => t.category === 'Savings').reduce((acc, t) => acc + t.amount, 0);
  
  if (savingsCount >= 3) {
    insights.push(`Great savings habit! You've made ${savingsCount} deposits recently, showing high financial discipline.`);
  } else if (savingsCount > 0) {
    insights.push("Small savings detected. Try to automate a weekly deposit to M-Shwari to boost your score.");
  } else {
    insights.push("No savings history found. Even KES 50 a week helps prove your ability to set aside funds.");
  }

  // 3. Utility & Reliability Insights
  const utilityCount = transactions.filter(t => t.category === 'Utility').length;
  if (utilityCount >= 4) {
    insights.push("Reliable utility payer. Your consistent KPLC/Water payments reduce your risk profile significantly.");
  } else if (utilityCount < 2) {
    insights.push("Limited utility history. Paying your shop's electricity or water via M-Pesa is the fastest way to grow your score.");
  }

  // 4. Business Growth Insights
  const businessIncome = transactions.filter(t => t.type === 'IN' && t.category === 'Business');
  const lastMonthIncome = businessIncome.filter(t => t.date.includes('2024-03')).reduce((acc, t) => acc + t.amount, 0);
  const prevMonthIncome = businessIncome.filter(t => t.date.includes('2024-02')).reduce((acc, t) => acc + t.amount, 0);

  if (lastMonthIncome > prevMonthIncome && prevMonthIncome > 0) {
    const growth = ((lastMonthIncome - prevMonthIncome) / prevMonthIncome * 100).toFixed(0);
    insights.push(`Business is growing! Your revenue increased by ${growth}% this month. This supports a limit increase.`);
  }

  // 5. Debt Management
  const loanRepayments = transactions.filter(t => t.category === 'Loan Repayment').length;
  if (loanRepayments > 0) {
    insights.push("Active debt management detected. Timely Fuliza/M-Shwari repayments are being tracked positively.");
  }

  return insights;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  amount: number;
  category: 'Business' | 'Personal' | 'Utility' | 'Savings' | 'Loan Repayment';
  description: string;
}

export interface CreditProfile {
  name: string;
  businessType: string;
  yearsInBusiness: number;
  location: string;
  mpesaLinked: boolean;
  score: number;
  limit: number;
  insights: string[];
  transactions: Transaction[];
}

export type InformalSector = 'Mama Mboga' | 'Boda Boda' | 'Kiosk' | 'Artisan' | 'Farmer';

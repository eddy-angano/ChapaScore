/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ShieldCheck, 
  Info, 
  Plus, 
  History, 
  UserCheck, 
  ArrowUpRight,
  CreditCard,
  PieChart,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { CreditProfile, Transaction, InformalSector } from './types';
import { calculateCreditScore, getCreditLimit, generateInsights } from './lib/ScoreEngine';
import { MOCK_TRANSACTIONS } from './lib/mockData';

const SECTOR_COLORS: Record<InformalSector, string> = {
  'Mama Mboga': 'text-green-600 bg-green-50',
  'Boda Boda': 'text-blue-600 bg-blue-50',
  'Kiosk': 'text-orange-600 bg-orange-50',
  'Artisan': 'text-purple-600 bg-purple-50',
  'Farmer': 'text-emerald-600 bg-emerald-50',
};

export default function App() {
  const [profile, setProfile] = useState<CreditProfile | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'insights'>('overview');

  const simulateData = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const score = calculateCreditScore(MOCK_TRANSACTIONS, 3);
      const income = MOCK_TRANSACTIONS.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.amount, 0) / 3;
      const limit = getCreditLimit(score, income);
      const insights = generateInsights(score, MOCK_TRANSACTIONS);

      setProfile({
        name: "Jane Wambui",
        businessType: "Mama Mboga",
        yearsInBusiness: 3,
        location: "Kawangware, Nairobi",
        mpesaLinked: true,
        score,
        limit,
        insights,
        transactions: MOCK_TRANSACTIONS
      });
      setIsSimulating(false);
    }, 1500);
  };

  const chartData = useMemo(() => {
    if (!profile) return [];
    const monthly = profile.transactions.reduce((acc: any, t) => {
      const month = t.date.substring(5, 7);
      if (!acc[month]) acc[month] = { month: `Month ${month}`, in: 0, out: 0 };
      if (t.type === 'IN') acc[month].in += t.amount;
      else acc[month].out += t.amount;
      return acc;
    }, {});
    return Object.values(monthly);
  }, [profile]);

  const scoreColor = useMemo(() => {
    if (!profile) return 'text-gray-400';
    if (profile.score >= 700) return 'text-green-500';
    if (profile.score >= 500) return 'text-yellow-500';
    return 'text-red-500';
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-green-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ChapaScore</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Alt-Credit for Kenya</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!profile && (
            <button 
              onClick={simulateData}
              disabled={isSimulating}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isSimulating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              Link M-Pesa
            </button>
          )}
          {profile && (
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                <UserCheck size={16} />
              </div>
              <span className="text-sm font-semibold">{profile.name}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {!profile && !isSimulating && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-8">
              <Wallet size={48} />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Unlock Credit for Your Business</h2>
            <p className="text-gray-500 max-w-md mb-10 text-lg leading-relaxed">
              We use your M-Pesa transaction patterns and community "Champs" verification to build a credit profile that traditional banks miss.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                { icon: <ShieldCheck />, title: "Secure Data", desc: "Your M-Pesa data is encrypted and used only for scoring." },
                { icon: <Activity />, title: "Real-time Scoring", desc: "Score updates instantly as you transact." },
                { icon: <UserCheck />, title: "Champs Vouching", desc: "Community leaders can boost your score by vouching for you." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {isSimulating && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-8 text-lg font-medium text-gray-600 animate-pulse">Analyzing M-Pesa Statements...</p>
          </div>
        )}

        {profile && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Score & Stats */}
            <div className="lg:col-span-4 space-y-8">
              {/* Score Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <PieChart size={120} />
                </div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Credit Worthiness</h3>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-100"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={552}
                        strokeDashoffset={552 - (552 * (profile.score - 300)) / 550}
                        className={cn("transition-all duration-1000 ease-out", scoreColor)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black tracking-tighter">{profile.score}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase mt-1">Score</span>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-bold">
                    <ShieldCheck size={16} />
                    Tier 1 Borrower
                  </div>
                </div>
              </motion.div>

              {/* Limit Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#1A1A1A] p-8 rounded-[2rem] text-white shadow-xl shadow-gray-900/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Available Limit</h3>
                  <CreditCard size={20} className="text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-4xl font-black tracking-tighter">KES {profile.limit.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">Instant disbursement to M-Pesa</p>
                </div>
                <button className="w-full mt-8 py-4 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                  Withdraw Funds
                </button>
              </motion.div>

              {/* Business Info */}
              <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Business Profile</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Sector</span>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-bold", SECTOR_COLORS[profile.businessType as InformalSector])}>
                      {profile.businessType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Experience</span>
                    <span className="font-bold text-sm">{profile.yearsInBusiness} Years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Location</span>
                    <span className="font-bold text-sm">{profile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Charts & Details */}
            <div className="lg:col-span-8 space-y-8">
              {/* Navigation Tabs */}
              <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-gray-100 w-fit">
                {(['overview', 'transactions', 'insights'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                      activeTab === tab 
                        ? "bg-gray-900 text-white shadow-lg" 
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Revenue Chart */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-lg">Income vs Expenses</h3>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-bold text-gray-500">Income</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <span className="text-xs font-bold text-gray-500">Expenses</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600 }} />
                            <Tooltip 
                              cursor={{ fill: '#F8F9FA' }}
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="in" fill="#10B981" radius={[6, 6, 0, 0]} barSize={32} />
                            <Bar dataKey="out" fill="#F87171" radius={[6, 6, 0, 0]} barSize={32} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                          <TrendingUp size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Monthly Income</p>
                          <p className="text-xl font-black">KES 32,400</p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                          <History size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Repayment Rate</p>
                          <p className="text-xl font-black">98.2%</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'transactions' && (
                  <motion.div
                    key="transactions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-bold text-lg">Recent Activity</h3>
                      <button className="text-sm font-bold text-green-600 hover:text-green-700">Export CSV</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {profile.transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-6 py-4 text-sm font-medium text-gray-500">{t.date}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                    t.type === 'IN' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                  )}>
                                    {t.type === 'IN' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                  </div>
                                  <span className="text-sm font-bold">{t.description}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase">
                                  {t.category}
                                </span>
                              </td>
                              <td className={cn(
                                "px-6 py-4 text-sm font-black text-right",
                                t.type === 'IN' ? "text-green-600" : "text-gray-900"
                              )}>
                                {t.type === 'IN' ? '+' : '-'} {t.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'insights' && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Info size={20} className="text-blue-500" />
                        AI Financial Insights
                      </h3>
                      <div className="space-y-4">
                        {profile.insights.map((insight, i) => (
                          <div key={i} className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                              <ArrowUpRight size={20} />
                            </div>
                            <p className="text-sm text-blue-900 leading-relaxed font-medium">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Champs Verification */}
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <UserCheck size={20} className="text-green-600" />
                        Champs Verification
                      </h3>
                      <p className="text-sm text-gray-500 mb-6">Boost your score by getting vouched for by community leaders.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-100 rounded-2xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <Plus size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold">Add a Champ</p>
                            <p className="text-xs text-gray-400">Vouching increases limit by 15%</p>
                          </div>
                        </div>
                        <div className="p-4 bg-green-50/50 border border-green-100 rounded-2xl flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                            <UserCheck size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold">Market Chairman</p>
                            <p className="text-xs text-green-600 font-bold">Verified ✅</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-gray-100 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <TrendingUp size={20} />
            <span className="font-bold text-lg">ChapaScore</span>
          </div>
          <div className="flex gap-8 text-sm font-bold text-gray-400">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Contact Support</a>
          </div>
          <p className="text-xs text-gray-400 font-medium">© 2026 ChapaScore Kenya. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}


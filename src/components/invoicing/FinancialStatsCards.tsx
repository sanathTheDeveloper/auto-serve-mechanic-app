"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Clock, TrendingUp, Calendar } from "lucide-react";
import { FinancialSummary } from "@/types/invoice";

interface FinancialStatsCardsProps {
  financialData: FinancialSummary;
}

export function FinancialStatsCards({ financialData }: FinancialStatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
      {/* Funds in Escrow */}
      <Card className="group bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50 hover:shadow-2xl hover:border-blue-300/60 transition-all duration-300 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
        <CardHeader className="pb-3 p-4 lg:p-6 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs lg:text-sm font-semibold text-slate-700">
              Funds in Escrow
            </CardTitle>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-4 lg:p-6 relative z-10">
          <div className="space-y-3">
            <div className="text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
              {formatCurrency(financialData.fundsInEscrow)}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-xs lg:text-sm text-slate-600 font-medium">
                Securely held by AutoServe
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-100">
              <div className="flex items-center justify-between text-xs lg:text-sm text-slate-500">
                <span>Status</span>
                <span className="text-blue-600 font-semibold">Protected</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payouts */}
      <Card className="group bg-white/90 backdrop-blur-sm shadow-xl border border-amber-200/50 hover:shadow-2xl hover:border-amber-300/60 transition-all duration-300 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/20 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
        <CardHeader className="pb-3 p-4 lg:p-6 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs lg:text-sm font-semibold text-slate-700">
              Pending Payouts
            </CardTitle>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-4 lg:p-6 relative z-10">
          <div className="space-y-3">
            <div className="text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {formatCurrency(financialData.pendingPayouts)}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <p className="text-xs lg:text-sm text-slate-600 font-medium">
                Ready for next transfer
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-amber-100">
              <div className="flex items-center justify-between text-xs lg:text-sm text-slate-500">
                <span>Processing</span>
                <span className="text-amber-600 font-semibold">2-3 Days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Payout */}
      <Card className="group bg-white/90 backdrop-blur-sm shadow-xl border border-slate-200/50 hover:shadow-2xl hover:border-blue-300/60 transition-all duration-300 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-slate-50/30 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
        <CardHeader className="pb-3 p-4 lg:p-6 relative z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs lg:text-sm font-semibold text-slate-700">
              Last Payout
            </CardTitle>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-4 lg:p-6 relative z-10">
          <div className="space-y-3">
            <div className="text-2xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">
              {formatCurrency(financialData.lastPayout.amount)}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <p className="text-xs lg:text-sm text-slate-600 font-medium">
                {formatDate(financialData.lastPayout.date)}
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs lg:text-sm text-slate-500">
                <span>Next Payout</span>
                <span className="text-blue-600 font-semibold">Weekly</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
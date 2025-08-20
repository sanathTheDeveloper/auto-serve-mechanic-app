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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Funds in Escrow */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">
              Funds in Escrow
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
              {formatCurrency(financialData.fundsInEscrow)}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-slate-500">
                Securely held by AutoServe
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Payouts */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Payouts
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
              {formatCurrency(financialData.pendingPayouts)}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-slate-500">
                Ready for next transfer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Payout */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-600">
              Last Payout
            </CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
              {formatCurrency(financialData.lastPayout.amount)}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-slate-400" />
              <p className="text-xs text-slate-500">
                {formatDate(financialData.lastPayout.date)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FinancialStatsCards } from "./FinancialStatsCards";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { InvoiceCreationDialog } from "./InvoiceCreationDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import {
  mockFinancialSummary,
  mockTransactions,
  exportTransactionsToCSV,
} from "@/data/invoicing";
import { Invoice, Transaction } from "@/types/invoice";
import { Job } from "@/types/booking";

interface InvoicingPageProps {
  onCreateInvoiceFromJob?: (job: Job) => void;
}

export function InvoicingPage({}: InvoicingPageProps) {
  const router = useRouter();
  const [financialData] = useState(mockFinancialSummary);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

  const handleCreateInvoice = useCallback(
    (invoice: Invoice) => {
      // Add new transaction when invoice is sent
      const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        date: invoice.sentAt || new Date().toISOString(),
        customerName: invoice.customerName,
        grossAmount: invoice.total,
        appFee: invoice.total * 0.15, // 15% app fee
        netPayout: invoice.total * 0.85,
        status: "in_escrow",
      };

      setTransactions([newTransaction, ...transactions]);
      setRecentInvoices([invoice, ...recentInvoices]);
      setIsInvoiceDialogOpen(false);
    },
    [transactions, recentInvoices]
  );

  const handleSaveDraft = useCallback(
    (invoice: Invoice) => {
      setRecentInvoices([invoice, ...recentInvoices]);
      setIsInvoiceDialogOpen(false);
    },
    [recentInvoices]
  );

  // Handle new invoice or draft creation from localStorage
  useEffect(() => {
    const newInvoice = localStorage.getItem("newInvoice");
    const draftInvoice = localStorage.getItem("draftInvoice");

    if (newInvoice) {
      const invoice = JSON.parse(newInvoice);
      handleCreateInvoice(invoice);
      localStorage.removeItem("newInvoice");
    }

    if (draftInvoice) {
      const invoice = JSON.parse(draftInvoice);
      handleSaveDraft(invoice);
      localStorage.removeItem("draftInvoice");
    }
  }, [handleCreateInvoice, handleSaveDraft]);

  const handleExportCSV = (filteredTransactions: Transaction[]) => {
    exportTransactionsToCSV(filteredTransactions);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "paid":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "draft":
        return <FileText className="h-4 w-4 text-slate-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Sent
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Paid
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
            Draft
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Financial Overview Cards */}
      <FinancialStatsCards financialData={financialData} />

      {/* Payment Status & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Payment Status Overview */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardHeader className="p-4 lg:p-5">
            <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4 lg:p-5 pt-0">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-700">
                    {transactions.filter((t) => t.status === "paid_out").length}
                  </div>
                  <div className="text-xs text-green-600">Paid</div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                <div className="text-center">
                  <div className="text-lg font-bold text-amber-700">
                    {
                      transactions.filter((t) => t.status === "in_escrow")
                        .length
                    }
                  </div>
                  <div className="text-xs text-amber-600">In Escrow</div>
                </div>
              </div>
            </div>

            {/* Recent Payment Activity */}
            <div className="border-t border-slate-200 pt-3">
              <h4 className="text-xs font-semibold text-slate-700 mb-2">
                Recent Activity
              </h4>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-600 truncate">
                      {transaction.customerName}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-slate-800">
                        {formatCurrency(transaction.grossAmount)}
                      </span>
                      {transaction.status === "paid_out" ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : transaction.status === "in_escrow" ? (
                        <Clock className="h-3 w-3 text-amber-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <Button
                onClick={() => router.push("/create-invoice")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-8 text-xs"
              >
                <FileText className="h-3 w-3 mr-2" />
                New Invoice
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 h-8 text-xs"
                onClick={() => handleExportCSV(transactions)}
              >
                <TrendingUp className="h-3 w-3 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="lg:col-span-2 bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/50">
          <CardHeader className="p-4 lg:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                <FileText className="h-4 w-4 text-slate-600" />
                Recent Invoices
              </CardTitle>
              {recentInvoices.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 text-xs lg:text-sm"
                >
                  View All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-5 pt-0">
            {recentInvoices.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No invoices created yet</p>
                <p className="text-sm">
                  Create your first invoice to see it here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInvoices.slice(0, 3).map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(invoice.status)}
                      <div>
                        <p className="font-medium text-slate-800">
                          {invoice.customerName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500 font-mono">
                            {invoice.invoiceNumber}
                          </span>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {formatCurrency(invoice.total)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History Table */}
      <TransactionHistoryTable
        transactions={transactions}
        onExportCSV={handleExportCSV}
      />

      {/* Invoice Creation Dialog */}
      <InvoiceCreationDialog
        isOpen={isInvoiceDialogOpen}
        onClose={() => {
          setIsInvoiceDialogOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onInvoiceCreate={handleCreateInvoice}
        onInvoiceDraft={handleSaveDraft}
      />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  Download,
  Filter,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Transaction } from "@/types/invoice";
import { format } from "date-fns";

interface TransactionHistoryTableProps {
  transactions: Transaction[];
  onExportCSV: (filteredTransactions: Transaction[]) => void;
}

export function TransactionHistoryTable({
  transactions,
  onExportCSV,
}: TransactionHistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  const itemsPerPage = 10;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;

      // Date range filter
      const transactionDate = new Date(transaction.date);
      const matchesDateRange =
        (!dateRange.from || transactionDate >= dateRange.from) &&
        (!dateRange.to || transactionDate <= dateRange.to);

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [transactions, searchTerm, statusFilter, dateRange]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

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

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'paid_out':
        return (
          <Badge className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 hover:from-emerald-200 hover:to-emerald-300 border border-emerald-300 font-medium shadow-sm">
            ✓ Paid Out
          </Badge>
        );
      case 'pending_payout':
        return (
          <Badge className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 hover:from-amber-200 hover:to-amber-300 border border-amber-300 font-medium shadow-sm">
            ⏳ Pending
          </Badge>
        );
      case 'in_escrow':
        return (
          <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border border-blue-300 font-medium shadow-sm">
            🔒 In Escrow
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border border-slate-300">
            ❓ Unknown
          </Badge>
        );
    }
  };

  const clearDateRange = () => {
    setDateRange({});
    setIsDatePickerOpen(false);
  };

  const handleExport = () => {
    onExportCSV(filteredTransactions);
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-blue-200/50 lg:shadow-xl">
      <CardHeader className="p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Transaction History
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              Track payments and payouts for your services
            </p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 shadow-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span> CSV
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-5 mt-4 lg:mt-6">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by customer name or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 sm:justify-end">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44 lg:w-48 h-11 border-slate-200 focus:border-blue-300 focus:ring-blue-200 shadow-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid_out">Paid Out</SelectItem>
                <SelectItem value="pending_payout">Pending Payout</SelectItem>
                <SelectItem value="in_escrow">In Escrow</SelectItem>
              </SelectContent>
            </Select>

            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full sm:w-48 lg:w-52 h-11 justify-start text-left font-normal border-slate-200 hover:bg-slate-50 shadow-sm ${
                    !dateRange.from && !dateRange.to ? "text-muted-foreground" : ""
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} -{" "}
                        {format(dateRange.to, "MMM dd")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 border-b">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Select Date Range</span>
                    {(dateRange.from || dateRange.to) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearDateRange}
                        className="h-6 px-2 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    setDateRange({
                      from: range?.from,
                      to: range?.to,
                    });
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-16 lg:py-20 text-slate-500">
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto px-4">
              <div className="bg-slate-100 rounded-full p-4">
                <Filter className="h-16 w-16 text-slate-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-700">No transactions found</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Try adjusting your search criteria, status filter, or date range to find the transactions you&apos;re looking for.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile/Tablet Card Layout */}
            <div className="block lg:hidden px-2 sm:px-4">
              <div className="space-y-4">
                {paginatedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gradient-to-r from-white to-slate-50/30 border border-slate-200/80 rounded-xl p-4 sm:p-5 hover:shadow-lg hover:border-blue-200/60 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h4 className="font-bold text-slate-800 text-base truncate">
                            {transaction.customerName}
                          </h4>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-sm text-slate-600 font-medium">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-xl text-emerald-700">
                          {formatCurrency(transaction.netPayout)}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">Your Earnings</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 font-medium">Invoice #</span>
                        <span className="font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm">
                          {transaction.invoiceNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 font-medium">Gross Amount</span>
                        <span className="font-bold text-slate-800">{formatCurrency(transaction.grossAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 font-medium">App Fee (15%)</span>
                        <span className="text-slate-600 font-semibold">{formatCurrency(transaction.appFee)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50/40 border-b-2 border-blue-200">
                      <TableHead className="font-bold text-slate-700 text-sm py-4 pl-6">
                        <div className="flex flex-col">
                          <span>Date</span>
                          <span className="text-xs font-normal text-slate-500">Transaction Date</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 text-sm py-4 px-4">
                        <div className="flex flex-col">
                          <span>Customer</span>
                          <span className="text-xs font-normal text-slate-500">Client Name</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 text-sm py-4 px-4">
                        <div className="flex flex-col">
                          <span>Invoice #</span>
                          <span className="text-xs font-normal text-slate-500">Reference</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 text-sm text-right py-4 px-4">
                        <div className="flex flex-col items-end">
                          <span>Gross Amount</span>
                          <span className="text-xs font-normal text-slate-500">Total Charged</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 text-sm text-right py-4 px-4">
                        <div className="flex flex-col items-end">
                          <span>App Fee</span>
                          <span className="text-xs font-normal text-slate-500">15% Service Fee</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 text-sm text-right py-4 px-4">
                        <div className="flex flex-col items-end">
                          <span>Net Payout</span>
                          <span className="text-xs font-normal text-emerald-600">Your Earnings</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 text-sm text-center py-4 pr-6">
                        <div className="flex flex-col items-center">
                          <span>Status</span>
                          <span className="text-xs font-normal text-slate-500">Payment State</span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => (
                      <TableRow
                        key={transaction.id}
                        className={`group hover:bg-gradient-to-r hover:from-blue-50/20 hover:to-transparent transition-all duration-200 border-b border-slate-100 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <TableCell className="font-medium text-slate-700 py-5 pl-6">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">{formatDate(transaction.date)}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(transaction.date).toLocaleDateString('en-AU', {
                                weekday: 'short'
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 px-4">
                          <div className="font-semibold text-slate-800 text-sm">
                            {transaction.customerName}
                          </div>
                        </TableCell>
                        <TableCell className="py-5 px-4">
                          <span className="font-mono text-xs bg-slate-100 group-hover:bg-blue-100 px-3 py-2 rounded-lg border transition-colors shadow-sm">
                            {transaction.invoiceNumber}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-slate-800 py-5 px-4">
                          <span className="text-base">{formatCurrency(transaction.grossAmount)}</span>
                        </TableCell>
                        <TableCell className="text-right text-slate-600 py-5 px-4">
                          <span className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                            {formatCurrency(transaction.appFee)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-bold text-emerald-700 py-5 px-4">
                          <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg inline-block shadow-sm">
                            <span className="text-base">{formatCurrency(transaction.netPayout)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center py-5 pr-6">
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 lg:px-6 py-4 lg:py-5 border-t border-slate-200 bg-gradient-to-r from-slate-50/50 to-blue-50/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-slate-600 order-2 sm:order-1">
                <span className="font-medium">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
                </span>
                <span className="text-slate-500">
                  {" "}of {filteredTransactions.length} transactions
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-slate-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      );
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-slate-400 text-sm">...</span>
                        )}
                        <Button
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 p-0 text-sm ${
                            page === currentPage
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
                              : "border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-slate-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
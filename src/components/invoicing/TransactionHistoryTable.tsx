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
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Paid Out
          </Badge>
        );
      case 'pending_payout':
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Pending Payout
          </Badge>
        );
      case 'in_escrow':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            In Escrow
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unknown
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
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Transaction History
          </CardTitle>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by customer name or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
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
                  className={`w-48 justify-start text-left font-normal ${
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="font-semibold text-slate-700">Date</TableHead>
                <TableHead className="font-semibold text-slate-700">Customer</TableHead>
                <TableHead className="font-semibold text-slate-700">Invoice #</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">
                  Gross Amount
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">
                  App Fee (15%)
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">
                  Net Payout
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="h-12 w-12 text-slate-300" />
                      <p>No transactions found</p>
                      <p className="text-sm">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>{transaction.customerName}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                        {transaction.invoiceNumber}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.grossAmount)}
                    </TableCell>
                    <TableCell className="text-right text-slate-600">
                      {formatCurrency(transaction.appFee)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700">
                      {formatCurrency(transaction.netPayout)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
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
                          <span className="px-2 text-slate-400">...</span>
                        )}
                        <Button
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 p-0 ${
                            page === currentPage
                              ? "bg-blue-500 hover:bg-blue-600"
                              : ""
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
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
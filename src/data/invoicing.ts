import { FinancialSummary, Transaction } from "@/types/invoice";

// Mock financial data
export const mockFinancialSummary: FinancialSummary = {
  fundsInEscrow: 3450.75,
  pendingPayouts: 1250.00,
  lastPayout: {
    amount: 2100.50,
    date: "2025-08-15T00:00:00Z",
  },
  totalEarnings: 15750.25,
  monthlyEarnings: 4680.75,
};

// Mock transaction history
export const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    invoiceId: "inv-001",
    invoiceNumber: "INV-20250820-001",
    date: "2025-08-20T10:30:00Z",
    customerName: "Emily Watson",
    grossAmount: 450.00,
    appFee: 67.50,
    netPayout: 382.50,
    status: "in_escrow",
  },
  {
    id: "txn-002",
    invoiceId: "inv-002",
    invoiceNumber: "INV-20250819-002",
    date: "2025-08-19T14:15:00Z",
    customerName: "Robert Taylor",
    grossAmount: 280.00,
    appFee: 42.00,
    netPayout: 238.00,
    status: "pending_payout",
    escrowReleaseDate: "2025-08-21T00:00:00Z",
  },
  {
    id: "txn-003",
    invoiceId: "inv-003",
    invoiceNumber: "INV-20250818-003",
    date: "2025-08-18T09:45:00Z",
    customerName: "Lisa Johnson",
    grossAmount: 650.00,
    appFee: 97.50,
    netPayout: 552.50,
    status: "paid_out",
    payoutDate: "2025-08-20T00:00:00Z",
  },
  {
    id: "txn-004",
    invoiceId: "inv-004",
    invoiceNumber: "INV-20250817-004",
    date: "2025-08-17T16:20:00Z",
    customerName: "Michael Chen",
    grossAmount: 320.00,
    appFee: 48.00,
    netPayout: 272.00,
    status: "paid_out",
    payoutDate: "2025-08-19T00:00:00Z",
  },
  {
    id: "txn-005",
    invoiceId: "inv-005",
    invoiceNumber: "INV-20250816-005",
    date: "2025-08-16T11:30:00Z",
    customerName: "Sarah Williams",
    grossAmount: 180.00,
    appFee: 27.00,
    netPayout: 153.00,
    status: "in_escrow",
  },
  {
    id: "txn-006",
    invoiceId: "inv-006",
    invoiceNumber: "INV-20250815-006",
    date: "2025-08-15T13:45:00Z",
    customerName: "David Brown",
    grossAmount: 420.00,
    appFee: 63.00,
    netPayout: 357.00,
    status: "pending_payout",
    escrowReleaseDate: "2025-08-22T00:00:00Z",
  },
  {
    id: "txn-007",
    invoiceId: "inv-007",
    invoiceNumber: "INV-20250814-007",
    date: "2025-08-14T08:20:00Z",
    customerName: "Jennifer Davis",
    grossAmount: 750.00,
    appFee: 112.50,
    netPayout: 637.50,
    status: "paid_out",
    payoutDate: "2025-08-16T00:00:00Z",
  },
  {
    id: "txn-008",
    invoiceId: "inv-008",
    invoiceNumber: "INV-20250813-008",
    date: "2025-08-13T15:10:00Z",
    customerName: "James Wilson",
    grossAmount: 290.00,
    appFee: 43.50,
    netPayout: 246.50,
    status: "paid_out",
    payoutDate: "2025-08-15T00:00:00Z",
  },
  {
    id: "txn-009",
    invoiceId: "inv-009",
    invoiceNumber: "INV-20250812-009",
    date: "2025-08-12T12:00:00Z",
    customerName: "Angela Foster",
    grossAmount: 380.00,
    appFee: 57.00,
    netPayout: 323.00,
    status: "in_escrow",
  },
  {
    id: "txn-010",
    invoiceId: "inv-010",
    invoiceNumber: "INV-20250811-010",
    date: "2025-08-11T10:15:00Z",
    customerName: "Mark Thompson",
    grossAmount: 520.00,
    appFee: 78.00,
    netPayout: 442.00,
    status: "pending_payout",
    escrowReleaseDate: "2025-08-25T00:00:00Z",
  },
];

// Helper function to export transactions to CSV
export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  const headers = [
    "Date",
    "Customer Name",
    "Invoice Number",
    "Gross Amount",
    "App Fee",
    "Net Payout",
    "Status",
    "Payout Date",
  ];

  const csvData = transactions.map((transaction) => [
    new Date(transaction.date).toLocaleDateString('en-AU'),
    transaction.customerName,
    transaction.invoiceNumber,
    transaction.grossAmount.toFixed(2),
    transaction.appFee.toFixed(2),
    transaction.netPayout.toFixed(2),
    transaction.status.replace('_', ' ').toUpperCase(),
    transaction.payoutDate 
      ? new Date(transaction.payoutDate).toLocaleDateString('en-AU')
      : '',
  ]);

  const csvContent = [headers, ...csvData]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
import { FinancialSummary, Transaction, Invoice } from "@/types/invoice";

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
    invoiceNumber: "INV-20250822-001",
    date: "2025-08-22T10:30:00Z",
    customerName: "Marcus Thompson",
    grossAmount: 269.50,
    appFee: 40.43,
    netPayout: 229.07,
    status: "paid_out",
    payoutDate: "2025-08-22T16:00:00Z",
  },
  {
    id: "txn-002",
    invoiceId: "inv-002",
    invoiceNumber: "INV-20250821-002",
    date: "2025-08-21T14:15:00Z",
    customerName: "Sarah Chen",
    grossAmount: 577.50,
    appFee: 86.63,
    netPayout: 490.87,
    status: "in_escrow",
  },
  {
    id: "txn-003",
    invoiceId: "inv-003",
    invoiceNumber: "INV-20250820-003",
    date: "2025-08-20T09:45:00Z",
    customerName: "David Rodriguez",
    grossAmount: 528.00,
    appFee: 79.20,
    netPayout: 448.80,
    status: "pending_payout",
    escrowReleaseDate: "2025-08-23T00:00:00Z",
  },
  {
    id: "txn-004",
    invoiceId: "inv-004",
    invoiceNumber: "INV-20250819-004",
    date: "2025-08-19T16:20:00Z",
    customerName: "Jennifer Park",
    grossAmount: 660.00,
    appFee: 99.00,
    netPayout: 561.00,
    status: "in_escrow",
  },
  {
    id: "txn-005",
    invoiceId: "inv-005",
    invoiceNumber: "INV-20250816-005",
    date: "2025-08-16T11:30:00Z",
    customerName: "Alex Mitchell",
    grossAmount: 295.00,
    appFee: 44.25,
    netPayout: 250.75,
    status: "paid_out",
    payoutDate: "2025-08-18T00:00:00Z",
  },
  {
    id: "txn-006",
    invoiceId: "inv-006",
    invoiceNumber: "INV-20250815-006",
    date: "2025-08-15T13:45:00Z",
    customerName: "Maria Gonzalez",
    grossAmount: 385.00,
    appFee: 57.75,
    netPayout: 327.25,
    status: "pending_payout",
    escrowReleaseDate: "2025-08-22T00:00:00Z",
  },
  {
    id: "txn-007",
    invoiceId: "inv-007",
    invoiceNumber: "INV-20250814-007",
    date: "2025-08-14T08:20:00Z",
    customerName: "Ryan O'Connor",
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
    customerName: "Emma Taylor",
    grossAmount: 155.00,
    appFee: 23.25,
    netPayout: 131.75,
    status: "paid_out",
    payoutDate: "2025-08-15T00:00:00Z",
  },
  {
    id: "txn-009",
    invoiceId: "inv-009",
    invoiceNumber: "INV-20250812-009",
    date: "2025-08-12T12:00:00Z",
    customerName: "Lucas Kim",
    grossAmount: 425.00,
    appFee: 63.75,
    netPayout: 361.25,
    status: "in_escrow",
  },
  {
    id: "txn-010",
    invoiceId: "inv-010",
    invoiceNumber: "INV-20250811-010",
    date: "2025-08-11T10:15:00Z",
    customerName: "Sophie Anderson",
    grossAmount: 520.00,
    appFee: 78.00,
    netPayout: 442.00,
    status: "pending_payout",
    escrowReleaseDate: "2025-08-25T00:00:00Z",
  },
];

// Mock recent invoices data
export const mockRecentInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-20250822-001",
    jobId: "job-001",
    customerId: "cust-001",
    customerName: "Marcus Thompson",
    customerEmail: "marcus.thompson@email.com",
    vehicleInfo: {
      year: 2022,
      make: "Tesla",
      model: "Model 3",
      registration: "TES222"
    },
    lineItems: [
      {
        id: "line-001",
        description: "EV Battery Diagnostic Scan",
        quantity: 1,
        unitPrice: 120.00,
        total: 120.00,
        type: "labor"
      },
      {
        id: "line-002",
        description: "Cabin Air Filter Replacement",
        quantity: 1,
        unitPrice: 45.00,
        total: 45.00,
        type: "parts"
      },
      {
        id: "line-003",
        description: "Software Update Service",
        quantity: 1,
        unitPrice: 80.00,
        total: 80.00,
        type: "additional"
      }
    ],
    subtotal: 245.00,
    gstAmount: 24.50,
    gstRate: 0.10,
    total: 269.50,
    status: "paid",
    createdAt: "2025-08-22T09:15:00Z",
    sentAt: "2025-08-22T09:30:00Z",
    paidAt: "2025-08-22T14:20:00Z",
    dueDate: "2025-09-05T00:00:00Z",
    notes: "Regular EV maintenance service with latest software updates"
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-20250821-002",
    jobId: "job-002",
    customerId: "cust-002",
    customerName: "Sarah Chen",
    customerEmail: "sarah.chen@email.com",
    vehicleInfo: {
      year: 2021,
      make: "BMW",
      model: "X3",
      registration: "BMW321"
    },
    lineItems: [
      {
        id: "line-004",
        description: "Premium Brake Service",
        quantity: 1,
        unitPrice: 280.00,
        total: 280.00,
        type: "labor"
      },
      {
        id: "line-005",
        description: "High-Performance Brake Pads",
        quantity: 1,
        unitPrice: 180.00,
        total: 180.00,
        type: "parts"
      },
      {
        id: "line-006",
        description: "Brake Fluid Flush",
        quantity: 1,
        unitPrice: 65.00,
        total: 65.00,
        type: "additional"
      }
    ],
    subtotal: 525.00,
    gstAmount: 52.50,
    gstRate: 0.10,
    total: 577.50,
    status: "sent",
    createdAt: "2025-08-21T14:20:00Z",
    sentAt: "2025-08-21T14:30:00Z",
    dueDate: "2025-09-04T00:00:00Z",
    notes: "Customer reported squeaking noise during braking"
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-20250820-003",
    jobId: "job-003",
    customerId: "cust-003",
    customerName: "David Rodriguez",
    customerEmail: "david.rodriguez@email.com",
    vehicleInfo: {
      year: 2018,
      make: "Ford",
      model: "F-150",
      registration: "TRK456"
    },
    lineItems: [
      {
        id: "line-007",
        description: "Transmission Service",
        quantity: 1,
        unitPrice: 350.00,
        total: 350.00,
        type: "labor"
      },
      {
        id: "line-008",
        description: "Transmission Fluid Change",
        quantity: 1,
        unitPrice: 85.00,
        total: 85.00,
        type: "parts"
      },
      {
        id: "line-009",
        description: "Filter Replacement",
        quantity: 1,
        unitPrice: 45.00,
        total: 45.00,
        type: "parts"
      }
    ],
    subtotal: 480.00,
    gstAmount: 48.00,
    gstRate: 0.10,
    total: 528.00,
    status: "draft",
    createdAt: "2025-08-20T11:00:00Z",
    dueDate: "2025-08-27T00:00:00Z",
    notes: "Annual transmission maintenance for fleet vehicle"
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-20250819-004",
    jobId: "job-004",
    customerId: "cust-004",
    customerName: "Jennifer Park",
    customerEmail: "jennifer.park@email.com",
    vehicleInfo: {
      year: 2023,
      make: "Audi",
      model: "Q5",
      registration: "AUD789"
    },
    lineItems: [
      {
        id: "line-011",
        description: "Annual Service Package",
        quantity: 1,
        unitPrice: 450.00,
        total: 450.00,
        type: "labor"
      },
      {
        id: "line-012",
        description: "Premium Engine Oil",
        quantity: 1,
        unitPrice: 85.00,
        total: 85.00,
        type: "parts"
      },
      {
        id: "line-013",
        description: "Multi-Point Inspection",
        quantity: 1,
        unitPrice: 65.00,
        total: 65.00,
        type: "additional"
      }
    ],
    subtotal: 600.00,
    gstAmount: 60.00,
    gstRate: 0.10,
    total: 660.00,
    status: "overdue",
    createdAt: "2025-08-19T16:30:00Z",
    sentAt: "2025-08-19T17:00:00Z",
    dueDate: "2025-08-26T00:00:00Z",
    notes: "Premium service package for luxury vehicle maintenance"
  }
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
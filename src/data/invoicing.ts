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

// Mock recent invoices data
export const mockRecentInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-20250822-001",
    jobId: "job-001",
    customerId: "cust-001",
    customerName: "Emily Watson",
    customerEmail: "emily.watson@email.com",
    vehicleInfo: {
      year: 2020,
      make: "Honda",
      model: "Civic",
      registration: "ABC123"
    },
    lineItems: [
      {
        id: "line-001",
        description: "Brake Pad Replacement",
        quantity: 1,
        unitPrice: 180.00,
        total: 180.00,
        type: "labor"
      },
      {
        id: "line-002",
        description: "Brake Pads - Front Set",
        quantity: 1,
        unitPrice: 120.00,
        total: 120.00,
        type: "parts"
      },
      {
        id: "line-003",
        description: "Brake Fluid Top-up",
        quantity: 1,
        unitPrice: 25.00,
        total: 25.00,
        type: "additional"
      }
    ],
    subtotal: 325.00,
    gstAmount: 32.50,
    gstRate: 0.10,
    total: 357.50,
    status: "sent",
    createdAt: "2025-08-22T09:15:00Z",
    sentAt: "2025-08-22T09:30:00Z",
    dueDate: "2025-09-05T00:00:00Z",
    notes: "Customer requested brake inspection - pads were worn beyond safe limits"
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-20250821-002",
    jobId: "job-002",
    customerId: "cust-002",
    customerName: "Robert Taylor",
    customerEmail: "robert.taylor@email.com",
    vehicleInfo: {
      year: 2019,
      make: "Ford",
      model: "Focus",
      registration: "DEF456"
    },
    lineItems: [
      {
        id: "line-004",
        description: "Oil Change Service",
        quantity: 1,
        unitPrice: 80.00,
        total: 80.00,
        type: "labor"
      },
      {
        id: "line-005",
        description: "Engine Oil - 5W30 Synthetic",
        quantity: 5,
        unitPrice: 12.00,
        total: 60.00,
        type: "parts"
      },
      {
        id: "line-006",
        description: "Oil Filter",
        quantity: 1,
        unitPrice: 15.00,
        total: 15.00,
        type: "parts"
      }
    ],
    subtotal: 155.00,
    gstAmount: 15.50,
    gstRate: 0.10,
    total: 170.50,
    status: "paid",
    createdAt: "2025-08-21T14:20:00Z",
    sentAt: "2025-08-21T14:30:00Z",
    paidAt: "2025-08-21T16:45:00Z",
    dueDate: "2025-09-04T00:00:00Z"
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-20250820-003",
    jobId: "job-003",
    customerId: "cust-003",
    customerName: "Lisa Johnson",
    customerEmail: "lisa.johnson@email.com",
    vehicleInfo: {
      year: 2020,
      make: "Honda",
      model: "Civic",
      registration: "GHI789"
    },
    lineItems: [
      {
        id: "line-007",
        description: "Diagnostic Scan & Inspection",
        quantity: 1,
        unitPrice: 120.00,
        total: 120.00,
        type: "labor"
      },
      {
        id: "line-008",
        description: "Engine Mount Replacement",
        quantity: 2,
        unitPrice: 180.00,
        total: 360.00,
        type: "labor"
      },
      {
        id: "line-009",
        description: "Engine Mount - Left Side",
        quantity: 1,
        unitPrice: 85.00,
        total: 85.00,
        type: "parts"
      },
      {
        id: "line-010",
        description: "Engine Mount - Right Side",
        quantity: 1,
        unitPrice: 85.00,
        total: 85.00,
        type: "parts"
      }
    ],
    subtotal: 650.00,
    gstAmount: 65.00,
    gstRate: 0.10,
    total: 715.00,
    status: "overdue",
    createdAt: "2025-08-20T11:00:00Z",
    sentAt: "2025-08-20T11:15:00Z",
    dueDate: "2025-08-27T00:00:00Z",
    notes: "Customer reported excessive engine vibration - found worn engine mounts"
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-20250819-004",
    jobId: "job-004",
    customerId: "cust-004",
    customerName: "Angela Foster",
    customerEmail: "angela.foster@email.com",
    vehicleInfo: {
      year: 2020,
      make: "Nissan",
      model: "Navara",
      registration: "JKL012"
    },
    lineItems: [
      {
        id: "line-011",
        description: "Tire Rotation & Balance",
        quantity: 1,
        unitPrice: 120.00,
        total: 120.00,
        type: "labor"
      },
      {
        id: "line-012",
        description: "Wheel Alignment",
        quantity: 1,
        unitPrice: 180.00,
        total: 180.00,
        type: "labor"
      }
    ],
    subtotal: 300.00,
    gstAmount: 30.00,
    gstRate: 0.10,
    total: 330.00,
    status: "draft",
    createdAt: "2025-08-19T16:30:00Z",
    dueDate: "2025-09-02T00:00:00Z",
    notes: "Vehicle showing signs of uneven tire wear - alignment recommended"
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-20250818-005",
    jobId: "job-005",
    customerId: "cust-005",
    customerName: "Michael Chen",
    customerEmail: "michael.chen@email.com",
    vehicleInfo: {
      year: 2018,
      make: "Toyota",
      model: "Camry",
      registration: "MNO345"
    },
    lineItems: [
      {
        id: "line-013",
        description: "Air Conditioning Service",
        quantity: 1,
        unitPrice: 150.00,
        total: 150.00,
        type: "labor"
      },
      {
        id: "line-014",
        description: "A/C Refrigerant R134a",
        quantity: 2,
        unitPrice: 45.00,
        total: 90.00,
        type: "parts"
      },
      {
        id: "line-015",
        description: "Cabin Air Filter",
        quantity: 1,
        unitPrice: 25.00,
        total: 25.00,
        type: "parts"
      }
    ],
    subtotal: 265.00,
    gstAmount: 26.50,
    gstRate: 0.10,
    total: 291.50,
    status: "paid",
    createdAt: "2025-08-18T13:45:00Z",
    sentAt: "2025-08-18T14:00:00Z",
    paidAt: "2025-08-19T10:30:00Z",
    dueDate: "2025-09-01T00:00:00Z"
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
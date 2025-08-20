export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
  type: 'labor' | 'parts' | 'additional';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    registration?: string;
  };
  lineItems: InvoiceLineItem[];
  subtotal: number;
  gstAmount: number;
  gstRate: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
  dueDate: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  grossAmount: number;
  appFee: number;
  netPayout: number;
  status: 'in_escrow' | 'pending_payout' | 'paid_out';
  payoutDate?: string;
  escrowReleaseDate?: string;
}

export interface FinancialSummary {
  fundsInEscrow: number;
  pendingPayouts: number;
  lastPayout: {
    amount: number;
    date: string;
  };
  totalEarnings: number;
  monthlyEarnings: number;
}

export interface PayoutSchedule {
  nextPayoutDate: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  minimumAmount: number;
}
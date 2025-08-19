export type JobStage = 'quote-requested' | 'quote-sent' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'deposit-paid' | 'paid-full' | 'unpaid' | 'quote-pending';
export type Priority = 'normal' | 'urgent';
export type QuoteStatus = 'pending' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface QuoteItem {
  id: string;
  description: string;
  type: 'labor' | 'parts' | 'other';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  status: QuoteStatus;
  notes?: string;
  createdAt: string;
  sentAt?: string;
}

export interface Job {
  id: string;
  customer: string;
  customerEmail: string;
  phone: string;
  vehicle: string;
  vehicleYear?: number;
  vehicleMake?: string;
  vehicleModel?: string;
  service: string;
  description: string;
  timeStart?: string;
  timeEnd?: string;
  duration?: string;
  stage: JobStage;
  paymentStatus: PaymentStatus;
  bay?: string;
  estimatedCompletion?: string;
  priority: Priority;
  date: string; // ISO date string (YYYY-MM-DD)
  notes?: string;
  quote?: Quote;
  actualStartTime?: string;
  actualEndTime?: string;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

// Legacy booking interface for backward compatibility
export interface Booking extends Job {
  bookingStatus: JobStage;
  servicePrice?: number;
  depositAmount?: number;
}

export interface JobFilter {
  stages?: JobStage[];
  paymentStatus?: PaymentStatus[];
  priority?: Priority[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  searchTerm?: string;
}

// Legacy filter interface for backward compatibility
export interface BookingFilter extends JobFilter {
  status?: JobStage[];
}

export interface StatusConfig {
  jobStage: {
    [K in JobStage]: {
      label: string;
      className: string;
      color: string;
    };
  };
  paymentStatus: {
    [K in PaymentStatus]: {
      label: string;
      className: string;
    };
  };
  priority: {
    [K in Priority]: {
      label: string;
      className: string;
    };
  };
}
import { Booking } from '@/types/booking';
import { mockJobs, statusConfig as jobStatusConfig } from './jobs';

// Legacy bookings interface - converts jobs to bookings for backward compatibility
export const mockBookings: Booking[] = mockJobs.map(job => ({
  ...job,
  bookingStatus: job.stage,
  servicePrice: job.finalPrice,
  service: job.service,
}));

// Legacy status config for backward compatibility
export const statusConfig = {
  bookingStatus: jobStatusConfig.jobStage,
  paymentStatus: jobStatusConfig.paymentStatus,
};
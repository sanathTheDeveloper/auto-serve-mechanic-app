import { ServiceMenuData } from './services';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateServiceMenu(serviceMenuData: ServiceMenuData): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate Basic Package
  const { basicPackage, fullPackage, extraServices } = serviceMenuData;

  // Basic package validation
  if (basicPackage.price <= 0) {
    errors.push({
      field: 'basicPackage.price',
      message: 'Basic service package must have a price greater than $0'
    });
  }

  if (basicPackage.includedServices.length === 0) {
    errors.push({
      field: 'basicPackage.services',
      message: 'Basic service package must include at least one service'
    });
  }

  // Full package validation
  if (fullPackage.price <= 0) {
    errors.push({
      field: 'fullPackage.price',
      message: 'Full service package must have a price greater than $0'
    });
  }

  if (fullPackage.includedServices.length === 0) {
    errors.push({
      field: 'fullPackage.services',
      message: 'Full service package must include at least one service'
    });
  }

  // Logical validation - full service should be more expensive than basic
  if (fullPackage.price <= basicPackage.price) {
    errors.push({
      field: 'fullPackage.price',
      message: 'Full service price should be higher than basic service price'
    });
  }

  // Validate that full service includes all basic services (recommended)
  const basicServiceIds = new Set(basicPackage.includedServices);
  const missingBasicServices = [...basicServiceIds].filter(
    serviceId => !fullPackage.includedServices.includes(serviceId)
  );

  if (missingBasicServices.length > 0) {
    errors.push({
      field: 'fullPackage.services',
      message: 'Full service package should include all services from the basic package'
    });
  }

  // Extra services validation
  extraServices.forEach((service, index) => {
    if (service.price <= 0) {
      errors.push({
        field: `extraServices.${index}.price`,
        message: `Extra service "${service.name}" must have a price greater than $0`
      });
    }

    if (!service.name.trim()) {
      errors.push({
        field: `extraServices.${index}.name`,
        message: 'Extra service must have a name'
      });
    }

    if (service.estimatedTime <= 0) {
      errors.push({
        field: `extraServices.${index}.estimatedTime`,
        message: `Extra service "${service.name}" must have an estimated time greater than 0 minutes`
      });
    }
  });

  // Check for duplicate services across packages and extras
  const extraServiceIds = extraServices.map(s => s.id);
  const duplicateInExtra = extraServiceIds.filter(id => 
    basicPackage.includedServices.includes(id) || fullPackage.includedServices.includes(id)
  );

  if (duplicateInExtra.length > 0) {
    errors.push({
      field: 'extraServices',
      message: 'Extra services should not duplicate services already included in packages'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateShopProfileForm(formData: Record<string, string | number>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields validation
  const requiredFields = [
    { field: 'shopName', message: 'Shop name is required' },
    { field: 'email', message: 'Business email is required' },
    { field: 'phone', message: 'Contact number is required' },
    { field: 'address', message: 'Street address is required' },
    { field: 'city', message: 'City/suburb is required' },
    { field: 'zipCode', message: 'Postcode is required' },
    { field: 'abn', message: 'ABN is required' },
    { field: 'bankAccount', message: 'Bank account details are required' }
  ];

  requiredFields.forEach(({ field, message }) => {
    const value = formData[field];
    if (!value || !String(value).trim()) {
      errors.push({ field, message });
    }
  });

  // Email validation
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email))) {
    errors.push({
      field: 'email',
      message: 'Please enter a valid email address'
    });
  }

  // Phone validation (basic)
  if (formData.phone && String(formData.phone).length < 10) {
    errors.push({
      field: 'phone',
      message: 'Please enter a valid phone number'
    });
  }

  // ABN validation (basic Australian format)
  if (formData.abn && !/^\d{2}\s?\d{3}\s?\d{3}\s?\d{3}$/.test(String(formData.abn).replace(/\s/g, ''))) {
    errors.push({
      field: 'abn',
      message: 'Please enter a valid ABN (11 digits)'
    });
  }

  // Postcode validation (Australian)
  if (formData.zipCode && !/^\d{4}$/.test(String(formData.zipCode))) {
    errors.push({
      field: 'zipCode',
      message: 'Please enter a valid 4-digit postcode'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getFieldError(errors: ValidationError[], fieldName: string): string | null {
  const error = errors.find(e => e.field === fieldName);
  return error ? error.message : null;
}

export function hasFieldError(errors: ValidationError[], fieldName: string): boolean {
  return errors.some(e => e.field === fieldName);
}

// Utility to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0
  }).format(amount);
}

// Real-time field validation utilities
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) return { isValid: true };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true };
}

export function validateAustralianPhone(phone: string): { isValid: boolean; message?: string } {
  if (!phone) return { isValid: true };
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Australian phone number patterns
  const mobilePattern = /^(04|\+614)\d{8}$/; // Mobile: 04XX XXX XXX or +614XX XXX XXX
  const landlinePattern = /^(0[2-8]|\+612[2-8])\d{8}$/; // Landline: 0X XXXX XXXX or +612X XXXX XXXX
  
  if (digits.length < 10) {
    return { isValid: false, message: 'Phone number must be at least 10 digits' };
  }
  
  if (!mobilePattern.test(digits) && !landlinePattern.test(digits)) {
    return { isValid: false, message: 'Please enter a valid Australian phone number' };
  }
  
  return { isValid: true };
}

export function validateAustralianPostcode(postcode: string): { isValid: boolean; message?: string } {
  if (!postcode) return { isValid: true };
  const postcodePattern = /^\d{4}$/;
  if (!postcodePattern.test(postcode)) {
    return { isValid: false, message: 'Please enter a valid 4-digit postcode' };
  }
  return { isValid: true };
}

export function validateWebsiteUrl(url: string): { isValid: boolean; message?: string } {
  if (!url) return { isValid: true };
  try {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      return { isValid: false, message: 'Please enter a valid website URL' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Please enter a valid website URL' };
  }
}

// Utility to validate pricing reasonableness
export function validatePricingReasonableness(serviceMenuData: ServiceMenuData): ValidationError[] {
  const warnings: ValidationError[] = [];
  
  const { basicPackage, fullPackage, extraServices } = serviceMenuData;

  // Check if prices are reasonable for automotive services
  if (basicPackage.price < 50) {
    warnings.push({
      field: 'basicPackage.price',
      message: 'Basic service price seems low for automotive service (typically $50-150)'
    });
  }

  if (basicPackage.price > 200) {
    warnings.push({
      field: 'basicPackage.price',
      message: 'Basic service price seems high (typically $50-150)'
    });
  }

  if (fullPackage.price < 100) {
    warnings.push({
      field: 'fullPackage.price',
      message: 'Full service price seems low for comprehensive service (typically $100-300)'
    });
  }

  if (fullPackage.price > 400) {
    warnings.push({
      field: 'fullPackage.price',
      message: 'Full service price seems high (typically $100-300)'
    });
  }

  // Check extra service pricing
  extraServices.forEach((service, index) => {
    if (service.price > 200 && !service.name.toLowerCase().includes('diagnostic')) {
      warnings.push({
        field: `extraServices.${index}.price`,
        message: `"${service.name}" price seems high for an individual service`
      });
    }

    if (service.price < 20) {
      warnings.push({
        field: `extraServices.${index}.price`,
        message: `"${service.name}" price seems low for professional service`
      });
    }
  });

  return warnings;
}
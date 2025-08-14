export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedTime: number; // minutes
  category: 'maintenance' | 'inspection' | 'repair' | 'specialty' | 'tires' | 'fluids';
  isCustom: boolean;
  icon?: string;
}

export interface ServicePackage {
  id: 'basic' | 'full';
  name: string;
  description: string;
  includedServices: string[]; // service IDs
  price: number;
  estimatedTime: number;
}

export interface ExtraService extends Service {
  price: number;
  standalone: true;
}

export interface ServiceMenuData {
  basicPackage: ServicePackage;
  fullPackage: ServicePackage;
  extraServices: ExtraService[];
  customServices: Service[];
}

// Comprehensive automotive service library
export const SERVICE_LIBRARY: Service[] = [
  // Maintenance Services
  {
    id: 'oil-change',
    name: 'Oil Change',
    description: 'Engine oil and filter replacement',
    estimatedTime: 30,
    category: 'maintenance',
    isCustom: false,
    icon: '🛢️'
  },
  {
    id: 'air-filter',
    name: 'Air Filter Replacement',
    description: 'Replace engine air filter',
    estimatedTime: 15,
    category: 'maintenance',
    isCustom: false,
    icon: '🌪️'
  },
  {
    id: 'cabin-filter',
    name: 'Cabin Filter Replacement',
    description: 'Replace cabin air filter',
    estimatedTime: 20,
    category: 'maintenance',
    isCustom: false,
    icon: '❄️'
  },
  {
    id: 'spark-plugs',
    name: 'Spark Plug Replacement',
    description: 'Replace spark plugs',
    estimatedTime: 60,
    category: 'maintenance',
    isCustom: false,
    icon: '⚡'
  },

  // Inspection Services
  {
    id: 'visual-inspection',
    name: 'Visual Inspection',
    description: 'General visual inspection of vehicle components',
    estimatedTime: 15,
    category: 'inspection',
    isCustom: false,
    icon: '👁️'
  },
  {
    id: 'brake-inspection',
    name: 'Brake System Inspection',
    description: 'Inspect brake pads, rotors, and brake fluid',
    estimatedTime: 30,
    category: 'inspection',
    isCustom: false,
    icon: '🛑'
  },
  {
    id: 'suspension-check',
    name: 'Suspension Check',
    description: 'Inspect shocks, struts, and suspension components',
    estimatedTime: 25,
    category: 'inspection',
    isCustom: false,
    icon: '🔧'
  },
  {
    id: 'battery-test',
    name: 'Battery Test',
    description: 'Test battery voltage and charging system',
    estimatedTime: 15,
    category: 'inspection',
    isCustom: false,
    icon: '🔋'
  },
  {
    id: 'belt-hose-inspection',
    name: 'Belt & Hose Inspection',
    description: 'Check condition of belts and hoses',
    estimatedTime: 20,
    category: 'inspection',
    isCustom: false,
    icon: '🔗'
  },
  {
    id: 'exhaust-inspection',
    name: 'Exhaust System Inspection',
    description: 'Check exhaust system for leaks and damage',
    estimatedTime: 20,
    category: 'inspection',
    isCustom: false,
    icon: '💨'
  },

  // Fluid Services
  {
    id: 'brake-fluid-check',
    name: 'Brake Fluid Check',
    description: 'Check brake fluid level and condition',
    estimatedTime: 10,
    category: 'fluids',
    isCustom: false,
    icon: '🟡'
  },
  {
    id: 'coolant-check',
    name: 'Coolant Level Check',
    description: 'Check coolant level and condition',
    estimatedTime: 10,
    category: 'fluids',
    isCustom: false,
    icon: '🧊'
  },
  {
    id: 'transmission-fluid',
    name: 'Transmission Fluid Check',
    description: 'Check transmission fluid level and condition',
    estimatedTime: 15,
    category: 'fluids',
    isCustom: false,
    icon: '⚙️'
  },
  {
    id: 'power-steering-fluid',
    name: 'Power Steering Fluid Check',
    description: 'Check power steering fluid level',
    estimatedTime: 10,
    category: 'fluids',
    isCustom: false,
    icon: '🔄'
  },
  {
    id: 'windshield-washer',
    name: 'Windshield Washer Fluid Top-up',
    description: 'Top up windshield washer fluid',
    estimatedTime: 5,
    category: 'fluids',
    isCustom: false,
    icon: '🪟'
  },

  // Tire Services
  {
    id: 'tire-rotation',
    name: 'Tire Rotation',
    description: 'Rotate tires according to manufacturer specifications',
    estimatedTime: 30,
    category: 'tires',
    isCustom: false,
    icon: '🔄'
  },
  {
    id: 'tire-pressure-check',
    name: 'Tire Pressure Check',
    description: 'Check and adjust tire pressure',
    estimatedTime: 10,
    category: 'tires',
    isCustom: false,
    icon: '📊'
  },
  {
    id: 'tire-inspection',
    name: 'Tire Inspection',
    description: 'Inspect tire tread depth and condition',
    estimatedTime: 15,
    category: 'tires',
    isCustom: false,
    icon: '🔍'
  },
  {
    id: 'wheel-balance',
    name: 'Wheel Balancing',
    description: 'Balance wheels to prevent vibration',
    estimatedTime: 45,
    category: 'tires',
    isCustom: false,
    icon: '⚖️'
  },

  // Repair Services (commonly offered)
  {
    id: 'brake-pad-replacement',
    name: 'Brake Pad Replacement',
    description: 'Replace worn brake pads',
    estimatedTime: 90,
    category: 'repair',
    isCustom: false,
    icon: '🛠️'
  },
  {
    id: 'light-bulb-replacement',
    name: 'Light Bulb Replacement',
    description: 'Replace headlights, taillights, or turn signals',
    estimatedTime: 20,
    category: 'repair',
    isCustom: false,
    icon: '💡'
  },
  {
    id: 'wiper-blade-replacement',
    name: 'Wiper Blade Replacement',
    description: 'Replace windshield wiper blades',
    estimatedTime: 15,
    category: 'repair',
    isCustom: false,
    icon: '🌧️'
  },

  // Specialty Services
  {
    id: 'computer-diagnostic',
    name: 'Computer Diagnostic Scan',
    description: 'Scan for diagnostic trouble codes',
    estimatedTime: 30,
    category: 'specialty',
    isCustom: false,
    icon: '💻'
  },
  {
    id: 'emissions-test',
    name: 'Emissions Test',
    description: 'Test vehicle emissions compliance',
    estimatedTime: 20,
    category: 'specialty',
    isCustom: false,
    icon: '🌱'
  }
];

// Default service packages
export const DEFAULT_BASIC_PACKAGE: ServicePackage = {
  id: 'basic',
  name: 'Basic Service',
  description: 'Essential maintenance to keep your vehicle running smoothly',
  includedServices: [
    'oil-change',
    'visual-inspection',
    'tire-pressure-check',
    'brake-fluid-check',
    'coolant-check',
    'windshield-washer'
  ],
  price: 89,
  estimatedTime: 90
};

export const DEFAULT_FULL_PACKAGE: ServicePackage = {
  id: 'full',
  name: 'Full Service',
  description: 'Comprehensive inspection and maintenance service',
  includedServices: [
    'oil-change',
    'air-filter',
    'cabin-filter',
    'visual-inspection',
    'brake-inspection',
    'suspension-check',
    'battery-test',
    'belt-hose-inspection',
    'exhaust-inspection',
    'tire-inspection',
    'tire-pressure-check',
    'brake-fluid-check',
    'coolant-check',
    'transmission-fluid',
    'power-steering-fluid',
    'windshield-washer'
  ],
  price: 159,
  estimatedTime: 180
};

// Common extra services with default pricing
export const DEFAULT_EXTRA_SERVICES: ExtraService[] = [
  {
    id: 'tire-rotation',
    name: 'Tire Rotation',
    description: 'Rotate tires according to manufacturer specifications',
    estimatedTime: 30,
    category: 'tires',
    isCustom: false,
    icon: '🔄',
    price: 49,
    standalone: true
  },
  {
    id: 'wheel-balance',
    name: 'Wheel Balancing',
    description: 'Balance wheels to prevent vibration',
    estimatedTime: 45,
    category: 'tires',
    isCustom: false,
    icon: '⚖️',
    price: 75,
    standalone: true
  },
  {
    id: 'computer-diagnostic',
    name: 'Computer Diagnostic Scan',
    description: 'Scan for diagnostic trouble codes',
    estimatedTime: 30,
    category: 'specialty',
    isCustom: false,
    icon: '💻',
    price: 89,
    standalone: true
  }
];

// Utility functions
export function getServiceById(id: string): Service | undefined {
  return SERVICE_LIBRARY.find(service => service.id === id);
}

export function getServicesByCategory(category: Service['category']): Service[] {
  return SERVICE_LIBRARY.filter(service => service.category === category);
}

export function calculatePackageTime(serviceIds: string[]): number {
  return serviceIds.reduce((total, id) => {
    const service = getServiceById(id);
    return total + (service?.estimatedTime || 0);
  }, 0);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
}

export const SERVICE_CATEGORIES = [
  { id: 'maintenance', name: 'Maintenance', icon: '🔧', color: 'blue' },
  { id: 'inspection', name: 'Inspection', icon: '🔍', color: 'amber' },
  { id: 'fluids', name: 'Fluids', icon: '🟡', color: 'emerald' },
  { id: 'tires', name: 'Tires', icon: '⚙️', color: 'slate' },
  { id: 'repair', name: 'Repair', icon: '🛠️', color: 'orange' },
  { id: 'specialty', name: 'Specialty', icon: '⭐', color: 'purple' }
] as const;
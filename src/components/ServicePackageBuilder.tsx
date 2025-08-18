"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Clock,
  DollarSign,
  Package,
  Wrench,
  Check,
  X,
  Search,
  Info,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import {
  Service,
  ServicePackage,
  ExtraService,
  ServiceMenuData,
  SERVICE_LIBRARY,
  DEFAULT_BASIC_PACKAGE,
  DEFAULT_FULL_PACKAGE,
  DEFAULT_EXTRA_SERVICES,
  SERVICE_CATEGORIES,
  getServiceById,
  calculatePackageTime,
  formatDuration
} from '@/lib/services';
import { validateServiceMenu, validatePricingReasonableness, ValidationError } from '@/lib/validation';

interface ServicePackageBuilderProps {
  initialData?: ServiceMenuData;
  onDataChange: (data: ServiceMenuData) => void;
}

export function ServicePackageBuilder({ initialData, onDataChange }: ServicePackageBuilderProps) {
  const [serviceMenuData, setServiceMenuData] = useState<ServiceMenuData>({
    basicPackage: initialData?.basicPackage || DEFAULT_BASIC_PACKAGE,
    fullPackage: initialData?.fullPackage || DEFAULT_FULL_PACKAGE,
    extraServices: initialData?.extraServices || DEFAULT_EXTRA_SERVICES,
    customServices: initialData?.customServices || []
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'full' | 'extra'>('basic');
  const [showServiceLibrary, setShowServiceLibrary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingCustomService, setIsCreatingCustomService] = useState(false);
  const [customServiceForm, setCustomServiceForm] = useState({
    name: '',
    description: '',
    estimatedTime: 30,
    category: 'maintenance' as Service['category'],
    price: 0
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  // Update parent when data changes
  useEffect(() => {
    onDataChange(serviceMenuData);
    
    // Validate on data change
    if (showValidation) {
      const validation = validateServiceMenu(serviceMenuData);
      const warnings = validatePricingReasonableness(serviceMenuData);
      setValidationErrors([...validation.errors, ...warnings]);
    }
  }, [serviceMenuData, onDataChange, showValidation]);

  // Filter services for library display
  const filteredServices = SERVICE_LIBRARY.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleServiceInPackage = (serviceId: string, packageType: 'basic' | 'full') => {
    setServiceMenuData(prev => {
      const packageData = prev[`${packageType}Package`];
      const isIncluded = packageData.includedServices.includes(serviceId);
      
      const newIncludedServices = isIncluded
        ? packageData.includedServices.filter(id => id !== serviceId)
        : [...packageData.includedServices, serviceId];

      const newEstimatedTime = calculatePackageTime(newIncludedServices);

      return {
        ...prev,
        [`${packageType}Package`]: {
          ...packageData,
          includedServices: newIncludedServices,
          estimatedTime: newEstimatedTime
        }
      };
    });
  };

  const updatePackagePrice = (packageType: 'basic' | 'full', price: number) => {
    setServiceMenuData(prev => ({
      ...prev,
      [`${packageType}Package`]: {
        ...prev[`${packageType}Package`],
        price
      }
    }));
  };

  const getPriceFeedback = (packageType: 'basic' | 'full', price: number) => {
    const warnings = validatePricingReasonableness({
      ...serviceMenuData,
      [`${packageType}Package`]: {
        ...serviceMenuData[`${packageType}Package`],
        price
      }
    });
    
    const relevantWarning = warnings.find(w => w.field === `${packageType}Package.price`);
    
    if (!relevantWarning) {
      if (packageType === 'basic' && price >= 50 && price <= 200) {
        return { type: 'good', message: 'This price is competitive for your area', icon: <TrendingUp className="h-3 w-3" /> };
      } else if (packageType === 'full' && price >= 100 && price <= 400) {
        return { type: 'good', message: 'This price is competitive for your area', icon: <TrendingUp className="h-3 w-3" /> };
      }
    }
    
    if (relevantWarning) {
      if (relevantWarning.message.includes('low')) {
        return { type: 'warning', message: 'Note: This price is lower than the average', icon: <TrendingDown className="h-3 w-3" /> };
      } else if (relevantWarning.message.includes('high')) {
        return { type: 'warning', message: 'Note: This price is higher than the average', icon: <AlertTriangle className="h-3 w-3" /> };
      }
    }
    
    return null;
  };

  const addExtraService = (service: Service, price: number) => {
    const extraService: ExtraService = {
      ...service,
      price,
      standalone: true
    };

    setServiceMenuData(prev => ({
      ...prev,
      extraServices: [...prev.extraServices, extraService]
    }));
  };

  const removeExtraService = (serviceId: string) => {
    setServiceMenuData(prev => ({
      ...prev,
      extraServices: prev.extraServices.filter(service => service.id !== serviceId)
    }));
  };

  const updateExtraServicePrice = (serviceId: string, price: number) => {
    setServiceMenuData(prev => ({
      ...prev,
      extraServices: prev.extraServices.map(service =>
        service.id === serviceId ? { ...service, price } : service
      )
    }));
  };

  const createCustomService = () => {
    if (!customServiceForm.name.trim()) return;

    const customService: Service = {
      id: `custom-${Date.now()}`,
      name: customServiceForm.name,
      description: customServiceForm.description,
      estimatedTime: customServiceForm.estimatedTime,
      category: customServiceForm.category,
      isCustom: true
    };

    setServiceMenuData(prev => ({
      ...prev,
      customServices: [...prev.customServices, customService]
    }));

    // Reset form
    setCustomServiceForm({
      name: '',
      description: '',
      estimatedTime: 30,
      category: 'maintenance',
      price: 0
    });
    setIsCreatingCustomService(false);
  };

  const ServiceLibraryModal = () => {
    if (!showServiceLibrary) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-800">Service Library</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowServiceLibrary(false)}
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search and Filter */}
            <div className="flex gap-4 mt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Categories</option>
                {SERVICE_CATEGORIES.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map(service => {
                const isInBasic = serviceMenuData.basicPackage.includedServices.includes(service.id);
                const isInFull = serviceMenuData.fullPackage.includedServices.includes(service.id);
                const isExtraService = serviceMenuData.extraServices.some(s => s.id === service.id);

                return (
                  <Card key={service.id} className="border border-slate-200 hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{service.icon}</span>
                            <h4 className="font-semibold text-slate-800">{service.name}</h4>
                            <div className="group relative">
                              <Info className="h-3 w-3 text-slate-400 cursor-help" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64">
                                <p className="font-medium mb-1">How customers see this service:</p>
                                <p className="text-slate-200">&ldquo;{service.description}&rdquo;</p>
                                <div className="text-slate-300 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Estimated: {formatDuration(service.estimatedTime)}
                                  </span>
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800"></div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{service.description}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(service.estimatedTime)}
                            </span>
                            <span className="px-2 py-1 bg-slate-100 rounded-full capitalize">
                              {service.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {activeTab === 'basic' && (
                          <Button
                            size="sm"
                            variant={isInBasic ? "default" : "outline"}
                            onClick={() => toggleServiceInPackage(service.id, 'basic')}
                            className="text-xs"
                          >
                            {isInBasic ? <Check className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                            Basic
                          </Button>
                        )}
                        
                        {activeTab === 'full' && (
                          <Button
                            size="sm"
                            variant={isInFull ? "default" : "outline"}
                            onClick={() => toggleServiceInPackage(service.id, 'full')}
                            className="text-xs"
                          >
                            {isInFull ? <Check className="h-3 w-3 mr-1" /> : <Plus className="h-3 w-3 mr-1" />}
                            Full
                          </Button>
                        )}
                        
                        {activeTab === 'extra' && !isExtraService && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const price = prompt(`Set price for ${service.name}:`, '50');
                              if (price && !isNaN(Number(price))) {
                                addExtraService(service, Number(price));
                              }
                            }}
                            className="text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Extra
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Custom Service Creation */}
            <Card className="mt-6 border-2 border-dashed border-slate-300">
              <CardContent className="p-4">
                {!isCreatingCustomService ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingCustomService(true)}
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Custom Service
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Service name"
                        value={customServiceForm.name}
                        onChange={(e) => setCustomServiceForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <select
                        value={customServiceForm.category}
                        onChange={(e) => setCustomServiceForm(prev => ({ ...prev, category: e.target.value as Service['category'] }))}
                        className="px-3 py-2 border border-slate-200 rounded-lg"
                      >
                        {SERVICE_CATEGORIES.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      placeholder="Description"
                      value={customServiceForm.description}
                      onChange={(e) => setCustomServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-slate-600">Estimated Time (minutes)</label>
                        <Input
                          type="number"
                          value={customServiceForm.estimatedTime}
                          onChange={(e) => setCustomServiceForm(prev => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                        />
                      </div>
                      {activeTab === 'extra' && (
                        <div>
                          <label className="text-sm text-slate-600">Price ($)</label>
                          <Input
                            type="number"
                            value={customServiceForm.price}
                            onChange={(e) => setCustomServiceForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={createCustomService}
                        disabled={!customServiceForm.name.trim()}
                        className="flex-1"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Create Service
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatingCustomService(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  };

  const getValidationErrors = (field: string) => {
    return validationErrors.filter(error => error.field.includes(field));
  };

  const validateAndToggleDisplay = () => {
    const validation = validateServiceMenu(serviceMenuData);
    const warnings = validatePricingReasonableness(serviceMenuData);
    setValidationErrors([...validation.errors, ...warnings]);
    setShowValidation(!showValidation);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex">
          {[
            { id: 'basic', label: 'Basic Service', icon: Package },
            { id: 'full', label: 'Full Service', icon: Wrench },
            { id: 'extra', label: 'Extra Services', icon: Plus }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {getValidationErrors(tab.id).length > 0 && (
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={validateAndToggleDisplay}
          className={`${
            validationErrors.length > 0 
              ? 'border-amber-200 text-amber-700 hover:bg-amber-50' 
              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          {showValidation ? 'Hide' : 'Show'} Validation
          {validationErrors.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
              {validationErrors.length}
            </span>
          )}
        </Button>
      </div>

      {/* Validation Panel */}
      {showValidation && (
        <Card className={`${
          validationErrors.length > 0 
            ? 'border-amber-200 bg-amber-50/50' 
            : 'border-emerald-200 bg-emerald-50/50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              {validationErrors.length > 0 ? (
                <>
                  <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <h4 className="font-semibold text-amber-800">Validation Issues</h4>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <h4 className="font-semibold text-emerald-800">All validations passed!</h4>
                </>
              )}
            </div>
            
            {validationErrors.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-amber-700">
                    • {error.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-emerald-700">
                Your service menu configuration looks good and ready for customers!
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Package Content */}
      {(activeTab === 'basic' || activeTab === 'full') && (
        <PackageEditor
          package={serviceMenuData[`${activeTab}Package`]}
          onPriceChange={(price) => updatePackagePrice(activeTab, price)}
          onToggleService={(serviceId) => toggleServiceInPackage(serviceId, activeTab)}
          onShowLibrary={() => setShowServiceLibrary(true)}
          getPriceFeedback={(price) => getPriceFeedback(activeTab, price)}
        />
      )}

      {activeTab === 'extra' && (
        <ExtraServicesEditor
          extraServices={serviceMenuData.extraServices}
          onPriceChange={updateExtraServicePrice}
          onRemoveService={removeExtraService}
          onShowLibrary={() => setShowServiceLibrary(true)}
        />
      )}

      <ServiceLibraryModal />
    </div>
  );
}

// Package Editor Component
interface PackageEditorProps {
  package: ServicePackage;
  onPriceChange: (price: number) => void;
  onToggleService: (serviceId: string) => void;
  onShowLibrary: () => void;
  getPriceFeedback?: (price: number) => { type: string; message: string; icon: React.ReactNode } | null;
}

function PackageEditor({ package: pkg, onPriceChange, onToggleService, onShowLibrary, getPriceFeedback }: PackageEditorProps) {
  const includedServices = pkg.includedServices.map(id => getServiceById(id)).filter(Boolean) as Service[];

  return (
    <div className="space-y-6">
      {/* Package Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border border-blue-200/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
              <p className="text-slate-600 mb-4">{pkg.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(pkg.estimatedTime)}
                </span>
                <span>{pkg.includedServices.length} services included</span>
              </div>
            </div>
            <div className="text-right">
              <label className="block text-sm font-medium text-slate-700 mb-2">Package Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  value={pkg.price}
                  onChange={(e) => onPriceChange(Number(e.target.value))}
                  className={`pl-8 w-32 text-lg font-semibold ${
                    pkg.price <= 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                  min="1"
                />
              </div>
              {pkg.price > 0 && getPriceFeedback && (() => {
                const feedback = getPriceFeedback(pkg.price);
                if (feedback) {
                  return (
                    <div className={`flex items-center gap-1 mt-2 text-xs ${
                      feedback.type === 'good' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {feedback.icon}
                      <span>{feedback.message}</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Included Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Included Services</CardTitle>
            <Button
              variant="outline"
              onClick={onShowLibrary}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Services
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {includedServices.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No services added yet</p>
              <p className="text-sm">Click &ldquo;Add Services&rdquo; to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {includedServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onRemove={() => onToggleService(service.id)}
                  showPrice={false}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Extra Services Editor Component
interface ExtraServicesEditorProps {
  extraServices: ExtraService[];
  onPriceChange: (serviceId: string, price: number) => void;
  onRemoveService: (serviceId: string) => void;
  onShowLibrary: () => void;
}

function ExtraServicesEditor({ extraServices, onPriceChange, onRemoveService, onShowLibrary }: ExtraServicesEditorProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Extra Services</h3>
              <p className="text-slate-600">Individual services customers can add to their booking</p>
            </div>
            <Button
              onClick={onShowLibrary}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Extra Service
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Extra Services List */}
      <Card>
        <CardContent className="p-6">
          {extraServices.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Wrench className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No extra services added yet</p>
              <p className="text-sm">Add services that customers can book individually</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extraServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  price={service.price}
                  onPriceChange={(price) => onPriceChange(service.id, price)}
                  onRemove={() => onRemoveService(service.id)}
                  showPrice={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Service Card Component
interface ServiceCardProps {
  service: Service;
  price?: number;
  onPriceChange?: (price: number) => void;
  onRemove: () => void;
  showPrice: boolean;
}

function ServiceCard({ service, price, onPriceChange, onRemove, showPrice }: ServiceCardProps) {
  return (
    <Card className="border border-slate-200 hover:shadow-md transition-all group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{service.icon || '🔧'}</span>
              <h4 className="font-semibold text-slate-800">{service.name}</h4>
            </div>
            <p className="text-sm text-slate-600 mb-2">{service.description}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(service.estimatedTime)}
              </span>
              <span className="px-2 py-1 bg-slate-100 rounded-full capitalize">
                {service.category}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {showPrice && (
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-slate-400" />
            <Input
              type="number"
              value={price || 0}
              onChange={(e) => onPriceChange?.(Number(e.target.value))}
              className="w-24 h-8 text-sm"
              placeholder="0"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
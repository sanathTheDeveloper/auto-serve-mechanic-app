"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  AlertTriangle,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  ServiceMenuData,
  ServicePackage,
  ExtraService,
  Service,
  PricingModel,
  ServicePricing,
  SERVICE_LIBRARY,
  SERVICE_CATEGORIES,
  DEFAULT_BASIC_PACKAGE,
  DEFAULT_FULL_PACKAGE,
  DEFAULT_EXTRA_SERVICES,
  getServiceById,
  calculatePackageTime,
  formatDuration,
  formatServicePricing,
  createDefaultPricing
} from '@/lib/services';
import { validatePricingReasonableness } from '@/lib/validation';

interface ServiceMenuManagerProps {
  initialData?: Partial<ServiceMenuData>;
  onDataChange?: (data: ServiceMenuData) => void;
}

export function ServiceMenuManager({ initialData, onDataChange }: ServiceMenuManagerProps) {
  const [serviceMenuData, setServiceMenuData] = useState<ServiceMenuData>({
    basicPackage: initialData?.basicPackage || DEFAULT_BASIC_PACKAGE,
    fullPackage: initialData?.fullPackage || DEFAULT_FULL_PACKAGE,
    extraServices: initialData?.extraServices || DEFAULT_EXTRA_SERVICES,
    customServices: initialData?.customServices || []
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'full' | 'extra' | 'custom'>('basic');
  const [showServiceLibrary, setShowServiceLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showValidation, setShowValidation] = useState(false);

  // Custom service form state
  const [customServiceForm, setCustomServiceForm] = useState({
    name: '',
    description: '',
    estimatedTime: 30,
    category: 'maintenance' as Service['category'],
    pricing: createDefaultPricing('fixed')
  });

  // Update parent component when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(serviceMenuData);
    }
  }, [serviceMenuData, onDataChange]);

  // Calculate package times dynamically
  useEffect(() => {
    const basicTime = calculatePackageTime(serviceMenuData.basicPackage.includedServices);
    const fullTime = calculatePackageTime(serviceMenuData.fullPackage.includedServices);

    setServiceMenuData(prev => ({
      ...prev,
      basicPackage: { ...prev.basicPackage, estimatedTime: basicTime },
      fullPackage: { ...prev.fullPackage, estimatedTime: fullTime }
    }));
  }, [serviceMenuData.basicPackage.includedServices, serviceMenuData.fullPackage.includedServices]);

  const updatePackagePrice = (packageType: 'basic' | 'full', price: number) => {
    setServiceMenuData(prev => ({
      ...prev,
      [`${packageType}Package`]: {
        ...prev[`${packageType}Package`],
        price
      }
    }));
  };

  const toggleServiceInPackage = (serviceId: string, packageType: 'basic' | 'full') => {
    setServiceMenuData(prev => {
      const pkg = prev[`${packageType}Package`];
      const isIncluded = pkg.includedServices.includes(serviceId);
      const newIncludedServices = isIncluded
        ? pkg.includedServices.filter(id => id !== serviceId)
        : [...pkg.includedServices, serviceId];

      return {
        ...prev,
        [`${packageType}Package`]: {
          ...pkg,
          includedServices: newIncludedServices
        }
      };
    });
  };

  const addExtraService = (service: Service, pricing: ServicePricing) => {
    const extraService: ExtraService = {
      ...service,
      pricing,
      standalone: true
    };

    setServiceMenuData(prev => ({
      ...prev,
      extraServices: [...prev.extraServices, extraService]
    }));
  };

  const updateExtraServicePricing = (serviceId: string, pricing: ServicePricing) => {
    setServiceMenuData(prev => ({
      ...prev,
      extraServices: prev.extraServices.map(service =>
        service.id === serviceId ? { ...service, pricing } : service
      )
    }));
  };

  const removeExtraService = (serviceId: string) => {
    setServiceMenuData(prev => ({
      ...prev,
      extraServices: prev.extraServices.filter(service => service.id !== serviceId)
    }));
  };

  const addCustomService = () => {
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
      pricing: createDefaultPricing('fixed')
    });
  };

  const removeCustomService = (serviceId: string) => {
    setServiceMenuData(prev => ({
      ...prev,
      customServices: prev.customServices.filter(service => service.id !== serviceId)
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

  const filteredServices = SERVICE_LIBRARY.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const validationErrors = validatePricingReasonableness(serviceMenuData);

  const renderPricingInputs = (pricing: ServicePricing, onPricingChange: (pricing: ServicePricing) => void) => {
    return (
      <div className="space-y-4">
        {/* Pricing Model Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Pricing Model</label>
          <Select
            value={pricing.model}
            onValueChange={(value) => onPricingChange(createDefaultPricing(value as PricingModel))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pricing model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Price</SelectItem>
              <SelectItem value="range">Price Range</SelectItem>
              <SelectItem value="starts-at">Starts At</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pricing Inputs Based on Model */}
        {pricing.model === 'fixed' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="number"
                value={pricing.fixed || ''}
                onChange={(e) => onPricingChange({ ...pricing, fixed: Number(e.target.value) })}
                className="pl-8"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        )}

        {pricing.model === 'range' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  value={pricing.min || ''}
                  onChange={(e) => onPricingChange({ ...pricing, min: Number(e.target.value) })}
                  className="pl-8"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="number"
                  value={pricing.max || ''}
                  onChange={(e) => onPricingChange({ ...pricing, max: Number(e.target.value) })}
                  className="pl-8"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {pricing.model === 'starts-at' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Starting Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-slate-400">From $</span>
              <Input
                type="number"
                value={pricing.startsAt || ''}
                onChange={(e) => onPricingChange({ ...pricing, startsAt: Number(e.target.value) })}
                className="pl-16"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPackageEditor = (pkg: ServicePackage, packageType: 'basic' | 'full') => {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                {pkg.name}
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">{pkg.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-slate-700">
                  {formatDuration(pkg.estimatedTime)}
                </span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {pkg.includedServices.length} services
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Package Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Package Price</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="number"
                value={pkg.price}
                onChange={(e) => updatePackagePrice(packageType, Number(e.target.value))}
                className={`pl-8 text-lg font-semibold ${
                  pkg.price <= 0 ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                min="1"
              />
            </div>
            {pkg.price > 0 && (() => {
              const feedback = getPriceFeedback(packageType, pkg.price);
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

          {/* Included Services */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800">Included Services</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowServiceLibrary(true)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Services
              </Button>
            </div>

            {pkg.includedServices.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                <Wrench className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500 mb-2">No services added yet</p>
                <p className="text-sm text-slate-400">Click &ldquo;Add Services&rdquo; to get started</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {pkg.includedServices.map((serviceId) => {
                  const service = getServiceById(serviceId);
                  if (!service) return null;
                  
                  const category = SERVICE_CATEGORIES.find(cat => cat.id === service.category);
                  
                  return (
                    <Card key={serviceId} className="border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-lg">{service.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
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
                              <p className="text-sm text-slate-600">{service.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(service.estimatedTime)}
                                </span>
                                {category && (
                                  <Badge variant="outline" className="text-xs">
                                    {category.name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleServiceInPackage(serviceId, packageType)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderExtraServices = () => {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-amber-500" />
                Extra Services
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Additional services offered as standalone options
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowServiceLibrary(true)}
              className="text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceMenuData.extraServices.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 mb-2">No extra services added yet</p>
              <p className="text-sm text-slate-400">Add standalone services customers can book separately</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {serviceMenuData.extraServices.map((service) => {
                const category = SERVICE_CATEGORIES.find(cat => cat.id === service.category);
                
                return (
                  <Card key={service.id} className="border border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-lg">{service.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
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
                            <p className="text-sm text-slate-600 mb-3">{service.description}</p>
                            
                            {/* Pricing Configuration */}
                            <div className="space-y-3">
                              {renderPricingInputs(service.pricing, (pricing) => updateExtraServicePricing(service.id, pricing))}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(service.estimatedTime)}
                              </span>
                              {category && (
                                <Badge variant="outline" className="text-xs">
                                  {category.name}
                                </Badge>
                              )}
                              <Badge className="bg-amber-100 text-amber-800 text-xs">
                                {formatServicePricing(service.pricing)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExtraService(service.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCustomServices = () => {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Plus className="h-5 w-5 text-emerald-500" />
                Custom Services
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Create custom services unique to your shop
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Create Custom Service Form */}
          <Card className="border border-emerald-200 bg-emerald-50/30">
            <CardContent className="p-4">
              <h4 className="font-semibold text-slate-800 mb-4">Create New Custom Service</h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service Name *</label>
                    <Input
                      placeholder="e.g., Custom Engine Diagnostic"
                      value={customServiceForm.name}
                      onChange={(e) => setCustomServiceForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <Select
                      value={customServiceForm.category}
                      onValueChange={(value) => setCustomServiceForm(prev => ({ ...prev, category: value as Service['category'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <Input
                    placeholder="Detailed description of the service"
                    value={customServiceForm.description}
                    onChange={(e) => setCustomServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Duration (minutes) *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="number"
                      placeholder="30"
                      value={customServiceForm.estimatedTime}
                      onChange={(e) => setCustomServiceForm(prev => ({ ...prev, estimatedTime: Number(e.target.value) }))}
                      className="pl-8"
                      min="1"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={addCustomService}
                  disabled={!customServiceForm.name.trim() || customServiceForm.estimatedTime <= 0}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Service
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Services List */}
          {serviceMenuData.customServices.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
              <Plus className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 mb-2">No custom services created yet</p>
              <p className="text-sm text-slate-400">Create services specific to your expertise</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {serviceMenuData.customServices.map((service) => {
                const category = SERVICE_CATEGORIES.find(cat => cat.id === service.category);
                
                return (
                  <Card key={service.id} className="border border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-slate-800">{service.name}</h4>
                            <Badge className="bg-emerald-100 text-emerald-800 text-xs">Custom</Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{service.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(service.estimatedTime)}
                            </span>
                            {category && (
                              <Badge variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomService(service.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderServiceLibrary = () => {
    if (!showServiceLibrary) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-slate-800">Service Library</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Choose services to add to your packages or as extra services
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowServiceLibrary(false)}
                className="text-slate-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Services Grid */}
            <div className="grid gap-3">
              {filteredServices.map((service) => {
                const category = SERVICE_CATEGORIES.find(cat => cat.id === service.category);
                const isInBasic = serviceMenuData.basicPackage.includedServices.includes(service.id);
                const isInFull = serviceMenuData.fullPackage.includedServices.includes(service.id);
                const isExtra = serviceMenuData.extraServices.some(es => es.id === service.id);
                
                return (
                  <Card key={service.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-lg">{service.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
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
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDuration(service.estimatedTime)}
                              </span>
                              {category && (
                                <Badge variant="outline" className="text-xs">
                                  {category.name}
                                </Badge>
                              )}
                              {(isInBasic || isInFull || isExtra) && (
                                <div className="flex gap-1">
                                  {isInBasic && <Badge className="bg-blue-100 text-blue-800 text-xs">Basic</Badge>}
                                  {isInFull && <Badge className="bg-purple-100 text-purple-800 text-xs">Full</Badge>}
                                  {isExtra && <Badge className="bg-amber-100 text-amber-800 text-xs">Extra</Badge>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {activeTab === 'basic' && (
                            <Button
                              size="sm"
                              variant={isInBasic ? "default" : "outline"}
                              onClick={() => toggleServiceInPackage(service.id, 'basic')}
                              className={isInBasic ? "bg-blue-500 hover:bg-blue-600" : "border-blue-200 text-blue-600 hover:bg-blue-50"}
                            >
                              {isInBasic ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          )}
                          {activeTab === 'full' && (
                            <Button
                              size="sm"
                              variant={isInFull ? "default" : "outline"}
                              onClick={() => toggleServiceInPackage(service.id, 'full')}
                              className={isInFull ? "bg-purple-500 hover:bg-purple-600" : "border-purple-200 text-purple-600 hover:bg-purple-50"}
                            >
                              {isInFull ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          )}
                          {activeTab === 'extra' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (!isExtra) {
                                  addExtraService(service, createDefaultPricing('fixed'));
                                }
                              }}
                              disabled={isExtra}
                              className="border-amber-200 text-amber-600 hover:bg-amber-50"
                            >
                              {isExtra ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Validation Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
            Service Menu Customization
          </h2>
          <p className="text-slate-600 mt-1">
            Configure your service packages, pricing, and offerings
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowValidation(!showValidation)}
            className={`border-amber-200 ${
              validationErrors.length > 0 ? 'text-amber-600' : 'text-slate-600'
            }`}
          >
            {showValidation ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            Validation
            {validationErrors.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                {validationErrors.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Validation Panel */}
      {showValidation && (
        <Card className={`${
          validationErrors.length > 0 
            ? 'border-amber-200 bg-amber-50/50' 
            : 'border-emerald-200 bg-emerald-50/50'
        }`}>
          <CardContent className="p-4">
            <h3 className={`font-semibold mb-3 ${
              validationErrors.length > 0 ? 'text-amber-800' : 'text-emerald-800'
            }`}>
              Pricing Validation
            </h3>
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

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white/90 backdrop-blur-sm rounded-t-xl">
        {[
          { id: 'basic', label: 'Basic Package', icon: Package, color: 'blue' },
          { id: 'full', label: 'Full Package', icon: Package, color: 'purple' },
          { id: 'extra', label: 'Extra Services', icon: Wrench, color: 'amber' },
          { id: 'custom', label: 'Custom Services', icon: Plus, color: 'emerald' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
              activeTab === tab.id
                ? `border-b-2 border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50/50`
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'basic' && renderPackageEditor(serviceMenuData.basicPackage, 'basic')}
      {activeTab === 'full' && renderPackageEditor(serviceMenuData.fullPackage, 'full')}
      {activeTab === 'extra' && renderExtraServices()}
      {activeTab === 'custom' && renderCustomServices()}

      {/* Service Library Modal */}
      {renderServiceLibrary()}
    </div>
  );
}
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Check,
  Star,
  Wrench,
  Plus,
  ChevronRight,
  Eye,
  Calendar,
  MapPin
} from 'lucide-react';
import {
  ServiceMenuData,
  Service,
  ExtraService,
  getServiceById,
  formatDuration,
  getMinPrice,
  formatServicePricing
} from '@/lib/services';

interface ServiceMenuPreviewProps {
  serviceMenuData: ServiceMenuData;
  shopName?: string;
}

export function ServiceMenuPreview({ serviceMenuData, shopName = "Your Auto Shop" }: ServiceMenuPreviewProps) {
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'full' | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const { basicPackage, fullPackage, extraServices } = serviceMenuData;

  const getPackageServices = (packageData: typeof basicPackage) => {
    return packageData.includedServices
      .map(id => getServiceById(id))
      .filter(Boolean) as Service[];
  };

  const calculateTotal = () => {
    const packagePrice = selectedPackage === 'basic' ? basicPackage.price : 
                        selectedPackage === 'full' ? fullPackage.price : 0;
    const extrasPrice = selectedExtras.reduce((total, serviceId) => {
      const service = extraServices.find(s => s.id === serviceId);
      return total + (service ? getMinPrice(service.pricing) : 0);
    }, 0);
    return packagePrice + extrasPrice;
  };

  const calculateTotalTime = () => {
    const packageTime = selectedPackage === 'basic' ? basicPackage.estimatedTime : 
                       selectedPackage === 'full' ? fullPackage.estimatedTime : 0;
    const extrasTime = selectedExtras.reduce((total, serviceId) => {
      const service = extraServices.find(s => s.id === serviceId);
      return total + (service?.estimatedTime || 0);
    }, 0);
    return packageTime + extrasTime;
  };

  const toggleExtraService = (serviceId: string) => {
    setSelectedExtras(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 p-6 rounded-2xl">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg mb-4">
          <Eye className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-slate-700">Customer Preview</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-2">
          {shopName}
        </h2>
        <p className="text-slate-600">Professional automotive service packages</p>
      </div>

      {/* Service Packages */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Basic Package */}
        <ServicePackageCard
          package={basicPackage}
          services={getPackageServices(basicPackage)}
          isSelected={selectedPackage === 'basic'}
          onSelect={() => setSelectedPackage(selectedPackage === 'basic' ? null : 'basic')}
          badgeText="POPULAR"
          badgeColor="blue"
        />

        {/* Full Package */}
        <ServicePackageCard
          package={fullPackage}
          services={getPackageServices(fullPackage)}
          isSelected={selectedPackage === 'full'}
          onSelect={() => setSelectedPackage(selectedPackage === 'full' ? null : 'full')}
          badgeText="COMPREHENSIVE"
          badgeColor="amber"
        />
      </div>

      {/* Extra Services */}
      {extraServices.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <Plus className="h-5 w-5 text-amber-500" />
              Add Extra Services
            </CardTitle>
            <p className="text-sm text-slate-600">
              Enhance your service with these additional options
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {extraServices.map(service => (
                <ExtraServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedExtras.includes(service.id)}
                  onToggle={() => toggleExtraService(service.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Summary */}
      {(selectedPackage || selectedExtras.length > 0) && (
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Booking Summary</h3>
              <div className="text-right">
                <div className="text-2xl font-bold">${calculateTotal()}</div>
                <div className="text-blue-100 text-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(calculateTotalTime())}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {selectedPackage && (
                <div className="flex justify-between items-center py-2 border-b border-blue-400/30">
                  <span>{selectedPackage === 'basic' ? basicPackage.name : fullPackage.name}</span>
                  <span>${selectedPackage === 'basic' ? basicPackage.price : fullPackage.price}</span>
                </div>
              )}
              {selectedExtras.map(serviceId => {
                const service = extraServices.find(s => s.id === serviceId);
                return service ? (
                  <div key={serviceId} className="flex justify-between items-center py-2 border-b border-blue-400/30">
                    <span>{service.name}</span>
                    <span>{formatServicePricing(service.pricing)}</span>
                  </div>
                ) : null;
              })}
            </div>

            <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl">
              <Calendar className="h-4 w-4 mr-2" />
              Book This Service
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
          <Star className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-slate-800">4.9★</div>
          <div className="text-xs text-slate-600">Customer Rating</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
          <Wrench className="h-6 w-6 text-blue-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-slate-800">250+</div>
          <div className="text-xs text-slate-600">Services Completed</div>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50">
          <MapPin className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-slate-800">Local</div>
          <div className="text-xs text-slate-600">Trusted Provider</div>
        </div>
      </div>
    </div>
  );
}

// Service Package Card Component
interface ServicePackageCardProps {
  package: {
    id: 'basic' | 'full';
    name: string;
    description: string;
    includedServices: string[];
    price: number;
    estimatedTime: number;
  };
  services: Service[];
  isSelected: boolean;
  onSelect: () => void;
  badgeText: string;
  badgeColor: 'blue' | 'amber';
}

function ServicePackageCard({ 
  package: pkg, 
  services, 
  isSelected, 
  onSelect, 
  badgeText, 
  badgeColor 
}: ServicePackageCardProps) {
  const badgeColors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200'
  };

  return (
    <Card className={`cursor-pointer transition-all duration-200 hover:shadow-xl ${
      isSelected 
        ? 'ring-2 ring-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-white' 
        : 'bg-white/90 backdrop-blur-sm hover:bg-white'
    } border border-blue-200/50`}
    onClick={onSelect}>
      <CardContent className="p-6">
        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${badgeColors[badgeColor]}`}>
            {badgeText}
          </span>
        </div>

        {/* Package Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
          <div className="text-3xl font-bold text-slate-800 mb-1">${pkg.price}</div>
          <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDuration(pkg.estimatedTime)}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 text-center mb-6">{pkg.description}</p>

        {/* Services List */}
        <div className="space-y-2 mb-6">
          {services.slice(0, 5).map(service => (
            <div key={service.id} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-700">{service.name}</span>
            </div>
          ))}
          {services.length > 5 && (
            <div className="text-xs text-slate-500 pl-6">
              +{services.length - 5} more services
            </div>
          )}
        </div>

        {/* Select Button */}
        <Button 
          className={`w-full transition-all ${
            isSelected 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Selected
            </>
          ) : (
            <>
              Select Package
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Extra Service Card Component
interface ExtraServiceCardProps {
  service: ExtraService;
  isSelected: boolean;
  onToggle: () => void;
}

function ExtraServiceCard({ service, isSelected, onToggle }: ExtraServiceCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-amber-500 bg-gradient-to-br from-amber-50 to-white' 
          : 'hover:shadow-md bg-white'
      } border border-slate-200`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{service.icon || '🔧'}</span>
            <div>
              <h4 className="font-semibold text-slate-800">{service.name}</h4>
              <p className="text-xs text-slate-600">{service.description}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800">{formatServicePricing(service.pricing)}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(service.estimatedTime)}
            </div>
          </div>
        </div>

        <Button 
          size="sm" 
          className={`w-full ${
            isSelected 
              ? 'bg-amber-600 hover:bg-amber-700' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="h-3 w-3 mr-2" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-3 w-3 mr-2" />
              Add Service
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
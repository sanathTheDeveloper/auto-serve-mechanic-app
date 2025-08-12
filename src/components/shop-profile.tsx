'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe,
  Edit,
  CheckCircle,
  Star,
  Users,
  Award,
  Wrench,
  DollarSign,
  Car,
  CreditCard,
  Settings
} from 'lucide-react'

interface ShopProfileData {
  shopName: string
  description: string
  email: string
  phone: string
  website?: string
  address: string
  city: string
  state: string
  zipCode: string
  services: string[]
  specialties?: string
  servicePricing: Array<{
    id: string
    name: string
    basePrice: number
    duration: number
    category: string
    description?: string
    isPopular?: boolean
  }>
  laborRate?: number
  totalBays?: number
  lifts?: number
  maxVehiclesPerDay?: number
  equipmentList: string[]
  acceptedPayments: string[]
  creditCards: string[]
  paymentTerms?: string
  teamSize?: string
  yearsInBusiness?: string
  certifications: string[]
  rating?: number
  reviewCount?: number
}

interface ShopProfileProps {
  data: ShopProfileData
  editable?: boolean
  onEdit?: () => void
  compact?: boolean
}

export function ShopProfile({ data, editable = false, onEdit, compact = false }: ShopProfileProps) {
  const formatAddress = () => {
    return `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`
  }

  if (compact) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-slate-800">{data.shopName}</h3>
                {data.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="text-sm font-medium text-slate-700">{data.rating}</span>
                    {data.reviewCount && (
                      <span className="text-xs text-slate-500">({data.reviewCount})</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{formatAddress()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{data.phone}</span>
                </div>
              </div>
              
              {data.services.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {data.services.slice(0, 3).map((service) => (
                    <Badge 
                      key={service} 
                      variant="secondary" 
                      className="text-xs bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border-0"
                    >
                      {service}
                    </Badge>
                  ))}
                  {data.services.length > 3 && (
                    <Badge variant="outline" className="text-xs text-slate-500">
                      +{data.services.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {editable && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="text-blue-600">
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
                  {data.shopName}
                </CardTitle>
                {data.rating && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < data.rating! ? 'text-amber-500 fill-current' : 'text-slate-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{data.rating}</span>
                    {data.reviewCount && (
                      <span className="text-sm text-slate-500">({data.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {data.description && (
              <p className="text-slate-600 leading-relaxed">{data.description}</p>
            )}
          </div>
          
          {editable && onEdit && (
            <Button 
              onClick={onEdit}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-500" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{data.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-slate-700">{data.phone}</span>
              </div>
              {data.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <a 
                    href={data.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {data.website}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                <span className="text-slate-700">{formatAddress()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-blue-500" />
              Services Offered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.services.map((service) => (
                <Badge 
                  key={service}
                  className="bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border-0 hover:from-blue-200 hover:to-sky-200"
                >
                  {service}
                </Badge>
              ))}
            </div>
            {data.specialties && (
              <div className="mt-4 pt-4 border-t border-blue-200/50">
                <h4 className="font-medium text-slate-700 mb-2">Specialties</h4>
                <p className="text-sm text-slate-600">{data.specialties}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team & Experience */}
        {(data.teamSize || data.yearsInBusiness || data.certifications.length > 0) && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Team & Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {data.teamSize && (
                  <div>
                    <div className="text-sm text-slate-500">Team Size</div>
                    <div className="font-semibold text-slate-700">{data.teamSize} technicians</div>
                  </div>
                )}
                {data.yearsInBusiness && (
                  <div>
                    <div className="text-sm text-slate-500">Experience</div>
                    <div className="font-semibold text-slate-700">{data.yearsInBusiness} years</div>
                  </div>
                )}
              </div>
              
              {data.certifications.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certifications & Awards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.certifications.map((cert) => (
                      <Badge 
                        key={cert}
                        variant="outline"
                        className="text-xs bg-gradient-to-r from-amber-50 to-orange-100 text-amber-700 border-amber-200"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pricing Information */}
        {(data.servicePricing?.length > 0 || data.laborRate) && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Pricing & Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.laborRate && (
                <div className="p-3 bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg border border-blue-200/30">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-slate-700">Labor Rate</span>
                    <span className="font-bold text-blue-600">${data.laborRate}/hour</span>
                  </div>
                </div>
              )}
              
              {data.servicePricing && data.servicePricing.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">Service Pricing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {data.servicePricing.slice(0, 6).map((service) => (
                      <div key={service.id} className="p-3 rounded-lg border border-blue-200/30 bg-gradient-to-r from-blue-50/30 to-orange-50/30">
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-medium text-slate-800 text-sm">{service.name}</h5>
                          {service.isPopular && (
                            <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">Popular</Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-600">{service.duration}min • {service.category}</span>
                          <span className="font-semibold text-blue-600">
                            {service.basePrice === 0 ? 'FREE' : `$${service.basePrice}`}
                          </span>
                        </div>
                        {service.description && (
                          <p className="text-xs text-slate-500 mt-1">{service.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {data.servicePricing.length > 6 && (
                    <p className="text-sm text-slate-500 mt-2">+{data.servicePricing.length - 6} more services</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Capacity & Equipment */}
        {(data.totalBays || data.equipmentList?.length > 0) && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-500" />
                Facility & Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(data.totalBays || data.lifts || data.maxVehiclesPerDay) && (
                <div className="grid grid-cols-3 gap-4">
                  {data.totalBays && (
                    <div className="text-center p-3 bg-gradient-to-r from-blue-50/50 to-sky-50/50 rounded-lg">
                      <div className="font-bold text-xl text-slate-800">{data.totalBays}</div>
                      <div className="text-xs text-slate-600">Service Bays</div>
                    </div>
                  )}
                  {data.lifts && (
                    <div className="text-center p-3 bg-gradient-to-r from-blue-50/50 to-sky-50/50 rounded-lg">
                      <div className="font-bold text-xl text-slate-800">{data.lifts}</div>
                      <div className="text-xs text-slate-600">Vehicle Lifts</div>
                    </div>
                  )}
                  {data.maxVehiclesPerDay && (
                    <div className="text-center p-3 bg-gradient-to-r from-blue-50/50 to-sky-50/50 rounded-lg">
                      <div className="font-bold text-xl text-slate-800">{data.maxVehiclesPerDay}</div>
                      <div className="text-xs text-slate-600">Daily Capacity</div>
                    </div>
                  )}
                </div>
              )}
              
              {data.equipmentList && data.equipmentList.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Available Equipment
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.equipmentList.slice(0, 8).map((equipment) => (
                      <Badge 
                        key={equipment}
                        variant="outline"
                        className="text-xs bg-gradient-to-r from-slate-50 to-blue-50 text-slate-700 border-slate-300"
                      >
                        {equipment}
                      </Badge>
                    ))}
                    {data.equipmentList.length > 8 && (
                      <Badge variant="outline" className="text-xs text-slate-500">
                        +{data.equipmentList.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Methods */}
        {data.acceptedPayments?.length > 0 && (
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                Payment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-700 mb-2">Accepted Payment Methods</h4>
                <div className="flex flex-wrap gap-2">
                  {data.acceptedPayments.map((method) => (
                    <Badge 
                      key={method}
                      className="bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 border-0"
                    >
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>

              {data.creditCards && data.creditCards.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Credit Cards</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.creditCards.map((card) => (
                      <Badge 
                        key={card}
                        variant="outline"
                        className="text-xs bg-gradient-to-r from-green-50 to-blue-50 text-slate-700 border-green-200"
                      >
                        {card}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {data.paymentTerms && (
                <div className="pt-3 border-t border-blue-200/50">
                  <h4 className="font-medium text-slate-700 mb-2">Payment Terms</h4>
                  <p className="text-sm text-slate-600">{data.paymentTerms}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Business Hours */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { day: 'Monday', hours: '8:00 AM - 6:00 PM' },
                { day: 'Tuesday', hours: '8:00 AM - 6:00 PM' },
                { day: 'Wednesday', hours: '8:00 AM - 6:00 PM' },
                { day: 'Thursday', hours: '8:00 AM - 6:00 PM' },
                { day: 'Friday', hours: '8:00 AM - 6:00 PM' },
                { day: 'Saturday', hours: '9:00 AM - 5:00 PM' },
                { day: 'Sunday', hours: 'Closed' },
              ].map((item) => (
                <div key={item.day} className="flex justify-between items-center py-1">
                  <span className="text-slate-600 font-medium">{item.day}</span>
                  <span className={`text-sm ${
                    item.hours === 'Closed' ? 'text-slate-500' : 'text-slate-700'
                  }`}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Sample data for preview
export const sampleShopData: ShopProfileData = {
  shopName: "AutoServe Pro Shop",
  description: "Professional automotive service with over 20 years of experience. We specialize in comprehensive maintenance and repair services for all vehicle makes and models.",
  email: "info@autoservepro.com",
  phone: "(555) 123-4567",
  website: "https://autoservepro.com",
  address: "123 Main Street",
  city: "San Francisco",
  state: "CA",
  zipCode: "94105",
  services: ["Oil Change", "Brake Service", "Tire Rotation", "Engine Diagnostic", "A/C Repair", "Tune-up"],
  specialties: "We specialize in European vehicles and have state-of-the-art diagnostic equipment for modern vehicles.",
  servicePricing: [
    { id: '1', name: 'Oil Change', basePrice: 49.99, duration: 45, category: 'Maintenance', description: 'Full synthetic oil change with 21-point inspection', isPopular: true },
    { id: '2', name: 'Brake Inspection', basePrice: 0, duration: 30, category: 'Inspection', description: 'Complete brake system inspection' },
    { id: '3', name: 'Tire Rotation', basePrice: 25.00, duration: 20, category: 'Maintenance', description: 'Standard tire rotation service' },
    { id: '4', name: 'Engine Diagnostic', basePrice: 125.00, duration: 60, category: 'Diagnostic', description: 'Comprehensive engine diagnostic scan' },
    { id: '5', name: 'A/C Service', basePrice: 89.99, duration: 90, category: 'Repair', description: 'Complete AC system service and recharge' },
    { id: '6', name: 'Brake Service', basePrice: 299.99, duration: 120, category: 'Repair', description: 'Complete brake pad and rotor service', isPopular: true }
  ],
  laborRate: 125,
  totalBays: 4,
  lifts: 3,
  maxVehiclesPerDay: 20,
  equipmentList: ['Alignment Machine', 'Tire Changer', 'Brake Lathe', 'AC Recovery System', 'Diagnostic Scanner', 'Engine Hoist'],
  acceptedPayments: ['Cash', 'Credit Card', 'Debit Card', 'Check', 'Mobile Payment'],
  creditCards: ['Visa', 'Mastercard', 'American Express', 'Discover'],
  paymentTerms: 'Payment due upon completion of service. We accept cash, credit cards, and checks. Fleet accounts available with approved credit.',
  teamSize: "8",
  yearsInBusiness: "20",
  certifications: ["ASE Certified", "AAA Approved", "Better Business Bureau", "NAPA AutoCare"],
  rating: 4.8,
  reviewCount: 124
}
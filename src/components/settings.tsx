'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Settings as SettingsIcon,
  Save
} from 'lucide-react'

export function Settings() {
  const businessHours = [
    { day: 'Monday', open: '8:00 AM', close: '6:00 PM', isOpen: true },
    { day: 'Tuesday', open: '8:00 AM', close: '6:00 PM', isOpen: true },
    { day: 'Wednesday', open: '8:00 AM', close: '6:00 PM', isOpen: true },
    { day: 'Thursday', open: '8:00 AM', close: '6:00 PM', isOpen: true },
    { day: 'Friday', open: '8:00 AM', close: '6:00 PM', isOpen: true },
    { day: 'Saturday', open: '9:00 AM', close: '4:00 PM', isOpen: true },
    { day: 'Sunday', open: '', close: '', isOpen: false }
  ]

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Shop Profile & Settings</h1>
        <p className="text-slate-600 mt-1">Manage your shop information and preferences</p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Business Name</label>
              <Input defaultValue="Mike's Auto Shop" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Owner Name</label>
              <Input defaultValue="Mike Johnson" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Business Description</label>
            <Textarea 
              defaultValue="Full-service automotive repair shop specializing in maintenance, diagnostics, and repairs for all vehicle makes and models. Family-owned business serving the community for over 15 years."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  defaultValue="(555) 123-4567"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  defaultValue="info@mikesautoshop.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Business Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
              <Textarea 
                defaultValue="123 Main Street&#10;Anytown, ST 12345&#10;United States"
                className="pl-10"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businessHours.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-4">
                  <span className="w-20 font-medium text-slate-900">{schedule.day}</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      defaultChecked={schedule.isOpen}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-600">Open</span>
                  </div>
                </div>
                
                {schedule.isOpen ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      defaultValue={schedule.open}
                      className="w-24 h-8 text-sm"
                    />
                    <span className="text-slate-600">to</span>
                    <Input 
                      defaultValue={schedule.close}
                      className="w-24 h-8 text-sm"
                    />
                  </div>
                ) : (
                  <Badge variant="secondary">Closed</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shop Capacity & Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Shop Capacity & Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Service Bays</label>
              <Input 
                type="number" 
                defaultValue="4" 
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Max Daily Appointments</label>
              <Input 
                type="number" 
                defaultValue="12" 
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Staff Members</label>
              <Input 
                type="number" 
                defaultValue="3" 
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Average Service Duration</label>
              <select className="w-full p-2 border border-slate-300 rounded-md" defaultValue="1.5">
                <option value="1">1 hour</option>
                <option value="1.5">1.5 hours</option>
                <option value="2">2 hours</option>
                <option value="2.5">2.5 hours</option>
                <option value="3">3 hours</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Booking Buffer Time</label>
              <select className="w-full p-2 border border-slate-300 rounded-md" defaultValue="30">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">New Booking Requests</p>
                <p className="text-sm text-slate-600">Get notified when customers request new bookings</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Payment Confirmations</p>
                <p className="text-sm text-slate-600">Receive notifications for completed payments</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">New Reviews</p>
                <p className="text-sm text-slate-600">Be notified when customers leave reviews</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Appointment Reminders</p>
                <p className="text-sm text-slate-600">Send yourself reminders before appointments</p>
              </div>
              <input type="checkbox" className="rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <Button className="bg-primary hover:bg-primary/90 min-w-32">
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </div>
    </div>
  )
}
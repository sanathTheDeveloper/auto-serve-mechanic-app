"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Clock,
  Calendar,
  Plus,
  X,
  Coffee,
  Settings,
  Copy,
  RotateCcw,
  CheckCircle,
  Sun,
  Zap
} from 'lucide-react';

interface TimeSlot {
  start: string;
  end: string;
  isBreak?: boolean;
}

interface DaySchedule {
  day: string;
  fullName: string;
  isOpen: boolean;
  timeSlots: TimeSlot[];
  isHoliday?: boolean;
}

interface BusinessHoursSetupProps {
  initialData?: {
    schedule: DaySchedule[];
    timezone: string;
    lunchBreak: {
      enabled: boolean;
      start: string;
      end: string;
    };
    specialDays: Array<{
      date: string;
      name: string;
      isOpen: boolean;
      timeSlots?: TimeSlot[];
    }>;
  };
  onDataChange: (data: Record<string, unknown>) => void;
}

export function BusinessHoursSetup({ initialData, onDataChange }: BusinessHoursSetupProps) {
  const defaultSchedule: DaySchedule[] = [
    { day: 'monday', fullName: 'Monday', isOpen: true, timeSlots: [{ start: '08:00', end: '17:00' }] },
    { day: 'tuesday', fullName: 'Tuesday', isOpen: true, timeSlots: [{ start: '08:00', end: '17:00' }] },
    { day: 'wednesday', fullName: 'Wednesday', isOpen: true, timeSlots: [{ start: '08:00', end: '17:00' }] },
    { day: 'thursday', fullName: 'Thursday', isOpen: true, timeSlots: [{ start: '08:00', end: '17:00' }] },
    { day: 'friday', fullName: 'Friday', isOpen: true, timeSlots: [{ start: '08:00', end: '17:00' }] },
    { day: 'saturday', fullName: 'Saturday', isOpen: true, timeSlots: [{ start: '08:00', end: '15:00' }] },
    { day: 'sunday', fullName: 'Sunday', isOpen: false, timeSlots: [] }
  ];

  const [schedule, setSchedule] = useState<DaySchedule[]>(
    initialData?.schedule || defaultSchedule
  );
  
  const [lunchBreak, setLunchBreak] = useState({
    enabled: initialData?.lunchBreak?.enabled || false,
    start: initialData?.lunchBreak?.start || '12:00',
    end: initialData?.lunchBreak?.end || '13:00'
  });

  const [timezone, setTimezone] = useState(initialData?.timezone || 'Australia/Melbourne');
  const [activeTab, setActiveTab] = useState<'hours' | 'breaks' | 'special'>('hours');
  // const [specialDays, setSpecialDays] = useState(initialData?.specialDays || []);
  const [showQuickSetup, setShowQuickSetup] = useState(false);

  const timezones = [
    { id: 'Australia/Melbourne', name: 'Melbourne (AEST/AEDT)' },
    { id: 'Australia/Sydney', name: 'Sydney (AEST/AEDT)' },
    { id: 'Australia/Brisbane', name: 'Brisbane (AEST)' },
    { id: 'Australia/Perth', name: 'Perth (AWST)' },
    { id: 'Australia/Adelaide', name: 'Adelaide (ACST/ACDT)' },
    { id: 'Australia/Darwin', name: 'Darwin (ACST)' }
  ];

  const quickSetupTemplates = [
    {
      name: 'Standard Business Hours',
      description: 'Mon-Fri 8AM-5PM, Sat 8AM-3PM',
      icon: <Settings className="h-4 w-4" />,
      schedule: defaultSchedule
    },
    {
      name: 'Extended Hours',
      description: 'Mon-Fri 7AM-6PM, Sat 7AM-4PM',
      icon: <Sun className="h-4 w-4" />,
      schedule: defaultSchedule.map(day => ({
        ...day,
        timeSlots: day.day === 'sunday' ? [] : 
                  day.day === 'saturday' ? [{ start: '07:00', end: '16:00' }] :
                  [{ start: '07:00', end: '18:00' }]
      }))
    },
    {
      name: 'Compact Hours',
      description: 'Mon-Fri 9AM-4PM, Weekends closed',
      icon: <Coffee className="h-4 w-4" />,
      schedule: defaultSchedule.map(day => ({
        ...day,
        isOpen: !['saturday', 'sunday'].includes(day.day),
        timeSlots: ['saturday', 'sunday'].includes(day.day) ? [] : [{ start: '09:00', end: '16:00' }]
      }))
    }
  ];

  React.useEffect(() => {
    const data = {
      schedule,
      timezone,
      lunchBreak,
      specialDays: []
    };
    onDataChange(data);
  }, [schedule, timezone, lunchBreak, onDataChange]);

  const toggleDayOpen = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].isOpen = !newSchedule[dayIndex].isOpen;
    if (!newSchedule[dayIndex].isOpen) {
      newSchedule[dayIndex].timeSlots = [];
    } else if (newSchedule[dayIndex].timeSlots.length === 0) {
      newSchedule[dayIndex].timeSlots = [{ start: '08:00', end: '17:00' }];
    }
    setSchedule(newSchedule);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots[slotIndex][field] = value;
    setSchedule(newSchedule);
  };

  const addTimeSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const lastSlot = newSchedule[dayIndex].timeSlots[newSchedule[dayIndex].timeSlots.length - 1];
    const newStart = lastSlot ? addMinutes(lastSlot.end, 60) : '08:00';
    newSchedule[dayIndex].timeSlots.push({ start: newStart, end: addMinutes(newStart, 120) });
    setSchedule(newSchedule);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].timeSlots.splice(slotIndex, 1);
    setSchedule(newSchedule);
  };

  const copySchedule = (fromDayIndex: number, toDayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[toDayIndex] = {
      ...newSchedule[toDayIndex],
      isOpen: newSchedule[fromDayIndex].isOpen,
      timeSlots: [...newSchedule[fromDayIndex].timeSlots]
    };
    setSchedule(newSchedule);
  };

  const applyTemplate = (template: typeof quickSetupTemplates[0]) => {
    setSchedule(template.schedule);
    setShowQuickSetup(false);
  };

  const addMinutes = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTotalHours = (): string => {
    const totalMinutes = schedule.reduce((total, day) => {
      if (!day.isOpen) return total;
      return total + day.timeSlots.reduce((dayTotal, slot) => {
        const start = slot.start.split(':').map(Number);
        const end = slot.end.split(':').map(Number);
        const startMinutes = start[0] * 60 + start[1];
        const endMinutes = end[0] * 60 + end[1];
        return dayTotal + (endMinutes - startMinutes);
      }, 0);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m per week`;
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-white/90 backdrop-blur-sm rounded-t-xl">
        {[
          { id: 'hours', label: 'Operating Hours', icon: Clock },
          { id: 'breaks', label: 'Breaks & Lunch', icon: Coffee },
          { id: 'special', label: 'Special Days', icon: Calendar }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Operating Hours Tab */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          {/* Quick Setup & Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Weekly Schedule</h3>
                  <p className="text-sm text-slate-600">{getTotalHours()}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQuickSetup(!showQuickSetup)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Quick Setup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSchedule(defaultSchedule)}
                    className="text-slate-600 border-slate-200 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Quick Setup Templates */}
              {showQuickSetup && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-white/80 rounded-lg border border-blue-200">
                  {quickSetupTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyTemplate(template)}
                      className="p-3 text-left border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {template.icon}
                        <span className="font-medium text-sm">{template.name}</span>
                      </div>
                      <p className="text-xs text-slate-600">{template.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timezone Selection */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    {timezones.map(tz => (
                      <option key={tz.id} value={tz.id}>{tz.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Current Time</p>
                  <p className="font-mono text-sm font-semibold text-slate-800">
                    {new Date().toLocaleTimeString('en-AU', { 
                      timeZone: timezone,
                      hour12: true,
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Schedule */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                <Clock className="h-5 w-5 text-blue-500" />
                Daily Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.map((day, dayIndex) => (
                <div key={day.day} className="border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between p-4 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleDayOpen(dayIndex)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          day.isOpen ? 'bg-blue-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            day.isOpen ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="font-semibold text-slate-800 w-20">{day.fullName}</span>
                      {day.isOpen && (
                        <span className="text-sm text-slate-600">
                          {day.timeSlots.length} slot{day.timeSlots.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {day.isOpen && dayIndex > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copySchedule(dayIndex - 1, dayIndex)}
                          className="text-blue-600 hover:text-blue-700"
                          title="Copy from previous day"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {!day.isOpen && (
                        <span className="text-sm text-slate-500 font-medium">Closed</span>
                      )}
                    </div>
                  </div>

                  {day.isOpen && (
                    <div className="p-4 space-y-3">
                      {day.timeSlots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <div className="relative">
                              <Input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                                className="w-28"
                              />
                            </div>
                            <span className="text-slate-400">to</span>
                            <div className="relative">
                              <Input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                                className="w-28"
                              />
                            </div>
                            <span className="text-sm text-slate-500 ml-2">
                              ({formatTime(slot.start)} - {formatTime(slot.end)})
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {day.timeSlots.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(dayIndex)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Time Slot
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Breaks & Lunch Tab */}
      {activeTab === 'breaks' && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <Coffee className="h-5 w-5 text-blue-500" />
              Breaks & Lunch Hours
            </CardTitle>
            <p className="text-slate-600">
              Set up lunch breaks and other non-working periods during business hours
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Lunch Break Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-semibold text-slate-800">Daily Lunch Break</h4>
                  <p className="text-sm text-slate-600">
                    Automatically block lunch time across all working days
                  </p>
                </div>
                <button
                  onClick={() => setLunchBreak(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    lunchBreak.enabled ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      lunchBreak.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {lunchBreak.enabled && (
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Lunch Start Time
                      </label>
                      <Input
                        type="time"
                        value={lunchBreak.start}
                        onChange={(e) => setLunchBreak(prev => ({ ...prev, start: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Lunch End Time
                      </label>
                      <Input
                        type="time"
                        value={lunchBreak.end}
                        onChange={(e) => setLunchBreak(prev => ({ ...prev, end: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <Coffee className="h-4 w-4" />
                    <span>
                      Lunch break: {formatTime(lunchBreak.start)} - {formatTime(lunchBreak.end)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Break Information */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h4 className="font-semibold text-slate-800 mb-3">Break Time Information</h4>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>Break times are automatically blocked from customer bookings</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>You can adjust break times anytime in your dashboard</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p>Emergency bookings can still be accepted during breaks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Special Days Tab */}
      {activeTab === 'special' && (
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
              <Calendar className="h-5 w-5 text-blue-500" />
              Special Days & Holidays
            </CardTitle>
            <p className="text-slate-600">
              Configure special hours for holidays and other exceptional days
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-12 text-slate-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p className="font-medium mb-2">Holiday Management</p>
              <p className="text-sm mb-4">
                Set special hours for public holidays, maintenance days, or other exceptions
              </p>
              <Button
                variant="outline"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Special Day
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
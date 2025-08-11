'use client'

import { useState } from 'react'
import { 
  Home, 
  Calendar, 
  Wrench, 
  CreditCard, 
  Star, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const navigationItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'bookings', icon: Calendar, label: 'Bookings' },
  { id: 'services', icon: Wrench, label: 'Services' },
  { id: 'payments', icon: CreditCard, label: 'Payments' },
  { id: 'reviews', icon: Star, label: 'Reviews' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "h-screen bg-white border-r border-slate-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-slate-900">Auto Serve</h1>
                <p className="text-sm text-slate-500">Mechanic App</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12",
                    isCollapsed && "justify-center px-0",
                    isActive && "bg-primary hover:bg-primary/90 text-white"
                  )}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              )
            })}
          </div>
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-slate-200">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
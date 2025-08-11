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
  ChevronRight,
  Plus,
  Search,
  Bell,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ModernSidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const navigationItems = [
  { id: 'dashboard', icon: Home, label: 'Overview', shortcut: '⌘1' },
  { id: 'bookings', icon: Calendar, label: 'Schedule', shortcut: '⌘2', badge: '12' },
  { id: 'services', icon: Wrench, label: 'Services', shortcut: '⌘3' },
  { id: 'payments', icon: CreditCard, label: 'Finance', shortcut: '⌘4' },
  { id: 'reviews', icon: Star, label: 'Reviews', shortcut: '⌘5', badge: '3' },
  { id: 'settings', icon: Settings, label: 'Settings', shortcut: '⌘,' },
]

const quickStats = [
  { label: 'Today', value: '$1,250', icon: TrendingUp, change: '+12%', positive: true },
  { label: 'Queue', value: '8', icon: Clock, change: '2 urgent', positive: false },
  { label: 'Active', value: '4', icon: Activity, change: 'Bay 3', positive: true },
]

const quickActions = [
  { label: 'New Booking', action: 'new-booking' },
  { label: 'Quick Invoice', action: 'quick-invoice' },
  { label: 'Add Service', action: 'add-service' },
]

export function ModernSidebar({ currentPage, onPageChange }: ModernSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 shadow-card flex flex-col",
      isCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">AutoServe</h1>
              <p className="text-sm text-muted-foreground">Professional</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors"
            />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="space-y-3">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    stat.positive ? "bg-green-100 text-success" : "bg-orange-100 text-warning"
                  )}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-xs font-medium",
                    stat.positive ? "text-success" : "text-warning"
                  )}>
                    {stat.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <div key={item.id} className="relative">
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-11 font-medium relative transition-all",
                    isCollapsed && "justify-center px-0",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className="h-5 px-1.5 text-xs bg-muted-foreground/20 text-muted-foreground border-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground/70 font-mono">
                          {item.shortcut}
                        </span>
                      </div>
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start h-9 text-sm hover:bg-muted/70 border-muted"
                onClick={() => console.log(`Quick action: ${action.action}`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          {!isCollapsed ? (
            <>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">M</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Mike&apos;s Auto Shop</p>
                <p className="text-xs text-muted-foreground">mike@autoshop.com</p>
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></div>
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" className="w-full relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></div>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
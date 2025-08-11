'use client'

import { useState } from 'react'
import { ModernSidebar } from '@/components/modern-sidebar'
import { ModernDashboard } from '@/components/modern-dashboard'
import { Bookings } from '@/components/bookings'
import { Services } from '@/components/services'
import { Payments } from '@/components/payments'
import { Reviews } from '@/components/reviews'
import { Settings } from '@/components/settings'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ModernDashboard />
      case 'bookings':
        return <Bookings />
      case 'services':
        return <Services />
      case 'payments':
        return <Payments />
      case 'reviews':
        return <Reviews />
      case 'settings':
        return <Settings />
      default:
        return <ModernDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <ModernSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

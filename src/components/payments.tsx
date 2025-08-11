'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CreditCard, 
  Search,
  Download
} from 'lucide-react'

export function Payments() {
  const transactions = [
    {
      id: '#INV-001',
      date: '2024-01-15',
      customer: 'John Smith',
      service: 'Full Service + Oil Change',
      amount: '$150.00',
      status: 'paid',
      paymentMethod: 'Credit Card'
    },
    {
      id: '#INV-002',
      date: '2024-01-15',
      customer: 'Maria Garcia',
      service: 'Brake Service',
      amount: '$200.00',
      status: 'paid',
      paymentMethod: 'Cash'
    },
    {
      id: '#INV-003',
      date: '2024-01-14',
      customer: 'Robert Johnson',
      service: 'Tire Rotation',
      amount: '$60.00',
      status: 'pending',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: '#INV-004',
      date: '2024-01-14',
      customer: 'Lisa Wilson',
      service: 'Engine Diagnostic',
      amount: '$120.00',
      status: 'paid',
      paymentMethod: 'Credit Card'
    },
    {
      id: '#INV-005',
      date: '2024-01-13',
      customer: 'David Miller',
      service: 'A/C Repair',
      amount: '$280.00',
      status: 'overdue',
      paymentMethod: 'Invoice'
    },
    {
      id: '#INV-006',
      date: '2024-01-13',
      customer: 'Sarah Thompson',
      service: 'Basic Oil Change',
      amount: '$45.00',
      status: 'paid',
      paymentMethod: 'Credit Card'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'overdue': return 'bg-red-100 text-red-700'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'pending': return 'Pending'
      case 'overdue': return 'Overdue'
      default: return 'Unknown'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payments & Invoicing</h1>
          <p className="text-slate-600 mt-1">Track revenue and manage transactions</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          Generate Report
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">This Month&apos;s Revenue</p>
                <p className="text-2xl font-bold text-slate-900">$8,540</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Payouts</p>
                <p className="text-2xl font-bold text-slate-900">$420</p>
                <p className="text-sm text-slate-600">3 invoices</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Overdue Payments</p>
                <p className="text-2xl font-bold text-slate-900">$280</p>
                <p className="text-sm text-red-600">1 invoice</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Transaction</p>
                <p className="text-2xl font-bold text-slate-900">$142</p>
                <p className="text-sm text-slate-600">6 transactions</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input 
                  placeholder="Search transactions..."
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {transaction.customer}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {transaction.service}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {transaction.paymentMethod}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {transaction.amount}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusText(transaction.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-slate-900">Credit Card</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900">$615</p>
                <p className="text-sm text-slate-600">4 payments</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium text-slate-900">Cash</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900">$200</p>
                <p className="text-sm text-slate-600">1 payment</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium text-slate-900">Bank Transfer</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900">$60</p>
                <p className="text-sm text-slate-600">1 payment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-primary hover:bg-primary/90">
              Create New Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Send Payment Reminder
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Export Monthly Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Update Payment Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
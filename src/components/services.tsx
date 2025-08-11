'use client'

import { useState } from 'react'

interface Service {
  id?: number
  name: string
  category: 'Maintenance' | 'Repair' | 'Diagnostic'
  duration: string
  price: string
  description: string
  isActive: boolean
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog'
import { Wrench, Edit, Trash2, Plus } from 'lucide-react'

export function Services() {
  const [services] = useState<Service[]>([
    {
      id: 1,
      name: 'Basic Oil Change',
      category: 'Maintenance' as const,
      duration: '30 mins',
      price: '$45',
      description: 'Standard oil change with filter replacement',
      isActive: true
    },
    {
      id: 2,
      name: 'Full Service',
      category: 'Maintenance' as const,
      duration: '2 hours',
      price: '$150',
      description: 'Complete vehicle inspection and basic maintenance',
      isActive: true
    },
    {
      id: 3,
      name: 'Brake Pad Replacement',
      category: 'Repair' as const,
      duration: '1.5 hours',
      price: '$200',
      description: 'Replace brake pads and inspect brake system',
      isActive: true
    },
    {
      id: 4,
      name: 'Tire Rotation',
      category: 'Maintenance' as const,
      duration: '45 mins',
      price: '$60',
      description: 'Rotate tires and check tire pressure',
      isActive: true
    },
    {
      id: 5,
      name: 'Engine Diagnostic',
      category: 'Diagnostic' as const,
      duration: '1 hour',
      price: '$120',
      description: 'Complete engine diagnostic with OBD scan',
      isActive: true
    },
    {
      id: 6,
      name: 'A/C Service',
      category: 'Repair' as const,
      duration: '2.5 hours',
      price: '$180',
      description: 'Air conditioning system service and repair',
      isActive: false
    }
  ])

  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleAddService = () => {
    setEditingService({
      name: '',
      category: 'Maintenance' as const,
      duration: '',
      price: '',
      description: '',
      isActive: true
    })
    setIsDialogOpen(true)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Maintenance': return 'bg-blue-100 text-blue-700'
      case 'Repair': return 'bg-orange-100 text-orange-700'
      case 'Diagnostic': return 'bg-purple-100 text-purple-700'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Service Menu</h1>
          <p className="text-slate-600 mt-1">Manage your service offerings and pricing</p>
        </div>
        <Button 
          onClick={handleAddService}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Services</p>
                <p className="text-2xl font-bold text-slate-900">{services.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Services</p>
                <p className="text-2xl font-bold text-slate-900">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <p className="text-2xl font-bold text-slate-900">
                  {[...new Set(services.map(s => s.category))].length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-slate-900">{service.name}</div>
                      <div className="text-sm text-slate-600">{service.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-700">{service.duration}</TableCell>
                  <TableCell className="font-medium text-slate-900">{service.price}</TableCell>
                  <TableCell>
                    <Badge variant={service.isActive ? 'default' : 'secondary'}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit/Add Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingService?.id ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Service Name</label>
              <Input 
                placeholder="e.g., Oil Change"
                defaultValue={editingService?.name || ''}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select 
                className="w-full p-2 border border-slate-300 rounded-md"
                defaultValue={editingService?.category || 'Maintenance'}
              >
                <option value="Maintenance">Maintenance</option>
                <option value="Repair">Repair</option>
                <option value="Diagnostic">Diagnostic</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Duration</label>
                <Input 
                  placeholder="e.g., 1 hour"
                  defaultValue={editingService?.duration || ''}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Price</label>
                <Input 
                  placeholder="e.g., $150"
                  defaultValue={editingService?.price || ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Textarea 
                placeholder="Brief description of the service"
                defaultValue={editingService?.description || ''}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isActive"
                defaultChecked={editingService?.isActive || true}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">
                Service is active and available for booking
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsDialogOpen(false)}
            >
              {editingService?.id ? 'Save Changes' : 'Add Service'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
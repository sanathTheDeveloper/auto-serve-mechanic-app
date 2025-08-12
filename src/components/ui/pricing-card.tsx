import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { EnhancedInput } from "./enhanced-input"
import { FormField } from "./form-field"
import { 
  DollarSign, 
  Clock, 
  Edit, 
  Trash2, 
  Plus,
  Save,
  X
} from "lucide-react"

interface ServicePricing {
  id: string
  name: string
  basePrice: number
  duration: number // in minutes
  description?: string
  category: string
  isPopular?: boolean
  laborRate?: number
}

interface PricingCardProps {
  service: ServicePricing
  editable?: boolean
  onEdit?: (service: ServicePricing) => void
  onDelete?: (id: string) => void
  className?: string
}

export function PricingCard({ service, editable = false, onEdit, onDelete, className }: PricingCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editData, setEditData] = React.useState(service)

  const handleSave = () => {
    onEdit?.(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(service)
    setIsEditing(false)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  if (isEditing) {
    return (
      <Card className={cn("bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50", className)}>
        <CardContent className="p-4 space-y-4">
          <FormField label="Service Name" required>
            <EnhancedInput
              value={editData.name}
              onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Oil Change Service"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Base Price" required>
              <EnhancedInput
                icon={<DollarSign className="h-4 w-4" />}
                type="number"
                step="0.01"
                value={editData.basePrice}
                onChange={(e) => setEditData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                placeholder="49.99"
              />
            </FormField>

            <FormField label="Duration (minutes)" required>
              <EnhancedInput
                icon={<Clock className="h-4 w-4" />}
                type="number"
                value={editData.duration}
                onChange={(e) => setEditData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="45"
              />
            </FormField>
          </div>

          <FormField label="Description">
            <EnhancedInput
              value={editData.description || ''}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Includes 21-point inspection"
            />
          </FormField>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300",
      service.isPopular && "ring-2 ring-amber-300 ring-opacity-50",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-slate-800">{service.name}</h3>
              {service.isPopular && (
                <Badge className="bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 border-0 text-xs">
                  Popular
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="font-bold text-lg text-slate-800">${service.basePrice}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">{formatDuration(service.duration)}</span>
              </div>
            </div>

            {service.description && (
              <p className="text-sm text-slate-600">{service.description}</p>
            )}

            <div className="mt-2">
              <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-sky-100 text-blue-700 border-blue-200">
                {service.category}
              </Badge>
            </div>
          </div>

          {editable && (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-blue-600">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete?.(service.id)} className="text-amber-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface AddServiceCardProps {
  onAdd: (service: Omit<ServicePricing, 'id'>) => void
  className?: string
}

export function AddServiceCard({ onAdd, className }: AddServiceCardProps) {
  const [isAdding, setIsAdding] = React.useState(false)
  const [newService, setNewService] = React.useState({
    name: '',
    basePrice: 0,
    duration: 30,
    description: '',
    category: 'Maintenance',
    isPopular: false
  })

  const handleAdd = () => {
    if (newService.name && newService.basePrice > 0) {
      onAdd(newService)
      setNewService({
        name: '',
        basePrice: 0,
        duration: 30,
        description: '',
        category: 'Maintenance',
        isPopular: false
      })
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setNewService({
      name: '',
      basePrice: 0,
      duration: 30,
      description: '',
      category: 'Maintenance',
      isPopular: false
    })
    setIsAdding(false)
  }

  if (isAdding) {
    return (
      <Card className={cn("bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50", className)}>
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-slate-800">Add New Service</h3>
          
          <FormField label="Service Name" required>
            <EnhancedInput
              value={newService.name}
              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Oil Change Service"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Base Price" required>
              <EnhancedInput
                icon={<DollarSign className="h-4 w-4" />}
                type="number"
                step="0.01"
                value={newService.basePrice}
                onChange={(e) => setNewService(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                placeholder="49.99"
              />
            </FormField>

            <FormField label="Duration (minutes)" required>
              <EnhancedInput
                icon={<Clock className="h-4 w-4" />}
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="45"
              />
            </FormField>
          </div>

          <FormField label="Category">
            <select 
              value={newService.category}
              onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-md border border-blue-200/50 bg-gradient-to-r from-blue-50/30 to-orange-50/30 px-3 py-2 text-sm focus:border-blue-400 focus:ring-blue-400/20"
            >
              <option value="Maintenance">Maintenance</option>
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
              <option value="Specialty">Specialty</option>
              <option value="Emergency">Emergency</option>
            </select>
          </FormField>

          <FormField label="Description">
            <EnhancedInput
              value={newService.description}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Includes 21-point inspection"
            />
          </FormField>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleAdd} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "bg-gradient-to-r from-blue-50/50 to-orange-50/50 border-2 border-dashed border-blue-300 hover:border-blue-400 cursor-pointer transition-all duration-300",
      className
    )}>
      <CardContent 
        className="p-8 flex flex-col items-center justify-center text-center"
        onClick={() => setIsAdding(true)}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center mb-3">
          <Plus className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-slate-800 mb-1">Add New Service</h3>
        <p className="text-sm text-slate-600">Create a new service offering with pricing</p>
      </CardContent>
    </Card>
  )
}
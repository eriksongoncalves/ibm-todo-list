export type ListItemStatus = 'pending' | 'in_progress' | 'done' | 'cancelled'

export type ListItemData = {
  id?: string
  status: ListItemStatus
  comment?: string
  created_at: Date
  updated_at: Date
}

export type ListData = {
  id?: string
  name: string
  user_id: string
  items: ListItemData[]
  created_at: Date
  updated_at: Date
}

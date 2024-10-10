import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const itemFormSchema = z.object({
  description: z
    .string({ message: 'Campo obrigatório' })
    .min(2, 'A descrição deve conter pelo menos 2 caracteres'),
  status: z.enum(['pending', 'in_progress', 'done']).default('pending'),
  comments: z.string().optional().default('')
})

export const suggestionItemsSchema = z.array(
  z.object({
    item: z.string()
  })
)

export type ItemFormData = z.infer<typeof itemFormSchema>

export const itemFormResolver = zodResolver(itemFormSchema)

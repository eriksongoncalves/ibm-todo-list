import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const listFormSchema = z.object({
  name: z
    .string({ message: 'Campo obrigatório' })
    .min(6, 'O nome da lista deve conter pelo menos 2 caracteres')
})

export type ListFormData = z.infer<typeof listFormSchema>

export const listFormResolver = zodResolver(listFormSchema)

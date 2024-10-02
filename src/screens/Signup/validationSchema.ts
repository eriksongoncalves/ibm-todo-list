import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const signUpFormSchema = z
  .object({
    name: z
      .string({ message: 'Campo obrigatório' })
      .min(1, 'Campo obrigatório'),
    email: z
      .string({ message: 'Campo obrigatório' })
      .min(1, 'E-mail obrigatório')
      .email('E-mail inválido'),
    password: z
      .string({ message: 'Campo obrigatório' })
      .min(6, 'A senha deve conter pelo menos 6 caracteres'),
    confirm_password: z
      .string({ message: 'Campo obrigatório' })
      .min(1, 'Campo obrigatório')
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'As senhas são diferentes',
    path: ['confirm_password']
  })

export type SignUpFormData = z.infer<typeof signUpFormSchema>

export const signUpFormResolver = zodResolver(signUpFormSchema)

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export const profileFormDataSchema = z
  .object({
    name: z
      .string({ message: 'Campo obrigatório' })
      .min(1, 'Campo obrigatório'),
    email: z
      .string({ message: 'Campo obrigatório' })
      .min(1, 'E-mail obrigatório')
      .email('E-mail inválido'),

    password: z.string().optional(),
    confirm_password: z.string().optional()
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (password && password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A senha deve conter pelo menos 6 caracteres',
        path: ['password']
      })
    }

    if ((password || confirm_password) && password !== confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'As senhas são diferentes',
        path: ['confirm_password']
      })
    }
  })

export const profileFormDataResolver = zodResolver(profileFormDataSchema)
export type ProfileFormData = z.infer<typeof profileFormDataSchema>

import { z } from 'zod'

const optionalText = (max: number) => z.string().trim().max(max).optional()

export const userUpdateSchema = z.object({
  status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED']).optional(),
  roleIds: z.array(z.string().min(1)).min(1).optional(),
})

export const newsSchema = z.object({
  title: z.string().trim().min(2).max(200),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: optionalText(500),
  content: z.string().trim().min(2),
  imageUrl: optionalText(500),
  isPublished: z.boolean().optional(),
})

export const newsUpdateSchema = newsSchema.partial()

export const gallerySchema = z.object({
  title: z.string().trim().min(2).max(160),
  imageUrl: z.string().trim().min(1).max(500),
  altText: optionalText(200),
  sortOrder: z.number().int().min(0).optional(),
  isVisible: z.boolean().optional(),
})

export const galleryUpdateSchema = gallerySchema.partial()

export const roleSchema = z.object({
  name: z.string().trim().min(2).max(80).regex(/^[A-Z][A-Z0-9_]*$/),
  description: optionalText(240),
  permissionIds: z.array(z.string().min(1)).optional(),
})

export const roleUpdateSchema = roleSchema.partial()

export const permissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  resource: z.string().trim().min(1).max(80),
  action: z.string().trim().min(1).max(80),
  description: optionalText(240),
})

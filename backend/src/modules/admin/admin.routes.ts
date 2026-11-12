import { Router, type Request } from 'express'
import { prisma } from '../../config/database.js'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { requireRoles } from '../../middlewares/role.middleware.js'
import { validateBody } from '../../middlewares/validate.middleware.js'
import { writeAuditLog } from '../../utils/audit-log.js'
import {
  gallerySchema,
  galleryUpdateSchema,
  newsSchema,
  newsUpdateSchema,
  permissionSchema,
  roleSchema,
  roleUpdateSchema,
  userUpdateSchema,
} from './admin.validation.js'

export const adminRoutes = Router()
adminRoutes.use(requireAuth, requireRoles('ADMIN'))

const getRouteId = (request: Request) => typeof request.params.id === 'string' ? request.params.id : undefined

adminRoutes.get('/overview', async (_req, res) => {
  const [users, roles, auditLogs, products, openContacts] = await Promise.all([
    prisma.user.count(),
    prisma.role.count(),
    prisma.auditLog.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.contactSubmission.count({ where: { isResolved: false } }),
  ])
  res.json({ data: { users, roles, auditLogs, products, openContacts } })
})

adminRoutes.get('/audit-logs', async (req, res) => {
  const data = await prisma.auditLog.findMany({
    include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: Math.min(Number(req.query.limit) || 50, 100),
  })
  res.json({ data })
})

adminRoutes.get('/users', async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search : undefined
  const data = await prisma.user.findMany({
    where: search ? { OR: [{ firstName: { contains: search, mode: 'insensitive' } }, { lastName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] } : undefined,
    include: { roles: { include: { role: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ data })
})

adminRoutes.patch('/users/:id', validateBody(userUpdateSchema), async (req, res) => {
  const id = getRouteId(req)
  if (!id) {
    res.status(400).json({ error: 'A valid user id is required' })
    return
  }
  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  const { status, roleIds } = req.body
  const user = await prisma.$transaction(async (transaction) => {
    if (roleIds) {
      await transaction.userRole.deleteMany({ where: { userId: id } })
      await transaction.userRole.createMany({ data: roleIds.map((roleId: string) => ({ userId: id, roleId })) })
    }
    return transaction.user.update({
      where: { id },
      data: status ? { status } : {},
      include: { roles: { include: { role: true } } },
    })
  })
  await writeAuditLog(req, 'UPDATE', 'User', user.id, { status, roleIds })
  res.json({ data: user })
})

adminRoutes.get('/news', async (_req, res) => {
  res.json({ data: await prisma.newsArticle.findMany({ orderBy: { createdAt: 'desc' } }) })
})

adminRoutes.post('/news', validateBody(newsSchema), async (req, res) => {
  const article = await prisma.newsArticle.create({ data: { ...req.body, publishedAt: req.body.isPublished ? new Date() : undefined } })
  await writeAuditLog(req, 'CREATE', 'NewsArticle', article.id, { title: article.title })
  res.status(201).json({ data: article })
})

adminRoutes.patch('/news/:id', validateBody(newsUpdateSchema), async (req, res) => {
  const id = getRouteId(req)
  if (!id) {
    res.status(400).json({ error: 'A valid news article id is required' })
    return
  }
  const existing = await prisma.newsArticle.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'News article not found' })
    return
  }
  const article = await prisma.newsArticle.update({
    where: { id },
    data: {
      ...req.body,
      publishedAt: req.body.isPublished === true && !existing.publishedAt ? new Date() : undefined,
    },
  })
  await writeAuditLog(req, 'UPDATE', 'NewsArticle', article.id, { title: article.title })
  res.json({ data: article })
})

adminRoutes.delete('/news/:id', async (req, res) => {
  const id = getRouteId(req)
  if (!id) {
    res.status(400).json({ error: 'A valid news article id is required' })
    return
  }
  const existing = await prisma.newsArticle.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'News article not found' })
    return
  }
  await prisma.newsArticle.delete({ where: { id } })
  await writeAuditLog(req, 'DELETE', 'NewsArticle', id)
  res.status(204).send()
})

adminRoutes.get('/gallery', async (_req, res) => {
  res.json({ data: await prisma.galleryItem.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] }) })
})

adminRoutes.post('/gallery', validateBody(gallerySchema), async (req, res) => {
  const item = await prisma.galleryItem.create({ data: req.body })
  await writeAuditLog(req, 'CREATE', 'GalleryItem', item.id, { title: item.title })
  res.status(201).json({ data: item })
})

adminRoutes.patch('/gallery/:id', validateBody(galleryUpdateSchema), async (req, res) => {
  const id = getRouteId(req)
  if (!id) {
    res.status(400).json({ error: 'A valid gallery item id is required' })
    return
  }
  const existing = await prisma.galleryItem.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'Gallery item not found' })
    return
  }
  const item = await prisma.galleryItem.update({ where: { id }, data: req.body })
  await writeAuditLog(req, 'UPDATE', 'GalleryItem', item.id, { title: item.title })
  res.json({ data: item })
})

adminRoutes.delete('/gallery/:id', async (req, res) => {
  const id = getRouteId(req)
  if (!id) {
    res.status(400).json({ error: 'A valid gallery item id is required' })
    return
  }
  const existing = await prisma.galleryItem.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'Gallery item not found' })
    return
  }
  await prisma.galleryItem.delete({ where: { id } })
  await writeAuditLog(req, 'DELETE', 'GalleryItem', id)
  res.status(204).send()
})

adminRoutes.get('/contacts', async (req, res) => {
  const resolved = req.query.resolved === 'true' ? true : req.query.resolved === 'false' ? false : undefined
  const data = await prisma.contactSubmission.findMany({
    where: resolved === undefined ? undefined : { isResolved: resolved },
    include: { respondedBy: { select: { id: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ data })
})

adminRoutes.patch('/contacts/:id/resolve', async (req, res) => {
  const id = getRouteId(req)
  if (!id) {
    res.status(400).json({ error: 'A valid contact submission id is required' })
    return
  }
  const existing = await prisma.contactSubmission.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'Contact submission not found' })
    return
  }
  const submission = await prisma.contactSubmission.update({
    where: { id },
    data: { isResolved: true, respondedAt: new Date(), respondedById: req.user!.id },
  })
  await writeAuditLog(req, 'RESOLVE', 'ContactSubmission', submission.id)
  res.json({ data: submission })
})

adminRoutes.get('/roles', async (_req, res) => {
  res.json({ data: await prisma.role.findMany({ include: { permissions: { include: { permission: true } }, _count: { select: { users: true } } }, orderBy: { name: 'asc' } }) })
})

adminRoutes.post('/roles', validateBody(roleSchema), async (req, res) => {
  const { permissionIds, ...roleData } = req.body
  const role = await prisma.role.create({
    data: { ...roleData, permissions: permissionIds ? { create: permissionIds.map((permissionId: string) => ({ permission: { connect: { id: permissionId } } })) } : undefined },
    include: { permissions: { include: { permission: true } } },
  })
  await writeAuditLog(req, 'CREATE', 'Role', role.id, { name: role.name })
  res.status(201).json({ data: role })
})

adminRoutes.patch('/roles/:id', validateBody(roleUpdateSchema), async (req, res) => {
  const id = getRouteId(req)
  if (!id) {
    res.status(400).json({ error: 'A valid role id is required' })
    return
  }
  const existing = await prisma.role.findUnique({ where: { id } })
  if (!existing) {
    res.status(404).json({ error: 'Role not found' })
    return
  }
  const { permissionIds, ...roleData } = req.body
  const role = await prisma.$transaction(async (transaction) => {
    if (permissionIds) {
      await transaction.rolePermission.deleteMany({ where: { roleId: id } })
      await transaction.rolePermission.createMany({ data: permissionIds.map((permissionId: string) => ({ roleId: id, permissionId })) })
    }
    return transaction.role.update({ where: { id }, data: roleData, include: { permissions: { include: { permission: true } } } })
  })
  await writeAuditLog(req, 'UPDATE', 'Role', role.id, { name: role.name })
  res.json({ data: role })
})

adminRoutes.get('/permissions', async (_req, res) => {
  res.json({ data: await prisma.permission.findMany({ orderBy: [{ resource: 'asc' }, { action: 'asc' }] }) })
})

adminRoutes.post('/permissions', validateBody(permissionSchema), async (req, res) => {
  const permission = await prisma.permission.create({ data: req.body })
  await writeAuditLog(req, 'CREATE', 'Permission', permission.id, { name: permission.name })
  res.status(201).json({ data: permission })
})

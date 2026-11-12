import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { createResource, deleteResource, listResource, updateResource, type ResourceName } from './resource-store.js'
import { writeAuditLog } from '../utils/audit-log.js'

export const resourceRouter = (name: ResourceName) => {
  const router = Router()
  router.use(requireAuth)
  router.get('/', async (req, res) => {
    const data = await listResource(name, String(req.query.search ?? ''))
    res.json({ data, total: data.length })
  })
  router.post('/', async (req, res) => {
    const data = await createResource(name, req.body)
    await writeAuditLog(req, 'CREATE', name, data.id, { fields: Object.keys(req.body) })
    res.status(201).json({ data })
  })
  router.patch('/:id', async (req, res) => {
    const data = await updateResource(name, String(req.params.id), req.body)
    if (!data) {
      res.status(404).json({ error: `${name} record not found` })
      return
    }
    await writeAuditLog(req, 'UPDATE', name, String(req.params.id), { fields: Object.keys(req.body) })
    res.json({ data })
  })
  router.delete('/:id', async (req, res) => {
    if (!await deleteResource(name, String(req.params.id))) {
      res.status(404).json({ error: `${name} record not found` })
      return
    }
    await writeAuditLog(req, 'DELETE', name, String(req.params.id))
    res.status(204).send()
  })
  return router
}

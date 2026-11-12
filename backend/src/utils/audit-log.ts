import { prisma } from '../config/database.js'
import type { Request } from 'express'
import type { Prisma } from '../generated/prisma/client.js'

export const writeAuditLog = async (request: Request, action: string, resource: string, resourceId?: string, details?: Record<string, unknown>) => {
  await prisma.auditLog.create({
    data: {
      userId: request.user?.id,
      action,
      resource,
      resourceId,
      details: details as Prisma.InputJsonObject | undefined,
      ipAddress: request.ip,
      userAgent: request.get('user-agent'),
    },
  })
}

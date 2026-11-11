import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createWorkspaceRecord, deleteWorkspaceRecord, getWorkspaceResource, updateWorkspaceRecord, type WorkspaceResource } from './workspaceApi'

export const useWorkspaceResource = (resource: WorkspaceResource | null, search = '') => useQuery({
  queryKey: ['workspace-resource', resource, search],
  queryFn: () => getWorkspaceResource(resource as WorkspaceResource, search),
  enabled: Boolean(resource),
})

export const useCreateWorkspaceRecord = (resource: WorkspaceResource) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (values: Record<string, unknown>) => createWorkspaceRecord(resource, values),
    onSuccess: () => client.invalidateQueries({ queryKey: ['workspace-resource', resource] }),
  })
}

export const useUpdateWorkspaceRecord = (resource: WorkspaceResource) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Record<string, unknown> }) => updateWorkspaceRecord(resource, id, values),
    onSuccess: () => client.invalidateQueries({ queryKey: ['workspace-resource', resource] }),
  })
}

export const useDeleteWorkspaceRecord = (resource: WorkspaceResource) => {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWorkspaceRecord(resource, id),
    onSuccess: () => client.invalidateQueries({ queryKey: ['workspace-resource', resource] }),
  })
}

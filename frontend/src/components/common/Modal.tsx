import type { ReactNode } from 'react'
export function Modal({ open, children }: { open: boolean; children: ReactNode }) { return open ? <div className="modal-backdrop">{children}</div> : null }

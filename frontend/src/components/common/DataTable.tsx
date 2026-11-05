import type { ReactNode } from 'react'
export function DataTable({ children }: { children: ReactNode }) { return <div className="table-wrap"><table>{children}</table></div> }

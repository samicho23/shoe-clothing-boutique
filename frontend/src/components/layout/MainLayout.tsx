import type { ReactNode } from 'react'
export function MainLayout({ children }: { children: ReactNode }) { return <main className="main"><div className="content">{children}</div></main> }

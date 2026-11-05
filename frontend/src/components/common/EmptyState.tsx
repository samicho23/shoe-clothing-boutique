export function EmptyState({ message = 'Nothing to show yet.' }: { message?: string }) { return <div className="empty-state"><h3>{message}</h3></div> }

import type { User } from '../../types/user'

const KEY = 'boutique_user'
export const authStore = {
  getUser: (): User | null => {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) as User : null
  },
  setUser: (user: User) => localStorage.setItem(KEY, JSON.stringify(user)),
  clear: () => { localStorage.removeItem(KEY); localStorage.removeItem('boutique_token') },
}

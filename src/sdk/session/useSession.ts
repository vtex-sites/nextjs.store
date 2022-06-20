import { useStore } from '@faststore/sdk'

import { sessionStore } from './store'

export const useSession = () => useStore(sessionStore)

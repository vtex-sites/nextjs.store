import { createStorageStore, useStore } from '@faststore/sdk'

const MAX_HISTORY_SIZE = 4

export interface History {
  term: string
  path: string
}

const historyStore = createStorageStore<History[]>(
  'faststore::searchHistory',
  []
)

export default function useSearchHistory(
  maxHistorySize: number = MAX_HISTORY_SIZE
) {
  const searchHistory = useStore<History[]>(historyStore)

  function addToSearchHistory(newHistory: History) {
    const set = new Set<string>()
    const newHistoryArray = [newHistory, ...searchHistory]
      .slice(0, maxHistorySize)
      .filter((item) => !set.has(item.term) && set.add(item.term), set)

    historyStore.set(newHistoryArray)
  }

  function clearSearchHistory() {
    historyStore.set([])
  }

  return {
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  }
}

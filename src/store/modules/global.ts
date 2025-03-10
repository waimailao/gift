import { defineStore, storeToRefs } from 'pinia'

const useGlobalStore = defineStore('GlobalStore', {
  state: () => ({

  }),
})

export const useGlobalStoreRefs = () => storeToRefs(useGlobalStore())

import { defineStore, storeToRefs } from 'pinia'

interface State {
  token: string | null
  user: any
  tgUser: any
  code: string
  avatar: string
}

const useUserStore = defineStore('UserStore', {
  state: (): State => {
    return {
      code: '',
      token: null,
      user: null,
      avatar: '',
      tgUser: null,
    }
  },
})

export const useUserStoreRefs = () => storeToRefs(useUserStore())

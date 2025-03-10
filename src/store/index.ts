import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const store = createPinia()

export function setupStore(app: App) {
  const persist = createPersistedState({
    auto: true,
    key: id => `GIFT_MINI_APP:${id}`,
    serializer: {
      serialize: (state) => {
        // TODO encrypt or compress or nothing
        return JSON.stringify(state)
      },
      deserialize: (state) => {
        // TODO decrypt or decompress or nothing
        return JSON.parse(state)
      },
    },
  })

  store.use(persist)

  app.use(store)
}

export { store }

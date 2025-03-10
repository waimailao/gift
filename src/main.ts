import { createApp, nextTick } from 'vue'
import { Lazyload } from 'vant'
import App from './App.vue'
import { setupStore } from './store'
import { setupRouter } from './router'
import { setupTelegram } from './services/telegram'
import './lib/sketch'

// style
import 'vant/lib/index.css'
import './style.less'

// init
async function bootstrap() {
  const app = createApp(App)
  // setup
  setupStore(app)
  setupTelegram()
  setupRouter(app)
  // mount
  app.mount('#app')

  await nextTick()
  // lazy load
  app.use(Lazyload)
  // app provide
  app.provide('appInstance', app)
  // wallet
}

bootstrap()

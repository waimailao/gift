import type { App } from 'vue'
import type { RouteLocationNormalized, RouteRecordName } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { TGClient } from '@/services/telegram'
import { useUserStoreRefs } from '@/store/modules/user'

// router
const Routes = [
  {
    path: '/Rank',
    name: 'Home',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'Rank',
    },
  },
  {
    path: '/',
    name: 'Play',
    component: () => import('@/views/Play/index.vue'),
    meta: {
      title: 'Play',
    },
  },
  {
    path: '/My',
    name: 'My',
    component: () => import('@/views/My/index.vue'),
    meta: {
      title: 'My',
    },
  },
  {
    path: '/Pay',
    name: 'Pay',
    component: () => import('@/views/Pay/index.vue'),
    meta: {
      title: 'Pay',
    },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: Routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})


export const WHITE_LIST: RouteRecordName[] = [
  'Home',
]

// config router
export function setupRouter(app: App) {
  app.use(router)
  const { token, tgUser } = useUserStoreRefs()
  // Routing Guard: 拦截未登录用户
  router.beforeEach((to: RouteLocationNormalized) => {
    return true
    if (TGClient.supported) {
      if (to.name === 'Home')
        TGClient.backButton.hide()
      else
        TGClient.backButton.show()
    }
    if (to.name && WHITE_LIST.includes(to.name)) {
      return true
    }
    else {
      if (token.value || tgUser.value)
        return true
      else
        return { name: 'Home' }
    }
  })

  if (!TGClient.supported)
    return
}

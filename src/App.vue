<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { BackendResponseData } from 'axios'
// components
import Background from '@/components/Background.vue'
// utils
import { useSetupAssets } from '@/assets'
import { useUserStoreRefs } from '@/store/modules/user'
import { Apis } from '@/api'
import { useApiClient } from '@/api/hooks/useClient'
import { TGClient } from '@/services/telegram'
import { logError } from '@/services/sentry'

const { token, user, avatar } = useUserStoreRefs()
const {  execute } = useSetupAssets()
// Setting Params
const isSettingPopoverShow = ref(false)
// Locale Params

useApiClient(async () => {
  await execute().catch((error) => {
    logError(error)
  })
  if (TGClient.supported) {
    // User Login
    const { token: newToken, userAvatar } = await Apis.user.login(decodeURIComponent(TGClient.initDataRaw as string)) as BackendResponseData
    token.value = newToken
    avatar.value = userAvatar
  }
  if (!token.value)
    return

  // Home Path
  const isToHome = location.pathname === '/' || location.pathname === ''
  // init info
  if (isToHome) {
    // account & game & skin
    const list = await Promise.all([
      Apis.user.account(),
    ])
    user.value = list[0] as any
  }
  else {
    // account & skin
    const list = await Promise.all([
      Apis.user.account(),
    ])
    user.value = list[0] as any
  }
  // another page reload home data
})




/**
 * @msg vue life circle
 */
onMounted(async () => {
  await nextTick()
  // fix: ios css :active effective
  document.addEventListener('touchstart', () => {}, false)
  // listen setting button click
  if (TGClient.supported)
    onSettingButtonClick()
})

onUnmounted(() => {
  document.removeEventListener('touchstart', () => {}, false)
})




// user click setting button
function onSettingButtonClick() {
  TGClient.settingsButton.on('click', () => {
    isSettingPopoverShow.value = true
  })
}

</script>

<template>
  <Background>
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </Background>
</template>

<style lang="less" scoped>
:deep(.van-popover__wrapper) {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 0px;
  height: 0px;
}
</style>

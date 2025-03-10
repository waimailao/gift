import { ref } from 'vue'
import { IMAGES } from './images/index'
import { IMAGES_LAZY } from './images/index_lazy'
import { NEW_IMAGES } from './new-images/index'
import { NEW_IMAGES_LAZY } from './new-images/index_lazy'
import { loadImage } from '@/utils/cdn'

export async function setupAssets() {
  return Promise.all([
    ...Object.values(NEW_IMAGES).map(url => loadImage(url)),
  ])
}

export function useSetupAssets() {
  const progress = ref(0)

  function execute() {
    const oldValue = Object.values(IMAGES)
    const newValue = Object.values(NEW_IMAGES)
    const values = [...oldValue, ...newValue]
    return Promise.all(
      values.map((src: any) => loadImage(src).finally(() => {
        progress.value += (Math.floor(1 / values.length * 1000) / 10)
      })),
    )
  }

  return {
    progress,
    execute,
  }
}

export { IMAGES, IMAGES_LAZY, NEW_IMAGES, NEW_IMAGES_LAZY }

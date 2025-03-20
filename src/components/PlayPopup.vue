<script setup lang="ts">
import {ref, onMounted, nextTick, toRefs, watch} from 'vue'
import lottie from 'lottie-web'
import { NEW_IMAGES } from '@/assets'
import {useApiClient} from "@/api/hooks/useClient";
import {Apis} from "@/api";
import {useUserStoreRefs} from "@/store/modules/user";
import {showNotify} from "vant";
interface Props {
  animation?: string,
  id?: number,
  price?: number,
}
const props = withDefaults(defineProps<Props>(), {
  animation: '',
  id: 0,
  price: 0,
})
const { user } = useUserStoreRefs()
const { animation,id } = toRefs(props)
const emits = defineEmits(['handleClose'])
const lottieDiv = ref<HTMLElement | null>(null)
const { execute: giftToType } = useApiClient(async (type:boolean): Promise<any>  => {
  if (type) {
    const detail = await Apis.user.giftToIntegral({}, id.value) as any
    console.log(true, detail.gift_tg_id);
    if (detail && detail.gift_tg_id && detail.integral_num) {
        user.value.integral_num = user.value.integral_num + detail.integral_num;
        emits('handleClose');
      showNotify({
        message: 'Successful',
        color: '#FFFFFF',
        background: '#000000',
      })
    }
  } else {
    const detail = await Apis.user.giftToGift({}, id.value) as any
    console.log(false, detail);
    if (detail && detail.gift_tg_id && detail.integral_num) {
        emits('handleClose');
      showNotify({
        message: 'Successful',
        color: '#FFFFFF',
        background: '#000000',
      })
    }
  }
}, { immediate: false, throttleWait: 900 })
watch(animation, (value) => {
  console.log(value);
  if (lottieDiv.value) {
    const animations = lottie.loadAnimation({
      container: lottieDiv.value, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(animation.value)
    });
    animations.play();
  }
})
onMounted(async () => {
  await nextTick()
  if (lottieDiv.value) {
    const animations = lottie.loadAnimation({
      container: lottieDiv.value, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(animation.value)
    });
    animations.play();
  }
})


</script>

<template>
<div class="popup-main">
  <img class="popup-bg" :src="NEW_IMAGES.POPUP_BG" alt="">
  <div class="popup-content">
    <div class="popop-zhan" />
    <div class="popop-center">
<!--            <img id="lottie-div" class="popup-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">-->
      <div ref="lottieDiv" id="lottie-div" class="popup-icon"  />
      <div class="popup-title">
        You won a gift
      </div>
      <div class="popup-desc">
        What do you want to do with him?
      </div>
    </div>
    <div>
      <div class="popup-button-top">
        <div v-on:click="() => giftToType()" class="popup-button-child">
          Get to Telegram
        </div>
        <div v-on:click="() => giftToType(true)" class="popup-button-child">
          Sell it for {{price}}
        </div>
      </div>
      <div  v-on:click="() => $emit('handleClose')" class="popup-button bottom-button">
        Keep in App
      </div>
    </div>
  </div>
</div>
</template>

<style lang="less" scoped>
.popup-main {
  position: relative;
  height: 100%;
  width: 100%;
  .popup-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 30px 0;
  }
  .popop-zhan {
  }
  .popop-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .popup-bg {
    position: absolute;
    z-index: 100;
    left: 0;
    top: 50%;
    width: 100%;
    transform: translateY(calc(-75%));
  }
  .popup-title {
    color: #F2F2F2;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 20px;
  }
  .popup-desc {
    margin-top: 6px;
    color: #F2F2F2;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
  .popup-icon {
    width: 149px;
  }
  .popup-button-top {
    width: 349px;
    height: 50px;
    display: flex;
    gap: 7px;
  }
  .popup-button-child {
    width: 171px;
    height: 50px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #3290EC;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    text-align: justify;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .popup-button {
    width: 349px;
    height: 50px;
    flex-shrink: 0;
    border-radius: 10px;
    background: #3290EC;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    text-align: justify;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    &.bottom-button {
      color: #FFF;
      text-align: justify;
      font-family: "PingFang SC";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      margin-top: 10px;
      line-height: normal;
    }
  }
}
</style>

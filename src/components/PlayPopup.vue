<script setup lang="ts">
import {ref, onMounted, nextTick, toRefs, watch} from 'vue'
import lottie from 'lottie-web'
import { NEW_IMAGES } from '@/assets'
import {useApiClient} from "@/api/hooks/useClient";
import {Apis} from "@/api";
import {useUserStoreRefs} from "@/store/modules/user";
import {showDialog} from "vant";
import {useI18n} from "vue-i18n";
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
const { t } = useI18n()
const { user } = useUserStoreRefs()
const { animation,id } = toRefs(props)
const emits = defineEmits(['handleClose'])
const lottieDiv = ref<HTMLElement | null>(null)
const animationDiv:any = ref(null)
const { execute: giftToType } = useApiClient(async (type:boolean): Promise<any>  => {
  if (type) {
    const detail = await Apis.user.giftToIntegral({}, id.value) as any
    console.log(true, detail.gift_tg_id);
    if (detail && detail.gift_tg_id && detail.integral_num) {
        user.value.integral_num = user.value.integral_num + detail.integral_num;
        emits('handleClose');
      animationDiv.value.destroy();
      showDialog({
        title: t('recharged',{'coin': detail.integral_num})
      })
    }
  } else {
    const detail = await Apis.user.giftToGift({}, id.value) as any
    console.log(false, detail);
    if (detail && detail.gift_tg_id && detail.integral_num) {
        emits('handleClose');
      animationDiv.value.destroy();
      showDialog({
        title: t('gift_send')
      })
    }
  }
}, { immediate: false, throttleWait: 900 })
watch(animation, (value) => {
  console.log(value);
  if (lottieDiv.value) {
    animationDiv.value = lottie.loadAnimation({
      container: lottieDiv.value, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(animation.value)
    });
    animationDiv.value.play();
  }
})
onMounted(async () => {
  await nextTick()
  if (lottieDiv.value) {
    animationDiv.value = lottie.loadAnimation({
      container: lottieDiv.value, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(animation.value)
    });
    animationDiv.value.play();
  }
})

function closePopup(){
  emits('handleClose');
  animationDiv.value.destroy();
}


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
        {{t('won')}}
      </div>
      <div class="popup-desc">
        {{t('want')}}
      </div>
    </div>
    <div>
      <div class="popup-button-top">
        <div v-on:click="() => giftToType()" class="popup-button-child">
          {{t('get')}}
        </div>
        <div v-on:click="() => giftToType(true)" class="popup-button-child">
          {{t('sell',{'price':price})}}
        </div>
      </div>
      <div  v-on:click="() => closePopup()" class="popup-button bottom-button">
        {{t('keep')}}
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
    color: #010105;
    font-size: 20px;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    margin-top: 20px;
  }
  .popup-desc {
    margin-top: 6px;
    color: #010105;
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
    font-weight: bold;
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
    font-weight: bold;
    line-height: normal;
    &.bottom-button {
      color: #0B3660;
      text-align: justify;
      font-family: "PingFang SC";
      font-size: 16px;
      font-style: normal;
      font-weight: bold;
      margin-top: 10px;
      line-height: normal;
      background: rgba(50, 144, 236, 0.30);
    }
  }
}
</style>

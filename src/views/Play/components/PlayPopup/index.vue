<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue'
import lottie from 'lottie-web'
import { NEW_IMAGES } from '@/assets'

const emits = defineEmits(['handleClose'])
const lottieDiv = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  if (lottieDiv.value) {
    const animation = lottie.loadAnimation({
      container: lottieDiv.value, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'data.json'
    });
    animation.play();
  }
})


</script>

<template>
<div class="popup-main">
  <img class="popup-bg" :src="NEW_IMAGES.POPUP_BG" alt="">
  <div class="popup-content">
    <div class="popop-zhan" />
    <div>
      <div class="popup-title">
        恭喜你获得
      </div>
<!--            <img id="lottie-div" class="popup-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">-->
      <div ref="lottieDiv" id="lottie-div" class="popup-icon"  />
    </div>
    <div>
      <div v-on:click="() => $emit('handleClose')" class="popup-button">
        回到游戏
      </div>
      <div class="popup-button bottom-button">
        我用Star抽中了年度Premium
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
    height: 110px;
  }
  .popup-bg {
    position: absolute;
    z-index: 100;
    left: 0;
    top: 50%;
    width: 100%;
    transform: translateY(calc(-50% - -26px));
  }
  .popup-title {
    color: #F2F2F2;
    text-align: justify;
    font-size: 26px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .popup-icon {
    margin-top: 20px;
    width: 149px;
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

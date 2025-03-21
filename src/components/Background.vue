<script setup lang="ts">
// utils
import { isiOS } from '@/constants/is'
import { useRoute } from 'vue-router'
// import { useI18n } from 'vue-i18n'

// const { t } = useI18n()
const route = useRoute()
// const router = useRouter()
</script>

<template>
  <div class="container" :class="{ 'ios-container': isiOS() }">
    <div class="launch-content" :class="{'pay': route.name == 'Pay'}">
      <slot />
<!--      <div v-if="route.name != 'Pay'" class="bottom-nav">-->
<!--        <div v-on:click="() => router.push({ name: 'Home' })" class="nav" :class="{'selected': route.name == 'Home'}">-->
<!--          <div class="nav-img">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="27" viewBox="0 0 26 27" fill="none">-->
<!--              <path d="M0.992302 12.7058H6.3202C6.98173 12.7058 7.3125 13.0174 7.3125 13.6405V26.0652C7.3125 26.6884 6.98173 26.9999 6.3202 26.9999H0.992302C0.330767 26.9999 0 26.6884 0 26.0652V13.6405C0 13.0174 0.330767 12.7058 0.992302 12.7058Z" />-->
<!--              <path d="M10.4366 0H15.8759C16.5003 0 16.8125 0.303738 16.8125 0.911215V26.0888C16.8125 26.6963 16.5003 27 15.8759 27H10.4366C9.81219 27 9.5 26.6963 9.5 26.0888V0.911215C9.5 0.303738 9.81219 0 10.4366 0Z" fill="#3290EC"/>-->
<!--              <path d="M19.5759 6.35303H25.1116C25.7039 6.35303 26 6.66608 26 7.29219V26.0609C26 26.687 25.7039 27.0001 25.1116 27.0001H19.5759C18.9836 27.0001 18.6875 26.687 18.6875 26.0609V7.29219C18.6875 6.66608 18.9836 6.35303 19.5759 6.35303Z" fill="#3290EC"/>-->
<!--            </svg>-->
<!--          </div>-->
<!--          <div class="nav-title">-->
<!--            {{t('rank')}}-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-on:click="() => router.push({ name: 'Play' })" class="nav" :class="{'selected': route.name == 'Play'}">-->
<!--          <div class="nav-img">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="20" viewBox="0 0 32 20" fill="none">-->
<!--              <path fill-rule="evenodd" clip-rule="evenodd" d="M23.5234 1.30746C24.3055 0.648548 25.1903 0.241572 26.1778 0.0865331C27.1653 -0.0685054 28.0892 -0.0152109 28.9496 0.246417C29.81 0.508044 30.5335 0.968315 31.1201 1.62723C31.7067 2.28614 32 3.10009 32 4.06908V14.9993C32 15.8133 31.8778 16.5642 31.6334 17.2522C31.3889 17.9402 31.037 18.5119 30.5775 18.9673C30.1179 19.4227 29.5606 19.7328 28.9056 19.8975C28.2505 20.0623 27.5124 20.0284 26.6911 19.7958C26.1436 19.6408 25.645 19.4324 25.1952 19.1708C24.7455 18.9092 24.3153 18.6427 23.9047 18.3714C23.494 18.1001 23.0834 17.8481 22.6728 17.6156C22.2621 17.383 21.8222 17.228 21.3529 17.1505H10.6764C10.2071 17.1505 9.7623 17.2619 9.34189 17.4848C8.92148 17.7076 8.50596 17.9644 8.09533 18.2551C7.68469 18.5458 7.25451 18.8365 6.80477 19.1272C6.35503 19.4179 5.86618 19.6408 5.33822 19.7958C4.51696 20.0284 3.7788 20.0623 3.12374 19.8975C2.46868 19.7328 1.90651 19.4179 1.43721 18.9528C0.967919 18.4877 0.61106 17.9063 0.366636 17.2086C0.122212 16.5109 0 15.7551 0 14.9412V4.06908C0.117324 3.11947 0.479071 2.31521 1.08524 1.6563C1.69141 0.997384 2.39536 0.532269 3.19707 0.260951C3.99878 -0.010366 4.84449 -0.0685054 5.73419 0.0865331C6.62389 0.241572 7.41094 0.648548 8.09533 1.30746C8.38863 1.59816 8.80904 1.96637 9.35655 2.41211C9.90406 2.85785 10.5249 3.29389 11.2191 3.72025C11.9132 4.1466 12.6709 4.50998 13.4922 4.81036C14.3135 5.11075 15.1543 5.26094 16.0147 5.26094C16.8555 5.26094 17.6621 5.10591 18.4345 4.79583C19.2068 4.48575 19.9157 4.11753 20.561 3.69118C21.2062 3.26482 21.7782 2.82878 22.2768 2.38304C22.7754 1.93731 23.191 1.57878 23.5234 1.30746ZM6.65811 14.5051C7.02964 14.5051 7.37672 14.4373 7.69936 14.3016C8.022 14.166 8.30553 13.9819 8.54995 13.7493C8.79438 13.5167 8.98503 13.2406 9.12191 12.9208C9.25878 12.601 9.32722 12.2571 9.32722 11.8888C9.32722 11.1524 9.06813 10.5274 8.54995 10.0138C8.03178 9.50028 7.40116 9.24349 6.65811 9.24349C6.28659 9.24349 5.93951 9.31132 5.61687 9.44698C5.29423 9.58264 5.01069 9.7716 4.76627 10.0138C4.52185 10.2561 4.33119 10.5371 4.19432 10.8569C4.05744 11.1766 3.989 11.5206 3.989 11.8888C3.989 12.6253 4.24809 13.2454 4.76627 13.7493C5.28445 14.2532 5.91506 14.5051 6.65811 14.5051ZM26.6911 10.5516H28.011V13.197H26.6911V14.5051H24.022V13.197H22.6728V10.5516H24.022V9.24349H26.6911V10.5516Z" fill="#999999"/>-->
<!--            </svg>-->
<!--          </div>-->
<!--          <div class="nav-title">-->
<!--            {{t('play')}}-->
<!--          </div>-->
<!--        </div>-->
<!--        <div v-on:click="() => router.push({ name: 'My' })" class="nav" :class="{'selected': route.name == 'My'}">-->
<!--          <div class="nav-img">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">-->
<!--              <path fill-rule="evenodd" clip-rule="evenodd" d="M18.818 0H11.4998C7.45798 0 4.18147 3.13401 4.18147 7C4.18147 10.866 7.45798 14 11.4998 14C15.5415 14 18.818 10.866 18.818 7V0ZM22.9895 22.87C22.9895 22.87 23.1045 16 11.5029 16C-0.100765 16 0.0163271 22.87 0.0163271 22.87C-0.097629 23.487 0.398969 24 1.06807 24H21.9377C22.6068 24 23.0773 23.494 22.9895 22.87Z" fill="#999999"/>-->
<!--            </svg>-->
<!--          </div>-->
<!--          <div class="nav-title">-->
<!--            {{t('my')}}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>

  </div>
</template>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overscroll-behavior-y: none;
  &.ios-container {
    height: 100vh;
  }
  &.shake-animation {
    animation: screen-shake-animation 320ms linear infinite;
    -webkit-animation: screen-shake-animation 320ms linear infinite;
  }
  .launch-background {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 480px;
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;

  }
  .launch-content {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: auto;
    overscroll-behavior: none;
    background: #FFF;
    &.pay {
      background: #010101;
    }
  }
  .bottom-nav {
    height: 72px;
    width: 100%;
    position: fixed;
    background: #FFF;
    bottom: 0;
    border-top: 1px solid #C8C1C1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;
    .nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-family: 'OPPOSansBold';

      .nav-title {
        color: #999;
        text-align: justify;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        cursor: pointer;
      }
      .nav-img {
        svg {
          path {
            fill: #999;
          }
        }
      }
      &.selected {
        .nav-title {
          color: #3290EC;
        }
        .nav-img svg path {
          fill: #3290EC;
        }
      }
    }
  }
}

@media screen and (min-width: 385px){
  .container {

  }
}
</style>

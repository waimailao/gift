<script setup lang="ts">
import {nextTick, onMounted, ref,watch} from 'vue'
import { throttle } from 'lodash-es'
import {showConfirmDialog,showDialog, Skeleton} from 'vant'

import { Popup } from 'vant'
import { TG_ICON } from '@/constants/is'
import PlayPopup from '@/components/PlayPopup.vue'
import { useIntervalFn } from '@vueuse/core'

// utils
import { NEW_IMAGES } from '@/assets'
import { useI18n } from 'vue-i18n'
import {useApiClient} from "@/api/hooks/useClient";
import type { BackendResponseData } from 'axios'
import {Apis} from "@/api";
import {TGClient} from "@/services/telegram";
import {sleep} from "@/utils";
import {useUserStoreRefs} from "@/store/modules/user";
import {useRouter} from "vue-router";
import {ENV} from "@/constants/env";
const { user } = useUserStoreRefs()
const { t } = useI18n()
const router = useRouter()
const cardList = ref<HTMLElement | null>(null)
const playBox = ref<HTMLElement | null>(null)
const listTop:any = ref(null)
const listAll:any = ref(null)
const showPopup = ref(false)
const listMain:any = ref(null)
const list25 = ref(null)
const animation = ref('')
const animationId = ref(0)
const price = ref(0)
const invoicelink = ref('')
const transaction_id = ref(0)
const list50 = ref(null)
const list100 = ref(null)
const canClick = ref(true)
const showFirst = ref(false)
const { isFetching } = useApiClient(async () => {
  const list = await Apis.user.gifts() as BackendResponseData
  listTop.value = list[0].gifts;
  listAll.value = list
  listMain.value = list[0].gifts.concat(list[0].gifts).concat(list[0].gifts).sort(() => Math.random() - 0.5);
  list25.value = list[0].gifts.concat(list[0].gifts).concat(list[0].gifts);
  list50.value = list[1].gifts.concat(list[1].gifts).concat(list[1].gifts)
  list100.value = list[2].gifts.concat(list[2].gifts).concat(list[2].gifts)
})
const navType = ref(4)
function changeType(type: number) {
  navType.value = type;
  if (type == 4) {
    listMain.value = list25.value
    listTop.value = listAll.value[0].gifts;
  }
  if (type == 5) {
    listMain.value = list50.value
    listTop.value = listAll.value[1].gifts;
  }
  if (type == 6) {
    listMain.value = list100.value
    listTop.value = listAll.value[2].gifts;
  }
  listMain.value = listMain.value.sort(() => Math.random() - 0.5);
}

// Star Payment Interval Init
const { execute: paymentStatusExecute } = useApiClient(async () => {
  const detail = await Apis.user.check({'transaction_id': transaction_id.value}) as any
  // const detail = await Apis.user.check({'transaction_id': '742545834956033361'}) as any
  console.log(detail.transaction_info,detail.transaction_info.pay_status)
  if (detail.transaction_info.pay_status == 1) {
    starPaymentPause()
    await doLottery(true);
  }
}, { immediate: false, throttleWait: 900 })

// Handle Wallet Unbinding
async function handleWalletUnbinding(action: string): Promise<any> {
  if (action === 'cancel') {
    return Promise.resolve(true)
  }
  canClick.value = false;
  await doLottery();
  return Promise.resolve(true)
}

function clickButton() {
  if (!canClick.value) return;
  showConfirmDialog({
    title: t('play_coin',{'coin': navType.value == 6 ? 100 : (navType.value == 5 ? 50 : 25)}),
    confirmButtonText: t('yes'),
    cancelButtonText: t('no'),
    showCancelButton: true,
    confirmButtonColor: 'black',
    beforeClose: handleWalletUnbinding,
  })
}

const { execute: doLottery } = useApiClient(async (flag:boolean = false)  => {
  canClick.value = false;
  const detail = await Apis.user.doLottery({}, navType.value) as any
  console.log(detail);
  if (detail.raward_type == 1) {
    changePlayList(detail.integral);
    return;
  }
  if (detail.raward_type == 2) {
    console.log(detail);
    listMain.value[21].star_price = detail.gifts.star_price;
    listMain.value[21].gift_tg_id = detail.gifts.gift_tg_id;
    listMain.value[21].is_limit = detail.gifts.is_limit;
    listMain.value[21].id = detail.gifts.id;
    animation.value = detail.gifts.gift_animation;
    animationId.value = detail.gifts.lottery_id;
    price.value = detail.gifts.star_price;
    const integral_num = navType.value == 6 ? 100 : (navType.value == 5 ? 50 : 25);
    if (!flag) {
      user.value.integral_num = user.value.integral_num - integral_num;
    }
    starPaymentPause()
    playGame()
    return;
  }
  invoicelink.value = detail.invoicelink;
  transaction_id.value = detail.transaction_id;

  onClickTelegramStarBoost()
}, { immediate: false, throttleWait: 900 })

const { pause: starPaymentPause, resume: starPaymentResume } = useIntervalFn(() => {
  paymentStatusExecute();
}, 1000, { immediate: false })

// user click telegram star boost
const onClickTelegramStarBoost = throttle(() => {
  if (invoicelink.value) {
    TGClient.shareLink(invoicelink.value, false)
    // resume
    setTimeout(() => {
      canClick.value = true;
      starPaymentResume();
    }, 2000)
  }
}, 1000)

function playGame(integral:number = 0) {
  console.log(1)
  canClick.value = false;
  const transformLength = (playBox.value!.clientWidth - 48) / 3 * 20 + 8 * 18
  cardList.value!.children[2].classList.remove('hover')
  if (cardList.value) {
    cardList.value!.style.transition = `transform 4s cubic-bezier(0.35, 0.08, 0.26, 0.93) 0s`;
    cardList.value!.style.transform = 'translateX(-' + transformLength + 'px)';
    openPopup(integral);
  }
}
async function openPopup(integral:number = 0) {
  await sleep(3850)
  cardList.value!.children[21].classList.add('hover')
  await sleep(250)
  if (integral) {
    showDialog({
      title: t('get_coin',{'coin': integral}),
    })
    changeType(navType.value);
    closePopup()
  } else {
    showPopup.value = true;
  }
  canClick.value = true;
}

function changePlayList(integral: number) {
  listMain.value = listMain.value.concat(
    [
      {
        'star_price': 5,
        'gift_tg_id': 1,
        'is_limit': 0,
      },
      {
        'star_price': 6,
        'gift_tg_id': 1,
        'is_limit': 0,
      },
      {
        'star_price': 7,
        'gift_tg_id': 1,
        'is_limit': 0,
      },
      {
        'star_price': 8,
        'gift_tg_id': 1,
        'is_limit': 0,
      },
      {
        'star_price': 9,
        'gift_tg_id': 1,
        'is_limit': 0,
      },
      {
        'star_price': 10,
        'gift_tg_id': 1,
        'is_limit': 0,
      },
    ]
  ).sort(() => Math.random() - 0.5);
  listMain.value[21].star_price = integral;
  listMain.value[21].gift_tg_id = 1;
  listMain.value[21].is_limit = 0;
  playGame(integral);
}

function closePopup() {
  listMain.value = listMain.value.sort(() => Math.random() - 0.5);
  const transformLength = (playBox.value!.clientWidth - 48) / 3 - 8
  cardList.value!.style.transition = `none`;
  cardList.value!.style.transform = 'translateX(-' + transformLength + 'px)';
  cardList.value!.children[2].classList.add('hover')
  showPopup.value = false;
}
function closeFirstPopup() {
  console.log(1111)
  showFirst.value = false;
  user.value.first_lottery = 0;
}
function joinChannel() {
  TGClient.shareLink(ENV.CHANNEL_LINK,false)
}
async function clickFirstPopup() {
  user.value.first_lottery = 0;
  showFirst.value = false;
  await doLottery();
}
watch(user, (value) => {
  console.log(value);
  if (user.value.first_lottery) {
    showFirst.value = true;
  }
})
onMounted(async () => {
  await nextTick()
  console.log(user.value.first_lottery)
  if (user.value.first_lottery) {
    showFirst.value = true;
  }
})
</script>

<template>
  <div class="main">
    <div class="play-head">
      <div class="left">
        {{ t('play_title') }}
      </div>
      <div v-on:click="() => router.push({ name: 'Pay' })" class="right">
        <svg class="right-add" xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
          <g clip-path="url(#clip0_483_652)">
            <path d="M7.00269 1.319C8.83389 1.319 10.498 2.05139 11.6959 3.26005H11.7013C12.9046 4.45855 13.6477 6.12198 13.6477 7.94254C13.6477 9.77911 12.9046 11.4378 11.7013 12.6411L11.6595 12.6776C10.461 13.8552 8.81303 14.5822 7.00274 14.5822C5.17686 14.5822 3.51818 13.8391 2.32025 12.6411H2.31488C1.11154 11.4378 0.37915 9.77915 0.37915 7.94259C0.37915 6.12203 1.11154 4.45855 2.31484 3.2601L2.3566 3.22361C3.5551 2.04121 5.19235 1.319 7.00269 1.319Z" fill="#3290EC"/>
            <path d="M6.27026 4.74088V7.2102H3.80099C3.3927 7.2102 3.06323 7.53971 3.06323 7.94258C3.06323 8.36146 3.39275 8.68566 3.80099 8.68566H6.27026V11.1501C6.27026 11.5579 6.60509 11.8879 7.00265 11.8879C7.41089 11.8879 7.74572 11.5579 7.74572 11.1501V8.68566H10.215C10.6233 8.68566 10.948 8.36146 10.948 7.94258C10.948 7.53971 10.6233 7.2102 10.215 7.2102H7.74572V4.74088C7.74572 4.34328 7.41089 4.00849 7.00265 4.00849C6.60509 4.00849 6.27026 4.34328 6.27026 4.74088Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_483_652">
              <rect width="14" height="14" fill="white" transform="translate(0 0.883835)"/>
            </clipPath>
          </defs>
        </svg>
        <div class="right-amount">
          <div>{{user.integral_num}}</div>
          <img class="right-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
      </div>
    </div>
    <Skeleton v-if="isFetching" class="card-list" loading>
      <template #template>
        <div class="card">
        </div>
        <div class="card">
        </div>
        <div class="card">
        </div>
        <div class="card">
        </div>
        <div class="card">
        </div>
      </template>
    </Skeleton>

    <div v-else class="card-list">
      <div class="card-box">
        <div class="card-content" :class="[{'animation1': navType == 4},{'animation2': navType == 5},{'animation3': navType == 6}]">
          <div v-for="(item, i) in listTop" :key="i" class="card">
            <div class="card-chance">
              {{item.probability + '%'}}
            </div>
            <img class="card-icon" :src="TG_ICON[TG_ICON.findIndex(ii => ii.value === parseInt(item.gift_tg_id))].icon" alt="">
                    <img class="card-icon-tag" v-if="item.is_limit" :src="NEW_IMAGES.GIFT_TAG" alt="">
            <div class="card-button">
              <div>
                {{item.star_price}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
        </div>

      </div>
    </div>
    <div class="play-title second">
      {{ t('play_title_second') }}
    </div>
    <div class="play-nav">
      <div v-on:click="()=>changeType(4)" class="play-nav-child" :class="{'active': navType == 4}">
        <div CLASS="play-nav-title">
          25
        </div>
        <img class="play-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(5)" class="play-nav-child" :class="{'active': navType == 5}">
        <div CLASS="play-nav-title">
          50
        </div>
        <img class="play-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(6)" class="play-nav-child" :class="{'active': navType == 6}">
        <div CLASS="play-nav-title">
          100
        </div>
        <img class="play-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
    </div>
    <div class="play-detail">
      <div class="play-box" ref="playBox">
        <Skeleton v-if="isFetching" class="play-card-list" loading>
          <template #template>
            <div class="card">
            </div>
            <div class="card">
            </div>
            <div class="card">
            </div>
            <div class="card">
            </div>
            <div class="card">
            </div>
          </template>
        </Skeleton>
        <div ref="cardList" class="play-card-list">
          <div v-for="(i, index) in listMain" :index="index" :key="index"  class="card" :class="{'hover': index == 2}">
            <img class="card-icon" :src="TG_ICON[TG_ICON.findIndex(ii => ii.value === parseInt(i.gift_tg_id))].icon" alt="">
            <img class="card-icon-tag" v-if="i.is_limit" :src="NEW_IMAGES.GIFT_TAG" alt="">
            <div class="card-button">
              <div>
                {{i.star_price}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
        </div>
        <div class="play-bg">
          <svg class="play-bg-top" xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 6.52197L10 -0.000204086H0L5 6.52197Z" fill="#3290EC"/>
          </svg>
          <svg class="play-bg-middle" xmlns="http://www.w3.org/2000/svg" width="2" height="123" viewBox="0 0 2 123" fill="none">
            <path d="M1 0.5V122.5" stroke="#3290EC" stroke-width="0.5" stroke-linecap="square" stroke-dasharray="4 4"/>
          </svg>
          <svg class="play-bg-bottom" xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5 0L10 6.56853H0L5 0Z" fill="#3290EC"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="play-button" v-on:click="() => clickButton()">
      <div>
        {{ t('play_button') }}
      </div>
      <div class="play-button-icon">
        <img class="play-dice" :src="NEW_IMAGES.DICE" alt="">
        <img class="play-round" :src="NEW_IMAGES.ROUND" alt="">
      </div>
    </div>
    <div v-on:click="() => joinChannel()" class="join_channel">
      <img :src="NEW_IMAGES.JOIN_CHANNEL" alt="">
    </div>
    <Popup v-model:show="showPopup" class="blue-popup" teleport="#app">
      <PlayPopup :id="animationId" :price="price" :animation="animation" @handle-close="closePopup" />
    </Popup>
    <Popup v-model:show="showFirst" class="first-popup" position="center" teleport="#app">
      <div class="first-content">
        <img class="first-icon" :src="NEW_IMAGES.FIRST_ICON" alt="">
        <div class="first-title">
          {{ t('play_tip') }}
        </div>
        <div class="first-button">
          <div v-on:click="() => closeFirstPopup()" class="first-button-child">
            {{ t('play_look') }}
          </div>
          <div  v-on:click="() => clickFirstPopup()" class="first-button-child">
            {{ t('free_lottery') }}
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>

<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'OPPOSansBold';
  min-height: 100%;
  padding-bottom: 100px;

  .play-head {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    margin-top: 20px;
    width: 100%;
    .left {
      color: #010105;
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 70.403px;
      height: 20.241px;
      color: #CF8A37;
      font-family: "DINAlternate";
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      padding: 0 6px;
      gap: 8px;
      border-radius: 14px;
      border: 1px solid #3290EC;
      background: #E8EDF3;
      .right-icon {
        width: 12.242px;
        height: 13.14px;
      }
      .right-add {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        line-height: 14px;
      }
      .right-amount {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
  .play-title {
    display: flex;
    justify-content: left;
    width: 100%;
    padding-left: 15px;
    margin-top: 20px;
    color: #010105;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

  }

  .card-list {
    display: flex;
    width: 100%;
    padding: 16px 16px;
    gap: 4.5px;
    .card-box {
      width: 100%;
      padding: 12px 8px;
      background: #E8EDF3;
      border-radius: 14px;
      overflow-x: hidden;
      .card-content {
        display: flex;
        gap: 4.5px;
        /*动画名称*/
        /*设置秒数*/
        animation-timing-function: linear;
        /*速度曲线*/
        animation-iteration-count: infinite;
        /*播放次数*/
        animation-direction: alternate;
        /*逆向播放*/
        animation-play-state: running;
        &.animation1 {
          animation-name: card-beat1;
          animation-duration: 8s;

        }
        &.animation2 {
          animation-name: card-beat2;
          animation-duration: 10s;

        }
        &.animation3 {
          animation-name: card-beat3;
          animation-duration: 10s;

        }
      }
    }

    .card {
      width: calc((100% - 18px)/5);
      height: 91px;
      flex-shrink: 0;
      border-radius: 8px;
      background: #FFF;
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: center;
      .card-chance {
        color: #EF6C27;
        text-align: justify;
        font-family: "DINAlternate";
        font-size: 10.4px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        width: 40.998px;
        height: 13.094px;
        flex-shrink: 0;
        border-radius: 0px 0px 5.85px 5.85px;
        background: #FFF3E9;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .card-icon {
        width: 40px;
        margin-top: 7px;
      }
      .card-icon-tag {
        width: 24px;
        height: 24px;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 9;
      }
      .card-button {
        margin-top: 5px;
        width: 45px;
        height: 20px;
        flex-shrink: 0;
        border-radius: 15px;
        background: #F5F5F5;
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;
        color: #000;
        font-family: "DINAlternate";
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        .card-button-icon {
          width: 11px;
          height: 12px;
        }
      }
    }
  }
  .play-nav {
    display: flex;
    padding: 0 20px;
    gap: 12px;
    margin-top: 18px;
    width: 100%;
    .play-nav-child {
      display: flex;
      gap: 8px;
      width: 100%;
      height: 34px;
      background: #EDF5FD;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .play-nav-title {
        color: #000;
        text-align: justify;
        font-family: "DINAlternate";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      .play-nav-icon {
        width: 20px;
        height: 21px;
      }
      &.active {
        background: #3290EC;
        .play-nav-title {
          color: #FFF;
        }
      }
    }
  }
  .play-detail {
    padding: 20px;
    width: 100%;

  }
  .play-box {
    width: 100%;
    height: 170px;
    border-radius: 14px;
    background: #E8EDF3;
    overflow-x: hidden;
    position: relative;
    .play-card-list {
      display: flex;
      width: 100%;
      gap: 8px;
      padding-top: 15px;
      transform: translateX(calc(( -100% + 70.667px) / 3));
      .card {
        width: calc((100% - 48px) / 3);
        height: 140px;
        flex-shrink: 0;
        border-radius: 8px;
        background: #FFF;
        display: flex;
        position: relative;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        padding: 14px 0;
        padding-top: 28px;
        &.hover {
          background: #CFE7FF;
        }
        .card-icon {
          width: 45px;
        }
        .card-icon-tag {
          width: 43px;
          height: 43px;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 9;
        }
        .card-button {
          width: 45px;
          height: 20px;
          flex-shrink: 0;
          border-radius: 15px;
          background: #F5F5F5;
          display: flex;
          gap: 4px;
          align-items: center;
          justify-content: center;
          color: #000;
          font-family: "DINAlternate";
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: normal;
          .card-button-icon {
            width: 11px;
            height: 12px;
          }
        }
      }
    }
    .play-bg {
      .play-bg-top {
        position: absolute;
        top: 15px;
        left: 50%;
        transform: translateX(-50%);
      }
      .play-bg-middle {
        position: absolute;
        top: 23px;
        left: 50%;
        transform: translateX(-50%);
      }
      .play-bg-bottom {
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .play-button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    height: 50px;
    border-radius: 10px;
    border: 1px solid #0090FF;
    background: #3290EC;
    width: calc(100% - 40px);
    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    .play-button-icon {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      .play-dice {
        position: relative;
        width: 22.514px;
        height: 21px;
        animation-name: beat;
        /*动画名称*/
        animation-duration: .75s;
        /*设置秒数*/
        animation-timing-function: linear;
        /*速度曲线*/
        animation-iteration-count: infinite;
        /*播放次数*/
        animation-direction: alternate;
        /*逆向播放*/
        animation-play-state: running;
      }
      .play-round {
        width: 11px;
        height: 4px;
        animation-name: round-beat;
        /*动画名称*/
        animation-duration: .75s;
        /*设置秒数*/
        animation-timing-function: linear;
        /*速度曲线*/
        animation-iteration-count: infinite;
        /*播放次数*/
        animation-direction: alternate;
        /*逆向播放*/
        animation-play-state: running;
      }
    }
  }
  .join_channel {
    margin-top: 16px;
    cursor: pointer;
    width: calc(100% - 40px);
    img {
      width: 100%;
    }
  }
}
.blue-popup {
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.first-popup {
  background: transparent;
  width: calc(100% - 110px);
  height: 177px;
  margin-left: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  .first-content {
    width: 100%;
    height: 100%;
    border-radius: 13.5px;
    background: #FFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    .first-icon {
      margin-top: 14.5px;
      width: 61px;
      height: 61px;
    }
    .first-title {
      margin-top: 17px;
      color: #010105;
      text-align: justify;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      span {
        color: #49A3ED;
      }
    }
    .first-button {
      margin-top: 30px;
      display: flex;
      width: 100%;
      padding: 0 55px;
      justify-content: space-between;
      color: #3382FB;
      text-align: justify;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      .first-button-child {
        cursor: pointer;
      }
    }
  }
}
@keyframes round-beat {
  0% {
    width: 5px;
  }

  100% {
    width: 11px;
  }
}
@keyframes card-beat1 {
  0% {
    transform: translateX(0px);
  }

  100% {
    transform: translateX(-160%);
  }
}
@keyframes card-beat2 {
  0% {
    transform: translateX(0px);
  }

  100% {
    transform: translateX(-220%);
  }
}
@keyframes card-beat3 {
  0% {
    transform: translateX(0px);
  }

  100% {
    transform: translateX(-220%);
  }
}
@keyframes beat {
  0% {
    top: -5px;
  }

  100% {
    top: 1px;
  }
}
.van-overlay {
  background: rgba(255, 255, 255, .7) !important;
  backdrop-filter: blur(8px);
}
</style>
<style>

</style>

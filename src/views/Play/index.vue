<script setup lang="ts">
import {ref} from 'vue'
import { throttle } from 'lodash-es'
import {showConfirmDialog,showDialog, Skeleton} from 'vant'

import { Popup } from 'vant'
import { TG_ICON } from '@/constants/is'
import PlayPopup from '@/components/PlayPopup.vue'
import { useIntervalFn } from '@vueuse/core'

// utils
import { NEW_IMAGES } from '@/assets'
import {useApiClient} from "@/api/hooks/useClient";
import type { BackendResponseData } from 'axios'
import {Apis} from "@/api";
import {TGClient} from "@/services/telegram";
import {sleep} from "@/utils";
import {useUserStoreRefs} from "@/store/modules/user";
import {useRouter} from "vue-router";
const { user } = useUserStoreRefs()
const router = useRouter()
const cardList = ref<HTMLElement | null>(null)
const playBox = ref<HTMLElement | null>(null)
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
const { isFetching } = useApiClient(async () => {
  const list = await Apis.user.gifts() as BackendResponseData
  const listTop = await Apis.user.topGifts() as BackendResponseData
  listAll.value = listTop.slice(0,5)
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
  }
  if (type == 5) {
    listMain.value = list50.value
  }
  if (type == 6) {
    listMain.value = list100.value
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
    await doLottery();
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
    title: '以' + (navType.value == 6 ? 100 : (navType.value == 5 ? 50 : 25)) + '火花们进行游戏？',
    confirmButtonText: '是',
    cancelButtonText: '否',
    showCancelButton: true,
    confirmButtonColor: 'black',
    beforeClose: handleWalletUnbinding,
  })
}

const { execute: doLottery } = useApiClient(async ()  => {
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
      title: '恭喜您获得'+ integral +'积分',
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

</script>

<template>
  <div class="main">
    <div class="play-head">
      <div class="left">
        您可以100%获得奖品
      </div>
      <div class="right">
        <div v-on:click="() => router.push({ name: 'Pay' })" class="right-add">+</div>
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
      <div v-for="(item, i) in listAll" :key="i" class="card">
        <div class="card-chance">
          {{Math.floor(item.probability * 100) + '%'}}
        </div>
        <img class="card-icon" :src="TG_ICON[TG_ICON.findIndex(ii => ii.value === parseInt(item.gift_tg_id))].icon" alt="">
<!--        <img class="card-icon-tag" v-if="item.is_limit" :src="NEW_IMAGES.GIFT_TAG" alt="">-->
        <div class="card-button">
          <div>
            {{item.star_price}}
          </div>
          <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
      </div>
    </div>
    <div class="play-title second">
      参与游戏
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
        100% winning rate
      </div>
      <div class="play-button-icon">
        <img class="play-dice" :src="NEW_IMAGES.DICE" alt="">
        <img class="play-round" :src="NEW_IMAGES.ROUND" alt="">
      </div>
    </div>
    <Popup v-model:show="showPopup" class="blue-popup" teleport="#app">
      <PlayPopup :id="animationId" :price="price" :animation="animation" @handle-close="closePopup" />
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
  padding-bottom: 120px;

  .play-head {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    margin-top: 20px;
    width: 100%;
    .left {
      color: #FFF;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 14px;
      min-width: 70.403px;
      height: 20.241px;
      background: #1C1C1E;
      color: #CF8A37;
      font-family: "DINAlternate";
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      padding: 0 6px;
      gap: 8px;
      .right-icon {
        width: 12.242px;
        height: 13.14px;
      }
      .right-add {
        width: 18px;
        height: 18px;
        border: 1px solid #CF8A37;
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
    color: #FFF;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    &.second {
      margin-top: 40px;
    }
  }

  .card-list {
    display: flex;
    flex-wrap:wrap;
    width: 100%;
    padding: 12px 24px;
    gap: 4.5px;
    .card {
      width: calc((100% - 18px)/5);
      height: 91px;
      flex-shrink: 0;
      border-radius: 8px;
      background: #2E2E2E;
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
        background: #4D280B;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .card-icon {
        width: 40px;
        height: 40px;
        margin-top: 7px;
      }
      .card-icon-tag {
        width: 34px;
        height: 34px;
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
        background: #545454;
        display: flex;
        gap: 4px;
        align-items: center;
        justify-content: center;
        color: #F2F2F2;
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
      background: #1C1C1E;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      .play-nav-title {
        color: #FFF;
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
        background: #0090FF;
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
    background: #1C1C1E;
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
        background: #2E2E2E;
        display: flex;
        position: relative;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;
        padding: 14px 0;
        &.hover {
          background: #4C4C4C;
        }
        .card-icon {
          width: 45px;
          height: 50px;
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
          background: #545454;
          display: flex;
          gap: 4px;
          align-items: center;
          justify-content: center;
          color: #F2F2F2;
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
}
.blue-popup {
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}
@keyframes round-beat {
  0% {
    width: 5px;
  }

  100% {
    width: 11px;
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
</style>

<script setup lang="ts">
import {ref} from 'vue'
import { throttle } from 'lodash-es'
import { Popup } from 'vant'


// utils
import { NEW_IMAGES } from '@/assets'
import { useUserStoreRefs } from '@/store/modules/user'
import {useApiClient} from "@/api/hooks/useClient";
import type { BackendResponseData } from 'axios'
import {Apis} from "@/api";
import {TGClient} from "@/services/telegram";

const { user } = useUserStoreRefs()
const cardList = ref<HTMLElement | null>(null)
const listAll:any = ref(null)
const isPlaying = ref(0)
const showPopup = ref(true)
const playMain:any = ref(null)
const listMain:any = ref(null)
const list25 = ref(null)
const list50 = ref(null)
const list100 = ref(null)
const play25 = ref(null)
const play50 = ref(null)
const play100 = ref(null)
useApiClient(async () => {
  const list = await Apis.user.gifts() as BackendResponseData
  listAll.value = list.list_100_percent
  listMain.value = list.list_tg_star_25
  list25.value = list.list_tg_star_25
  list50.value = list.list_tg_star_50
  list100.value = list.list_tg_star_100
  playMain.value = list.buttons.play_star_25
  play25.value = list.buttons.play_star_25
  play50.value = list.buttons.play_star_50
  play100.value = list.buttons.play_star_100
  console.log(listAll.value)
})
console.log(user)
const navType = ref(0)
function changeType(type: number) {
  navType.value = type;
  if (type == 0) {
    listMain.value = list25.value
    playMain.value = play25.value
  }
  if (type == 1) {
    listMain.value = list50.value
    playMain.value = play50.value
  }
  if (type == 2) {
    listMain.value = list100.value
    playMain.value = play100.value
  }
  console.log(playMain.value)
}

// Star Payment Interval Init
const { execute: paymentStatusExecute } = useApiClient(async () => {
  const detail = await Apis.user.check({}) as any
  isPlaying.value = 2;
  console.log(detail);
  playGame()
}, { immediate: false, throttleWait: 900 })

// user click telegram star boost
const onClickTelegramStarBoost = throttle(() => {
  if (isPlaying.value == 2) return;
  if (playMain.value.invoice_link) {
    TGClient.shareLink(playMain.value.invoice_link, false)
    // resume
    isPlaying.value = 1;
    setTimeout(() => {
      paymentStatusExecute();
      console.log(123)
    }, 2000)
  }
}, 1000)

function playGame() {
  if (cardList.value) {
    cardList.value!.style.transition = `transform 4s cubic-bezier(0.35, 0.08, 0.26, 0.93) 0s`;
    cardList.value!.style.transform = `translateX(-2400px)`;
  }
}
</script>

<template>
  <div class="main">
    <div class="play-title">
      您可以100%获得奖品
    </div>

    <div class="card-list">
      <div v-for="(item, i) in listAll" :key="i" class="card">
        <div class="card-chance">
          {{item.chance * 100 + '%'}}
        </div>
        <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        <div class="card-button">
          <div>
            {{item.start_count}}
          </div>
          <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
      </div>

    </div>
    <div class="play-title second">
      参与游戏
    </div>
    <div class="play-nav">
      <div v-on:click="()=>changeType(0)" class="play-nav-child" :class="{'active': navType == 0}">
        <div CLASS="play-nav-title">
          25
        </div>
        <img class="play-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(1)" class="play-nav-child" :class="{'active': navType == 1}">
        <div CLASS="play-nav-title">
          50
        </div>
        <img class="play-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(2)" class="play-nav-child" :class="{'active': navType == 2}">
        <div CLASS="play-nav-title">
          100
        </div>
        <img class="play-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
    </div>
    <div class="play-detail">
      <div class="play-box">
        <div ref="cardList" class="play-card-list">
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div v-for="(i, index) in listMain" :key="index"  class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                {{i.start_count}}
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="play-button" v-on:click="() => onClickTelegramStarBoost()">
      <div>
        100% winning rate
      </div>
      <div class="play-button-icon">
        <img class="play-dice" :src="NEW_IMAGES.DICE" alt="">
        <img class="play-round" :src="NEW_IMAGES.ROUND" alt="">
      </div>
    </div>
    <Popup v-model:show="showPopup" class="blue-popup" teleport="#app">
      <div class="popup-main">
        <img class="popup-bg" :src="NEW_IMAGES.POPUP_BG" alt="">
        <div class="popup-content">
          <div class="popop-zhan">

          </div>
          <div>
            <div class="popup-title">
              恭喜你获得
            </div>
            <img class="popup-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
          </div>
          <div>
            <div v-on:click="() => showPopup = false" class="popup-button">
              回到游戏
            </div>
            <div class="popup-button bottom-button">
              我用Star抽中了年度Premium
            </div>
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
    .play-card-list {
      display: flex;
      width: 100%;
      gap: 8px;
      padding-top: 15px;
      transform: translateX(-90px);
      .card {
        width: 100px;
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
        .card-icon {
          width: 45px;
          height: 50px;
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

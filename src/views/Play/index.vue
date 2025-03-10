<script setup lang="ts">
import {ref} from 'vue'

// utils
import { NEW_IMAGES } from '@/assets'
// store
import { useUserStoreRefs } from '@/store/modules/user'

const { user } = useUserStoreRefs()
const cardList = ref<HTMLElement | null>(null)
console.log(user)
const navType = ref(0)
function changeType(type: number) {
  navType.value = type;
}
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
      <div class="card">
        <div class="card-chance">
          0.278%
        </div>
        <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        <div class="card-button">
          <div>
            15
          </div>
          <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
      </div>
      <div class="card">
        <div class="card-chance">
          0.278%
        </div>
        <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        <div class="card-button">
          <div>
            15
          </div>
          <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
      </div>
      <div class="card">
        <div class="card-chance">
          0.278%
        </div>
        <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        <div class="card-button">
          <div>
            15
          </div>
          <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
      </div>
      <div class="card">
        <div class="card-chance">
          0.278%
        </div>
        <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        <div class="card-button">
          <div>
            15
          </div>
          <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
      </div>
      <div class="card">
        <div class="card-chance">
          0.278%
        </div>
        <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        <div class="card-button">
          <div>
            15
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
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
          <div class="card">
            <img class="card-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            <div class="card-button">
              <div>
                15
              </div>
              <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="play-button" v-on:click="() => playGame()">
      <div>
        100% winning rate
      </div>
      <div class="play-button-icon">
        <img class="play-dice" :src="NEW_IMAGES.DICE" alt="">
        <img class="play-round" :src="NEW_IMAGES.ROUND" alt="">
      </div>
    </div>
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
@keyframes playGames {
  0% {
    transform: translateX(0px);
  }
  20% {
    transform: translateX(-800px);
  }
  40% {
    transform: translateX(-1400px);
  }
  60% {
    transform: translateX(-1800px);
  }
  80% {
    transform: translateX(-2000px);
  }
  100% {
    transform: translateX(-2100px);
  }
}
</style>

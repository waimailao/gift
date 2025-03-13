<script setup lang="ts">
import {ref} from 'vue'

// utils
import { NEW_IMAGES } from '@/assets'
// import type { BackendResponseData } from 'axios'
// store
import { useUserStoreRefs } from '@/store/modules/user'
// import {Apis} from "@/api";
// import {TGClient} from "@/services/telegram";
// import {useApiClient} from "@/api/hooks/useClient";

const { user } = useUserStoreRefs()
// const { isFetching } = useApiClient(async () => {
//   const list = await Apis.user.gifts() as BackendResponseData
//   console.log(list)
// })
console.log(user)
const navType = ref(0)
function changeType(type:number) {
  navType.value = type;
}
</script>

<template>
  <div class="main">
    <div class="home-icon">
      <img :src="NEW_IMAGES.HOME_COIN" alt="">
    </div>
    <div class="home-title">
      排行榜
    </div>
    <div class="home-desc">
      在这里您可以看到最幸运的玩家
    </div>
    <div class="home-nav">
      <div v-on:click="()=>changeType(0)" class="home-nav-child" :class="{'active': navType == 0}">
        <div CLASS="home-nav-title">
          25
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(1)" class="home-nav-child" :class="{'active': navType == 1}">
        <div CLASS="home-nav-title">
          50
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(2)" class="home-nav-child" :class="{'active': navType == 2}">
        <div CLASS="home-nav-title">
          100
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
    </div>
    <div class="home-list">
      <div class="list-item">
        <div class="avatar">
          <img :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
        <div class="list-main">
          <div class="list-content">
            <div class="list-title">
              Huge Griksg
            </div>
            <div class="list-desc">
              1190 游戏们•28720火花们•3头奖们
            </div>
          </div>
          <div class="list-icon">
            <img :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
          </div>
        </div>
      </div>
      <div class="list-item">
        <div class="avatar">
          <img :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
        </div>
        <div class="list-main">
          <div class="list-content">
            <div class="list-title">
              Huge Griksg
            </div>
            <div class="list-desc">
              1190 游戏们•28720火花们•3头奖们
            </div>
          </div>
          <div class="list-icon">
            <img :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
          </div>
        </div>
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
  .home-icon {
    display: flex;
    margin-top: 18px;
    align-items: center;
    justify-content: center;
    width: 126px;
    height: 126px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .home-title {
    margin-top: 8px;
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .home-desc {
    color: #969696;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 18px;
  }
  .home-nav {
    display: flex;
    padding: 0 20px;
    gap: 12px;
    margin-top: 18px;
    width: 100%;
    .home-nav-child {
      display: flex;
      gap: 8px;
      width: 100%;
      height: 34px;
      background: #1C1C1E;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      .home-nav-title {
        color: #FFF;
        text-align: justify;
        font-family: "DINAlternate";
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      .home-nav-icon {
        width: 20px;
        height: 21px;
      }
      &.active {
        background: #0090FF;
      }
    }
  }
  .home-list {
    padding-left: 20px;
    margin-top: 32px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .list-item {
      display: flex;
      gap: 5px;
      .avatar {
        width: 34px;
        height: 34px;
        img  {
          width: 100%;
          height: 100%;
        }
      }
      .list-main {
        display: flex;
        border-bottom: 1px solid rgba(217, 217, 217, 0.20);
        padding-right: 44px;
        justify-content: space-between;
        width: 100%;
        .list-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          .list-title {
            color: #FFF;
            font-size: 14px;
          }
          .list-desc {
            color: #999;
            font-size: 11px;
          }
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import {ref} from 'vue'
import {Skeleton, SkeletonAvatar } from 'vant'
// utils
import { NEW_IMAGES } from '@/assets'
import { TG_ICON } from '@/constants/is'
// store
import { useUserStoreRefs } from '@/store/modules/user'
import {useApiClient} from "@/api/hooks/useClient";
import {Apis} from "@/api";
import type { BackendResponseData } from 'axios'
const { user } = useUserStoreRefs()
const myList:any = ref(null)
const { isFetching } = useApiClient(async () => {
  const list = await Apis.user.myGifts() as BackendResponseData
  myList.value = list.data;
})
const navType = ref(0)
function changeType(type: number) {
  navType.value = type;
}
</script>

<template>
  <div class="main">
    <Skeleton v-if="isFetching" loading>
      <template #template>
        <SkeletonAvatar  class="my-icon" />
      </template>
    </Skeleton>
    <div v-else class="my-icon">
      <img :src="user.photo_url" alt="">
    </div>

    <div class="my-title">
      排行榜
    </div>
    <div class="my-desc">
      <div>
        50
      </div>
      <img :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
    </div>
    <div class="my-nav">
      <div v-on:click="()=>changeType(0)" class="my-nav-child" :class="{'active': navType == 0}">
        <div CLASS="my-nav-title">
          All
        </div>
        <div class="my-nav-bottom" />
      </div>
      <div v-on:click="()=>changeType(1)" class="my-nav-child" :class="{'active': navType == 1}">
        <div CLASS="my-nav-title">
          Rare
        </div>
        <div class="my-nav-bottom" />
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
        <div class="card">
        </div>
        <div class="card">
        </div>
        <div class="card">
        </div>
      </template>
    </Skeleton>
    <div v-else class="card-list">
      <div  v-for="(item, index) in myList" :index="index" class="card">
        <img class="card-icon" :src="TG_ICON[TG_ICON.findIndex(ii => ii.value === parseInt(item.gifts.gift_tg_id))].icon" alt="">
        <img class="card-icon-tag" :src="NEW_IMAGES.GIFT_TAG" alt="">
        <div class="card-button">
          <div>
            {{item.award_star}}
          </div>
          <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
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
  .my-icon {
    display: flex;
    margin-top: 18px;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .my-title {
    margin-top: 20px;
    color: #FFF;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .my-desc {
    color: #FFF;
    text-align: center;
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    img {
      width: 20px;
      height: 21px;
    }
  }
  .my-nav {
    display: flex;
    padding: 0 20px;
    gap: 12px;
    margin-top: 18px;
    width: 100%;
    .my-nav-child {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50%;
      gap: 10px;
      .my-nav-title {
        color: #E8EDF3;
        text-align: justify;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
      .my-nav-bottom {
        width: 23px;
        height: 5px;
        flex-shrink: 0;
        border-radius: 3px;
        background: #010101;
      }
      &.active {
        .my-nav-title {
          color: #3290EC;
        }
        .my-nav-bottom {
          background: #3290EC;
        }
      }
    }
  }
  .card-list {
    display: flex;
    flex-wrap:wrap;
    width: 100%;
    padding: 12px 24px;
    gap: 8px;
    .card {
      width: calc((100% - 24px)/4);
      height: 112px;
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
</style>

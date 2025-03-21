<script setup lang="ts">
import {ref} from 'vue'
import {Skeleton,Popup,List } from 'vant'
// utils
import { NEW_IMAGES } from '@/assets'
import { TG_ICON } from '@/constants/is'
import PlayPopup from '@/components/PlayPopup.vue'
// store
import { useUserStoreRefs } from '@/store/modules/user'
import {useApiClient} from "@/api/hooks/useClient";
import {Apis} from "@/api";
import type { BackendResponseData } from 'axios'
import {useI18n} from "vue-i18n";
const { t } = useI18n()
const { user } = useUserStoreRefs()
const myList:any = ref(null)
const page = ref(1)
const animation = ref('')
const finished = ref(false)
const showPopup = ref(false)
const animationId = ref(0)
const price = ref(0)
const navType = ref(0)

const { isFetching, execute: firstExecute  } = useApiClient(async () => {
  const list = await Apis.user.myGifts(navType.value ? 'limit' : 'all',page.value,10) as BackendResponseData
  // console.log(list,list.has_more);
  if (myList.value && page.value > 1) {
    myList.value = myList.value.concat(list.data)
  } else {
    myList.value = list.data;
  }
  if (list.has_more) {
    finished.value = false;
  } else {
    finished.value = true;
  }
})
function changeType(type: number) {
  if (type == navType.value) return;

  navType.value = type;
  myList.value = null;
  page.value = 1;
  firstExecute()
}

const { execute: giftExecute } = useApiClient(async (id: number) => {
  const detail = await Apis.user.giftAnimation(id) as any
  if (detail) {
    animation.value = detail.gift_animation;
    showPopup.value = true;
  }
  console.log(detail)
}, { immediate: false, throttleWait: 900 })
function clickGift(item: any) {
  console.log(item);
  animationId.value = item.id;
  price.value = item.award_star;
  giftExecute(item.gift_tg_id);
}
function toNext() {
  if (isFetching.value || page.value > 1) {
    return;
  }
  console.log(page.value);
  page.value = page.value + 1;

  firstExecute()
}
function reFresh() {
  page.value = 1;
  firstExecute()
}
function closePopup() {
  showPopup.value = false;
  reFresh()
}
</script>

<template>
  <div class="main">
<!--    <Skeleton v-if="isFetching" loading>-->
<!--      <template #template>-->
<!--        <SkeletonAvatar  class="my-icon" />-->
<!--      </template>-->
<!--    </Skeleton>-->
    <div class="my-icon">
      <img :src="user.photo_url" alt="">
    </div>

    <div class="my-title">
      {{user.username || `${user.firstName} ${user.lastName}`}}
    </div>
    <div class="my-desc">
      <div>
        {{user.integral_num}}
      </div>
      <img :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
    </div>
    <div class="my-nav">
      <div v-on:click="()=>changeType(0)" class="my-nav-child" :class="{'active': navType == 0}">
        <div CLASS="my-nav-title">
          {{t('my_all')}}
        </div>
        <div class="my-nav-bottom" />
      </div>
      <div v-on:click="()=>changeType(1)" class="my-nav-child" :class="{'active': navType == 1}">
        <div CLASS="my-nav-title">
          {{t('my_rare')}}
        </div>
        <div class="my-nav-bottom" />
      </div>
    </div>

    <List :model-value="isFetching" class="card-list-main" :finished="!isFetching && finished" :offset="15" @load="toNext">
      <Skeleton v-if="isFetching && page == 1" class="card-list" loading>
        <template #template>
          <div v-for="(item, index) in [0,1,2,3,4,5,6,7]" :index="index" :item="item" class="card">
          </div>
        </template>
      </Skeleton>
      <div v-else class="card-list">
        <div v-for="(item, index) in myList" v-on:click="() => clickGift(item)" :index="index" class="card">
          <img class="card-icon" :src="TG_ICON[TG_ICON.findIndex(ii => ii.value === parseInt(item.gift_tg_id))].icon" alt="">
          <img class="card-icon-tag" v-if="item.gifts.is_limit" :src="NEW_IMAGES.GIFT_TAG" alt="">
          <div class="card-button">
            <div>
              {{item.award_star}}
            </div>
            <img class="card-button-icon" :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
          </div>
        </div>
        <div v-for="i in [0,1,2,3]" :index="i" class="card zhan"></div>
      </div>
    </List>
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
  padding-bottom: 120px;
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
    color: #010105;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .my-desc {
    color: #000;
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
      cursor: pointer;
      .my-nav-title {
        color: #010105;
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
        background: #FFF;
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
  .card-list-main {
    width: 100%;
  }
  .card-list {
    display: flex;
    flex-wrap:wrap;
    width: 100%;
    padding: 12px 24px;
    gap: 8px;
    height: calc(100vh - 390px);
    .card {
      width: calc((100% - 24px)/4);
      height: 112px;
      flex-shrink: 0;
      border-radius: 8px;
      background: #E8EDF3;
      display: flex;
      position: relative;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;
      padding: 14px 0;
      &.zhan {
        background: transparent;
      }
      .card-icon {
        width: 45px;
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
        background: #FFF;
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
}
.blue-popup {
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: rgba(255, 255, 255, .7) !important;
  backdrop-filter: blur(8px);
}
</style>

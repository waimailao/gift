<script setup lang="ts">
import {ref} from 'vue'
import {Skeleton, SkeletonAvatar, SkeletonParagraph,List } from 'vant'

// utils
import { NEW_IMAGES } from '@/assets'
// store
import {useApiClient} from "@/api/hooks/useClient";
import type { BackendResponseData } from 'axios'
import {Apis} from "@/api";
import {useI18n} from "vue-i18n";
// import {TGClient} from "@/services/telegram";
const { t } = useI18n()
const listAll:any = ref(null)
const nowList:any = ref(null)
const navType = ref(4)
const page = ref(1)
const finished = ref(false)
const { isFetching, execute: firstExecute } = useApiClient(async () => {
  const list = await Apis.user.rankList(navType.value,page.value,10) as BackendResponseData
  console.log(list);
  if (nowList.value && page.value > 1) {
    nowList.value = nowList.value.concat(list.ranks)
  } else {
    nowList.value = list.ranks;
  }
  if (list.has_more) {
    finished.value = false;
  } else {
    finished.value = true;
  }
})
function toNext() {
  if (isFetching.value || page.value > 1) {
    return;
  }
  console.log(page.value);
  page.value = page.value + 1;
  firstExecute()
}

function changeType(type:number) {
  if (type == navType.value) return;

  navType.value = type;
  nowList.value = null;
  page.value = 1;
  firstExecute()
}

</script>

<template>
  <div class="main">
    <div class="home-icon">
      <img :src="NEW_IMAGES.HOME_COIN" alt="">
    </div>
    <div class="home-title">
      {{t('rank')}}
    </div>
    <div class="home-desc">
      {{t('home_desc')}}
    </div>
    <div class="home-nav">
      <div v-on:click="()=>changeType(4)" class="home-nav-child" :class="{'active': navType == 4}">
        <div CLASS="home-nav-title">
          25
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(5)" class="home-nav-child" :class="{'active': navType == 5}">
        <div CLASS="home-nav-title">
          50
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(6)" class="home-nav-child" :class="{'active': navType == 6}">
        <div CLASS="home-nav-title">
          100
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
    </div>
    <List :model-value="isFetching" class="card-list-main" :finished="!isFetching && finished" :offset="15" @load="toNext">

    <Skeleton v-if="isFetching && page == 1" class="home-list" loading>
      <template #template>
        <div class="list-item">
          <div class="avatar">
            <SkeletonAvatar class="avatar" />
          </div>
          <div class="list-main">
            <div class="list-content">
              <div class="list-title skeleton">
                <SkeletonParagraph  />
              </div>
              <div class="list-desc skeleton">
                <SkeletonParagraph />
              </div>
            </div>
            <div class="list-icon">
              <img :src="NEW_IMAGES.RANK_1" alt="">
            </div>
          </div>
        </div>
        <div class="list-item">
          <div class="avatar">
            <SkeletonAvatar class="avatar" />
          </div>
          <div class="list-main">
            <div class="list-content">
              <div class="list-title skeleton">
                <SkeletonParagraph  />
              </div>
              <div class="list-desc skeleton">
                <SkeletonParagraph />
              </div>
            </div>
            <div class="list-icon">
              <img :src="NEW_IMAGES.RANK_2" alt="">
            </div>
          </div>
        </div>
        <div class="list-item">
          <div class="avatar">
            <SkeletonAvatar class="avatar" />
          </div>
          <div class="list-main">
            <div class="list-content">
              <div class="list-title skeleton">
                <SkeletonParagraph  />
              </div>
              <div class="list-desc skeleton">
                <SkeletonParagraph />
              </div>
            </div>
            <div class="list-icon">
              <img :src="NEW_IMAGES.RANK_3" alt="">
            </div>
          </div>
        </div>
        <div class="list-item">
          <div class="avatar">
            <SkeletonAvatar class="avatar" />
          </div>
          <div class="list-main">
            <div class="list-content">
              <div class="list-title skeleton">
                <SkeletonParagraph  />
              </div>
              <div class="list-desc skeleton">
                <SkeletonParagraph />
              </div>
            </div>
            <div class="list-icon">
              <img class="rank4" :src="NEW_IMAGES.RANK_4" alt="">
            </div>
          </div>
        </div>
      </template>
    </Skeleton>
    <div v-else class="home-list">
      <div  v-for="(item, index) in nowList" :key="index"  class="list-item">
        <div class="avatar">
          <img :src="item.user.photo_url" alt="">
        </div>
        <div class="list-main">
          <div class="list-content">
            <div class="list-title">
              {{item.user.nick_name}}
            </div>
            <div class="list-desc">
              {{t('home_card',{'game':item.lottery_count,'credit':item.total_award,'limit':item.limit_raward_count})}}
            </div>
          </div>
          <div class="list-icon">
            <img v-if="item.rank == 1" :src="NEW_IMAGES.RANK_1" alt="">
            <img v-else-if="item.rank == 2" :src="NEW_IMAGES.RANK_2" alt="">
            <img v-else-if="item.rank == 3" :src="NEW_IMAGES.RANK_3" alt="">
            <img v-else class="rank4" :src="NEW_IMAGES.RANK_4" alt="">
          </div>
        </div>
      </div>
      <div  class="list-item zhan">
        <div class="zhanwei">
        </div>
      </div>
    </div>
    </List>
  </div>
</template>

<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'OPPOSansBold';
  padding-bottom: 110px;
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
    color: #010105;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .home-desc {
    color: #999;
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
      background: #E8EDF3;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .home-nav-title {
        color: #000;
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
        .home-nav-title {
          color: #FFF;
        }
      }
    }
  }
  .card-list-main {
    width: 100%;
  }
  .home-list {
    padding-left: 20px;
    margin-top: 32px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 0;
    height: calc(100vh - 403.5px);
    .list-item {
      display: flex;
      gap: 5px;
      &.zhan {
        height: 80px;
        .zhanwei {
          height: 80px;
          width: 100%;
        }
      }
      .avatar {
        width: 34px;
        height: 34px;
        img  {
          width: 34px;
          height: 34px;
          border-radius: 17px;
        }
      }
      .list-main {
        display: flex;
        padding-bottom: 16px;
        border-bottom: 1px solid #D9D9D9;
        padding-right: 44px;
        justify-content: space-between;
        width: 100%;
        .list-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
          &.skeleton {
            gap: 0;
          }
          .list-title {
            color: #473515;
            font-size: 14px;
            &.skeleton {
              width: 80px;
            }
          }
          .list-desc {
            color: #999;
            font-size: 11px;
            &.skeleton {
              width: 120px;
            }
          }
        }
        .list-icon {
          &.skeleton {
            height: 25px;
          }
          img {
            height: 25px;
            &.rank4 {
              padding: 0 7px;
            }
          }
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import {ref} from 'vue'
import {Skeleton, SkeletonAvatar, SkeletonParagraph } from 'vant'

// utils
import { NEW_IMAGES } from '@/assets'
// store
import {useApiClient} from "@/api/hooks/useClient";
import type { BackendResponseData } from 'axios'
import {Apis} from "@/api";
// import {TGClient} from "@/services/telegram";
const listAll:any = ref(null)
const nowList:any = ref(null)
const { isFetching } = useApiClient(async () => {
  const list = await Apis.user.allRankList() as BackendResponseData
  listAll.value = list;
  nowList.value = list[1].ranks;
})
const navType = ref(1)
function changeType(type:number) {
  navType.value = type;
  nowList.value = listAll.value[type].ranks;
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
      <div v-on:click="()=>changeType(1)" class="home-nav-child" :class="{'active': navType == 1}">
        <div CLASS="home-nav-title">
          25
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(2)" class="home-nav-child" :class="{'active': navType == 2}">
        <div CLASS="home-nav-title">
          50
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
      <div v-on:click="()=>changeType(3)" class="home-nav-child" :class="{'active': navType == 3}">
        <div CLASS="home-nav-title">
          100
        </div>
        <img class="home-nav-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
      </div>
    </div>
    <Skeleton v-if="isFetching" class="home-list" loading>
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
              {{item.total_cost}}游戏们•{{item.total_award}}火花们•{{item.lottery_count}}头奖们
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
    padding-bottom: 32px;
    padding-right: 0;
    .list-item {
      display: flex;
      gap: 5px;
      .avatar {
        width: 34px;
        height: 34px;
        img  {
          width: 100%;
          height: 100%;
          border-radius: 17px;
        }
      }
      .list-main {
        display: flex;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(217, 217, 217, 0.20);
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
            color: #FFF;
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

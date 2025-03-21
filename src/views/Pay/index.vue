<script setup lang="ts">
import {ref} from 'vue'
import {showNotify } from 'vant'
import { useIntervalFn } from '@vueuse/core'
// utils
import { NEW_IMAGES } from '@/assets'
// store
import {useApiClient} from "@/api/hooks/useClient";
import type { BackendResponseData } from 'axios'
import {Apis} from "@/api";
import {throttle} from "lodash-es";
import {TGClient} from "@/services/telegram";
import {useUserStoreRefs} from "@/store/modules/user";
import {useRouter} from "vue-router";
import {useI18n} from "vue-i18n";
// import {TGClient} from "@/services/telegram";
const { t } = useI18n()
const { user } = useUserStoreRefs()
const router = useRouter()
const list:any = ref(null)
const canClick = ref(true)
const invoicelink = ref('')
const transaction_id = ref(0)
useApiClient(async () => {
  const lists = await Apis.user.strIntegralList() as BackendResponseData
  list.value = lists;
  console.log(lists);
})
const { execute: paymentStatusExecute } = useApiClient(async () => {
  const detail = await Apis.user.check({'transaction_id': transaction_id.value}) as any
  // const detail = await Apis.user.check({'transaction_id': '742545834956033361'}) as any
  if (detail.transaction_info.pay_status == 1) {
    starPaymentPause()
    showNotify({
      message: 'Payment Successful',
      color: '#FFFFFF',
      background: '#000000',
    })
    user.value.integral_num = detail.user_integral_balance;
  }
}, { immediate: false, throttleWait: 900 })
const { pause: starPaymentPause, resume: starPaymentResume } = useIntervalFn(() => {
  paymentStatusExecute();
}, 1000, { immediate: false })
const { execute: clickButton } = useApiClient(async (item: any) => {
  starPaymentPause();
  if (!canClick.value) return;
  canClick.value = false;
  const detail = await Apis.user.doBuyIntegral({}, item.id) as any
  invoicelink.value = detail.invoicelink;
  transaction_id.value = detail.transaction_id;
  onClickTelegramStarBoost()
}, { immediate: false, throttleWait: 900 })

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

</script>

<template>
  <div class="main">
    <div v-on:click="() => router.push({ name: 'Play' })" class="back-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="13" viewBox="0 0 8 13" fill="none">
        <path d="M1.42244 5.67816L0.795543 6.3039C0.684506 6.41609 0.681037 6.59422 0.78976 6.70178L6.03857 12.042C6.14614 12.1507 6.32541 12.1472 6.43645 12.0362L7.20446 11.2682C7.31549 11.1571 7.31896 10.9779 7.21024 10.8703L2.91218 6.4959L7.20099 2.03939C7.30855 1.93298 7.30508 1.75601 7.1952 1.64498L6.43414 0.885067C6.3231 0.77403 6.14729 0.771717 6.03973 0.879284L1.42244 5.67816Z" fill="#F2F2F2"/>
      </svg>
    </div>
    <img class="pay-bg" :src="NEW_IMAGES.PAY_BG" alt="">
    <div class="pay-icon">
      <img :src="NEW_IMAGES.COIN" alt="">
    </div>
    <div class="pay-title">
      {{t('gift_point')}}
    </div>
    <div class="pay-desc">
      {{t('select_point')}}
    </div>
    <div class="card-list">
      <div  v-for="(item, index) in list" :key="index" class="card" v-on:click="()=>{clickButton(item)}">
        <div class="card-star">
          <img v-if="index == 0" class="star-icon" :src="NEW_IMAGES.STAR_1">
          <img v-if="index == 1" class="star-icon" :src="NEW_IMAGES.STAR_2">
          <img v-if="index == 2" class="star-icon" :src="NEW_IMAGES.STAR_3">
          <img v-if="index == 3" class="star-icon" :src="NEW_IMAGES.STAR_4">
          <img v-if="index == 4" class="star-icon" :src="NEW_IMAGES.STAR_5">
          <img v-if="index == 5" class="star-icon" :src="NEW_IMAGES.STAR_6">
          <div class="star-text">
            {{item.tg_star_amount}} points
          </div>
        </div>
        <div class="card-coin">
          <img class="coin-icon" :src="NEW_IMAGES.HOME_NAV_COIN">
          <div class="coin-text">
            {{item.integral_amount}} star
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
  position: relative;
  background: #010101;
  .back-btn {
    position: fixed;
    top: 20px;
    left: 16px;
    width: 30px;
    height: 30px;
    z-index: 999;
    cursor: pointer;
    img {
      width: 100%;
    }
  }
 .pay-bg {
   position: absolute;
   width: 100%;
   left: 0;
 }
  .pay-icon {
    display: flex;
    margin-top: 52px;
    align-items: center;
    justify-content: center;
    width: 76.715px;
    height: 80.977px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .pay-title {
    margin-top: 16.8px;
    color: #F2F2F2;
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .pay-desc {
    margin-top: 8px;
    color: #F2F2F2;
    text-align: center;
    font-family: OPPOSans;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .card-list {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    padding: 0 15px;
    gap: 8px;
    width: 100%;
    .card {
      width: 100%;
      height: 56px;
      border-radius: 10px;
      background: #1D1D20;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      .card-star {
        display: flex;
        align-items: center;
        gap: 6px;

        .star-icon {
          height: 40px;
        }
        .star-text {
          color: #FFF;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
      .card-coin {
        display: flex;
        align-items: center;
        gap: 6px;
        .coin-icon {
          height: 33px;
        }
        .coin-text {
          color: #FFF;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }
    }
  }
}
</style>

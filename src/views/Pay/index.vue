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
// import {TGClient} from "@/services/telegram";
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
      <img class="back-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAACxLAAAsSwGlPZapAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQlSURBVHgB7ZxPUhNREMa/l2jBkiNwBLhBAKlypzkB4QTiQgrcABtBXAAnAE8A7qhCQjwBHIEjsESt5Nk9GAUlmX7JzCS8+X6bSYWuItXf/Hn9Tb8GCCGEEEIIIYQQQgghhBASOw5jSG3N16rAhn6UX3jjPU46wFZrx10jMsZOgIV1vwSPo3+/98B15xazrX13g4ioYIxYWPWvH0u+ImfKdGUSK4iMsRFg8b2fQRWH/WKcxwwiYywEkHv+dLuDYzn7p/rFedf/70+RkQugyZcfcaG3mNTgDk4QGSMVICj5+hD+8fjz4SkzMgFqK34qJPnPgbnYVkDKM4wATX51AhcISP5phDWAMpIroDqJPVlXpq9opAirVFCPNflK4QLMr/s9OTQssRWHubMP7goRU6gAL9b8hqzlTcWUVL7LsSdfKUwATb4kddMSK3FbzR13hBJQiBc0QPJNsTGQuwC9zLXHKFvylVwFUH+n08GlJVYs54PmRxed2ZZGbgIkyfey1vcG/8bh5Hzb1VFCcinEuuaaqJuefI+r9i2WUVIyvwJC/Z12hC9ZQsh0GRqa/Fj9nRAyEyDxd3xy25k2hEft74SQmQCJuWb0d5j8v2QiwMKaPzSba47Jv8/Qq6DfVW7DFNwWf2c3fn8nhKEECLQYlpu7LrpXisMy8C2I5lo2DFQHiKe/IrbyniW2jP5OCMEC0FzLliABgvydMuJx0nZ4G9LDahZAq9yqE2eTye+Px42IMGsVwfwQFqX2mXwDDlNV9G+xvI9ZAAl8BWIjoIfVvgyVKhbERkAPq10A8e1BbHh8sYaaBRADbZlXgQE1G519H4NZADXQ1EijCD3QrVTAt+ces6d5LEO7zK/5hjM+5dWqkEJsC6QnwV6Qejpeig1LrAi1KYJtgPRkIDOuue32JbmmM5si9Geol/LiiG76u+2klv/UON92n0EeMHRXhLwN25fDG1NwB/VzvhN4QCZtKSLCkRyWUgPFJ6l0MHf2iW/FumTWFyQ29aWpBA80q2Ins66I9kRSI6Sf2VKma++Quqsg2XbGvZSk/oRt71cyekAbs0p+JWTemhgsAlsTs0XLcG28ko/XabHaRacNXdpVh5KSyxalxDeqoG7yjRxmkl2TJSXXDRpSqNX83e3IwtH5jitdm3qum/S+7riWNmQZwxtltCxy3yVJ864/hWxTDTbvVn1p9ooVsk21C827/ylUAMXsG0GbqZNCrYWIKXxWhKx0GnIwndm642bxnY9uTNl9RjItpa3D94y+UbuK45h9o8JvQV1qm36q+j3pM009w2P2jUYmgELfaMQz40J9I84NzYE/Ihh8I84NzQlr0xfnhuaITseSM7z/wA7ODc2XFPOOc0OLINlN6VDXPsvki7vx9QdlH+pBCCGEEEIIIYQQQgghhJCnyy8RxJsbwcYF0QAAAABJRU5ErkJggg==">
    </div>
    <img class="pay-bg" :src="NEW_IMAGES.PAY_BG" alt="">
    <div class="pay-icon">
      <img :src="NEW_IMAGES.HOME_NAV_COIN" alt="">
    </div>
    <div class="pay-title">
      gift 积分
    </div>
    <div class="pay-desc">
      Select the number of stars you want.
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
            {{item.tg_star_amount}} star
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
  .back-btn {
    position: fixed;
    bottom: 20px;
    left: 16px;
    width: 30px;
    height: 30px;
    background: #2c2c30;
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

import { ref, watch } from 'vue'
import type { ApiClientOption } from './useClient'
import { useApiClient } from './useClient'

export function useRequestList(
  api: any,
  options: ApiClientOption = {},
) {
  const current_page = ref(1)
  const pageSize = ref(10)
  const totalPage = ref(0)
  const totalRecords = ref(0)
  const otherData = ref({})
  const data = ref([])
  const finished = ref(false)
  const limitPage = ref(20)

  const { execute, isFetching } = useApiClient(
    async (index = current_page.value) => {
      const {
        rankList,
        current_page: resCurrentPage,
        pageSize: resPageSize = 10,
        totalPage: resTotalPage,
        totalRecords: resTotalRecords,
        ...otherResponseData
      } = await api({ index, pageSize: pageSize.value })
      current_page.value = resCurrentPage || 1
      console.log(rankList,current_page.value,1112222)
      totalPage.value = resTotalPage || 0
      totalRecords.value = resTotalRecords || 0
      otherData.value = otherResponseData
      data.value = (data.value && current_page.value > 1) ? [...data.value, ...rankList] : rankList
      finished.value = ((current_page.value + 1) > totalPage.value || currentPage.value > limitPage.value)
    },
    options,
  )

  const toNext = () => {
    if (current_page.value + 1 > totalPage.value || isFetching.value)
      return

    return execute(current_page.value + 1)
  }

  const toPage = (page: number) => execute(page)

  const refresh = () => execute(1)

  watch([pageSize, ...(options?.refreshDeps || [])], refresh)

  return {
    data,
    isFetching,
    finished,
    current_page,
    otherData,
    pageSize,
    totalPage,
    totalRecords,
    toNext,
    toPage,
    refresh,
  }
}

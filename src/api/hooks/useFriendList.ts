import { ref, watch } from 'vue'
import type { ApiClientOption } from './useClient'
import { useApiClient } from './useClient'

export function useRequestList(
  api: any,
  options: ApiClientOption = {},
) {
  const currentPage = ref(1)
  const pageSize = ref(10)
  const totalPage = ref(0)
  const totalRecords = ref(0)
  const otherData = ref({})
  const data = ref([])
  const finished = ref(false)
  const limitPage = ref(20)

  const { execute, isFetching } = useApiClient(
    async (index = currentPage.value) => {
      const {
        dataList,
        currentPage: resCurrentPage,
        pageSize: resPageSize = 10,
        totalPage: resTotalPage,
        totalRecords: resTotalRecords,
        ...otherResponseData
      } = await api({ index, pageSize: pageSize.value })
      currentPage.value = resCurrentPage || 1
      totalPage.value = resTotalPage || 0
      totalRecords.value = resTotalRecords || 0
      otherData.value = otherResponseData
      data.value = (data.value && currentPage.value > 1) ? [...data.value, ...dataList] : dataList
      finished.value = ((currentPage.value + 1) > totalPage.value || currentPage.value > limitPage.value)
    },
    options,
  )

  const toNext = () => {
    if (currentPage.value + 1 > totalPage.value || isFetching.value)
      return

    return execute(currentPage.value + 1)
  }

  const toPage = (page: number) => execute(page)

  const refresh = () => execute(1)

  watch([pageSize, ...(options?.refreshDeps || [])], refresh)

  return {
    data,
    isFetching,
    finished,
    currentPage,
    otherData,
    pageSize,
    totalPage,
    totalRecords,
    toNext,
    toPage,
    refresh,
  }
}

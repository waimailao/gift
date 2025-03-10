declare module 'cldr-compact-number' {
  interface CompactFormat {
    (
      input: number,
      lang: 'en',
      localeData: null,
      options: {
        significantDigits?: number
        minimumFractionDigits?: number
        maximumFractionDigits?: number
        financialFormat?: boolean
        threshold?: number
        long?: boolean
      },
    ): string
  }
  const compactFormat: CompactFormat

  export default compactFormat
}

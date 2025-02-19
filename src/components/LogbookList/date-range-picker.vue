<template>
  <div>
    <div>
      <div class="flex justify-start items-stretch">
        <InputText
          name="startDate"
          type="text"
          title="Awal"
          :value="startDateText"
          :disabled="true"
          style="width: 180px;"
          @click.native.capture="showModal = true"
        >
          <template #title>
            <span class="text-xs text-gray-600 dark:text-gray-300">
              Mulai
            </span>
          </template>
        </InputText>
        <span class="w-4">
        </span>
        <InputText
          name="startDate"
          type="text"
          title="Akhir"
          :value="endDateText"
          :disabled="true"
          style="width: 180px;"
          @click.native.capture="showModal = true"
        >
          <template #title>
            <span class="text-xs text-gray-600 dark:text-gray-300">
              Akhir
            </span>
          </template>
        </InputText>
      </div>
      <DateRangePickerHelpers v-bind="mRange" @change="performFilter"/>
    </div>
    <div :class="['date-range-picker__modal', showModal && 'is-active']">
      <div class="p-4 rounded-lg bg-white shadow-lg">
        <h5 class="font-bold text-gray-700 dark:text-gray-300 mb-4">
          Filter Tanggal
        </h5>
        <VDatePicker
          v-if="showModal"
          ref="rangeDatePicker"
          mode="range"
          :value="mRange"
          :is-inline="true"
        />
        <div class="flex justify-end items-center mt-4">
          <button
            class="date-range-picker__btn bg-gray-500 border-gray-500"
            @click="onCancelSelection">
            Batal
          </button>
          <button
            class="date-range-picker__btn bg-green-600 border-green-500"
            @click="onConfirmSelection">
            Pilih
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VDatePicker from 'v-calendar/lib/components/date-picker.umd'
import format from 'date-fns/format'
import InputText from '../Form/Input'
import DateRangePickerHelpers from './date-range-picker-helpers'

const formatDateToYMD = (date) => {
  if (date instanceof Date === false) {
    return null
  }
  return format(date, 'yyyy-MM-dd')
}

const DATE_OPTION = {
  TODAY: 'TODAY',
  THIS_WEEK: 'THIS_WEEK',
  THIS_MONTH: 'THIS_MONTH',
  CUSTOM_RANGE: 'CUSTOM_RANGE'
}

export default {
  components: {
    InputText,
    DateRangePickerHelpers,
    VDatePicker
  },
  props: {
    range: {
      type: Object,
      default: () => ({
        start: null,
        end: null
      }),
      validator: (obj) => {
        const isObject = !!obj && typeof obj === 'object'
        const hasValidFields = ['start', 'end']
          .every((key) => {
            const hasKey = key in obj
            const isNullOrDate = obj[key] === null ||
              obj[key] instanceof Date
            return hasKey && isNullOrDate
          })
        return isObject && hasValidFields
      }
    }
  },
  data () {
    return {
      showModal: false,
      mRange: {
        start: null,
        end: null
      },
      selectedDateOption: DATE_OPTION.THIS_MONTH
    }
  },
  computed: {
    startDateText () {
      return this.mRange.start ? formatDateToYMD(this.mRange.start) : '-'
    },
    endDateText () {
      return this.mRange.end ? formatDateToYMD(this.mRange.end) : '-'
    }
  },
  watch: {
    range: {
      immediate: true,
      deep: true,
      handler (newObject) {
        this.mRange = newObject
          ? { ...newObject }
          : { start: null, end: null }
      }
    }
  },
  methods: {
    onReset () {
      this.performFilter({ start: null, end: null })
    },
    onCancelSelection () {
      this.showModal = false
    },
    onConfirmSelection () {
      const { start, end } = this.$refs.rangeDatePicker.value_
      this.singleDateValue = null
      this.performFilter({ start, end })
      this.$nextTick(() => {
        this.showModal = false
      })
    },
    performFilter ({ start, end } = {}) {
      this.mRange = { start, end }
      const params = {}
      if (start instanceof Date || end instanceof Date) {
        Object.assign(params, {
          start_date: formatDateToYMD(start),
          end_date: formatDateToYMD(end)
        })
      }
      this.$emit('change-date', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.date-range-picker__modal {
  backdrop-filter: blur(4px);
  background-color: rgba(0,0,0,0.1);
  @apply z-50 fixed inset-0
  hidden select-none
  flex-col flex-no-wrap
  justify-center items-center;

  &.is-active {
    @apply flex self-auto;
  }
}

.date-range-picker__btn {
  @apply px-4 py-2 rounded
  border border-solid text-white;

  & + & {
    @apply ml-4;
  }

  &:hover {
    @apply opacity-50;
  }
}
</style>

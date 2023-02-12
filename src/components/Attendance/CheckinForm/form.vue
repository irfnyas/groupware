<template>
  <ValidationObserver #default="{ handleSubmit }">
    <div class="checkin-form">
      <span class="checkin-form__date text-gray-600 dark:text-gray-300">
        {{ todayDateString }}
      </span>
      <!-- START: CHECKIN HOUR AND MINUTE INPUT -->
      <div class="checkin-form__input-segment">
        <InputHeader
          label-for="checkinHour_checkinMinute"
          title="Jam Kehadiran"
        />
        <div class="checkin-form__hour-min">
          <p class="text-gray-600 dark:text-gray-300">Jam</p>
          <p class="text-gray-600 dark:text-gray-300">Menit</p>
          <Input disabled
            name="checkinHour"
            :value="checkinHour"
            />
          <Input disabled
            name="checkinMinute"
            :value="checkinMinute"
            />
        </div>
      </div>
      <!-- <div class="checkin-form__input-segment">
        <InputHeader
          label-for="checkinHour_checkinMinute"
          title="Jam Kehadiran"
        />
        <div class="checkin-form__hour-min">
          <InputSelect
            name="checkinHour"
            :options="hourOptions"
            :value="checkinHour"
            rules="required"
            prompt="Jam"
            @change="onCheckinHourChanged"
            />
          <InputSelect
            name="checkinMinute"
            :options="minuteOptions"
            :value="checkinMinute"
            rules="required"
            prompt="Menit"
            @change="onCheckinMinuteChanged"
            />
        </div>
      </div> -->
      <!-- END: CHECKIN HOUR AND MINUTE INPUT -->

      <!-- START: LOCATION INPUT -->
      <div class="checkin-form__input-segment">
        <RadioButtonGroup
          class="mb-2"
          name="location"
          title="Jenis Kehadiran"
          rules="required"
          :disabled="false"
          :block="true"
          :options="locationOptions"
          :custom-messages="{
            required: 'Jenis kehadiran harus diisi'
          }"
          v-model="payload.location"
        >
          <template #subtitle>
            <span class="italic text-gray-500">
              Pilih salah satu
            </span>
          </template>
        </RadioButtonGroup>
      </div>
      <!-- END: LOCATION INPUT -->

      <div class="checkin-form__input-segment">
        <MoodInput
          class="mb-12"
          name="mood"
          v-model="payload.mood"
        />
      </div>

      <!-- START: NOTE INPUT -->
      <div class="checkin-form__input-segment" v-if="checkinHour>=8 || (checkinHour>=7 && checkinMinute>=30)">
        <InputTextarea
          name="note"
          rows="5"
          title="Alasan dan Solusi Keterlambatan Presensi"
          rules="required|min:25"
          :placeholder="noteLatePlaceholder"
          :custom-messages="{
            required: 'Alasan dan Solusi Keterlambatan Presensi Harus Diisi',
            min: 'Minimal 25 Karakter'
          }"
          v-model="payload.note"
          />
      </div>

      <div class="checkin-form__input-segment" v-else>
        <InputTextarea
          name="note"
          rows="5"
          title="Catatan Agenda"
          :required="false"
          :placeholder="notePlaceholder"
          v-model="payload.note"
          />
      </div>
      <!-- END: NOTE INPUT -->
    </div>
    <button class="checkin-form__btn-submit" @click="handleSubmit(beforeSubmit)" v-if="checkinHour>=6 || (checkinHour>=5 && checkinMinute>=30)">
      Kirim
    </button>
    <div v-else class="px-4 py-2 mt-12 rounded-md border border-solid border-orange-500 bg-orange-100 text-gray-700 text-center">
      <strong>
        <span class="text-orange-700">Checkin bisa dilakukan setelah 05:30</span>
      </strong>
    </div>

    <Dialog :show="showSubmissionDialog">
      <Submission
        v-if="showSubmissionDialog"
        v-bind="{ payload }"
        @success="onSubmissionSuccess"
        @error="onSubmissionError"
        @cancel="onCloseConfirmationDialog"
        @close="onCloseConfirmationDialog"/>
    </Dialog>
  </ValidationObserver>
</template>

<script>
import _cloneDeep from 'lodash/cloneDeep'
import setHours from 'date-fns/setHours'
import setMinutes from 'date-fns/setMinutes'
import { formatDateLong } from '../../../lib/date'
import { ATTENDANCE } from '../../../lib/constants'
import MoodInput from './mood-input'
import { mapGetters } from 'vuex'

const LOCATION = {
  WFH: 'WFH',
  WFO: 'WFO',
  PERJADIN: 'PERJADIN'
}

const hourOptions = new Array(24).fill(null).map((_, n) => {
  return n < 10 ? `0${n}` : `${n}`
})

const minuteOptions = new Array(60 / 1).fill(null).map((_, n) => {
  return (n < 10 / 1) ? `0${n * 1}` : `${n * 1}`
})

const locationOptions = [
  LOCATION.WFH,
  LOCATION.WFO,
  LOCATION.PERJADIN
]

const emptyPayload = {
  date: null,
  location: null,
  message: ATTENDANCE.PRESENT,
  note: null,
  mood: null
}

export default {
  components: {
    MoodInput,
    InputHeader: () => import('../../Form/InputHeader'),
    Input: () => import('../../Form/Input'),
    // InputSelect: () => import('../../Form/Select'),
    InputTextarea: () => import('../../Form/Textarea'),
    RadioButtonGroup: () => import('../../Form/RadioButtonGroup'),
    Dialog: () => import('../../Dialog'),
    Submission: () => import('./form-submission')
  },
  computed: mapGetters({
    // authLoading: 'auth/loading'
    user: 'auth/user'
  }),
  data () {
    return {
      todayDateString: formatDateLong(new Date()),
      hourOptions: Object.freeze(hourOptions),
      minuteOptions: Object.freeze(minuteOptions),
      locationOptions: Object.freeze(locationOptions),

      checkinHour: null,
      checkinMinute: null,
      notePlaceholder: 'Ketikkan lokasi kerja kamu/agenda kamu hari ini/pesan penyemangat untuk teman-teman kamu disini',
      noteLatePlaceholder: 'Tuliskan alasan telatmu yang ga seberapa itu + janji-janji manis yang akan kamu lakukan agar ga terlambat lagi. Yang isi tulisannya ga sesuai arahan mimin catat!',
      payload: _cloneDeep(emptyPayload),

      showSubmissionDialog: false
    }
  },
  beforeMount () {
    this.getCurrentHourAndMinute()
  },
  methods: {
    formatDateLong (date) {
      return date ? formatDateLong(date) : null
    },

    /**
     * get current hour,
     * get current minute to the nearest multiplication of 5,
     * set current hour and minute to checkinHour and checkinMinute
    */
    getCurrentHourAndMinute () {
      const today = new Date()
      let currentHour = today.getHours()

      let currentMinute = Math.round(today.getMinutes() / 1) * 1
      if (currentMinute < 10) {
        currentMinute = `0${currentMinute}`
      } else if (currentMinute === 60) {
        currentMinute = '00'
        currentHour += 1
      } else {
        currentMinute = currentMinute.toString()
      }

      if (currentHour < 10) {
        currentHour = `0${currentHour}`
      }
      this.checkinHour = currentHour
      this.checkinMinute = currentMinute
      this.updateCheckinDatePayload({
        hour: currentHour,
        min: currentMinute
      })
    },
    updateCheckinDatePayload ({ hour, min }) {
      let { date } = this.payload
      if (date instanceof Date === false) {
        date = new Date()
      }
      if (hour) {
        date = setHours(date, hour)
      }
      if (min) {
        date = setMinutes(date, min)
      }
      this.$set(this.payload, 'date', date)
    },
    onCheckinHourChanged (hour) {
      this.checkinHour = hour
      this.updateCheckinDatePayload({ hour })
    },
    onCheckinMinuteChanged (min) {
      this.checkinMinute = min
      this.updateCheckinDatePayload({ min })
    },

    beforeSubmit () {
      this.showSubmissionDialog = true
    },

    onSubmissionSuccess () {
      this.onCloseConfirmationDialog()
      this.$router.push('/checkins')
    },
    onSubmissionError (/* err */) {
      this.onCloseConfirmationDialog()
    },
    onCloseConfirmationDialog () {
      this.showSubmissionDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.checkin-form {
  &__date {
    @apply block mb-8 text-lg font-bold;
  }

  &__hour-min {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  &__input-segment {
    & + & {
      margin-top: 1.5rem;
    }
  }

  &__btn-submit {
    @apply w-full mt-12
    px-4 py-2
    rounded
    bg-blue-600
    text-white;

    &:hover {
      @apply bg-blue-700;
    }
  }
}
</style>

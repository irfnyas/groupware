<template>
  <div class="workhour-progress-bar">
    <p class="monthly-workhour__title text-gray-900 dark:text-white">
      Laporkan Masalah
    </p>
    <p class="workhour-progress-bar__hint mb-4 text-gray-600 dark:text-white">
      Jika mengalami kendala atau masalah, segera laporkan dengan klik tombol di bawah.
    </p>
    <button
      :class="{
        'btn-logout': true,
        'btn-logout--spinner': showSpinner
      }"
      @click="onClick">
    <img
      v-if="showSpinner"
      src="@/assets/loading.gif"
      class="inline-block w-auto object-contain object-center"
      style="height: 24px;">
    <span v-else>
      Laporkan Masalah
    </span>
  </button>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean
    },
    hours: {
      type: Number
    }
  },
  data () {
    return {
      expectedHoursCount: 170,
      showSpinner: false
    }
  },
  computed: {
    progress () {
      if (typeof this.hours === 'number') {
        return Math.min(1, this.hours / this.expectedHoursCount)
      }
      return 0
    }
  },
  methods: {
    onClick () {
      return this.signOut()
    },
    async signOut () {
      try {
        this.showSpinner = true
        window.open('https://forms.gle/Lqwti4tFg1PSa3vQ8', '_blank')
      } catch (e) {
      } finally {
        this.showSpinner = false
      }
    },
    onImageError (e) {
      e.target.src = this.AVATAR_PLACEHOLDER
    }
  }
}
</script>

<style lang="scss" scoped>
.monthly-workhour {
  &__title {
    @apply mb-3 text-base font-bold;
  }
}
.btn-logout {
  @apply block w-full px-4 py-2 rounded text-white;
  @apply bg-orange-500;

  &:hover {
    @apply bg-orange-400;
  }

  &--spinner {
    @apply bg-white text-transparent;
  }

  &:focus,
  &:active {
    @apply outline-none;
  }
}
</style>

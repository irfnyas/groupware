<template>
  <div>
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
      Logout
    </span>
  </button>
  </div>
</template>

<script>
import { UNAUTHENTICATED } from '../store/mutation-types'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      showSpinner: false
    }
  },
  methods: {
    ...mapMutations('auth', [
      UNAUTHENTICATED
    ]),
    onClick () {
      return this.signOut()
    },
    async signOut () {
      const { value: confirm } = await this.$swal.fire({
        text: 'Apa kamu yakin untuk logout sekarang?',
        icon: 'question',
        confirmButtonText: 'Ya, logout sekarang',
        cancelButtonText: 'Tidak',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: '#F56565',
        cancelButtonColor: '#38A169'
      })
      if (!confirm) {
        return
      }
      try {
        this.showSpinner = true
        await this.$store.dispatch('auth/logout')
      } catch (e) {
      } finally {
        this.showSpinner = false
        this[UNAUTHENTICATED]()
      }
    },
    onImageError (e) {
      e.target.src = this.AVATAR_PLACEHOLDER
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-logout {
  @apply block w-full px-4 py-2 rounded text-white;
  @apply bg-red-500;

  &:hover {
    @apply bg-red-400;
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

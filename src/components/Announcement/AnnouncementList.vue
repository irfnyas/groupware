<template>
  <div class="w-full">
    <div class="flex flex-wrap">
      <div
        v-for="item in items"
        :key="item.id"
        class="w-full bg-white dark:bg-gray-900 sm:rounded-lg shadow sm:mx-2 sm:mb-2 p-4">
        <router-link :to="`/announcement/${item.id}`">
          <div class="flex">
            <div class="flex items-center mx-auto mr-4">
              <i aria-hidden="true" class="fas fa-star text-yellow-500 text-lg" />
            </div>
            <div class="text-left flex-grow dark:text-white">
              <p class="text-sm leading-normal">{{ item.title }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.author }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ item.published_at }}</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="w-full mx-2 my-2" v-if="('Tim Pengelola Layanan Digital' == user.manager_category || 'ASN' == user.divisi) && true == user.is_admin">
        <router-link
          to="/announcementcreate"
          class="w-full text-center shadow block bg-brand-blue text-white font-bold py-2 px-4 rounded">
          Buat Pengumuman
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDateTimeShort } from '@/lib/date'

export default {
  computed: mapGetters({
    loading: 'home-announcement/loading',
    items: 'home-announcement/items',
    user: 'auth/user'
  }),

  methods: {
    formatDateTimeShort
  }
}
</script>

<style lang="scss" scoped>
.home-announcement-list {
  &__list-item {
    @apply p-4
    flex items-center
    shadow;

    @screen sm {
      @apply rounded-lg;
    }

    & + & {
      @apply mt-2;
    }
  }
}
</style>

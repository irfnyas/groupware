<template>
  <div class="messages">
    <div class="container mx-auto">
      <div class="w-full lg:flex px-4 mb-4">
        <p class="text-leading text-grey-darker dark:text-white">Pengumuman</p>
      </div>

      <div class="bg-white dark:bg-gray-900 shadow p-4">
        <template v-if="!isLoading">
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

          <div
            class="text-sm leading-normal mt-5 body-content text-gray-700 dark:text-white"
            v-html="item.content" />

          <template v-if="item.backlink">
            <div class="my-2">
              <a
                :href="item.backlink"
                target="_blank"
                class="w-full text-center shadow block bg-brand-blue text-white font-bold py-2 px-4 rounded">
                Baca Selengkapnya
              </a>
            </div>
          </template>
        </template>

        <template v-else>
          <ContentLoader
            :speed="2"
            primaryColor="#f3f3f3"
            secondaryColor="#ecebeb"
          >
            <rect x="0" y="15" rx="0" ry="0" width="100%" height="15" />
            <rect x="0" y="45" rx="0" ry="0" width="100%" height="75" />
          </ContentLoader>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ContentLoader } from 'vue-content-loader'
import { formatDateTimeShort } from '@/lib/date'
import { analytics } from '@/lib/firebase'

export default {
  components: {
    ContentLoader
  },

  metaInfo: {
    title: 'Announcement Detail'
  },

  computed: mapGetters({
    loading: 'announcements-detail/loading',
    item: 'announcements-detail/item'
  }),

  mounted () {
    this.fetchItem(this.$route.params.id)
  },

  methods: {
    formatDateTimeShort,

    async fetchItem (id) {
      await this.$store.dispatch('announcements-detail/fetchItem', { id: id })

      analytics.logEvent('announcement_detail_view', { id: id })
    },

    formatContent (content) {
      return content
    },

    clickAction () {
      analytics.logEvent('announcement_detail_click_action', { id: this.$route.params.id })
    }
  }
}
</script>

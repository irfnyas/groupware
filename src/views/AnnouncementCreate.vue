<template>
    <div class="forums">
      <div class="container mx-auto">
        <div class="w-full bg-white shadow p-4">
          <div class="flex flex-wrap">
            <div class="w-full px-3">
              <label class="tracking-wide text-gray-700 text-xs font-bold mb-2" for="title-feedback">
                Judul
              </label>
              <input v-model="title" id="title-feedback" rows="5" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
              <label class="tracking-wide text-gray-700 text-xs font-bold mb-2" for="content-feedback">
                Isi (bisa diisi script HTML)
              </label>
              <textarea v-model="content" id="content-feedback" rows="5" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
              <label class="tracking-wide text-gray-700 text-xs font-bold mb-2" for="published-feedback">
                Tanggal
              </label>
              <input type="date" v-model="published" id="published-feedback" rows="5" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
              <label class="tracking-wide text-gray-700 text-xs font-bold mb-2" for="author-feedback">
                Pengirim
              </label>
              <input v-model="author" id="author-feedback" rows="5" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
              <label class="tracking-wide text-gray-700 text-xs font-bold mb-2" for="backlink-feedback">
                Link
              </label>
              <input v-model="backlink" id="backlink-feedback" rows="5" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"/>
              <button @click="submitFeedback" class="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Kirim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { analytics, db } from '@/lib/firebase'

export default {
  components: {
    //
  },

  metaInfo: {
    title: 'Tambah Pengumuman'
  },

  data () {
    return {
      title: '',
      content: '',
      published: '',
      author: '',
      backlink: ''
    }
  },

  computed: mapGetters({
    //
  }),

  mounted () {
    analytics.logEvent('announcement_create_view')
  },

  methods: {
    async submitFeedback () {
      analytics.logEvent('announcement_create_click')

      const title = this.title
      const content = this.content
      const published = this.published
      const author = this.author
      const backlink = this.backlink

      if (title === '' | content === '' | published === '' | author === '' | backlink === '') {
        return false
      }

      const collectionRef = await db.collection('announcement')

      await collectionRef.add({
        backlink: backlink,
        content: content,
        title: title,
        published_at: published,
        author: author
      })

      this.title = ''
      this.content = ''
      this.published = ''
      this.author = ''
      this.backlink = ''
      await this.$router.push('/')
      await this.$store.dispatch('home-announcement/fetchItems')
    }
  }
}
</script>

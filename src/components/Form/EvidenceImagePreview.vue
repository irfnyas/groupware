<template>
  <div class="form-input__file-preview">
    <figcaption>
      <div v-if="filetype.includes('pdf')">
        <pdf
          :src="url"
          class="form-input__file-preview__image"
          @click.prevent="onDownload"
        ></pdf>
      </div>
      <div v-else>
        <img
          :src="url"
          class="form-input__file-preview__image"
          @click.prevent="onDownload"
        >
      </div>
    </figcaption>
    <div class="mt-6 self-stretch md:flex-auto flex flex-col justify-between">
      <p
        v-if="!disabled"
        class="inline-block self-end text-sm"
      >
        <button
          class="w-auto py-2 px-4 mr-4 rounded border border-solid border-blue-500 text-blue-500 hover:opacity-50 hover:bg-blue-100"
          @click="onDownload"
        >
          Unduh
        </button>
        <button
          class="w-24 py-2 px-4 rounded border border-solid border-red-600 text-red-500 hover:opacity-50 hover:bg-red-100"
          @click="$emit('replace')"
        >
          Ubah
        </button>
      </p>
    </div>
  </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  components: {
    pdf
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      required: true
    },
    filetype: {
      type: String,
      required: true
    }
  },
  methods: {
    onDownload (e) {
      window.open(this.url, '_blank')
    }
  }
}
</script>

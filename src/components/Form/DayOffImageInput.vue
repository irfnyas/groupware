<template>
  <div>
    <FormInputHeader
      :label-for="name"
      :title="title"
      :subtitle="subtitle"
      :required="required"
    >
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #subtitle>
        <slot name="subtitle"></slot>
      </template>
    </FormInputHeader>
    <template v-if="mUrl">
      <DayOffImagePreview
        :url="mUrl"
        :filetype="mFile.type"
        :disabled="disabled"
        @replace="onReplaceFile"
      />
    </template>
    <FileSelector
      ref="fileSelector"
      v-show="!mUrl"
      :url="mUrl"
      accept="application/pdf,image/*"
      v-bind="$props"
      @preview="onPreview"
      @change="onSelectedFileChange"
    >
      <template #choose-file-button-text>
        Upload
      </template>
    </FileSelector>
  </div>
</template>

<script>
import { props, components } from './input-mixin'

export default {
  components: {
    ...components,
    DayOffImagePreview: () => import('./DayOffImagePreview'),
    FileSelector: () => import('./FileSelector')
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    ...props,
    path: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      mFile: null,
      mUrl: null,
      mBlob: null
    }
  },
  computed: {
    isSelectedFileChanged () {
      return this.mUrl && this.mUrl !== this.url
    }
  },
  watch: {
    url: {
      immediate: true,
      handler (v) {
        this.mUrl = v
      }
    }
  },
  methods: {
    onReplaceFile () {
      const selector = this.$refs.fileSelector
      if (!selector) {
        return
      }
      selector.onChooseFile()
    },
    onPreview () {
      window.open(this.mUrl, '_blank')
    },
    onSelectedFileChange (url, file) {
      this.mUrl = url
      this.mFile = file
      this.emitChanges()
    },
    getSelectedFile () {
      return this.isSelectedFileChanged ? this.mFile : null
    },
    emitChanges () {
      this.$emit('change:url', this.mUrl)
      this.$emit('change:file', this.mFile)
    }
  }
}
</script>

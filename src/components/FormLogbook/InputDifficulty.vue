<template>
  <FormRadioButtonGroup
    :name="name"
    title="Tingkat Kesulitan"
    :options="[1,2,3,4,5]"
    :disabled="disabled"
    :required="isRequired"
    :rules="isRequired ? 'required' : ''"
    :custom-messages="{
      required: 'Tingkat kesulitan harus diisi'
    }"
    v-model="syncedValue"
  >
    <template #subtitle>
      <div class="flex justify-between font-bold text-gray-500">
        <small>
          Sangat Mudah
        </small>
        <small>
          Sangat Sulit
        </small>
      </div>
    </template>
  </FormRadioButtonGroup>
</template>

<script>
import FormRadioButtonGroup from '../Form/RadioButtonGroup'
export default {
  components: {
    FormRadioButtonGroup
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    name: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    value: {
      type: [String, Number],
      default: undefined
    }
  },
  computed: {
    syncedValue: {
      get () {
        return this.value
      },
      set (v) {
        this.$emit('input', v)
      }
    },
    isRequired () {
      let cutoff = process.env.VUE_APP_FORM_DIFFICULTY_TASK_CUTOFF
      if (!cutoff) {
        return false
      }

      return Date.now() > parseInt(cutoff)
    }
  }
}
</script>

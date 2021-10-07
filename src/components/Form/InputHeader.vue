<template>
  <div class="form-input__header">
    <slot name="title">
      <label
        v-if="title"
        :for="labelFor"
        :class="['form-input__title dark:text-gray-300', required && 'is-required']"
      >
        {{title}}
      </label>
    </slot>
    <div
      v-if="subtitle || $slots.subtitle"
      class="form-input__subtitle dark:text-gray-300"
    >
      <slot name="subtitle">
        <p>
          {{subtitle}}
        </p>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    labelFor: {
      type: String
    },
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    required: {
      type: Boolean,
      default: true
    }
  }
}
</script>

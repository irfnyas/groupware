<template>
  <div>
    <i class="fa fa-sun" />
    <div class="relative inline-block w-10 mx-2 align-middle select-none transition duration-200 ease-in">
        <input
          :model="colorTheme === 'light'"
          type="checkbox"
          name="toggle"
          id="toggle"
          class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          @click="toggleTheme"
        />
        <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
    </div>
    <i class="fa fa-moon" />
  </div>
</template>

<script>
export default {
  props: {
    theme: {
      type: String,
      default: null
    }
  },
  computed: {
    colorTheme: {
      get () {
        return this.theme
      },
      set (val) {
        return val
      }
    }
  },
  watch: {
    colorTheme (val) {
      console.log(val)
    }
  },
  methods: {
    toggleTheme () {
      this.$store.dispatch('theme/toggleTheme')
    }
  }
}
</script>
<style>
/* CHECKBOX TOGGLE SWITCH */
/* @apply rules for documentation, these do not work as inline style */
.toggle-checkbox:checked {
  @apply: right-0 border-green-400;
  right: 0;
  border-color: #68D391;
}
.toggle-checkbox:checked + .toggle-label {
  @apply: bg-green-400;
  background-color: #68D391;
}
</style>

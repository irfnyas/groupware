<template>
  <div class="w-full bg-white dark:bg-gray-900" style="position: fixed; bottom: 0">
    <div class="container mx-auto px-4">
      <div class="flex items-center w-full lg:max-w-sm lg:mx-auto justify-around flex-wrap">
        <div class="text-center px-2 py-1">
          <router-link class="no-underline text-gray-700 dark:text-white block" to="/">
            <i aria-hidden="true" class="fas fa-home text-lg" />
            <p class="text-xs">Home</p>
          </router-link>
        </div>
        <div v-if="user" class="text-center px-2 py-1">
          <router-link class="no-underline text-gray-700 dark:text-white block" to="/profile">
            <i aria-hidden="true" class="fas fa-user text-lg" />
            <p class="text-xs">Profile</p>
          </router-link>
        </div>
        <div v-if="user" class="text-center px-2 py-1">
          <router-link class="no-underline text-gray-700 dark:text-white block" to="/messages">
            <i aria-hidden="true" class="fas fa-bell text-lg" />
            <p class="text-xs">Messages</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    // authLoading: 'auth/loading'
    user: 'auth/user'
  })
}
</script>
<style lang="scss" scoped>
a.router-link-exact-active {
  color: #399F4F !important;
 }
</style>

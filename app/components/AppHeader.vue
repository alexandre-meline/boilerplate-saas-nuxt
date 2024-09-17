<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))

const links = [{
  label: 'Docs',
  to: '/docs'
}, {
  label: 'Pricing',
  to: '/pricing'
}, {
  label: 'Blog',
  to: '/blog'
}]

async function logout() {
  try {
    await supabase.auth.signOut()
    user.value = null
    navigateTo('/login')
  } catch (error) {
    console.error('Error logging out:', error.message)
  }
}
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      Ecole 2600 - Saas Boilerplate
      <UBadge
        label="SaaS"
        variant="subtle"
        class="mb-0.5"
      />
    </template>

    <template #right>
      <template v-if="user">
        <UButton
          label="Logout"
          color="red"
          @click="logout"
        />
      </template>
      <template v-else>
        <UButton
          label="Sign in"
          color="gray"
          to="/login"
        />
        <UButton
          label="Sign up"
          icon="i-heroicons-arrow-right-20-solid"
          trailing
          color="black"
          to="/signup"
          class="hidden lg:flex"
        />
      </template>
    </template>

    <template #panel>
      <UNavigationTree
        :links="mapContentNavigation(navigation)"
        default-open
      />
    </template>
  </UHeader>
</template>

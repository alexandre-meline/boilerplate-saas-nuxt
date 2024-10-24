import { useSubscriptionStatus } from '~/composables/useSubscriptionStatus'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isSubscribed, isLoading } = useSubscriptionStatus()
  const user = useSupabaseUser()
  if (!user.value) {
    return navigateTo('/login')
  }

  while (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  if (!isSubscribed.value) {
    return navigateTo('/pricing')
  }
})
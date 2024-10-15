import { useSubscriptionStatus } from '~/composables/useSubscriptionStatus'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isSubscribed, isLoading } = useSubscriptionStatus()

  // Attendre la fin du chargement de l'état de la souscription
  if (isLoading.value) {
    await new Promise(resolve => {
      const unwatch = isLoading.watch((newValue) => {
        if (!newValue) {
          unwatch()
          resolve(true)
        }
      })
    })
  }
  
  if (!isSubscribed.value && to.name !== 'pricing') {
    // Redirige les utilisateurs non abonnés vers la page de tarification
    return navigateTo('/pricing')
  }
})
interface SubscriptionStatus {
  subscribed: boolean;
}

export function useSubscriptionStatus() {
  const isSubscribed = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref<string | null>(null)
  const supabase = useSupabaseClient()

  const fetchStatus = async () => {
    try {
      isLoading.value = true
      errorMessage.value = null
      const { data: authData, error: authError } = await supabase.auth.getSession()
      if (authError || !authData?.session?.access_token) {
        console.error('Authorization failure:', authError)
        throw new Error('Authorization failed')
      }
      const token = authData.session.access_token
      const response = await $fetch<SubscriptionStatus>('/api/payment/checkstatus', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      isSubscribed.value = response.subscribed
    } catch (error) {
      console.error('Error fetching subscription status:', error)
      errorMessage.value = 'Failed to fetch subscription status. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  fetchStatus()

  return { isSubscribed, isLoading, errorMessage }
}
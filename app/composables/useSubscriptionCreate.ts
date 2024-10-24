interface Subscription {
    url: string;
  }


export function useSubscriptionCreate() {   
    const isLoading = ref(false)
    const errorMessage = ref<string | null>(null)
    const supabase = useSupabaseClient()
    const subscription = ref<Subscription | null>(null)

    const createSubscription = async (priceId: string) => {
        try {
            isLoading.value = true
            errorMessage.value = null
            const { data: authData, error: authError } = await supabase.auth.getSession()
            if (authError || !authData?.session?.access_token) {
                console.error('Authorization failure:', authError)
                throw new Error('Authorization failed')
            }
            const token = authData.session.access_token
            const queryParams = new URLSearchParams({ priceId });
            const response = await $fetch<Subscription>(`/api/payment?${queryParams.toString()}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            subscription.value = response
        } catch (error) {
            console.error('Error creating subscription:', error)
            errorMessage.value = 'Failed to create subscription. Please try again.'
        } finally {
            isLoading.value = false
        }
    }

    return { subscription, isLoading, errorMessage, createSubscription }
}
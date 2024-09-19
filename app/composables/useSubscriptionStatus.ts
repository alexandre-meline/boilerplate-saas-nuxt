import { ref } from 'vue'
import { useFetch } from '#app'

export function useSubscriptionStatus() {
  const isSubscribed = ref(false)
  const isLoading = ref(true)

  const fetchStatus = async () => {
    // Set loading to true before fetching
    isLoading.value = true

    const { data, pending, error } = await useFetch<{ isSubscribed: boolean }>('/api/stripe/checkStatus')

    // Debug logs  
    console.log('Pending:', pending.value)
    console.log('Error:', error.value)
    console.log('Data:', data.value)

    // Update states based on fetch results
    if (error.value) {
      console.error("Error fetching subscription status:", error.value)
    } else {
      isSubscribed.value = data.value?.isSubscribed || false
    }

    // Set loading to false after fetching
    isLoading.value = false
  }

  // Initialize fetch on composable creation
  fetchStatus()

  return { isSubscribed, isLoading }
}
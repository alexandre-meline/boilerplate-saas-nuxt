interface SubscriptionStatus {
  isSubscribed: boolean;
}

export function useSubscriptionStatus() {
  const isSubscribed = ref(false);
  const isLoading = ref(true);
  const errorMessage = ref<string | null>(null);

  const handleError = (error: any) => {
    console.error("Error fetching subscription status:", error);
    errorMessage.value = "Failed to fetch subscription status. Please try again.";
  };

  const processResponse = (data: SubscriptionStatus | null) => {
    if (data) {
      isSubscribed.value = data.isSubscribed;
    } else {
      isSubscribed.value = false;
    }
  };

  const fetchStatus = async () => {
    isLoading.value = true;
    errorMessage.value = null; // Reset the error message before fetch
    const { data, error } = await useFetch<SubscriptionStatus>('/api/stripe/checkStatus');

    if (error.value) {
      handleError(error.value);
    } else {
      processResponse(data.value);
    }
    
    isLoading.value = false;
  };

  // Initialize fetch on composable creation
  fetchStatus();

  return { isSubscribed, isLoading, errorMessage };
}
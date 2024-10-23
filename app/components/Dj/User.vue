<script setup>
// Initialiser les références et états
const user_data = ref(null)
const isLoading = ref(false)
const hasError = ref(false)

// Initialisation Supabase
const supabase = useSupabaseClient()

// Fonction pour charger les données utilisateur
async function loadUserData() {
  const { data: authData, error: authError } = await supabase.auth.getSession()
  if (authError) {
    console.error('Error fetching session:', authError)
    hasError.value = true
    return
  }

  const token = authData?.session?.access_token
  if (!token) {
    console.error('No session found.')
    hasError.value = true
    return
  }

  try {
    const userData = await $fetch('/api/dj/users/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    user_data.value = userData
  } catch (e) {
    console.error('Error fetching user data:', e)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!supabase.auth.getSession().value) {
    hasError.value = true
  }
  isLoading.value = true
  loadUserData()
})

</script>

<template>
  <div>
    <h1>User</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <pre v-if="user_data">{{ user_data }}</pre>
      <p v-else-if="hasError">An error occurred or no session available.</p>
      <p v-else>No user data available</p>
    </div>
  </div>
</template>
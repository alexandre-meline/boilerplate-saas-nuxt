<script setup lang="ts">
const supabase = useSupabaseClient()
const errorMsg = ref(null)
const successMsg = ref(null)

async function signUp(data: any) {
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })
    if (error) {
      errorMsg.value = error.message
    } else {
      successMsg.value = 'Account created successfully! Please check your email to verify your account.'
    }
  } catch (error) {
    errorMsg.value = error.message
  }
}

async function signUpWithProvider(providerName: string) {
  try {
    const { error } = await supabase.auth.signInWithOAuth({ provider: providerName })
    if (error) {
      errorMsg.value = error.message
    } else {
      successMsg.value = 'Signed in successfully!'
    }
  } catch (error) {
    errorMsg.value = error.message
  }
}

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Sign up'
})

const fields = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email'
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}]

const validate = (state: any) => {
  // Remonte les erreurs de validation des champs
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  // Si le message errorMsg est défini, on l'ajoute à la liste des erreurs
  if (errorMsg.value) errors.push({ path: 'password', message: errorMsg.value })
  if (successMsg.value) errors.push({ path: 'password', message: successMsg.value })
  return errors
}

const providers = [{
  label: 'Continue with GitHub',
  icon: 'i-simple-icons-github',
  color: 'gray' as const,
  click: () => {
    signUpWithProvider('github')
  }
}]
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
  <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :providers="providers"
      align="top"
      title="Create an account"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Create account' }"
      @submit="signUp"
    >
      <template #description>
        Already have an account? <NuxtLink
          to="/login"
          class="text-primary font-medium"
        >Login</NuxtLink>.
      </template>

      <template #footer>
        By signing up, you agree to our <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Terms of Service</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>

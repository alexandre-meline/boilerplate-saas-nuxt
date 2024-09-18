<script setup lang="ts">
const supabase = useSupabaseClient()
const errorMsg = ref(null)
const successMsg = ref(null)

async function signIn(data: any) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })
    if (error) {
      errorMsg.value = error.message
    } else {
      successMsg.value = 'Signed in successfully!'
      // TODO: Redirect to the dashboard not implemented
      navigateTo('/pricing')
    }
  } catch (error) {
    errorMsg.value = error.message
  }
}

async function signInWithProvider(providerName: string) {
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
  title: 'Login'
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
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  if (errorMsg.value) errors.push({ path: 'password', message: errorMsg.value })
  if (successMsg.value) errors.push({ path: 'password', message: successMsg.value })
  return errors
}

const providers = [{
  label: 'Continue with GitHub',
  icon: 'i-simple-icons-github',
  color: 'white' as const,
  click: () => {
    signInWithProvider('github')
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
      title="Welcome back"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
      @submit="signIn"
    >
      <template #description>
        Don't have an account? <NuxtLink
          to="/signup"
          class="text-primary font-medium"
        >Sign up</NuxtLink>.
      </template>

      <template #password-hint>
        <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Forgot password?</NuxtLink>
      </template>

      <template #footer>
        By signing in, you agree to our <NuxtLink
          to="/"
          class="text-primary font-medium"
        >Terms of Service</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>

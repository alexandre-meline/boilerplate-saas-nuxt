<script setup lang="ts">
import { useSubscriptionStatus } from '~/composables/useSubscriptionStatus'
import { useSubscriptionCreate } from '~/composables/useSubscriptionCreate'

// Importer le composable de création d'abonnement
const { subscription, isLoading: isCreatingSubscription, errorMessage, createSubscription } = useSubscriptionCreate()

const { isSubscribed, isLoading: isCheckingSubscription } = useSubscriptionStatus()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { data: page } = await useAsyncData('pricing', () => queryContent('/pricing').findOne())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})

defineOgImage({
  component: 'Saas'
})

const isYearly = ref(false)

async function handlePriceClick(plan) {
  if (!user.value) {
    return navigateTo('/login')
  }

  const priceId = isYearly.value
    ? plan.price.year_stripe_plan_id
    : plan.price.month_stripe_plan_id

  if (!priceId) {
    console.error('Price ID non défini pour ce plan.')
    return
  }

  try {
    await createSubscription(priceId)

    if (subscription.value?.url) {
      window.location.href = subscription.value.url
    } else if (errorMessage.value) {
      console.error('Error message:', errorMessage.value)
    }
  } catch (error) {
    console.error('Error during subscription creation:', error)
  }
}

</script>

<template>
  <div v-if="page">
    <UPageHero v-bind="page.hero">
      <template #links>
        <UPricingToggle
          v-model="isYearly"
          class="w-48"
        />
      </template>
    </UPageHero>

    <UContainer>
      <UPricingGrid>
        <UPricingCard
          v-for="(plan, index) in page.plans"
          :key="index"
          v-bind="plan"
          :price="isYearly ? plan.price.year : plan.price.month"
          :cycle="isYearly ? '/year' : '/month'"
          @click="handlePriceClick(plan)"
        />
      </UPricingGrid>
    </UContainer>

    <ULandingSection>
      <ULandingLogos>
        <UIcon
          v-for="icon in page.logos.icons"
          :key="icon"
          :name="icon"
          class="w-12 h-12 flex-shrink-0 text-gray-500 dark:text-gray-400"
        />
      </ULandingLogos>
    </ULandingSection>

    <ULandingSection
      :title="page.faq.title"
      :description="page.faq.description"
    >
      <ULandingFAQ
        :items="page.faq.items"
        multiple
        default-open
        class="max-w-4xl mx-auto"
      />
    </ULandingSection>
  </div>
</template>

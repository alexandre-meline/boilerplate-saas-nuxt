<script setup lang="ts">
import { useSubscriptionStatus } from '~/composables/useSubscriptionStatus'

const user = useSupabaseUser()
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
  component: 'Saas',
  title: page.value.title,
  description: page.value.description
})

const isYearly = ref(false)

const { isSubscribed, isLoading } = useSubscriptionStatus()

console.log('isSubscribed', isSubscribed.value)
console.log('isLoading', isLoading)

async function handlePriceClick(plan) {
  if (!user.value) {
    return navigateTo('/login');
  }
  
  console.log(`Le plan ${plan.title} a été cliqué ! Pour la période ${isYearly.value ? 'annuelle' : 'mensuelle'}.`);
  
  const priceId = isYearly.value
    ? plan.price.year_stripe_plan_id
    : plan.price.month_stripe_plan_id;
  
  if (!priceId) {
    console.error('Price ID non défini pour ce plan.');
    return;
  }
  
  console.log('Price ID :', priceId);
  
  try {
    // Call the Stripe API to retrieve the checkout URL
    const queryParams = new URLSearchParams({ priceId });
    const response = await fetch(`/api/stripe?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Error fetching checkout session:', response.statusText);
      return;
    }

    const data = await response.json();
    if (data.url) {
      // Redirect the user to the Stripe payment URL
      window.location.href = data.url;
    } else {
      console.error('Error retrieving checkout URL.');
    }
  } catch (error) {
    console.error('Error calling Stripe API:', error);
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

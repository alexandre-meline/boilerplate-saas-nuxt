import { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import Stripe from 'stripe'

export const MAX_COUNT = 5
export const protectedRoute = async (event: H3Event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  event.context.user = user
}

// Stripe
const config = useRuntimeConfig()
export const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2024-06-20',
  typescript: true
})

export function absoluteUrl(path: string) {
  return `${config.appUrl}${path}`
}

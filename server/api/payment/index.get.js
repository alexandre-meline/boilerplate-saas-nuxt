
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const query = getQuery(event);
  const priceId = query.priceId;

  const token = event.req.headers.authorization

  const response = await $fetch(config.djangoUrl + 'payment/subscription/', {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
    params: {'price_id': priceId}
  })

  return response
})
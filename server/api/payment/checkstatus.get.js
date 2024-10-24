export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
  
    const token = event.req.headers.authorization
  
    const response = await $fetch(config.djangoUrl + 'payment/subscription/status/', {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
        'Content-Type': 'application/json',
      }, 
    })
    return response
  })
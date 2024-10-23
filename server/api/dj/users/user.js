
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const token = event.req.headers.authorization
  const response = await $fetch(config.djangoUrl + 'user/profile/', {
    headers: {
      Authorization: `${token}`, // Utiliser le JWT pour l'authentification
      'Content-Type': 'application/json',
    },
    // params: { ...event.query }, // Passez les paramètres de requête si nécessaires
  })

  return response
})

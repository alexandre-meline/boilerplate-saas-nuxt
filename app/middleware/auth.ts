export default defineNuxtRouteMiddleware((to, _from) => {
  const router = useRouter()
  const user = useSupabaseUser()
  if (!user.value) {
    return router.push('/login')
  }
})

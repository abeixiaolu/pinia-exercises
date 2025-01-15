import { User, UserRegister, login as _login, registerUser } from '@/api/auth'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref, computed } from 'vue'

const usePrivateStore = defineStore('private-auth', () => {
  const currentUser = ref<User | null>(null)

  return {
    currentUser,
  }
})

export const useAuthStore = defineStore('auth', () => {
  const privateStore = usePrivateStore()

  function signup(userInfo: UserRegister): Promise<User> {
    return registerUser(userInfo)
  }

  async function login(email: string, password: string) {
    const user = await _login({ email, password })
    privateStore.currentUser = user
  }

  function logout() {
    privateStore.currentUser = null
  }

  return {
    currentUser: computed(() => privateStore.currentUser),
    signup,
    login,
    logout,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

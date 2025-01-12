import { acceptHMRUpdate, defineStore } from 'pinia'

export const useDango = defineStore('2.5.1 store-actions', {
  state: () => ({
    amount: 20,
    eatenBalls: 0,
    isEating: false,
  }),

  getters: {
    finishedSticks: state => Math.floor(state.eatenBalls / 3),
  },

  actions: {
    eatDango() {
      if (this.amount < 1) return
      this.eatenBalls++
      if (this.eatenBalls % 3 === 0) this.amount--
    },
    startEating() {
      if (this.isEating || this.amount < 1) return
      this.isEating = true
      return new Promise(resolve => {
        const timer = setInterval(() => {
          if (!this.isEating) {
            clearInterval(timer)
            resolve(false)
            return
          }
          this.eatDango()
          if (this.amount === 0) {
            clearInterval(timer)
            resolve(true)
            this.isEating = false
          }
        }, 100)
      })
    },
    stopEating() {
      this.isEating = false
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDango, import.meta.hot))
}

import { defineStore } from 'pinia'

export const useDangoShop = defineStore('2.4.1 store-getters', {
  state: () => ({ amount: 0 }),
  getters: {
    totalPrice: state => {
      return state.amount * DANGO_PRICE
    },
    discountedPrice: state => {
      let price = 0
      if (state.amount < 3) price = state.amount * DANGO_PRICE
      else if (state.amount >= 3 && state.amount < 5) price = state.amount * DANGO_PRICE * 0.9
      else if (state.amount >= 5 && state.amount < 10) price = state.amount * DANGO_PRICE * 0.85
      else price = state.amount * DANGO_PRICE * 0.8
      return Math.round(price)
    },
    haveDiscount: state => {
      return state.amount >= 3
    },
    savingMoney(): number {
      return this.totalPrice - this.discountedPrice
    },
  },
})

// Do not change this value, you will need it
const DANGO_PRICE = 350

import { inject, Plugin, effectScope, InjectionKey, EffectScope } from 'vue'

export function defineStore<R>(fn: () => R) {
  function useStore() {
    const stores = inject(storesMapKey)
    const globalEffect = inject(effectKey)
    if (!stores || !globalEffect) {
      throw new Error('You must use  useStore() inside a setup function')
    }
    if (!stores.has(fn)) {
      const effect = globalEffect.run(() => effectScope())!
      const store = effect.run(() => fn())

      // stores.$effect = effect
      stores.set(fn, store)
    }

    return stores.get(fn) as R
  }

  return useStore
}

const effectKey = Symbol('effect') as InjectionKey<EffectScope>
const storesMapKey = Symbol('stores') as InjectionKey<WeakMap<() => unknown, unknown>>
// Keep this exported
export const appPlugin: Plugin = app => {
  const stores = new WeakMap<() => unknown, unknown>()
  const globalEffect = effectScope(true)
  // ...
  app.provide(storesMapKey, stores)
  app.provide(effectKey, globalEffect)
}

// NOTE: remove this line (or change the 1 into 0) if you don't want
// to work on the Type Safety part
/* eslint @typescript-eslint/no-explicit-any:0 */
import { defineStore, StateTree } from 'pinia'

export function definePrivateState<Id extends string, PrivateState extends () => StateTree, SetupReturn>(
  id: Id,
  privateStateFn: PrivateState,
  setup: (privateSTate: ReturnType<PrivateState>) => SetupReturn,
) {
  const usePrivateStore = defineStore(`${id}-private`, {
    state: privateStateFn,
  })

  const privateStore = usePrivateStore()
  return defineStore(id, () => {
    return setup(
      // FIXME: you will have to rewrite this to make it work
      privateStore.$state as any,
    )
  })
}

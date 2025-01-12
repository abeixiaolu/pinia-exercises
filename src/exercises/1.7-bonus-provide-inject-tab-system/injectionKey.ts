import { InjectionKey, Ref } from 'vue'

export const registerTabKey: InjectionKey<(title: Ref<string>) => { isVisible: Ref<boolean> }> = Symbol('tabs')

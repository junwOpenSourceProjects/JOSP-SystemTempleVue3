// Vue 3 类型声明
// 解决 pnpm 环境下 vue/dist/vue.d.ts 的 re-export 链路无法解析 @vue/runtime-dom 的问题
// 本文件声明 vue 模块，直接从物理文件路径导入，不再依赖 node_modules 解析
declare module 'vue' {
  // 引用 runtime-core 的类型
  import type {
    App,
    Component,
    ComponentPublicInstance,
    Directive,
    DirectiveBinding,
    Ref,
    MaybeRef,
    MaybeRefOrGetter,
    ShallowRef,
    ToRef,
    ToRefs,
    UnwrapRef,
    WritableComputedRef,
    ComputedRef,
    PropType,
    VNode,
    ExtractPropTypes,
    ExtractPublicPropTypes,
    ComponentOptions,
    ComponentCustomProperties,
    ComponentCustomOptions,
    DirectiveArguments,
  } from './runtime-core/index';

  // 引用 reactivity 的类型
  import type {
    WatchStopHandle,
  } from './reactivity/index';

  // 引用 shared 的类型
  import type {
   Assigner,
  } from './shared/index';

  // 声明所有导出的类型
  export type {
    App,
    Component,
    ComponentPublicInstance,
    Directive,
    DirectiveBinding,
    Ref,
    MaybeRef,
    MaybeRefOrGetter,
    ShallowRef,
    ToRef,
    ToRefs,
    UnwrapRef,
    WritableComputedRef,
    ComputedRef,
    PropType,
    VNode,
    ExtractPropTypes,
    ExtractPublicPropTypes,
    ComponentOptions,
    ComponentCustomProperties,
    ComponentCustomOptions,
    DirectiveArguments,
  };

  // 声明所有导出的值
  export const EffectScope: typeof import('./runtime-core/index').EffectScope;
  export const computed: typeof import('./runtime-core/index').computed;
  export const createApp: typeof import('./runtime-core/index').createApp;
  export const customRef: typeof import('./runtime-core/index').customRef;
  export const defineAsyncComponent: typeof import('./runtime-core/index').defineAsyncComponent;
  export const defineComponent: typeof import('./runtime-core/index').defineComponent;
  export const effectScope: typeof import('./runtime-core/index').effectScope;
  export const getCurrentInstance: typeof import('./runtime-core/index').getCurrentInstance;
  export const getCurrentScope: typeof import('./runtime-core/index').getCurrentScope;
  export const h: typeof import('./runtime-core/index').h;
  export const inject: typeof import('./runtime-core/index').inject;
  export const nextTick: typeof import('./runtime-core/index').nextTick;
  export const onActivated: typeof import('./runtime-core/index').onActivated;
  export const onBeforeMount: typeof import('./runtime-core/index').onBeforeMount;
  export const onBeforeUnmount: typeof import('./runtime-core/index').onBeforeUnmount;
  export const onBeforeUpdate: typeof import('./runtime-core/index').onBeforeUpdate;
  export const onMounted: typeof import('./runtime-core/index').onMounted;
  export const onRenderTracked: typeof import('./runtime-core/index').onRenderTracked;
  export const onRenderTriggered: typeof import('./runtime-core/index').onRenderTriggered;
  export const onScopeDispose: typeof import('./runtime-core/index').onScopeDispose;
  export const onUnmounted: typeof import('./runtime-core/index').onUnmounted;
  export const onUpdated: typeof import('./runtime-core/index').onUpdated;
  export const provide: typeof import('./runtime-core/index').provide;
  export const reactive: typeof import('./runtime-core/index').reactive;
  export const ref: typeof import('./runtime-core/index').ref;
  export const resolveComponent: typeof import('./runtime-core/index').resolveComponent;
  export const shallowReactive: typeof import('./runtime-core/index').shallowReactive;
  export const shallowReadonly: typeof import('./runtime-core/index').shallowReadonly;
  export const shallowRef: typeof import('./runtime-core/index').shallowRef;
  export const toRaw: typeof import('./runtime-core/index').toRaw;
  export const toRef: typeof import('./runtime-core/index').toRef;
  export const toRefs: typeof import('./runtime-core/index').toRefs;
  export const triggerRef: typeof import('./runtime-core/index').triggerRef;
  export const unref: typeof import('./runtime-core/index').unref;
  export const useAttrs: typeof import('./runtime-core/index').useAttrs;
  export const useTemplateRef: typeof import('./runtime-core/index').useTemplateRef;
  export const watch: typeof import('./runtime-core/index').watch;
  export const watchEffect: typeof import('./runtime-core/index').watchEffect;
  export const watchPostEffect: typeof import('./runtime-core/index').watchPostEffect;
  export const watchSyncEffect: typeof import('./runtime-core/index').watchSyncEffect;
  export const withDefaults: typeof import('./runtime-core/index').withDefaults;
  export const withDirectives: typeof import('./runtime-core/index').withDirectives;
  export const withMemo: typeof import('./runtime-core/index').withMemo;

  // 顶层函数
  export { createSSRApp, createApp, h, isProxy, isReactive, isReadonly, isRef, mergeDefaults, version } from './runtime-core/index';
  export { createRenderer } from './runtime-core/index';
  export { compileToFunction, compile } from './compiler-dom/index';

  // 生命周期钩子返回类型
  export type WatchHandle = WatchStopHandle;
}

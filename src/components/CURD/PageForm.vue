<template>
  <el-form
    ref="formRef"
    label-width="auto"
    v-bind="form"
    :model="formData"
    :rules="formRules"
  >
    <template v-for="item in formItems" :key="item.prop">
      <el-form-item v-show="!item.hidden" :label="item.label" :prop="item.prop">
        <!-- Label -->
        <template #label v-if="item.tips">
          <span>
            {{ item.label }}
            <el-tooltip
              placement="bottom"
              effect="light"
              :content="item.tips"
              :raw-content="true"
            >
              <el-icon style="vertical-align: -0.15em" size="16">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </span>
        </template>
        <!-- Input 输入框 -->
        <template v-if="item.type === 'input' || item.type === undefined">
          <el-input v-model="formData[item.prop]" v-bind="item.attrs" />
        </template>
        <!-- Select 选择器 -->
        <template v-else-if="item.type === 'select'">
          <el-select v-model="formData[item.prop]" v-bind="item.attrs">
            <template v-for="option in item.options" :key="option.value">
              <el-option v-bind="option" />
            </template>
          </el-select>
        </template>
        <!-- Radio 单选框 -->
        <template v-else-if="item.type === 'radio'">
          <el-radio-group v-model="formData[item.prop]" v-bind="item.attrs">
            <template v-for="option in item.options" :key="option.value">
              <el-radio v-bind="option" />
            </template>
          </el-radio-group>
        </template>
        <!-- Checkbox 多选框 -->
        <template v-else-if="item.type === 'checkbox'">
          <el-checkbox-group v-model="formData[item.prop]" v-bind="item.attrs">
            <template v-for="option in item.options" :key="option.value">
              <el-checkbox v-bind="option" />
            </template>
          </el-checkbox-group>
        </template>
        <!-- Input Number 数字输入框 -->
        <template v-else-if="item.type === 'input-number'">
          <el-input-number v-model="formData[item.prop]" v-bind="item.attrs" />
        </template>
        <!-- TreeSelect 树形选择 -->
        <template v-else-if="item.type === 'tree-select'">
          <el-tree-select v-model="formData[item.prop]" v-bind="item.attrs" />
        </template>
        <!-- DatePicker 日期选择器 -->
        <template v-else-if="item.type === 'date-picker'">
          <el-date-picker v-model="formData[item.prop]" v-bind="item.attrs" />
        </template>
        <!-- Text 文本 -->
        <template v-else-if="item.type === 'text'">
          <el-text v-bind="item.attrs">{{ formData[item.prop] }}</el-text>
        </template>
        <!-- 自定义 -->
        <template v-else-if="item.type === 'custom'">
          <slot
            :name="item.slotName ?? item.prop"
            :prop="item.prop"
            :formData="formData"
            :attrs="item.attrs"
          ></slot>
        </template>
      </el-form-item>
    </template>
  </el-form>
</template>

<script setup lang="ts">
/**
 * 表单组件 (PageForm)
 * 职责：渲染动态表单，支持多种表单项类型
 * 用于在页面中直接展示表单（如搜索区域、详情查看等）
 * 特性：支持表单项联动（watch、computed、watchEffect）
 */
import type { FormInstance, FormRules } from "element-plus";
import type { IObject, IPageForm } from "./types";

/** 组件属性：默认主键名为 id */
const props = withDefaults(defineProps<IPageForm>(), {
  pk: "id",
});

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 响应式的表单项数据 */
const formItems = reactive(props.formItems);

/** 表单数据对象 */
const formData = reactive<IObject>({});

/** 表单验证规则 */
const formRules: FormRules = {};

/** 准备函数数组（用于初始化监听器） */
const prepareFuncs: Array<() => void> = [];

/** 初始化表单项和数据 */
for (const item of formItems) {
  // 执行初始化函数
  item.initFn && item.initFn(item);
  // 初始化表单数据
  formData[item.prop] = item.initialValue ?? "";
  // 初始化验证规则
  formRules[item.prop] = item.rules ?? [];

  // 如果配置了 watch 函数，监听该字段变化
  if (item.watch !== undefined) {
    prepareFuncs.push(() => {
      watch(
        () => formData[item.prop],
        (newValue: unknown, oldValue: unknown) => {
          item.watch && item.watch(newValue, oldValue, formData, formItems);
        }
      );
    });
  }

  // 如果配置了 computed 函数，创建计算属性
  if (item.computed !== undefined) {
    prepareFuncs.push(() => {
      watchEffect(() => {
        item.computed && (formData[item.prop] = item.computed(formData));
      });
    });
  }

  // 如果配置了 watchEffect 函数，响应式收集依赖
  if (item.watchEffect !== undefined) {
    prepareFuncs.push(() => {
      watchEffect(() => {
        item.watchEffect && item.watchEffect(formData);
      });
    });
  }
}

/** 执行所有准备函数 */
prepareFuncs.forEach((func) => func());

/**
 * 获取表单数据
 * @param key 可选，指定获取某个字段的值
 * @returns 表单数据对象或指定字段值
 */
function getFormData(key?: string) {
  return key === undefined ? formData : (formData[key] ?? undefined);
}

/**
 * 设置表单数据（批量设置）
 * @param data 包含字段和值的对象
 */
function setFormData(data: IObject) {
  for (const key in formData) {
    if (Object.hasOwn(formData, key) && key in data) {
      formData[key] = data[key];
    }
  }
  // 如果数据中包含主键，也设置主键
  if (Object.hasOwn(data, props.pk)) {
    formData[props.pk] = data[props.pk];
  }
}

/**
 * 设置单个表单项的值
 * @param key 字段名
 * @param value 要设置的值
 */
function setFormItemData(key: string, value: any) {
  formData[key] = value;
}

/** 暴露的属性和方法，供父组件通过 ref 调用 */
defineExpose({ formRef, getFormData, setFormData, setFormItemData });
</script>

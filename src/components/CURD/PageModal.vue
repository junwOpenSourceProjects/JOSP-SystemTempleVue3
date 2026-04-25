<template>
  <!-- drawer -->
  <template v-if="modalConfig.component === 'drawer'">
    <el-drawer
      v-model="modalVisible"
      :append-to-body="true"
      v-bind="modalConfig.drawer"
      @close="handleCloseModal"
    >
      <!-- 表单 -->
      <el-form
        ref="formRef"
        label-width="auto"
        v-bind="modalConfig.form"
        :model="formData"
        :rules="formRules"
      >
        <template v-for="item in formItems" :key="item.prop">
          <el-form-item
            v-show="!item.hidden"
            :label="item.label"
            :prop="item.prop"
          >
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
              <el-checkbox-group
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              >
                <template v-for="option in item.options" :key="option.value">
                  <el-checkbox v-bind="option" />
                </template>
              </el-checkbox-group>
            </template>
            <!-- Input Number 数字输入框 -->
            <template v-else-if="item.type === 'input-number'">
              <el-input-number
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              />
            </template>
            <!-- TreeSelect 树形选择 -->
            <template v-else-if="item.type === 'tree-select'">
              <el-tree-select
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              />
            </template>
            <!-- DatePicker 日期选择器 -->
            <template v-else-if="item.type === 'date-picker'">
              <el-date-picker
                v-model="formData[item.prop]"
                v-bind="item.attrs"
              />
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
              >
              </slot>
            </template>
          </el-form-item>
        </template>
      </el-form>
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div>
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseModal">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </template>
  <!-- dialog -->
  <template v-else>
    <el-dialog
      v-model="modalVisible"
      :align-center="true"
      :append-to-body="true"
      width="70vw"
      v-bind="modalConfig.dialog"
      style="padding-right: 0"
      @close="handleCloseModal"
    >
      <!-- 滚动 -->
      <el-scrollbar max-height="60vh">
        <!-- 表单 -->
        <el-form
          ref="formRef"
          label-width="auto"
          v-bind="modalConfig.form"
          style="padding-right: var(--el-dialog-padding-primary)"
          :model="formData"
          :rules="formRules"
        >
          <template v-for="item in formItems" :key="item.prop">
            <el-form-item
              v-show="!item.hidden"
              :label="item.label"
              :prop="item.prop"
            >
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
                <el-radio-group
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                >
                  <template v-for="option in item.options" :key="option.value">
                    <el-radio v-bind="option" />
                  </template>
                </el-radio-group>
              </template>
              <!-- Checkbox 多选框 -->
              <template v-else-if="item.type === 'checkbox'">
                <el-checkbox-group
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                >
                  <template v-for="option in item.options" :key="option.value">
                    <el-checkbox v-bind="option" />
                  </template>
                </el-checkbox-group>
              </template>
              <!-- Input Number 数字输入框 -->
              <template v-else-if="item.type === 'input-number'">
                <el-input-number
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                />
              </template>
              <!-- TreeSelect 树形选择 -->
              <template v-else-if="item.type === 'tree-select'">
                <el-tree-select
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                />
              </template>
              <!-- DatePicker 日期选择器 -->
              <template v-else-if="item.type === 'date-picker'">
                <el-date-picker
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                />
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
                >
                </slot>
              </template>
            </el-form-item>
          </template>
        </el-form>
      </el-scrollbar>
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div style="padding-right: var(--el-dialog-padding-primary)">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="handleCloseModal">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </template>
</template>

<script setup lang="ts">
/**
 * 弹窗表单组件 (PageModal)
 * 职责：渲染弹窗/抽屉形式的表单，用于新增和编辑操作
 * 支持两种容器类型：el-dialog（弹窗）和 el-drawer（抽屉）
 * 使用方式：配合 usePage hook 使用，通过 setModalVisible 打开弹窗
 */
import { useThrottleFn } from "@vueuse/core";
import type { FormInstance, FormRules } from "element-plus";
import type { IModalConfig, IObject } from "./types";

/** 组件属性 */
const props = defineProps<{
  modalConfig: IModalConfig;
}>();

/** 自定义事件：表单提交成功后触发 */
const emit = defineEmits<{
  submitClick: [];
}>();

/** 主键名（用于编辑时识别记录） */
const pk = props.modalConfig.pk ?? "id";

/** 弹窗是否可见 */
const modalVisible = ref(false);

/** 表单引用 */
const formRef = ref<FormInstance>();

/** 响应式的表单项数据 */
const formItems = reactive(props.modalConfig.formItems);

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
  if (Object.hasOwn(data, pk)) {
    formData[pk] = data[pk];
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

/**
 * 显示弹窗
 * @param data 可选，编辑时传入数据用于填充表单
 */
function setModalVisible(data: IObject = {}) {
  modalVisible.value = true;
  // nextTick解决赋值后重置表单无效问题
  nextTick(() => {
    Object.values(data).length > 0 && setFormData(data);
  });
}

/**
 * 表单提交
 * 验证通过后调用配置的 formAction，执行实际的保存操作
 * 使用节流函数防止重复提交
 */
const handleSubmit = useThrottleFn(() => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      // 提交前回调（如果配置了的话）
      if (typeof props.modalConfig.beforeSubmit === "function") {
        props.modalConfig.beforeSubmit(formData);
      }
      // 调用配置的保存接口
      props.modalConfig.formAction(formData).then(() => {
        // 根据容器类型生成成功提示信息
        let msg = "操作成功";
        if (props.modalConfig.component === "drawer") {
          if (props.modalConfig.drawer?.title) {
            msg = `${props.modalConfig.drawer?.title}成功`;
          }
        } else {
          if (props.modalConfig.dialog?.title) {
            msg = `${props.modalConfig.dialog?.title}成功`;
          }
        }
        ElMessage.success(msg);
        emit("submitClick");
        handleCloseModal();
      });
    }
  });
}, 3000); // 3秒内不能重复提交

/**
 * 关闭弹窗
 * 重置表单并清除验证状态
 */
function handleCloseModal() {
  modalVisible.value = false;
  formRef.value?.resetFields();
  nextTick(() => {
    formRef.value?.clearValidate();
  });
}

/** 暴露的属性和方法，供父组件通过 ref 调用 */
defineExpose({ setModalVisible, getFormData, setFormData, setFormItemData });
</script>

<style lang="scss" scoped></style>

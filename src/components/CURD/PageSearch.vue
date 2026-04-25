<template>
  <el-card
    shadow="never"
    class="mb-[10px]"
    v-show="visible"
    v-hasPerm="[`${searchConfig.pageName}:query`]"
  >
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <template v-for="(item, index) in formItems" :key="item.prop">
        <el-form-item
          v-show="isExpand ? true : index < showNumber"
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
            <el-input
              v-model="queryParams[item.prop]"
              v-bind="item.attrs"
              @keyup.enter="handleQuery"
            />
          </template>
          <!-- InputTag 标签输入框 -->
          <template v-if="item.type === 'input-tag'">
            <div class="flex-center">
              <el-tag
                v-for="tag in inputTagMap[item.prop].data"
                class="mr-2"
                :key="tag"
                :closable="true"
                v-bind="inputTagMap[item.prop].tagAttrs"
                @close="handleCloseTag(item.prop, tag)"
              >
                {{ tag }}
              </el-tag>
              <template v-if="inputTagMap[item.prop].inputVisible">
                <el-input
                  :ref="(el: unknown) => (inputTagMap[item.prop].inputRef = el)"
                  v-model="inputTagMap[item.prop].inputValue"
                  v-bind="inputTagMap[item.prop].inputAttrs"
                  @keyup.enter="handleInputConfirm(item.prop)"
                  @blur="handleInputConfirm(item.prop)"
                />
              </template>
              <template v-else>
                <el-button
                  v-bind="inputTagMap[item.prop].buttonAttrs"
                  @click="handleShowInput(item.prop)"
                >
                  {{ inputTagMap[item.prop].buttonAttrs.btnText }}
                </el-button>
              </template>
            </div>
          </template>
          <!-- Select 选择器 -->
          <template v-else-if="item.type === 'select'">
            <el-select v-model="queryParams[item.prop]" v-bind="item.attrs">
              <template v-for="option in item.options" :key="option.value">
                <el-option :label="option.label" :value="option.value" />
              </template>
            </el-select>
          </template>
          <!-- TreeSelect 树形选择 -->
          <template v-else-if="item.type === 'tree-select'">
            <el-tree-select
              v-model="queryParams[item.prop]"
              v-bind="item.attrs"
            />
          </template>
          <!-- DatePicker 日期选择器 -->
          <template v-else-if="item.type === 'date-picker'">
            <el-date-picker
              v-model="queryParams[item.prop]"
              v-bind="item.attrs"
            />
          </template>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="refresh" @click="handleReset">重置</el-button>
        <!-- 展开/收起 -->
        <el-link
          v-if="isExpandable && formItems.length > showNumber"
          class="ml-2"
          type="primary"
          :underline="false"
          @click="isExpand = !isExpand"
        >
          <template v-if="isExpand"> 收起<i-ep-arrow-up /> </template>
          <template v-else> 展开<i-ep-arrow-down /> </template>
        </el-link>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
/**
 * 搜索表单组件 (PageSearch)
 * 职责：提供搜索条件表单，支持多种表单项类型，展开/收起功能
 * 使用方式：配合 PageContent 和 PageModal 使用 usePage hook
 */
import type { FormInstance } from "element-plus";
import type { IObject, ISearchConfig } from "./types";

/** 组件属性：搜索配置对象 */
const props = defineProps<{
  searchConfig: ISearchConfig;
}>();

/** 自定义事件：搜索按钮点击、重置按钮点击 */
const emit = defineEmits<{
  queryClick: [queryParams: IObject];
  resetClick: [queryParams: IObject];
}>();

/** 表单引用 */
const queryFormRef = ref<FormInstance>();

/** 是否显示组件（用于搜索区域的显示/隐藏切换） */
const visible = ref(true);

/** 响应式的表单项数据 */
const formItems = reactive(props.searchConfig.formItems);

/** 是否可展开/收缩 */
const isExpandable = ref(props.searchConfig.isExpandable ?? true);

/** 是否已展开状态 */
const isExpand = ref(false);

/**
 * 计算属性：表单项展示数量
 * - 如果可展开，默认显示3项，超出部分隐藏
 * - 如果不可展开，显示全部表单项
 */
const showNumber = computed(() => {
  if (isExpandable.value === true) {
    return props.searchConfig.showNumber ?? 3;
  } else {
    return formItems.length;
  }
});

/** 搜索表单数据（响应式对象） */
const queryParams = reactive<IObject>({});

/** 标签输入框类型的数据存储（input-tag类型使用） */
const inputTagMap = reactive<IObject>({});

/** 初始化表单项数据 */
for (const item of formItems) {
  // 执行初始化函数（如果配置了的话）
  item.initFn && item.initFn(item);

  // 如果是标签输入框类型（input-tag）
  if (item.type === "input-tag") {
    inputTagMap[item.prop] = {
      // 初始值，如果为数组直接使用，否则置为空数组
      data: Array.isArray(item.initialValue) ? item.initialValue : [],
      inputVisible: false,  // 输入框是否可见
      inputValue: "",       // 当前输入的值
      inputRef: null,       // 输入框DOM引用
      buttonAttrs: {        // 按钮属性
        size: item.attrs?.size ?? "default",
        btnText: item.attrs?.btnText ?? "+ New Tag",
        style: "color: #b0b2b7",
      },
      inputAttrs: {         // 输入框属性
        size: item.attrs?.size ?? "default",
        clearable: item.attrs?.clearable ?? false,
        style: "width: 150px",
      },
      tagAttrs: {           // 标签属性
        size: item.attrs?.size ?? "default",
      },
    };

    // 为 input-tag 类型创建计算属性，实现双向绑定
    queryParams[item.prop] = computed({
      get() {
        // 如果配置了 join 属性，用该字符拼接为字符串；否则返回数组
        return typeof item.attrs?.join === "string"
          ? inputTagMap[item.prop].data.join(item.attrs.join)
          : inputTagMap[item.prop].data;
      },
      set(value: string) {
        // resetFields 时会被调用，将字符串解析为数组
        inputTagMap[item.prop].data =
          typeof item.attrs?.join === "string"
            ? value.split(item.attrs.join).filter((item: any) => item !== "")
            : value;
      },
    });
  } else {
    // 普通表单项，直接使用初始值
    queryParams[item.prop] = item.initialValue ?? "";
  }
}

/**
 * 重置表单
 * 调用 Element Plus 的 resetFields 方法重置表单值
 */
function handleReset() {
  queryFormRef.value?.resetFields();
  emit("resetClick", queryParams);
}

/**
 * 搜索按钮点击
 * 触发查询事件，传递当前表单数据
 */
function handleQuery() {
  emit("queryClick", queryParams);
}

/**
 * 获取查询参数
 * 用于外部组件获取当前的搜索条件
 * @returns 当前搜索条件对象
 */
function getQueryParams() {
  return queryParams;
}

/**
 * 切换搜索表单的显示/隐藏状态
 */
function toggleVisible() {
  visible.value = !visible.value;
}

/** 关闭标签 */
function handleCloseTag(prop: string, tag: string) {
  inputTagMap[prop].data.splice(inputTagMap[prop].data.indexOf(tag), 1);
}

/** 确认添加标签（输入框回车或失去焦点时触发） */
function handleInputConfirm(prop: string) {
  if (inputTagMap[prop].inputValue) {
    inputTagMap[prop].data.push(inputTagMap[prop].inputValue);
  }
  inputTagMap[prop].inputVisible = false;
  inputTagMap[prop].inputValue = "";
}

/** 显示标签输入框 */
function handleShowInput(prop: string) {
  inputTagMap[prop].inputVisible = true;
  nextTick(() => {
    (inputTagMap[prop].inputRef as any)?.focus();
  });
}

/** 暴露的属性和方法，供父组件通过 ref 调用 */
defineExpose({ getQueryParams, toggleVisible });
</script>

<style lang="scss" scoped></style>

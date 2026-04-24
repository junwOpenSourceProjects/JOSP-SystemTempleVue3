<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <div class="clearfix">
          <span>高级表单体验</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称 : " prop="name">
          <el-input v-model="form.name" placeholder="请输入活动名称" />
        </el-form-item>
        
        <el-form-item label="活动区域 : " prop="region">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="华东区域 (上海)" value="shanghai" />
            <el-option label="华北区域 (北京)" value="beijing" />
            <el-option label="华南区域 (广州)" value="guangzhou" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="活动时间 : " required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="选择起始日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="2">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                v-model="form.date2"
                placeholder="选择起步时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        
        <el-form-item label="即时分发 : " prop="delivery">
          <el-switch v-model="form.delivery" />
        </el-form-item>
        
        <el-form-item label="活动类型 : " prop="type">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="美食/餐厅线上活动" name="type" />
            <el-checkbox label="地推活动" name="type" />
            <el-checkbox label="线下主题活动" name="type" />
            <el-checkbox label="单纯品牌曝光" name="type" />
          </el-checkbox-group>
        </el-form-item>
        
        <el-form-item label="特殊资源 : " prop="resource">
          <el-radio-group v-model="form.resource">
            <el-radio label="线上品牌商赞助" />
            <el-radio label="线下场地免费" />
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="活动形式 : " prop="desc">
          <el-input v-model="form.desc" type="textarea" placeholder="填写活动详细介绍..." />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">
            {{ $t('common.confirm') }}
          </el-button>
          <el-button @click="resetForm(formRef)">{{ $t('common.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";

defineOptions({
  name: "FormDemo",
});

const formRef = ref<FormInstance>();

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  region: [
    {
      required: true,
      message: "请选择活动区域",
      trigger: "change",
    },
  ],
  date1: [
    {
      type: "date",
      required: true,
      message: "请选择一个日期",
      trigger: "change",
    },
  ],
  date2: [
    {
      type: "date",
      required: true,
      message: "请选择一个时间",
      trigger: "change",
    },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "至少选择一个活动性质",
      trigger: "change",
    },
  ],
  resource: [
    {
      required: true,
      message: "请选择活动资源配置",
      trigger: "change",
    },
  ],
  desc: [{ required: true, message: "请填写简单的活动描述", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid: boolean, fields: Record<string, boolean>) => {
    if (valid) {
      ElMessage.success("表单校验通过，准备提交...");
    } else {
      console.log("error submit!", fields);
      ElMessage.error("未通过校验，请重新填写");
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.demo-ruleForm {
  max-width: 700px;
  margin-top: 30px;
}
</style>

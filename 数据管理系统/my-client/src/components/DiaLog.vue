<template>
  <div>
    <el-dialog
      :model-value="addDiaLog"
      :title="title"
      :before-close="handleClose"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm.data"
        :rules="dataFormRules"
        label-width="100px"
      >
        <el-form-item :label="$t('DiaLog.type')" prop="type">
          <el-input v-model="dataForm.data.type" maxlength="12" clearable />
        </el-form-item>
        <el-form-item :label="$t('DiaLog.des')" prop="describe">
          <el-input
            v-model="dataForm.data.describe"
            :rows="2"
            type="textarea"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('DiaLog.income')" prop="income">
          <el-input-number
            v-model.number="dataForm.data.income"
            :precision="2"
            :min="0"
          
          />
        </el-form-item>
        <el-form-item :label="$t('DiaLog.expend')" prop="expend">
          <el-input-number
            v-model.number="dataForm.data.expend"
            :precision="2"
            :min="0"
          />
        </el-form-item>
        <el-form-item :label="$t('FundList.cash')" prop="cash">
          <el-input-number
            v-model.number="dataForm.data.cash"
            :precision="2"
            :min="0"
          />
        </el-form-item>
        <el-form-item :label="$t('DiaLog.remark')" prop="remark">
          <el-input
            v-model="dataForm.data.remark"
            :rows="2"
            type="textarea"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">{{ $t("FundList.close") }}</el-button>
          <el-button type="primary" @click="handleCommit(dataFormRef)">{{
            $t("FundList.confirm")
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, toRefs } from "vue";
import { ElMessage } from "element-plus";
import { addData, editData } from "@/api/login";

// i18n
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const addDiaLog = ref(true);

const dataFormRef = ref("");

const props = defineProps(["formData"]);

const emits = defineEmits(["update:modelValue", "refreshList"]);

//表单输入的数据
const dataForm = reactive({
  data: {}
});

//判断标题
const title = computed(() => {
  dataForm.data = props.formData.data;
  return dataForm.data._id ? t("FundList.edit") : t("FundList.new");
});



const dataFormRules = reactive({
  type: [
    {
      message: t("FundList.typeerr"),
      trigger: "blur",
    },
  ],
  describe: [
    {
      message: t("FundList.deserr"),
      trigger: "blur",
    },
  ],
  income: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  expend: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  cash: [
    {
      type: "number",
      trigger: "blur",
    },
  ],
  remark: [
    {
      trigger: "blur",
    },
  ],
});

//关闭的点击事件
const handleClose = () => {
  emits("update:modelValue", false);
};

// 提交
const handleCommit = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!dataForm.data._id) {
  
        addData(dataForm.data).then(() => {
          // 关闭弹窗
          emits("update:modelValue", false);
          // table更新
          emits("refreshList");

          ElMessage({
            message: t("FundList.success"),
            type: "success",
          });
        });
      } else {
        // 编辑
        editData(dataForm.data._id, dataForm.data).then(() => {
          // 关闭弹窗
          emits("update:modelValue", false);
          // table更新
          emits("refreshList");

          ElMessage({
            message: t("FundList.success"),
            type: "success",
          });
        });
      }
    }
  });
};
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>

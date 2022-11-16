<template>
  <div>
    <el-dialog
      :model-value="addDiaLogE"
      :title="title"
      :before-close="handleClose"
    >
      <el-form
        ref="dataFormRef"
        :model="dataForm.data"
        :rules="dataFormRules"
        label-width="100px"
      >
        <el-form-item :label="$t('DiaLog.name')" prop="name">
          <el-input v-model="dataForm.data.name" maxlength="12" clearable />
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
import { reactive, ref ,computed} from "vue";
import { ElMessage } from "element-plus";
import { editUser } from "@/api/login";

// i18n
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const addDiaLogE = ref(true);

const dataFormRef = ref("");

const props = defineProps(["formData"]);

const emits = defineEmits(["update:modelValue", "refreshList"]);

const title = computed(() => {
  dataForm.data = props.formData.data;
  return dataForm.data._id ? t("DiaLog.edit") : t("FundList.new");
 
});


//表单输入的数据
const dataForm = reactive({
  data: {},
});

const dataFormRules = reactive({
  name: [
    {
      message: t("DiaLog.name"),
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
      // 编辑
    
      editUser(dataForm.data._id, dataForm.data).then(() => {
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
  });
};
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>

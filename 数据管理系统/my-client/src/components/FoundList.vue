<template>
  <div class="FundList">
    <!-- 头部 搜索和新增按钮 -->
    <el-row class="FundList-head">
      <!--搜索栏---->
      <el-col :span="16">
        <el-form
          ref="searchFormRef"
          :model="searchForm.data"
          :rules="searchRules"
        >
          <el-form-item :label="$t('FundList.stime')">
            <el-form-item prop="startTime">
              <el-date-picker
                type="datetime"
                :placeholder="$t('FundList.ps')"
                v-model="searchForm.data.startTime"
              />
            </el-form-item>
            ------
            <el-form-item prop="endTime">
              <el-date-picker
                type="datetime"
                :placeholder="$t('FundList.pe')"
                v-model="searchForm.data.endTime"
              />
            </el-form-item>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <el-form-item>
              <el-button type="primary" @click="handleSearch">
                {{ $t("FundList.search") }}</el-button
              >
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" :offset="6">
        <el-button type="primary" @click="FormAdd()" v-if="ddddd == a">{{
          $t("FundList.add")
        }}</el-button>
      </el-col>
    </el-row>

    <el-table
      :data="tableData.value"
      style="width: 100%"
      border
      :table-layout="tableLayout"
    >
      <el-table-column
        type="index"
        :label="$t('FundList.index')"
        align="center"
      >
        <template v-slot="scope">
          <span>{{
            scope.$index +
            (paginations.data.page_index - 1) * paginations.data.page_size +
            1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Date" prop="data" align="center" class="table2">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 10px">{{
              formatDate(scope.row.date)
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="收支类型"
        prop="type"
        align="center"
        class="table3"
      >
        <template #reference>
          <el-tag
            ><span>{{ scope.row.type }}</span></el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="收支描述"
        prop="describe"
        align="center"
        class="table3"
      >
        <template #reference>
          <el-tag>{{ scope.row.describe }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="收入" prop="income" align="center" class="table3">
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
          >
            <template #default>
              <div>income: {{ scope.row.income }}</div>
            </template>
            <template #reference>
              <el-tag
                ><span style="color: rgb(52, 203, 107)">{{
                  scope.row.income
                }}</span></el-tag
              >
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="支出" prop="expend" align="center" class="table3">
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
          >
            <template #default>
              <div>expend: {{ scope.row.expend }}</div>
            </template>
            <template #reference>
              <el-tag
                ><span style="color: rgb(203, 80, 52)">{{
                  scope.row.expend
                }}</span></el-tag
              >
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="余额" prop="cash" align="center" class="table3">
        <template #default="scope">
          <el-popover
            effect="light"
            trigger="hover"
            placement="top"
            width="auto"
          >
          <template #default>
              <div>cash: {{ scope.row.cash }}</div>
            </template>
            <template #reference>
              <el-tag>{{ scope.row.cash }}</el-tag>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" class="table3">
      </el-table-column>
      <el-table-column
        label="操作"
        prop="operation"
        class="table2"
        fixed="right"
        align="center"
      >
        <template #default="scope">
          <el-button
            type="warning"
            @click="handleEdit(scope.row)"
            icon="edit"
            class="butt"
            v-if="ddddd == a"
            >编辑</el-button
          >
          <el-button
            type="danger"
            @click="handleDelete(scope.row)"
            icon="delete"
            class="butt"
            v-if="ddddd == a"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!--分页区-->
    <div class="pagination">
      <el-pagination
        v-model:currentPage="paginations.data.page_index"
        v-model:page-size="paginations.data.page_size"
        :page-sizes="paginations.data.page_sizes"
        :layout="paginations.data.layout"
        :total="paginations.data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <dia-log
      v-if="addDiaLog"
      v-model="addDiaLog"
      :formData="formData"
      @refreshList="getTableData"
    ></dia-log>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { getTableList } from "@/api/login";
import { deleteData } from "@/api/login";
import { Timer } from "@element-plus/icons-vue";
import DiaLog from "../components/DiaLog.vue";
import { useI18n } from "vue-i18n";
const router = useRouter();
const store = useStore(); 
const { t } = useI18n();
//所有表格的数据
const allTableData = reactive([]);

//表格的数据
const tableData = reactive([]);

//分页的数据
const fileterTableData = ref([]);

//获取的表格格式为auto
const tableLayout = ref("auto");

//添加框默认为false
const addDiaLog = ref(false);

//添加的数据
const formData = reactive({});

const dddd = store.getters.user;
const ddddd = dddd.identity;
let a = "manager";

const searchForm = reactive({
  data: {
    startTime: "",
    endTime: "",
  },
});

const searchRules = reactive({
  startTime: [
    {
      type: "date",
      trigger: "change",
    },
  ],
  endTime: [
    {
      type: "date",
      trigger: "change",
    },
  ],
});

// 搜索
const handleSearch = () => {
  // 两个搜索条件都不能为空
  if (!searchForm.data.startTime || !searchForm.data.endTime) {
    getTableData();
    return;
  }
  const sTime = searchForm.data.startTime.getTime();
  const eTime = searchForm.data.endTime.getTime();
  allTableData.value = fileterTableData.value.filter((item) => {
    let date = new Date(item.date);
    let time = date.getTime();
    return time >= sTime && time <= eTime;
  });
  setPaginations();
};

//改变日期格式
const formatDate = (time) => {
  let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000).toJSON();
  date = date.substring(0, 19).replace("T", " ");
  return date;
};

//添加按钮
const FormAdd = () => {
  formData.data = {
    type: "",
    describe: "",
    income: 0,
    expend: 0,
    cash: 0,
    remark: "",
  };
  addDiaLog.value = true;
};

const paginations = reactive({
  data: {
    page_index: 1, //当前位于多少页
    total: "", //总数
    page_size: "", //一页显示多少条
    page_sizes: [5, 10, 15], //每页显示多少条
    layout: "total,sizes,prev,pager,next,jumper", // 翻页属性
  },
});

const setPaginations = () => {
  paginations.data.total = allTableData.value.length;
  paginations.data.page_index = 1;
  paginations.data.page_size = 5;

  //设置默认分页数据
  tableData.value = allTableData.value.filter((item, index) => {
    return index < paginations.data.page_size;
  });
};

//切换每页有多少数据
const handleSizeChange = (page_size) => {
  paginations.data.page_index = 1;
  paginations.data.page_size = page_size;
  tableData.value = allTableData.value.filter((item, index) => {
    return index < page_size;
  });
};

const handleCurrentChange = (page) => {
  //截取数1
  let index = paginations.data.page_size * (page - 1);
  //截取数2
  let nums = paginations.data.page_size * page;
  tableData.value = allTableData.value.slice(index, nums);
};

// 编辑
const handleEdit = (row) => {
  // 初始化formData 因为只需要单向赋值所以不用toRefs
  formData.data = {
    type: row.type,
    describe: row.describe,
    income: row.income,
    expend: row.expend,
    cash: row.cash,
    remark: row.remark,
    _id: row._id,
  };
  addDiaLog.value = true;
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(t("FundList.del"), t("FundList.tip"), {
    confirmButtonText: t("FundList.confirm"),
    cancelButtonText: t("FundList.cancel"),
    type: "warning",
  }).then(() => {
    deleteData(row._id).then(() => {
      ElMessage({
        message: t("FundList.success"),
        type: "success",
      });
      getTableData();
    });
  });
};

// 获取table数据
const getTableData = () => {
  getTableList().then((res) => {
    allTableData.value = res.data;
    fileterTableData.value = allTableData.value;
    //设置分页数据
    setPaginations();
  });
};
// 获取table数据
getTableList()
  .then((res) => {
    allTableData.value = res.data;
    fileterTableData.value = allTableData.value;
    //设置分页数据
    setPaginations();
    console.log(dddd);
  })
  .catch((err) => console.log(err));
</script>

<style scoped>
.FundList {
  width: 100%;
  height: 100%;
  padding: 16px;
}

.butt {
  width: 90px;
}

.pagination {
  float: right;
  margin-top: 10px;
}
</style>

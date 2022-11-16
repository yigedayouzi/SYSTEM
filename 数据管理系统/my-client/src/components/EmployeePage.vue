<template>
  <div class="FundList">
    <!-- 头部 搜索和新增按钮 -->

    <el-table
      :data="tableData.value"
      style="width: 100%"
      border
      :table-layout="tableLayout"
    >

    <!--Index-->
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


<!--date-->
<el-table-column label="创建日期" prop="date" align="center" >
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 10px">{{
              formatDate(scope.row.date)
            }}</span>
          </div>
        </template>
      </el-table-column>

<!--name-->
      <el-table-column
        label="名称"
        prop="name"
        align="center"
        class="table3"
      >
        <template #reference>
          <el-tag
            ><span>{{scope.row.name}}</span></el-tag
          >
        </template>
      </el-table-column>

  
      <!--email-->
      <el-table-column
        label="邮箱"
        prop="email"
        align="center"
        class="table3"
      >
        <template #reference>
          <el-tag
            ><span>{{scope.row.email}}</span></el-tag
          >
        </template>
      </el-table-column>




      <!--identity-->
      <el-table-column
        label="身份"
        prop="identity"
        align="center"
        class="table3"
      >
        <template #reference>
          <el-tag
            ><span>{{scope.row.identity}}</span></el-tag
          >
        </template>
      </el-table-column>


<!--操作-->
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
  </div>


  <DiaLogEmployee   v-if="addDiaLogE"
      v-model="addDiaLogE"
      :formData="formData"
      @refreshList="getUserData"></DiaLogEmployee>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Timer } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { getUserList } from "@/api/login";
import { deleteUser } from "@/api/login";
import { useI18n } from "vue-i18n";
import DiaLogEmployee from "./DiaLogEmployee.vue";
const router = useRouter();
const store = useStore();
const { t } = useI18n();
//所有表格的数据
const allTableData = reactive([]);

//表格的数据
const tableData = reactive([]);

//DiaLog状态
const addDiaLogE = ref(false);

//修改的数据
const formData = reactive({});

//分页的数据
const fileterTableData = ref([]);

//获取的表格格式为auto
const tableLayout = ref("auto");

//权限判断
const dddd = store.getters.user;
const ddddd = dddd.identity;
let a = "manager"; 

//改变日期格式
const formatDate = (time) => {
  let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000).toJSON();
  date = date.substring(0, 19).replace("T", " ");
  return date;
};


//分页函数
const paginations = reactive({
  data: {
    page_index: 1, //当前位于多少页
    total: "", //总数
    page_size: "", //一页显示多少条
    page_sizes: [5, 10, 15], //每页显示多少条
    layout: "total,sizes,prev,pager,next,jumper", // 翻页属性
  },
});

//分页函数
const setPaginations = () => {
  paginations.data.total = allTableData.value.length;
  paginations.data.page_index = 1;
  paginations.data.page_size = 5;

  //设置默认分页数据
  tableData.value = allTableData.value.filter((item, index) => {
    return index < paginations.data.page_size;
  });
};

//  //分页函数，切换每页有多少数据
const handleSizeChange = (page_size) => {
  paginations.data.page_index = 1;
  paginations.data.page_size = page_size;
  tableData.value = allTableData.value.filter((item, index) => {
    return index < page_size;
  });
};

//分页函数
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
    name: row.name,
    _id: row._id,
  };
  addDiaLogE.value = true;
  console.log( addDiaLogE.value);
};

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(t("FundList.del"), t("FundList.tip"), {
    confirmButtonText: t("FundList.confirm"),
    cancelButtonText: t("FundList.cancel"),
    type: "warning",
  }).then(() => {
    deleteUser(row._id).then(() => {
      ElMessage({
        message: t("FundList.success"),
        type: "success",
      });
      getUserData();
    });
  });
};



// 获取table数据
const getUserData = () => {
    getUserList().then((res) => {
    allTableData.value = res.data;
    fileterTableData.value = allTableData.value;
    //设置分页数据
    setPaginations();
  });
};

// 获取table数据
getUserList()
  .then((res) => {
    allTableData.value = res.data;
    fileterTableData.value = allTableData.value;
    //设置分页数据
    setPaginations();
    console.log(ddddd);
  })
  .catch((err) => console.log(err));
</script>

<style>
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

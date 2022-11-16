<template>
  <!-- 侧边栏菜单区域 -->
  <el-menu text-color="#fff" :router="true" class="menu">
    <el-menu-item index="/IndexPage" class="elitem">
      <el-icon>
        <House />
      </el-icon>
      <span>{{ $t("LeftMenu.index") }}</span>
    </el-menu-item>
    <el-menu-item index="/FoundList" class="elitem">
      <el-icon>
          <TrendCharts />
        </el-icon>
        <span >{{ $t("LeftMenu.g2") }}</span>
    </el-menu-item>
    <el-menu-item index="/EmployeePage" class="elitem" v-if="employeeAdmin == b">
      <el-icon>
          <TrendCharts />
        </el-icon>
        <span >{{ $t("LeftMenu.Emplyee") }}</span>
    </el-menu-item>
    <el-menu-item  class="elitem" index="/infoshow" >
      <template #title>
        <el-icon>
          <Setting />
        </el-icon>
        <span>{{ $t("LeftMenu.infoshow") }}</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { House, TrendCharts, Setting } from "@element-plus/icons-vue";
import { useStore } from "vuex";
const store = useStore(); 
const employeeAdmin = store.getters.user.identity;
const b="manager";
</script>

<style scoped>
.el-menu {
  border-right: none;
  width: 100%;
  height: 100%;
  background-color: rgb(42, 140, 23);
}

.elgroup {
  background-color: rgb(104, 171, 91);
}
.elgroup:hover {
  background-color: rgb(104, 171, 91);
}


.elitem:hover {
  background-color: rgb(40, 224, 166);
}

.elit{
color: #000;
}
.elit:hover{
background-color: aqua;
}
.tem:hover{
    background-color: rgb(40, 224, 166);
}

.zz:hover{
  background-color: rgb(40, 224, 166);
}
</style>

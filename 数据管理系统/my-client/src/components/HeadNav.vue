<template>
  <div class="head-nav">
    <div class="the-left">
      <button class="but"></button>

      <a class="sys-name">{{ $t("headnav.title") }}</a>
    </div>

    <div class="the-right">
      <el-avatar :size="150"  :src="avatarSrc" />

      <div class="welcome">
        <div class="left">
          <el-switch
            v-model="language"
            @change="handleSwitch"
            active-text="中文"
            inactive-text="English"
            style="margin-right: 10px"
          />
        </div>
        <div class="right">
          <p class="name welName">{{ $t("headnav.hello") }}</p>
          <p class="name avatarname">{{ user.name }}</p>
        </div>
        <el-dropdown trigger="click" class="drop" @command="setDialogInfo">
          <el-button type="primary" class="butt">
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info">{{  $t('headnav.info')  }}</el-dropdown-item>

              <el-dropdown-item command="logout">{{  $t('headnav.logout')  }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowDown } from "@element-plus/icons-vue";
import { ref, computed,reactive} from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { useRouter } from "vue-router";


const router = useRouter();


const store = useStore();

const avatar = store.getters.user.identity;
let avatarSrc="";

if(avatar=="manager"){
avatarSrc="https://img1.baidu.com/it/u=627834852,1545440019&fm=253&fmt=auto&app=138&f=JPEG?w=799&h=500";
}else{
  avatarSrc="https://img2.baidu.com/it/u=1894321896,53820295&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=707";
}

//改变语言
const { locale } = useI18n();
const openOrClose = localStorage.getItem("my_locale")
  ? localStorage.getItem("my_locale") == "zh"
    ? true
    : false
  : true;
const language = ref(openOrClose);
const handleSwitch = () => {
  if (!localStorage.getItem("my_locale")) {
    localStorage.setItem("my_locale", "zh");
  }
  let toLanguage = localStorage.getItem("my_locale") == "zh" ? "en" : "zh";
  localStorage.setItem("my_locale", toLanguage);

  locale.value = toLanguage;
};

//获取user
const user = computed(() => {
  return store.getters.user;
});

// nav右侧下拉框函数
const setDialogInfo = (cmdItem) => {
  switch (cmdItem) {
    case "info":
      showIndoList();
      break;
    case "logout":
      logout();
      break;
  }
};
// 下拉框-退出登录选项
const logout = () => {
  //清除token
  localStorage.removeItem("eleToken");
  store.dispatch("clearCurrentState");
  router.push("/loginPage");
};


const showIndoList= ()=>{
  router.push("/InfoShow");
}
</script>

<style scoped>
.head-nav {
  height: 152px;
  background-color: rgb(178, 218, 115);
  border-bottom: solid 2px rgb(196, 255, 219);
  display: flex;
}

.the-left {
  flex: 4;
  display: flex;
}
.the-right {
  flex:2;
  justify-content: center;
  display: flex;
}
.but {
  width: 150px;
  height: 150px;
  background: url("../assets/touxiang.jpg");
  border: solid 2px rebeccapurple;
  background-size: cover;
  background-position: center;
  border-radius: 100%;
  margin-right: 2px;
}
.but:hover {
  border-color: rgb(233, 73, 118);
  cursor: pointer;
}

.sys-name {
  font-size: 120px;
  vertical-align: middle;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
  line-height: 150px;
  overflow: hidden;
  color: rgb(12, 129, 30);
}
.avatar {
  margin-right: 40px;
}
.name {
  line-height: 20px;
  text-align: center;
  font-size: 14px;
}

.welName {
  font-size: 30px;
  color: rgb(255, 255, 255);
  margin-bottom: 15px;
}

.avatarname {
  color: #409eff;
  font-weight: bolder;
  font-size: 30px;
}

.welcome {
  margin-right: 10px;
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 5px;
}

.right {
  margin-top: 50px;
}
.drop {
  transform: translate(150px,-20px);
}

.butt{
width: 40px;
height: 25px;
}
</style>

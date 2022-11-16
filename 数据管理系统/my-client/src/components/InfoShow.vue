<template >
  <div class="infoshow" >
    <div class="left">
      <div class="user">
        <el-avatar :size="150" :src="avatarSrc"  />
      </div>
    </div>
    <div class="the-right">
      <div class="item">
        <span>{{ user.name }}</span>
      </div>
      <div class="item">
        <span>{{ theidentity }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
// i18n
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const store = useStore();

//身份判断
const user = computed(() => store.getters.user);
const theidentity = computed(() => {
  return avatar == "manager"
    ? t("InfoShow.manager")
    : t("InfoShow.user");
});


//头像判断
const avatar = store.getters.user.identity;
let avatarSrc="";

if(avatar=="manager"){
avatarSrc="https://img1.baidu.com/it/u=627834852,1545440019&fm=253&fmt=auto&app=138&f=JPEG?w=799&h=500";
}else{
  avatarSrc="https://img2.baidu.com/it/u=1894321896,53820295&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=707";
}

</script>

<style scoped>


.infoshow {
  width: 100%;
  height: 100%;
  display: flex;
}

.left {
  flex: 3;
  background-color: rgb(99, 205, 49,0.5);
  border-right: solid 2px rgb(41, 235, 154);
}

.the-right {
  flex: 4; 
  flex-flow: column wrap;
background-color:  rgba(70, 184, 17, 0.5);
}
.user {
  width: 200px;
  height: auto;
  position: relative;
  top: 40%;
  left: 65%;
}


.item {
  padding: 26px;
  font-size: 28px;
  color: #333;
  margin-top: 25%;
}
</style>

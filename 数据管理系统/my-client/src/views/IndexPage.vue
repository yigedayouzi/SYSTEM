<template>
  <div class="yemian">
    <HeadNav></HeadNav>
    <div class="the-home">
      <div class="the-left">
        <LeftMenu></LeftMenu>
      </div>
      <div class="the-right"><RouterView></RouterView></div>
    </div>
  </div>
</template>
<script>
export default {
  watch: {
    $route() {
      this.$router.replace("/ReFresh");
      this.$router.go(0);
    },
  },
};
</script>
<script setup>
import HeadNav from "../components/HeadNav.vue";
import LeftMenu from "../components/LeftMenu.vue";
</script>

<style scoped>
*{
overflow: auto;

}
::-webkit-scrollbar {
       display: none;
      }
.yemian {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
}
.the-home {
  width: 100%;
  height: 100%;
  display: flex;
}
.the-left {
  flex: 2;
}
.the-right {
  flex: 11;
}
</style>

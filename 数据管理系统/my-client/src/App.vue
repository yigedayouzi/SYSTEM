<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
import jwt_decode from "jwt-decode";
import { useStore } from "vuex";

const store = useStore();

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

if (localStorage.eleToken) {
  const decoded = jwt_decode(localStorage.eleToken);
  //存储token
  store.dispatch("setAuthenticated", !isEmpty(decoded));
  store.dispatch("setUser", decoded);
}
</script>
<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>

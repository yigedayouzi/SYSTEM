<template>
  <div class="stars">
    <div
      @click="index"
      v-for="(item, index) in statrsCount"
      :key="index"
      ref="star"
      class="star"
    ></div>
  </div>

  <div class="Login">
    <div class="pos">
      <el-switch
        v-model="language"
        @change="handleSwitch"
        active-text="中文"
        inactive-text="English"
        style="margin-right: 10px"
      />
    </div>

    <section class="form_contain">
      <div class="manage_tip">
        <span class="title">{{ $t("headnav.title") }}</span>

        <!--el表单-->
        <el-form
          ref="LoginForm"
          :model="LoginUser"
          :rules="rules"
          label-width="60px"
          class="LoginForm"
        >
          <el-form-item
            :label="$t('LoginPage.emailLabel')"
            prop="email"
            class="item"
          >
            <el-input
              v-model="LoginUser.email"
              type="email"
              :placeholder="$t('LoginPage.emailHolder')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('LoginPage.passwordLabel')"
            prop="password"
            class="item"
          >
            <el-input
              v-model="LoginUser.password"
              type="password"
              :placeholder="$t('LoginPage.passwordHolder')"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="submit_btn"
              @click="LoginChange()"
              >{{ $t("LoginPage.login") }}</el-button
            >
          </el-form-item>
          <div class="NoRegister">
            <p>
              {{ $t("LoginPage.newUser")
              }}<router-link to="/RegisterPage">{{
                $t("LoginPage.register")
              }}</router-link>
            </p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<!--星空背景---->
<script>
export default {
  name: "RegisterPage",
  data() {
    return {
      statrsCount: 1800, //星星数量
      distance: 1000, //间距
    };
  },
  mounted() {
    let _this = this;
    let starArr = _this.$refs.star;
    console.log(starArr);
    starArr.forEach((item) => {
      var speed = 0.2 + Math.random() * 1;
      var thisDistance = _this.distance + Math.random() * 300;
      item.style.transformOrigin = `0 0 ${thisDistance}px`;
      item.style.transform = `translate3d(0,0,-${thisDistance}px)
                  rotateY(${Math.random() * 360}deg) rotateX(${
        Math.random() * -50
      }deg) scale(${speed},${speed})`;
    });
  },
};
</script>

<script setup>
import { useI18n } from "vue-i18n";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { login } from "@/api/login";
import jwt_decode from "jwt-decode";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

//改变语言
const { t } = useI18n();
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
const router = useRouter();

const LoginUser = reactive({
  email: "",
  password: "",
});
const rules = reactive({
  email: [
    {
      required: true,
      message: t("LoginPage.emailErr"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: t("LoginPage.passwordNotNull"),
      trigger: "blur",
    },
    {
      min: 6,
      max: 30,
      message: t("LoginPage.plengthErr"),
      trigger: "blur",
    },
  ],
});

const LoginForm = ref(null);

const store = useStore();

const LoginChange = () => {
  LoginForm.value.validate((valid) => {
    if (valid) {
      login(LoginUser).then((res) => {

        // 从res.data里获取token存储到localStorage
        const { token } = res.data;
        localStorage.setItem("eleToken", token);

        //解析token
        const decoded = jwt_decode(token);
        //console.log(decoded);
        //存储token
        store.dispatch("setAuthenticated", !Empty(decoded));
        store.dispatch("setUser", decoded);

        // 登录成功消息提示
        ElMessage({
          message: t("LoginPage.loginsuccess"),
          type: "success",
        });

        router.push({
          path: "/IndexPage", //目标路由地址
        });
        
      });
    } else {
      ElMessage({
        type: "error",
        message: t("LoginPage.err"),
        showClose: true,
      });
      return false;
    }
  });
};



const Empty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};
</script>
<style >
@keyframes rotate {
  0% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg) rotateY(0);
  }
  100% {
    transform: perspective(400px) rotateZ(20deg) rotateX(-40deg)
      rotateY(-360deg);
  }
}
.stars {
  transform: perspective(500px);
  transform-style: preserve-3d;
  position: absolute;
  perspective-origin: 50% 100%;
  left: 50%;
  animation: rotate 140s infinite linear;
  bottom: 0;
}
.star {
  width: 2px;
  height: 2px;
  background: #f7f7b8;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
}
html,
body {
  background: radial-gradient(
    200% 100% at bottom center,
    #f7f7b6,
    #e96f92,
    #1b2947
  );
  background: radial-gradient(
    220% 105% at top center,
    #1b2947 10%,
    #75517d 40%,
    #e96f92 65%,
    #f7f7b6
  );
  background-attachment: fixed;
  overflow: hidden;
  height: 100%;
  margin: 0px;
  padding: 0px;
}
.Login {
  position: relative;
  width: 100%;
  height: 100%;
}
.form_contain {
  width: 370px;
  height: 350px;
  position: absolute;
  margin: 10%;
  left: 40%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  border: solid 3px burlywood;
  transform: translateX(-50%);
  box-shadow: 0px 5px 10px rgba(227, 165, 165, 0.8);
}
.form_contain .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.LoginForm {
  margin-top: 20px;
  background-image: -webkit-linear-gradient(#ce5ed4, #5684cc, #72e3c5, #46e0e0);
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}

.submit_btn {
  width: 100%;
}

.item .el-form-item__label {
  color: #1b2947;
}
.pos {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
</style>

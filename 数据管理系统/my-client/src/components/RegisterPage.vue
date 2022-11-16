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
  <div class="register">
    <div class="pos">
      <el-switch
        v-model="language"
        @change="handleSwitch"
        active-text="中文"
        inactive-text="English"
        style="margin-right: 10px"
      />
    </div>
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">{{ $t("RegisterPage.title") }}</span>

        <!--el表单-->
        <el-form
          ref="registerForm"
          :model="registerUser"
          :rules="rules"
          label-width="80px"
          class="registerForm"
        >
          <el-form-item
            :label="$t('RegisterPage.userLabel')"
            prop="name"
            class="item"
          >
            <el-input
              v-model="registerUser.name"
              type="text"
              :placeholder="$t('RegisterPage.userHolder')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('RegisterPage.emailLabel')"
            prop="email"
            class="item2"
          >
            <el-input
              v-model="registerUser.email"
              type="email"
              :placeholder="$t('RegisterPage.emailHolder')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('RegisterPage.passwordLabel')"
            prop="password"
            class="item3"
          >
            <el-input
              v-model="registerUser.password"
              type="password"
              :placeholder="$t('RegisterPage.passwordHolder')"
            />
          </el-form-item>
          <el-form-item
            :label="$t('RegisterPage.repeatedLabel')"
            prop="password2"
            class="item4"
          >
            <el-input
              v-model="registerUser.password2"
              type="password"
              :placeholder="$t('RegisterPage.repeatedHolder')"
            />
          </el-form-item>

          <el-form-item :label="$t('RegisterPage.identityLabel')" class="item5">
            <el-select
              v-model="registerUser.identity"
              :placeholder="$t('RegisterPage.identityHolder')"
            >
              <el-option
                :label="$t('RegisterPage.managerLabel')"
                value="manager"
              ></el-option>
              <el-option
                :label="$t('RegisterPage.emplyeeLabel')"
                value="employee"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="submit_btn"
              @click="submitForm()"
              >{{ $t("RegisterPage.register") }}</el-button
            >
          </el-form-item>
          <div class="NoRegister">
            <p>
              {{ $t("RegisterPage.return")
              }}<router-link to="/LoginPage">{{
                $t("RegisterPage.login")
              }}</router-link
              >{{ $t("RegisterPage.page") }}
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
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { register } from "@/api/login";

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

const validatePass2 = (rule, value, callback) => {
  if (value !== registerUser.password) {
    callback(new Error(t("RegisterPage.repeatedError")));
  } else {
    callback();
  }
};
const router = useRouter();
const route = useRoute();
const registerUser = reactive({
  name: "",
  email: "",
  password: "",
  password2: "",
  identity: "",
});
const rules = reactive({
  name: [
    {
      required: true,
      message: t("RegisterPage.errUser"),
      trigger: "blur",
    },
    {
      min: 1,
      max: 30,
      message: t("RegisterPage.ulengthErr"),
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: t("RegisterPage.emailErr"),
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: t("RegisterPage.passwordNotNull"),
      trigger: "blur",
    },
    {
      min: 6,
      max: 30,
      message: t("RegisterPage.plengthErr"),
      trigger: "blur",
    },
  ],
  password2: [
    {
      required: true,
      message: t("RegisterPage.reapeatedNotNull"),
      trigger: "blur",
    },
    {
      min: 6,
      max: 30,
      message: t("RegisterPage.plengthErr"),
      trigger: "blur",
    },
    {
      validator: validatePass2,
      trigger: "blur",
    },
  ],
});

const registerForm = ref(null);

const submitForm = () => {
  registerForm.value.validate(async (valid) => {
    if (valid) {
      await register(registerUser).catch((e) => {});
      ElMessage(t("RegisterPage.success"));

      router.push({
        path: "LoginPage", //目标路由地址
      });
    } else {
      console.log("error");
      
      return false;
    }
  });
};
</script >
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
.register {
  position: relative;
  width: 100%;
  height: 100%;
}
.form_container {
  width: 420px;
  height: 450px;
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
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.registerForm {
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

.item2 .el-form-item__label {
  color: #1b2947;
}

.item3 .el-form-item__label {
  color: #1b2947;
}

.item4 .el-form-item__label {
  color: #1b2947;
}

.item5 .el-form-item__label {
  color: #1b2947;
}
.pos {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}
</style>

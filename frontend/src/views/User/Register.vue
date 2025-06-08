<template>
  <el-row class="register">
    <el-col :span="8" class="register__image">
      <div class="overlay">
        <h2>Meal Planner for Busy Lives.</h2>
        <p>Plan meals, create shopping lists effortlessly.</p>
      </div>
    </el-col>
    <el-col :span="16" class="register__main">
      <div class="register__main--form">
        <router-link class="register__main--logo logo" to="/">GroceryMaster</router-link>
        <el-form
          ref="formRef"
          :model="authStore"
          :rules="rules"
          label-position="top"
          hide-required-asterisk="true"
          @submit.prevent="handleRegister"
        >
          <el-alert v-if="authStore.error" type="error" :title="authStore.error" show-icon />

          <el-form-item label="Họ và tên" prop="fullName">
            <el-input v-model="authStore.fullName" placeholder="Nhập họ và tên"></el-input>
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input v-model="authStore.email" placeholder="Nhập email"></el-input>
          </el-form-item>

          <el-form-item label="Mật khẩu" prop="password">
            <el-input
              v-model="authStore.password"
              type="password"
              placeholder="Nhập mật khẩu"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item label="Xác nhận mật khẩu" prop="confirmPassword">
            <el-input
              v-model="authStore.confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item>
            <button type="submit" class="user-btn" @click.prevent="handleRegister">Đăng ký</button>
            <GoogleLogin class="gg-login-container" popup-type="TOKEN">
              <button type="submit" class="btn-default" @click.prevent="">
                <img alt="Google Icon" class="gg-icon" src="@/assets/img/User/google-icon.svg" />
                <span> Đăng nhập bằng Google </span>
              </button>
            </GoogleLogin>
          </el-form-item>

          <div class="link-to-login">
            Đã có tài khoản
            <router-link
              style="
                text-decoration: underline;
                text-underline-offset: 5px;
                color: #000;
                font-weight: 500;
              "
              to="/login"
              >Đăng nhập
            </router-link>
          </div>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth/authStore'
import type { FormInstance } from 'element-plus'
import { notifySuccess } from '@/composables/notifications'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()

const rules = {
  fullName: [
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự', trigger: 'blur' },
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Vui lòng xác nhận mật khẩu', trigger: 'blur' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự', trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      const result = await authStore.register()

      if (result.success) {
        notifySuccess('Đăng ký thành công. Vui lòng đăng nhập lại')
        router.push({ name: 'user-login' })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.link-to-login {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  width: 400px;
  height: 40px;
}

:deep(.el-alert) {
  margin-bottom: 20px;
  width: 400px;
}

.user-btn,
.btn-default {
  width: 100%;
  margin-top: 20px;
  height: 40px;
}

.gg-register-container {
  width: 100%;
}

.register__image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../../assets/img/User/mealplan.jpg') no-repeat center center;
  background-size: cover;
  background-color: var(--user-theme-color);
  img {
    width: 100%;
    height: 100vh;
    object-fit: contain;
  }
}

.overlay {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 0.5rem;
  border-radius: 10px;
  max-width: 90%;
  backdrop-filter: blur(2px);
}

.register__main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;

  &--form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
  }

  &--logo {
    margin-bottom: 50px;
  }
}

.btn-default {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.gg-login-container {
  width: 100%;
}
</style>

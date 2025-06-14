<template>
  <el-row class="login">
    <!-- <el-col :span="8" class="login__image">
      <img src="@/assets/img/banner-auth.png" alt="login" />
    </el-col> -->
    <el-col :span="24" class="login__main">
      <div class="login__main--form">
        <span class="login__main--logo logo">Hệ thống quản lý GroceryMaster</span>
        <el-form
          ref="formRef"
          :model="authStore"
          :rules="rules"
          label-position="top"
          hide-required-asterisk="true"
          @submit.prevent="handleLogin"
        >
          <el-alert v-if="authStore.error" type="error" :title="authStore.error" show-icon />

          <el-form-item label="Email đăng nhập" prop="email">
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

          <el-form-item>
            <button type="submit" class="admin-btn" @click.prevent="handleLogin">Đăng nhập</button>
            <div class="gg-login-container">
              <button type="submit" class="btn-default">
                <img alt="Google Icon" class="gg-icon" src="@/assets/img/Admin/google-icon.svg" />
                <span> Đăng nhập bằng Google </span>
              </button>
            </div>
          </el-form-item>

          <div class="link-to-register">
            Chưa có tài khoản?
            <router-link
              style="
                text-decoration: underline;
                text-underline-offset: 5px;
                color: #000;
                font-weight: 500;
              "
              to="/register"
              >Đăng ký
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
import { notifyError, notifySuccess } from '@/composables/notifications'
import type { CallbackTypes } from 'vue3-google-login'
import { GoogleLogin } from 'vue3-google-login'
import { ElNotification } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()

const rules = {
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      const result = await authStore.login()

      if (result.success) {
        notifySuccess('Đăng nhập thành công')
        router.push('/admin/home')
      }
    }
  })
}
</script>

<style scoped lang="scss">
.link-to-register {
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

.admin-btn,
.btn-default {
  width: 100%;
  margin-top: 20px;
  height: 40px;
}

.gg-login-container {
  width: 100%;
}

.btn-default {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.login__image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--admin-theme-color);
  img {
    width: 100%;
    height: 100vh;
    object-fit: contain;
  }
}

.login__main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #4880ff;
  background-image: url(/Shape.png);

  &--form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 550px;
    width: 500px;
    border-radius: 20px;
    margin: 0 auto;
    background: #fff;
  }

  &--logo {
    margin-bottom: 50px;
    width: auto !important;
    font-weight: 620;
  }
}
</style>

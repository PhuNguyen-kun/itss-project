<template>
  <el-row :gutter="30" class="header">
    <el-col :span="7" class="header__logo">
      <router-link to="/">GroceryMaster</router-link>
    </el-col>
    <el-col :span="12">
      <el-row :gutter="10" class="nav-links">
        <el-col :span="4">
          <router-link to="/" exact-active-class="active-link">Trang chủ</router-link>
        </el-col>
        <el-col :span="4">
          <router-link to="/dishes" active-class="active-link">Món ăn</router-link>
        </el-col>
        <el-col :span="4">
          <router-link to="/favorites" active-class="active-link">Yêu thích</router-link>
        </el-col>
        <el-col :span="4">
          <router-link to="/meal-plan" active-class="active-link">Kế hoạch</router-link>
        </el-col>
        <el-col :span="4">
          <router-link to="/cart" active-class="active-link">Giỏ hàng</router-link>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="5" class="header__button">
      <template v-if="!authStore.isLoggedIn">
        <el-button class="header__button--register" @click="goToRegister">Đăng ký</el-button>
        <el-button class="header__button--login" @click="goToLogin">Đăng nhập</el-button>
      </template>

      <el-dropdown v-else split-button class="header__button--user">
        <div class="user-info">
          <el-avatar
            :size="34"
            :src="authStore.userInfo.avatar_url"
            :alt="authStore.userInfo.full_name"
            style="margin-left: -8px"
          >
            {{ getUserInitials }}
          </el-avatar>
          <span class="username">{{ authStore.userInfo.full_name }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link to="/profile" active-class="active-link">Tài khoản của tôi</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/family-manager" active-class="active-link">Gia đình</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/fridge" active-class="active-link">Tủ lạnh</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/favorites" active-class="active-link">Món ăn yêu thích</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <span class="logout-item">Đăng xuất</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth/authStore'
import { computed } from 'vue'
const router = useRouter()
const authStore = useAuthStore()

const getUserInitials = computed(() => {
  const fullName = authStore.userInfo.full_name || ''
  return fullName
    .split(' ')
    .map((name: any) => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

const goToLogin = () => {
  router.push({ name: 'user-login' })
}

const goToRegister = () => {
  router.push({ name: 'user-register' })
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'user-login' })
}
</script>

<style scoped lang="scss">
:deep(.el-button) {
  height: 45px;
  border-radius: 30px;
  background-color: #f2e1fd;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-links {
  a {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    padding: 5px 10px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--user-theme-color);
    }

    &.active-link {
      color: var(--user-theme-color);
      font-weight: 600;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--user-theme-color);
      }
    }
  }
}

.header {
  align-items: center;
  width: 100%;
  max-width: 1440px;

  &__logo {
    font-size: 24px;
    font-weight: 560;
    color: #333;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: end;

    &--register {
      border: 1px solid var(--user-theme-color);
      background-color: #fdfaff;
      color: var(--user-theme-color);
      padding: 15px 35px;
      border-radius: 10px;
      height: 40px;
      width: 120px;

      &:hover {
        background-color: var(--user-theme-color);
        color: #fff;
      }
    }

    &--login {
      background-color: var(--user-theme-color);
      color: #fff;
      padding: 15px 35px;
      border-radius: 10px;
      height: 40px;
      width: 120px;

      &:hover {
        background-color: #fdfaff;
        border: 1px solid var(--user-theme-color);
        color: var(--user-theme-color);
      }
    }
  }
}
</style>

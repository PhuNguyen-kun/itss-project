<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="favorites-container">
    <div class="favorites-header">
      <h2 class="favorites-title">Món ăn yêu thích</h2>
      <p class="favorites-subtitle">Danh sách các món ăn bạn đã lưu</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="favorites-loading">
      <div class="spinner"></div>
      <p>Đang tải món ăn yêu thích...</p>
    </div>
    <!-- Error state -->
    <div v-else-if="error" class="favorites-error">
      <el-alert :title="error" type="error" show-icon :closable="false" />
      <button class="user-btn retry-btn" @click="fetchFavoritesByUserId">Thử lại</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="favorites.length === 0" class="favorites-empty">
      <el-empty description="Bạn chưa có món ăn yêu thích nào">
        <router-link to="/dishes">
          <button class="user-btn">Khám phá món ăn</button>
        </router-link>
      </el-empty>
    </div>

    <!-- Content -->
    <div v-else class="favorites-grid">
      <div v-for="favorite in favorites" :key="favorite.id" class="favorite-item">
        <DishCard :dish="favorite.dish" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import DishCard from '@/components/User/DishCard.vue'
import { getFavoritesByUserId } from '@/services/User/favoriteService'
import type { FavoriteResponse } from '@/services/User/favoriteService'
import { useAuthStore } from '@/stores/Auth/authStore'

const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Món ăn yêu thích', to: '/favorites' },
])

// State
const isLoading = ref(true)
const error = ref('')
const favorites = ref<FavoriteResponse[]>([])
const authStore = useAuthStore()

// Fetch favorites on component mount
onMounted(() => {
  fetchFavoritesByUserId()
})

const fetchFavoritesByUserId = async () => {
  try {
    isLoading.value = true
    error.value = ''

    // Get the current user ID from auth store
    const userId = authStore.userInfo.id
    if (!userId) {
      throw new Error('User not logged in')
    }

    const response = await getFavoritesByUserId(userId)

    if (response && response.data) {
      favorites.value = response.data
    } else {
      throw new Error('Failed to fetch favorite dishes')
    }
  } catch (err: any) {
    console.error('Failed to fetch favorite dishes:', err)
    if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.'
    } else {
      error.value = 'Không thể tải món ăn yêu thích. Vui lòng thử lại sau.'
    }
    ElMessage.error(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.favorites-container {
  font-family: 'Segoe UI', sans-serif;
}

.favorites-header {
  margin-bottom: 30px;
}

.favorites-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
}

.favorites-subtitle {
  font-size: 16px;
  color: #666;
  margin-top: 1px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.favorites-loading,
.favorites-error,
.favorites-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--user-theme-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.user-btn {
  padding: 10px 20px;
  background-color: var(--user-theme-color);
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}

.retry-btn {
  margin-top: 20px;
}
</style>

<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="dishes-container">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      "
    >
      <h1 class="dishes__title">Danh sách món ăn</h1>
      <button class="user-btn" @click="showCreateModal = true">Tạo món ăn mới</button>
    </div>
    <div class="dishes__list">
      <el-row :gutter="20" v-loading="loading">
        <el-col
          v-for="dish in dishes"
          :key="dish.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="dish-col"
        >
          <DishCard :dish="dish" />
        </el-col>
      </el-row>
    </div>
  </div>

  <!-- Create Dish Modal -->
  <CreateDishModal v-model:visible="showCreateModal" @dish-created="handleDishCreated" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import DishCard from '@/components/User/DishCard.vue'
import CreateDishModal from '@/components/User/CreateDishModal.vue'
import { getAllDishes } from '@/services/User/dishService'
import type { Dish } from '@/types/User/dish'
import { messageError, messageSuccess } from '@/composables/notifications'

const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Món ăn', to: '/dishes' },
])

const dishes = ref<Dish[]>([])
const loading = ref(false)
const showCreateModal = ref(false)

const fetchDishes = async () => {
  loading.value = true
  try {
    const response = await getAllDishes()
    if (response.success && response.data) {
      dishes.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch featured dishes:', error)
    messageError('Không thể tải món ăn nổi bật. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

const handleDishCreated = (newDish: Dish) => {
  // Add the new dish to the top of the list
  dishes.value.unshift(newDish)
  messageSuccess('Món ăn mới đã được thêm thành công!')
}

onMounted(() => {
  fetchDishes()
})
</script>

<style scoped lang="scss">
.dishes {
  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }

  &__list {
    padding: 20px;
  }
}

.dish-col {
  margin-bottom: 20px;
}
</style>

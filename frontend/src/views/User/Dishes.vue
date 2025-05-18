<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="dishes-container">
    <h1 class="dishes__title">Danh sách món ăn</h1>

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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import DishCard from '@/components/User/DishCard.vue'
import { getAllDishes } from '@/services/Dish/dishService'
import type { Dish } from '@/types/Dish/dish'
import { messageError } from '@/composables/notifications'

const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Món ăn', to: '/dishes' },
])

const dishes = ref<Dish[]>([])
const loading = ref(false)

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
    text-align: center;
  }

  &__list {
    padding: 20px;
  }
}

.dish-col {
  margin-bottom: 20px;
}
</style>

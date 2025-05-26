<template>
  <div class="homepage">
    <div class="homepage__carousel">
      <el-carousel height="400px" motion-blur>
        <el-carousel-item v-for="(image, index) in carouselImages" :key="index">
          <img :src="image" alt="Carousel Image" class="carousel-image" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="homepage__content">
      <div class="homepage__intro">
        <h1 class="homepage__intro--title">
          Khám phá các món ăn ngon và công thức để làm ra chúng!
        </h1>
        <p>Với hơn 100 món ăn và hàng trăm nguyên liệu khác nhau dành cho bạn.</p>
      </div>
      <div class="homepage__section">
        <div class="homepage__section--header">
          <h2 class="homepage__section--title">Tất cả món ăn</h2>
          <router-link to="/dishes"><button class="user-btn">Xem tất cả</button></router-link>
        </div class="homepage__section--header">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import DishCard from '@/components/User/DishCard.vue'
import { getAllDishes } from '@/services/User/dishService'
import type { Dish } from '@/types/User/dish'

const carouselImages = [
  '/carousel-1.webp',
  '/carousel-2.jpg',
  '/carousel-3.jpg',
  '/carousel-4.jpg',
  '/carousel-5.jpg',
]

const dishes = ref<Dish[]>([])
const loading = ref(false)

const fetchDishes = async () => {
  loading.value = true
  try {
    const response = await getAllDishes({ per_page: 8, page: 1 })
    if (response.success && response.data) {
      dishes.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch featured dishes:', error)
    ElMessage.error('Không thể tải tất cả món ăn. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDishes()
})
</script>

<style scoped lang="scss">
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.homepage {
  &__intro {
    text-align: center;
    margin-top: 30px;

    &--title {
      font-size: 25px;
      font-weight: 650;
      margin-bottom: 15px;
    }
  }

  &__section {
    margin-top: 50px;
    margin-bottom: 50px;

    &--header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    &--title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }
  }
}

.dish-col {
  margin-bottom: 20px;
}
</style>

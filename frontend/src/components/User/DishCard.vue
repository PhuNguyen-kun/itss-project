<template>
  <router-link :to="`/dishes/${dish.slug}`" class="dish-card-link">
    <el-card class="dish-card" :body-style="{ padding: '0px' }">
      <div class="dish-card__image-container">
        <img
          :src="dish.image_url || '/default-dish.jpg'"
          :alt="dish.name"
          class="dish-card__image"
        />
      </div>
      <div class="dish-card__content">
        <h3 class="dish-card__title">{{ dish.name }}</h3>
        <p class="dish-card__description">{{ truncatedDescription }}</p>
      </div>
    </el-card>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Dish } from '@/types/Dish/dish'

const props = defineProps<{
  dish: Dish
}>()

const truncatedDescription = computed(() => {
  if (props.dish.description && props.dish.description.length > 100) {
    return props.dish.description.substring(0, 100) + '...'
  }
  return props.dish.description
})
</script>

<style scoped lang="scss">
.dish-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.dish-card {
  height: 100%;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  &__image-container {
    height: 180px;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__content {
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  &__description {
    font-size: 14px;
    color: #666;
    margin: 0;
    flex-grow: 1;
  }
}
</style>

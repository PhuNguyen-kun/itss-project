<template>
  <div class="dish-card-wrapper">
    <!-- Split the card into two parts: main clickable area and actions area -->
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
          <div
            style="display: flex; justify-content: space-between; align-items: center; gap: 10px"
          >
            <p class="dish-card__description">{{ truncatedDescription }}</p>
          </div>
        </div>
      </el-card>
    </router-link>

    <!-- Separate non-clickable actions area outside the router-link -->
    <div class="dish-card__action" @click.stop>
      <button class="add-to-plan-button" @click.stop="showAddToMealPlanModal">
        <el-icon><Calendar /></el-icon>
      </button>

      <button
        class="add-to-favorites-button"
        :class="{ 'is-favorite': isFavorite }"
        @click.stop="toggleFavorite"
      >
        <el-icon><StarFilled /></el-icon>
      </button>
    </div>

    <!-- Modal for adding to meal plan -->
    <el-dialog
      v-model="showMealPlanModal"
      title="Thêm món ăn vào kế hoạch bữa ăn"
      width="400px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="add-meal-plan-form">
        <el-form :model="newMealPlan" label-width="100px">
          <el-form-item label="Ngày:">
            <el-date-picker
              v-model="newMealPlan.date"
              type="date"
              placeholder="Chọn ngày"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              :disabled-date="disabledDate"
            />
          </el-form-item>
          <el-form-item label="Bữa ăn:">
            <el-select
              v-model="newMealPlan.meal_type"
              placeholder="Chọn bữa ăn"
              style="width: 100%"
            >
              <el-option :value="1" label="Bữa sáng" />
              <el-option :value="2" label="Bữa trưa" />
              <el-option :value="3" label="Bữa tối" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="showMealPlanModal = false">Hủy</el-button>
          <el-button type="primary" @click="confirmAddToMealPlan" :loading="addingToMealPlan">
            Xác nhận
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Dish } from '@/types/User/dish'
import { addMealPlan } from '@/services/User/mealPlanService'
import { getMyFamily } from '@/services/User/familyService'
import {
  addToFavorites,
  removeFromFavorites,
  checkIsFavorite,
  getFavoritesByUserId,
} from '@/services/User/favoriteService'
import { useAuthStore } from '@/stores/Auth/authStore'
import { messageSuccess } from '@/composables/notifications'

const props = defineProps<{
  dish: Dish
}>()

const emit = defineEmits<{
  (e: 'favoriteRemoved', dishId: number): void
}>()

// For meal plan related variables
const showMealPlanModal = ref(false)
const addingToMealPlan = ref(false)
const familyId = ref<number | null>(null)
const isFavorite = ref(false)
const isTogglingFavorite = ref(false)
const authStore = useAuthStore()

// New meal plan form data
const newMealPlan = ref({
  family_id: 0,
  dish_id: 0,
  date: '',
  meal_type: 1, // Default to breakfast
})

// Only allow selecting future dates
const disabledDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

// Truncate description for display
const truncatedDescription = computed(() => {
  if (props.dish.description && props.dish.description.length > 100) {
    return props.dish.description.substring(0, 100) + '...'
  }
  return props.dish.description
})

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Show the meal plan modal
const showAddToMealPlanModal = () => {
  // Initialize with dish data
  newMealPlan.value = {
    family_id: familyId.value || 0,
    dish_id: props.dish.id,
    date: '',
    meal_type: 1,
  }

  // Get family ID if not already fetched
  if (!familyId.value) {
    fetchFamilyId()
  }

  showMealPlanModal.value = true
}

// Fetch family ID from API
const fetchFamilyId = async () => {
  try {
    const response = await getMyFamily()
    if (response.data) {
      familyId.value = response.data.id
      newMealPlan.value.family_id = response.data.id
    }
  } catch (error) {
    console.error('Failed to fetch family data:', error)
    ElMessage.error('Không thể tải thông tin gia đình. Vui lòng thử lại sau.')
  }
}

// Confirm and add to meal plan
const confirmAddToMealPlan = async () => {
  // Validation
  if (!newMealPlan.value.date || !newMealPlan.value.dish_id || !familyId.value) {
    ElMessage.warning('Vui lòng chọn ngày và bữa ăn.')
    return
  }

  addingToMealPlan.value = true
  try {
    const response = await addMealPlan({
      family_id: familyId.value,
      dish_id: newMealPlan.value.dish_id,
      date: newMealPlan.value.date,
      meal_type: newMealPlan.value.meal_type,
    })

    // Check for successful response
    if (response && response.id) {
      messageSuccess('Đã thêm món ăn vào kế hoạch bữa ăn thành công!')
      showMealPlanModal.value = false

      // Reset form
      newMealPlan.value = {
        family_id: familyId.value,
        dish_id: props.dish.id,
        date: '',
        meal_type: 1,
      }
    } else {
      ElMessage.error('Không thể thêm vào kế hoạch bữa ăn. Vui lòng thử lại.')
    }
  } catch (error: any) {
    console.error('Error adding to meal plan:', error)
    if (error.response?.status === 401) {
      ElMessage.error('Vui lòng đăng nhập để thêm vào kế hoạch bữa ăn.')
    } else {
      ElMessage.error(
        error.response?.data?.message || 'Không thể thêm vào kế hoạch bữa ăn. Vui lòng thử lại.',
      )
    }
  } finally {
    addingToMealPlan.value = false
  }
}

const userId = computed(() => authStore.userInfo.id)

// Check if dish is in favorites when component mounts
onMounted(async () => {
  // Only check favorites status if we have a dish id
  if (props.dish.id) {
    try {
      const response = await checkIsFavorite(props.dish.id)
      isFavorite.value = response.isFavorite
    } catch (error) {
      console.error('Error checking favorite status:', error)
      // Silently fail - we'll just show the default unfavorited state
    }
  }
})

// Toggle favorite status
const toggleFavorite = async () => {
  // Prevent multiple clicks
  if (isTogglingFavorite.value) return

  isTogglingFavorite.value = true
  try {
    if (isFavorite.value) {
      // Remove from favorites
      await removeFromFavorites(props.dish.id)
      isFavorite.value = false
      messageSuccess('Đã xóa khỏi món ăn yêu thích')
      // Emit event to notify parent component
      emit('favoriteRemoved', props.dish.id)
    } else {
      // Add to favorites
      await addToFavorites(props.dish.id)
      isFavorite.value = true
      messageSuccess('Đã thêm vào món ăn yêu thích')
    }
  } catch (error: any) {
    console.error('Error toggling favorite status:', error)
    if (error.response?.status === 401) {
      ElMessage.error('Vui lòng đăng nhập để thêm món ăn yêu thích')
    } else {
      ElMessage.error(
        error.response?.data?.message ||
          'Không thể cập nhật trạng thái yêu thích. Vui lòng thử lại.',
      )
    }
  } finally {
    isTogglingFavorite.value = false
  }
}
</script>

<style scoped lang="scss">
.dish-card-wrapper {
  position: relative;
  height: 100%;
}

.dish-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.dish-card-wrapper {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

    .dish-card__image {
      transform: scale(1.05);
    }
  }
}

.dish-card {
  position: relative;
  height: 100%;
  // transition:
  //   transform 0.3s ease,
  //   box-shadow 0.3s ease;
  // display: flex;
  // flex-direction: column;

  // &:hover {
  //   transform: translateY(-5px);
  //   box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  // }

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
    min-height: 90px;
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
    // flex-grow: 1;
    width: 82%;
  }

  &__action {
    position: absolute;
    right: 12px;
    bottom: 12px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .add-to-plan-button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: var(--user-theme-color);
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition:
        transform 0.3s ease,
        background-color 0.3s ease;

      &:hover {
        transform: scale(1.1);
        opacity: 0.9;
      }
    }

    .add-to-favorites-button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #f5f5f5;
      color: #ff9800;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition:
        transform 0.3s ease,
        background-color 0.3s ease;

      &:hover {
        transform: scale(1.1);
        background-color: #ffe0b2;
      }

      &.is-favorite {
        background-color: #ff9800;
        color: white;

        &:hover {
          background-color: #f57c00;
        }
      }
    }
  }
}

:deep(.el-input) {
  width: 50px;
}

:deep(.el-input__wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
}

:deep(.el-input__icon) {
  margin-left: 8px !important;
}

:deep(.el-overlay) {
  position: fixed; /* Ensure the overlay is fixed */
}

/* Target the specific date picker dropdown */
:deep(.dish-date-picker) {
  z-index: 3000 !important; /* Higher z-index to prevent conflicts */
}

// Meal type selection styles
.meal-type-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meal-type-option {
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
    border-color: #dcdfe6;
  }

  &.selected {
    background-color: #ecf5ff;
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
    font-weight: 500;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.add-meal-plan-form {
  padding: 10px;
}
</style>

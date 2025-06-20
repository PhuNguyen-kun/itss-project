<template>
  <div class="dish-detail-container">
    <BreadCrumb :items="breadcrumbItems" />

    <div class="dish-header">
      <h1 class="dish-title">{{ dish?.name || 'Loading dish...' }}</h1>
    </div>

    <div class="dish-content">
      <div class="dish-main-info">
        <div class="dish-image-container">
          <img :src="dish?.image_url || '/default-dish.jpg'" :alt="dish?.name" class="dish-image" />
        </div>

        <div class="dish-description">
          <h3>Mô tả</h3>
          <p>{{ dish?.description }}</p>
        </div>

        <div class="dish-instructions">
          <h3>Hướng dẫn nấu ăn</h3>
          <p v-if="dish?.instructions">{{ dish.instructions }}</p>
          <p v-else>Không có hướng dẫn nấu ăn cho món này.</p>
        </div>
      </div>

      <div class="dish-ingredients">
        <h2>Thành phần</h2>

        <div class="ingredients-grid">
          <div v-for="item in dish?.dish_ingredients" :key="item.id" class="ingredient-card">
            <div class="ingredient-image-container">
              <img
                :src="item.ingredient?.image_url"
                :alt="item.ingredient?.name"
                class="ingredient-image"
              />
            </div>
            <div class="ingredient-name">{{ item.ingredient?.name }}</div>
            <div class="ingredient-details">
              <div>Số lượng: {{ formatQuantity(item.quantity, item.unit) }}</div>
              <div>Giá: {{ formatPrice(item.price) }}</div>
            </div>
          </div>
        </div>

        <div class="total-section">
          <div class="total-row">
            <span>Tổng số nguyên liệu:</span>
            <span>{{ dish?.dish_ingredients?.length || 0 }}</span>
          </div>
          <div class="total-row">
            <span>Tổng chi phí ước tính:</span>
            <span>{{ formatPrice(calculateTotalPrice()) }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="showAddToMealPlanModal" class="user-btn">Thêm vào kế hoạch bữa ăn</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add to Meal Plan Modal -->
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
          <el-select v-model="newMealPlan.meal_type" placeholder="Chọn bữa ăn" style="width: 100%">
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDishBySlug } from '@/services/User/dishService'
import type { Dish } from '@/types/User/dish'
import { addMealPlan } from '@/services/User/mealPlanService'
import { getMyFamily } from '@/services/User/familyService'
import { messageError, messageSuccess } from '@/composables/notifications'
import { ElMessage } from 'element-plus'
import BreadCrumb from '@/components/User/BreadCrumb.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const dish = ref<Dish | null>(null)
const familyId = ref<number | null>(null)

const showMealPlanModal = ref(false)
const addingToMealPlan = ref(false)
const newMealPlan = ref({
  family_id: 0,
  dish_id: 0,
  date: '',
  meal_type: 1, // Default to breakfast
})

const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Món ăn', to: '/dishes' },
  { text: dish.value?.name || 'Chi tiết món ăn', to: route.fullPath },
])

const fetchDishDetails = async () => {
  loading.value = true
  try {
    const slug = route.params.slug
    if (!slug || typeof slug !== 'string') {
      throw new Error('Invalid dish slug')
    }

    const response = await getDishBySlug(slug)

    if (response.success && response.data) {
      dish.value = response.data
    } else {
      throw new Error('Failed to fetch dish details')
    }
  } catch (error) {
    console.error('Error fetching dish details:', error)
    messageError('Không thể tải thông tin món ăn. Vui lòng thử lại sau.')
    setTimeout(() => router.push('/'), 2000)
  } finally {
    loading.value = false
  }
}

const calculateTotalPrice = () => {
  if (!dish.value?.dish_ingredients) {
    return 0
  }

  return dish.value.dish_ingredients.reduce((total, item) => {
    return total + (item.price || 0)
  }, 0)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatQuantity = (quantity: number, unitCode: number) => {
  const unitMap: Record<number, string> = {
    1: 'g', // gram
    2: 'ml', // milliliter
    3: 'cái', // piece
    4: 'lát', // slice
    5: 'thìa cà phê', // teaspoon
  }

  const unitText = unitMap[unitCode] || ''
  return `${quantity} ${unitText}`
}

const disabledDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

const showAddToMealPlanModal = () => {
  if (!dish.value) {
    messageError('Không thể thêm món ăn. Vui lòng tải lại trang.')
    return
  }

  newMealPlan.value = {
    family_id: familyId.value || 0,
    dish_id: dish.value.id,
    date: '',
    meal_type: 1,
  }

  if (!familyId.value) {
    fetchFamilyId()
  }

  showMealPlanModal.value = true
}

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

const confirmAddToMealPlan = async () => {
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

    if (response && response.id) {
      messageSuccess('Đã thêm món ăn vào kế hoạch bữa ăn thành công!')
      showMealPlanModal.value = false

      newMealPlan.value = {
        family_id: familyId.value,
        dish_id: dish.value?.id || 0,
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

const addToShoppingList = () => {
  messageSuccess('Đã thêm nguyên liệu vào giỏ hàng!')
}

onMounted(() => {
  fetchDishDetails()
})
</script>

<style scoped lang="scss">
.dish-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 15px;
}

.dish-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.dish-content {
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.dish-main-info {
  flex: 1;
}

.dish-image-container {
  width: 100%;
  height: 350px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dish-description,
.dish-instructions {
  margin-bottom: 30px;

  h3 {
    font-size: 20px;
    margin-bottom: 12px;
    font-weight: 600;
    color: #333;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 8px;
  }

  p {
    font-size: 16px;
    line-height: 1.6;
    color: #444;
    white-space: pre-wrap;
  }
}

.dish-ingredients {
  width: 550px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: 100%;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 10px;
  }
}

.ingredients-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.ingredient-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
  }
}

.ingredient-image-container {
  height: 100px;
  overflow: hidden;
}

.ingredient-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ingredient-name {
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.ingredient-details {
  padding: 10px;
  font-size: 14px;
  color: #666;

  div {
    margin-bottom: 5px;
  }
}

.total-section {
  margin: 25px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #eaeaea;

  &:last-child {
    border-bottom: none;
    font-weight: 700;
    font-size: 18px;
    margin-top: 5px;
    color: #333;
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .el-button {
    width: 100%;
  }
}

.add-meal-plan-form {
  padding: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;

  .el-button {
    width: auto;
  }
}
</style>

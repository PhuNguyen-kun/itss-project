<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="meal-plan">
    <div class="meal-plan__header">
      <h2 class="meal-plan__title">Kế hoạch bữa ăn</h2>
      <div class="meal-plan__filters">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="đến"
          start-placeholder="Ngày bắt đầu"
          end-placeholder="Ngày kết thúc"
          format="DD/MM/YYYY"
          value-format="YYYY-MM-DD"
          @change="handleDateChange"
          size="large"
        />
        <button class="user-btn" @click="showAddMealPlan = true">
          <i class="el-icon-plus"></i>
          Thêm kế hoạch bữa ăn
        </button>
      </div>
    </div>

    <!-- Error state -->
    <!-- <div v-else-if="error" class="meal-plan__error">
      <el-alert :title="error" type="error" show-icon :closable="false" />
      <button class="user-btn retry-btn" @click="fetchMealPlans">Thử lại</button>
    </div> -->

    <!-- Empty state -->
    <div v-if="!hasPlans" class="meal-plan__empty">
      <el-empty description="Không có kế hoạch bữa ăn nào trong khoảng thời gian này">
        <button class="user-btn" @click="showAddMealPlan = true">Thêm kế hoạch bữa ăn ngay</button>
      </el-empty>
    </div>

    <!-- Content -->
    <div v-else class="meal-plan__content">
      <div v-for="(meals, date) in groupedMealPlans" :key="date" class="meal-plan__day">
        <div
          style="
            display: flex;
            gap: 20px;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid var(--user-theme-color);
          "
        >
          <h3 class="meal-plan__date">{{ formatDate(date) }}</h3>
          <button
            class="user-btn"
            style="margin-bottom: 15px"
            @click="showAssignModal(getMealPlansByDate(date))"
          >
            <i class="el-icon-s-custom"></i>
            Phân công người đi chợ
          </button>
        </div>
        <div class="meal-plan__meals">
          <div v-for="mealType in [1, 2, 3]" :key="mealType" class="meal-plan__meal-slot">
            <h4 class="meal-plan__meal-type">{{ formatMealType(mealType) }}</h4>

            <template v-if="getMealsByType(meals, mealType).length > 0">
              <!-- Display all dishes for this meal type -->
              <div
                v-for="mealPlan in getMealsByType(meals, mealType)"
                :key="mealPlan.id"
                class="meal-card"
              >
                <div class="meal-card__wrapper">
                  <div class="meal-card__image">
                    <img
                      :src="mealPlan.dish.image_url || '/default-dish.jpg'"
                      :alt="mealPlan.dish.name"
                    />
                  </div>
                  <div class="meal-card__content">
                    <h5 class="meal-card__name">{{ mealPlan.dish.name }}</h5>
                    <p class="meal-card__description">
                      {{ mealPlan.dish.description }}
                    </p>
                    <div class="meal-card__actions">
                      <router-link :to="`/dishes/${mealPlan.dish.slug}`">
                        <button class="meal-card__view-btn">Xem chi tiết</button>
                      </router-link>
                      <button class="meal-card__delete-btn" @click="deleteMealPlan(mealPlan.id)">
                        <el-icon><Delete /></el-icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Add more button for this meal type -->
              <div class="add-more-meal" @click="showAddMealPlanModal(date, mealType)">
                <i class="el-icon-plus"></i>
                <span>Thêm món ăn khác</span>
              </div>
            </template>
            <div v-else class="empty-meal-slot" @click="showAddMealPlanModal(date, mealType)">
              <i class="el-icon-plus"></i>
              <span>Thêm món ăn</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Family Member Selection Modal -->
  <el-dialog
    v-model="showFamilyMemberModal"
    title="Chọn thành viên đi chợ"
    width="500px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="family-member-selection">
      <div class="selected-meals-info">
        <p class="modal-description">
          Phân công người đi mua <strong>{{ selectedMealPlans.length }}</strong> món từ ngày
          <strong>{{
            selectedMealPlans.length ? formatSimpleDate(selectedMealPlans[0].date) : ''
          }}</strong>
        </p>
        <p class="modal-subtitle">Chọn một hoặc nhiều thành viên để phân công</p>
      </div>
      <div class="family-members-list">
        <div v-for="member in familyMembers" :key="member.id" class="family-member-item">
          <div class="member-avatar">
            <img :src="member.avatar_url || '/default-avatar.png'" :alt="member.full_name" />
          </div>
          <div class="member-info">{{ member.full_name }}</div>
          <el-checkbox v-model="selectedMemberIds" :label="member.id" class="no-label" />
        </div>
      </div>
      <div class="dialog-footer">
        <el-button @click="showFamilyMemberModal = false">Hủy bỏ</el-button>
        <el-button type="primary" @click="confirmAssignment" :loading="assigning">
          Xác nhận
        </el-button>
      </div>
    </div>
  </el-dialog>

  <!-- Add Meal Plan Modal -->
  <el-dialog
    v-model="showAddMealPlan"
    title="Thêm kế hoạch bữa ăn"
    width="500px"
    :close-on-click-modal="false"
  >
    <div class="add-meal-plan">
      <el-form :model="newMealPlan" label-width="120px">
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
        <el-form-item label="Món ăn:">
          <el-select
            v-model="newMealPlan.dish_id"
            placeholder="Tìm kiếm tên món ăn"
            filterable
            remote
            :remote-method="searchDishes"
            :loading="searchLoading"
            style="width: 100%"
          >
            <el-option
              v-for="dish in dishOptions"
              :key="dish.id"
              :label="dish.name"
              :value="dish.id"
            >
              <div style="display: flex; align-items: center">
                <img
                  :src="dish.image_url || '/default-dish.jpg'"
                  style="width: 30px; height: 30px; margin-right: 10px; border-radius: 3px"
                />
                <span>{{ dish.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="showAddMealPlan = false">Hủy</el-button>
        <el-button type="primary" @click="addMealPlan" :loading="addingMealPlan"> Thêm </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import {
  getMealPlansByFamilyId,
  addMealPlan as createMealPlan,
  formatMealType,
  deleteMealPlanById,
} from '@/services/User/mealPlanService'
import type { MealPlan } from '@/services/User/mealPlanService'
import { getMyFamily } from '@/services/User/familyService'
import type { FamilyMember } from '@/services/User/familyService'
import { getAllDishes } from '@/services/User/dishService'
import type { Dish } from '@/types/User/dish'
import { assignIngredientsToFamilyMembers } from '@/services/User/cartService'
import { useRouter } from 'vue-router'

const router = useRouter()
const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Kế hoạch bữa ăn', to: '/meal-plan' },
])

// State management
const isLoading = ref(true)
const error = ref('')
const familyId = ref<number | null>(null)
const mealPlans = ref<MealPlan[]>([])
const dateRange = ref<string[]>([])
const startDate = ref('')
const endDate = ref('')
// New variables for family member assignment
const showFamilyMemberModal = ref(false)
const selectedMealPlans = ref<MealPlan[]>([])
const familyMembers = ref<FamilyMember[]>([])
const selectedMemberIds = ref<number[]>([])
const assigning = ref(false)
const showAddMealPlan = ref(false)
const addingMealPlan = ref(false)
const searchLoading = ref(false)
const dishOptions = ref<Dish[]>([])

// Computed for checking if there are meal plans
const hasPlans = computed(() => mealPlans.value.length > 0)

// New meal plan form data
const newMealPlan = ref({
  family_id: 0,
  dish_id: '',
  date: '',
  meal_type: 1,
})

// const currentMonthYear = computed(() => {
//   const now = new Date()
//   return `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`
// })

// Group meal plans by date for display
const groupedMealPlans = computed(() => {
  const grouped: Record<string, MealPlan[]> = {}

  mealPlans.value.forEach((plan) => {
    const dateKey = plan.date.split('T')[0]
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(plan)
  })

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime()
  })

  const result: Record<string, MealPlan[]> = {}
  sortedDates.forEach((date) => {
    result[date] = grouped[date]
  })

  return result
})

const getMealsByType = (meals: MealPlan[], mealType: number): MealPlan[] => {
  return meals.filter((meal) => meal.meal_type === mealType)
}

const getMealByType = (meals: MealPlan[], mealType: number): MealPlan | undefined => {
  return meals.find((meal) => meal.meal_type === mealType)
}

const disabledDate = (date: Date) => {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

const handleDateChange = (val: string[]) => {
  if (val) {
    startDate.value = val[0]
    endDate.value = val[1]
    fetchMealPlans()
  } else {
    startDate.value = ''
    endDate.value = ''
    fetchMealPlans()
  }
}

const searchDishes = async (query: string) => {
  if (query.length < 1) return

  searchLoading.value = true
  try {
    const response = await getAllDishes({
    })
    if (response.success && response.data) {
      dishOptions.value = response.data.filter((dish) =>
        dish.name.toLowerCase().includes(query.toLowerCase()),
      )
    }
  } catch (error) {
    console.error('Error searching dishes:', error)
    ElMessage.error('Không thể tìm kiếm món ăn. Vui lòng thử lại.')
  } finally {
    searchLoading.value = false
  }
}

const showAddMealPlanModal = (date: string, mealType: number) => {
  newMealPlan.value = {
    family_id: familyId.value || 0,
    dish_id: '',
    date: date,
    meal_type: mealType,
  }
  showAddMealPlan.value = true
}

const addMealPlan = async () => {
  if (!newMealPlan.value.date || !newMealPlan.value.dish_id || !newMealPlan.value.meal_type) {
    ElMessage.warning('Vui lòng điền đầy đủ thông tin.')
    return
  }

  addingMealPlan.value = true
  try {
    const response = await createMealPlan({
      family_id: familyId.value || 0,
      dish_id: Number(newMealPlan.value.dish_id),
      date: newMealPlan.value.date,
      meal_type: newMealPlan.value.meal_type,
    })

    if (response && response.id) {
      ElMessage.success('Thêm kế hoạch bữa ăn thành công!')
      showAddMealPlan.value = false
      fetchMealPlans()

      // Reset form
      newMealPlan.value = {
        family_id: familyId.value || 0,
        dish_id: '',
        date: '',
        meal_type: 1,
      }
    } else {
      ElMessage.error('Không thể thêm vào kế hoạch bữa ăn. Vui lòng thử lại.')
    }
  } catch (error: any) {
    console.error('Error adding meal plan:', error)
    ElMessage.error(
      error.response?.data?.message || 'Không thể thêm kế hoạch bữa ăn. Vui lòng thử lại.',
    )
  } finally {
    addingMealPlan.value = false
  }
}

const deleteMealPlan = async (id: number) => {
  ElMessageBox.confirm(
    'Bạn có chắc chắn muốn xóa món ăn này khỏi kế hoạch bữa ăn không?',
    'Xác nhận xóa',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        const response = await deleteMealPlanById(id)

        if (response) {
          ElMessage.success('Xóa kế hoạch bữa ăn thành công!')
          fetchMealPlans()
        } else {
          ElMessage.error('Không thể xóa kế hoạch bữa ăn. Vui lòng thử lại.')
        }
      } catch (error: any) {
        console.error('Error deleting meal plan:', error)
        ElMessage.error(
          error.response?.data?.message || 'Không thể xóa kế hoạch bữa ăn. Vui lòng thử lại.',
        )
      }
    })
    .catch(() => {})
}

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

const fetchFamilyData = async () => {
  try {
    const response = await getMyFamily()
    if (response.data) {
      familyId.value = response.data.id
      await fetchMealPlans()
    }
  } catch (err: any) {
    console.error('Failed to fetch family data:', err)
    if (err.response?.status === 401) {
      ElMessage.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.')
      router.push('/login')
    } else {
      error.value = 'Unable to load family information. Please try again later.'
      ElMessage.error(error.value)
    }
  } finally {
    isLoading.value = false
  }
}

const fetchMealPlans = async () => {
  if (!familyId.value) return

  try {
    isLoading.value = true
    error.value = ''

    const params: { startDate?: string; endDate?: string } = {}
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value

    const response = await getMealPlansByFamilyId(familyId.value, params)
    mealPlans.value = response.data
  } catch (err: any) {
    console.error('Failed to fetch meal plans:', err)
    error.value =
      err.response?.data?.message || 'Unable to load meal plans. Please try again later.'
    ElMessage.error(error.value)
  } finally {
    isLoading.value = false
  }
}

const getMealPlansByDate = (date: string): MealPlan[] => {
  return mealPlans.value.filter((plan) => plan.date.split('T')[0] === date)
}

const formatSimpleDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

const showAssignModal = async (datesMealPlans: MealPlan[]) => {
  if (!datesMealPlans.length) {
    ElMessage.error('Không có kế hoạch bữa ăn nào để phân công.')
    return
  }

  selectedMealPlans.value = datesMealPlans

  try {
    if (!familyId.value) {
      ElMessage.error('Vui lòng đăng nhập để thực hiện chức năng này.')
      return
    } 
    const response = await getMyFamily()
    if (response.data && response.data.users) {
      familyMembers.value = response.data.users
      selectedMemberIds.value = []
      showFamilyMemberModal.value = true
    } else {
      ElMessage.error('Không thể tải thông tin gia đình. Vui lòng thử lại sau.')
    }
  } catch (error) {
    console.error('Failed to fetch family members:', error)
    ElMessage.error('Không thể tải thông tin gia đình. Vui lòng thử lại sau.')
  }
}

const confirmAssignment = async () => {
  if (selectedMemberIds.value.length === 0 || !familyId.value) {
    ElMessage.warning('Vui lòng chọn ít nhất một thành viên gia đình.')
    return
  }

  const mealPlanIds = selectedMealPlans.value.map((plan) => plan.id)

  assigning.value = true
  try {
    const response = await assignIngredientsToFamilyMembers({
      familyId: familyId.value,
      mealPlanIds: mealPlanIds,
      memberIds: selectedMemberIds.value,
    })

    if (response.success) {
      ElMessage.success('Phân công thành công! Bạn có thể xem chi tiết trong giỏ hàng.')
      showFamilyMemberModal.value = false

      router.push('/cart')
    } else {
      throw new Error('Assignment failed')
    }
  } catch (error: any) {
    console.error('Error assigning ingredients:', error)
    ElMessage.error(
      error.response?.data?.message || 'Không thể phân công người đi chợ. Vui lòng thử lại.',
    )
  } finally {
    assigning.value = false
  }
}

onMounted(() => {
  fetchFamilyData()
  fetchMealPlans()
})
</script>

<style scoped lang="scss">
.meal-plan {
  font-family: 'Segoe UI', sans-serif;
}

.meal-plan__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.meal-plan__title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.meal-plan__filters {
  display: flex;
  gap: 15px;
  align-items: center;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 14px;
    color: #555;
  }

  input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}

.meal-plan__actions {
  margin-bottom: 20px;
  text-align: right;
}

.user-btn {
  padding: 8px 16px;
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

.meal-plan__day {
  margin-bottom: 30px;
}

.meal-plan__date {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  text-transform: capitalize;
}

.meal-plan__meals {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between; /* Ensure proper spacing */
}

.meal-card {
  flex: 1;
  min-width: 420px;
  max-width: calc(33.333% - 20px);
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: column; /* Ensure proper stacking on smaller screens */

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.meal-card__image {
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.meal-card__content {
  flex: 1;
  padding: 15px;
}

.meal-card__name {
  font-size: 18px;
  margin: 0 0 5px;
  color: #333;
}

.meal-card__type {
  color: var(--user-theme-color);
  font-weight: 500;
  margin: 0 0 8px;
  font-size: 14px;
}

.meal-card__description {
  font-size: 13px;
  color: #666;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2; /* Added for compatibility */
  box-orient: vertical; /* Added for compatibility */
}

.meal-plan__meal-slot {
  flex: 1;
  min-width: 280px;
  max-width: calc(33.333% - 20px);

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.meal-plan__meal-type {
  font-size: 16px;
  color: #555;
  background-color: #f8f8f8;
  padding: 8px 15px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 15px;
}

.meal-card__wrapper {
  display: flex;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
}

.meal-card__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.meal-card__view-btn {
  color: black;
  border: none;
  border-radius: 15px;
  padding: 5px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    background-color: #e0e0e0;
  }
}

.meal-card__delete-btn {
  // background-color: #ff4d4f;
  color: black;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff7875;
    color: white;
  }

  i {
    font-size: 16px;
  }
}

.empty-meal-slot {
  border: 2px dashed #ddd;
  border-radius: 10px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background-color 0.3s,
    border-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
    border-color: var(--user-theme-color);
  }

  i {
    font-size: 24px;
    color: #aaa;
    margin-bottom: 8px;
  }

  span {
    color: #888;
    font-size: 14px;
  }
}

.add-more-meal {
  margin-top: 15px;
  padding: 10px;
  border: 1px dashed #ddd;
  border-radius: 8px;
  width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9f9f9;

  &:hover {
    background-color: #f0f0f0;
    border-color: var(--user-theme-color);
  }

  i {
    font-size: 16px;
    color: #999;
    margin-right: 8px;
  }

  span {
    color: #666;
    font-size: 13px;
  }
}

.add-meal-plan {
  padding: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.meal-plan__loading,
.meal-plan__error,
.meal-plan__empty {
  text-align: center;
  padding: 40px 0;
}

.spinner {
  margin: 0 auto 20px;
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--user-theme-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Family member selection modal styles */
.family-member-selection {
  padding: 15px;
  min-height: 250px;
}

.modal-description {
  margin-bottom: 20px;
  font-size: 15px;
  color: #555;
  text-align: center;
}

.modal-subtitle {
  font-size: 14px;
  color: #777;
  margin-bottom: 15px;
  text-align: center;
}

.family-members-list {
  margin-bottom: 20px;
}

.family-member-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background-color 0.3s;
  border: 1px solid #eaeaea;
  cursor: pointer;

  &:hover {
    background-color: #f8f8f8;
  }

  .el-checkbox {
    margin-left: auto;
  }
}

.member-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.member-info {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.no-label :deep(.el-checkbox__label) {
  display: none;
}
</style>

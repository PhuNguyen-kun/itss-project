<template>
  <div class="fridge">
    <BreadCrumb :items="breadcrumbItems" />
    <div class="fridge__header">
      <h2 class="fridge__title">Tủ lạnh gia đình</h2>
      <p v-if="familyName" class="fridge__family-name">{{ familyName }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="fridge__loading">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu tủ lạnh...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="fridge__error">
      <el-alert :title="error" type="error" show-icon :closable="false" />
      <button class="user-btn retry-btn" @click="fetchFridgeItems">Thử lại</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="fridgeItems.length === 0" class="fridge__empty">
      <el-empty description="Tủ lạnh của bạn đang trống">
        <router-link to="/cart">
          <button class="user-btn">Đi mua nguyên liệu</button>
        </router-link>
      </el-empty>
    </div>

    <!-- Content state -->
    <div v-else class="fridge--ingredient">
      <div class="fridge--ingredient__header">
        <h3>Nguyên liệu ({{ fridgeItems.length }})</h3>

        <!-- Recently added indicator -->
        <div v-if="recentlyAddedItems.length > 0" class="recent-additions">
          <div class="recent-badge">{{ recentlyAddedItems.length }} nguyên liệu mới được thêm</div>
        </div>
      </div>

      <div class="fridge--ingredient__list">
        <div
          v-for="item in fridgeItems"
          :key="item.id"
          :class="['ingredient-card', { 'recently-added': isRecentlyAdded(item.id) }]"
        >
          <img
            :src="item.ingredient.image_url || '/ingredient-placeholder.jpg'"
            :alt="item.ingredient.name"
            class="ingredient-card__avatar"
          />
          <div class="ingredient-card__name">{{ item.ingredient.name }}</div>
          <div class="ingredient-card__quantity">
            Số lượng: {{ item.quantity }} {{ formatUnit(item.unit) }}
          </div>
          <div class="ingredient-card__expiry" v-if="item.createdAt">
            Ngày mua: {{ formatDate(item.createdAt) }}
          </div>
          <div class="ingredient-card__action">
            <button class="user-btn btn-action">Chỉnh sửa</button>
            <button class="img-delete" @click="confirmDelete(item)">
              <el-icon><Delete /></el-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import { getFamilyFridgeItems, formatUnit, deleteFromFridge } from '@/services/User/fridgeService'
import type { FridgeItem } from '@/services/User/fridgeService'
import { getMyFamily } from '@/services/User/familyService'

const route = useRoute()
const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Giỏ hàng', to: '/cart' },
  { text: 'Tủ lạnh', to: '/fridge' },
])

// State
const isLoading = ref(true)
const error = ref('')
const familyId = ref<number | null>(null)
const familyName = ref('')
const fridgeItems = ref<FridgeItem[]>([])
const recentlyAddedItems = ref<number[]>([])

onMounted(() => {
  const addedItems = route.query.added
  if (addedItems) {
    try {
      // @ts-ignore
      const itemIds = JSON.parse(Array.isArray(addedItems) ? addedItems[0] : addedItems)
      if (Array.isArray(itemIds)) {
        recentlyAddedItems.value = itemIds

        setTimeout(() => {
          recentlyAddedItems.value = []
        }, 5000)
      }
    } catch (err) {
      console.error('Error parsing recently added items:', err)
    }
  }

  fetchFamilyData()
})

const fetchFamilyData = async () => {
  try {
    isLoading.value = true
    error.value = ''
    const response = await getMyFamily()

    if (response && response.data) {
      familyId.value = response.data.id
      familyName.value = response.data.name
      await fetchFridgeItems()
    } else {
      throw new Error('Failed to fetch family data')
    }
  } catch (err: any) {
    console.error('Failed to fetch family data:', err)
    if (err.response?.status === 401) {
      ElMessage.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.')
    } else {
      error.value = 'Không thể tải thông tin gia đình. Vui lòng thử lại sau.'
      ElMessage.error(error.value)
    }
    isLoading.value = false
  }
}

const fetchFridgeItems = async () => {
  if (!familyId.value) return

  try {
    const response = await getFamilyFridgeItems(familyId.value)

    if (response && response.data) {
      fridgeItems.value = response.data
    } else {
      throw new Error('Failed to fetch fridge items')
    }
  } catch (err: any) {
    console.error('Failed to fetch fridge items:', err)
    error.value =
      err.response?.data?.message || 'Không thể tải dữ liệu tủ lạnh. Vui lòng thử lại sau.'
    ElMessage.error(error.value)
  } finally {
    isLoading.value = false
  }
}

const isRecentlyAdded = (id: number): boolean => {
  return recentlyAddedItems.value.includes(id)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const confirmDelete = (item: FridgeItem) => {
  ElMessageBox.confirm(
    `Bạn có chắc chắn muốn xóa ${item.ingredient.name} khỏi tủ lạnh không?`,
    'Xác nhận xóa',
    {
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      type: 'warning',
    },
  )
    .then(async () => {
      try {
        if (!familyId.value) return

        await deleteFromFridge({
          family_id: familyId.value,
          ingredient_id: item.ingredient_id,
          unit: item.unit,
        })

        ElMessage.success(`Đã xóa ${item.ingredient.name} khỏi tủ lạnh`)

        await fetchFridgeItems()
      } catch (err: any) {
        console.error('Failed to delete ingredient:', err)
        ElMessage.error(
          err.response?.data?.message || 'Không thể xóa nguyên liệu. Vui lòng thử lại sau.',
        )
      }
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.fridge {
  font-family: 'Segoe UI', sans-serif;
}

.fridge__header {
  margin-bottom: 30px;

  .fridge__title {
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
  }

  .fridge__family-name {
    color: #666;
    font-size: 17px;
    margin-top: 20px;
  }
}

.fridge__loading,
.fridge__error,
.fridge__empty {
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

.fridge--ingredient__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 24px;
    margin: 0;
  }

  .recent-additions {
    .recent-badge {
      background-color: var(--user-theme-color);
      color: white;
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.fridge--ingredient__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.img-delete {
  width: 25px;
  height: 25px;
  margin-left: auto;
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
  background-color: #f8f8f8;

  &:hover {
    background-color: #ff7875;
    color: white;
  }
}

.btn-action {
  border-radius: 20px;
  border: 1px solid var(--user-theme-color);
  font-weight: 500;
}

.btn-action:hover {
  background-color: #fff;
  color: var(--user-theme-color);
}

// Ingredient card
.ingredient-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid #eaeaea;

  &.recently-added {
    animation: highlight 3s ease;
    border: 1px solid var(--user-theme-color);
    box-shadow: 0 0 15px rgba(var(--user-theme-color-rgb), 0.3);
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .ingredient-card__avatar {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 12px;
  }

  .ingredient-card__name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .ingredient-card__quantity {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }

  .ingredient-card__expiry {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
  }

  .ingredient-card__action {
    display: flex;
    gap: 10px;
    margin-top: auto;
  }
}

@keyframes highlight {
  0% {
    background-color: rgba(var(--user-theme-color-rgb), 0.2);
  }
  100% {
    background-color: white;
  }
}

//fridge food
.fridge--food__title {
  font-size: 25px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.fridge--food__list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.food-card {
  flex: 1 1 250px;
  max-width: 250px;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.food-card__avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.food-card__name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 15px;
}

.food-card__quantity,
.food-card__expiry {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.food-card__action {
  display: flex;
  align-items: center;
}
//ingredient
.fridge--ingredient__title {
  font-size: 25px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.fridge--ingredient__list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.ingredient-card {
  flex: 1 1 250px;
  max-width: 250px;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.ingredient-card__avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
}

.ingredient-card__name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 15px;
}

.ingredient-card__quantity,
.ingredient-card__expiry {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.ingredient-card__action {
  display: flex;
  align-items: center;
}
</style>

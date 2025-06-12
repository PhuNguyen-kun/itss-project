<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="cart-container">
    <div class="cart-header">
      <h2 class="cart-title">Giỏ hàng - Danh sách nguyên liệu cần mua</h2>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="cart-loading">
      <div class="spinner"></div>
      <p>Đang tải danh sách nguyên liệu...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="cart-error">
      <el-alert :title="error" type="error" show-icon :closable="false" />
      <button class="user-btn retry-btn" @click="fetchCartItems">Thử lại</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="!hasAssignments" class="cart-empty">
      <el-empty description="Không có nguyên liệu nào được phân công">
        <router-link to="/meal-plan">
          <button class="user-btn">Xem kế hoạch bữa ăn</button>
        </router-link>
      </el-empty>
    </div>
    <!-- Content -->
    <div v-else class="cart-content">
      <h3 class="cart-family-name">Gia đình: {{ familyName }}</h3>

      <!-- View in fridge button appears when items are purchased -->
      <div v-if="showViewFridgeButton" class="view-fridge-section">
        <div class="fridge-notification">
          <el-alert
            title="Nguyên liệu đã được thêm vào tủ lạnh!"
            type="success"
            :closable="false"
            show-icon
          >
            <template #description>
              <div>
                <p>{{ addedToFridgeItems.length }} nguyên liệu đã được thêm vào tủ lạnh của bạn.</p>
                <button class="user-btn view-fridge-btn" @click="viewInFridge">
                  Xem trong tủ lạnh
                </button>
              </div>
            </template>
          </el-alert>
        </div>
      </div>

      <div class="cart-members">
        <div v-for="member in cartData.members" :key="member.id" class="cart-member-section">
          <div class="member-header">
            <div class="member-avatar">
              <img :src="member.avatar_url || '/default-avatar.png'" :alt="member.full_name" />
            </div>
            <div class="member-info">
              <h4 class="member-name">{{ member.full_name }}</h4>
              <p class="member-role">{{ formatRole(member.role) }}</p>
            </div>
            <div class="member-stats">
              <strong>{{ member.cart_items.length }}</strong> nguyên liệu
            </div>
          </div>

          <!-- Member's cart items -->
          <div class="cart-items">
            <div v-if="member.cart_items.length === 0" class="no-items">
              Không có nguyên liệu được phân công
            </div>
            <div
              v-else
              class="cart-item"
              :class="{ purchased: item.status === 1 }"
              v-for="item in member.cart_items"
              :key="item.id"
            >
              <div class="cart-item-image">
                <img
                  :src="item.ingredient.image_url || '/ingredient-placeholder.jpg'"
                  :alt="item.ingredient.name"
                />
              </div>
              <div class="cart-item-info">
                <h5 class="ingredient-name">{{ item.ingredient.name }}</h5>
                <p class="ingredient-quantity">{{ item.quantity }} {{ formatUnit(item.unit) }}</p>
              </div>
              <div class="cart-item-dish">
                <p><strong>Cho món:</strong></p>
                <p class="dish-name">{{ item.meal_plan.dish.name }}</p>
              </div>
              <div class="cart-item-status">
                <el-checkbox
                  :model-value="item.status === 1"
                  @change="
                    (val: boolean) => {
                      item.status = val ? 1 : 0
                      updateItemStatus(item)
                    }
                  "
                  :disabled="isUpdating(item.id)"
                >
                  <span v-if="isUpdating(item.id)" class="updating-text">Đang cập nhật...</span>
                  <span v-else>{{ item.status === 1 ? 'Đã mua' : 'Chưa mua' }}</span>
                </el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import {
  getCartItemsByFamilyId,
  formatUnit,
  updateCartItemStatus,
} from '@/services/User/cartService'
import type { CartResponse } from '@/services/User/cartService'
import { getMyFamily } from '@/services/User/familyService'

const router = useRouter()
const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Giỏ hàng', to: '/cart' },
])

// Function to navigate to fridge view with newly added items
const viewInFridge = () => {
  if (addedToFridgeItems.value.length > 0) {
    // Extract the IDs of added items to pass as query params
    const addedItemIds = addedToFridgeItems.value.map((item) => item.id)

    // Navigate to fridge view with added items info
    router.push({
      path: '/fridge',
      query: {
        added: JSON.stringify(addedItemIds),
      },
    })
  }
}

// State management
const isLoading = ref(true)
const error = ref('')
const familyId = ref<number | null>(null)
const familyName = ref('')
const cartData = ref<CartResponse>({
  family: { id: 0, name: '' },
  members: [],
})

// Add a ref for tracking which items are being updated
const updatingItems = ref<Record<number, boolean>>({})

// Tracking purchased items for fridge view
interface PurchasedItem {
  id: number
  ingredientName: string
}
const addedToFridgeItems = ref<PurchasedItem[]>([])
const showViewFridgeButton = ref(false)

// Helper to check if a specific item is being updated
const isUpdating = (itemId: number): boolean => {
  return !!updatingItems.value[itemId]
}

// Computed for checking if there are assignments
const hasAssignments = computed(() => {
  if (!cartData.value || !cartData.value.members) return false

  return cartData.value.members.some((member) => member.cart_items && member.cart_items.length > 0)
})

// Format family role
const formatRole = (role: number): string => {
  switch (role) {
    case 0:
      return 'Người nội trợ'
    case 1:
      return 'Thành viên'
    default:
      return 'Thành viên'
  }
}

// Update item status
const updateItemStatus = async (item: any) => {
  if (!familyId.value) return

  // Mark the item as being updated
  updatingItems.value[item.id] = true

  try {
    const numStatus = item.status ? 1 : 0
    const response = await updateCartItemStatus(item.id, numStatus, familyId.value)

    if (response.success) {
      ElMessage.success(`Cập nhật trạng thái thành công: ${item.status ? 'Đã mua' : 'Chưa mua'}`)

      // If the item was marked as purchased, inform the user it was added to the fridge
      if (item.status) {
        ElMessage.info(`Nguyên liệu ${item.ingredient.name} đã được thêm vào tủ lạnh`)

        // Add the item ID to our tracking array for purchased items
        addedToFridgeItems.value.push({
          id: response.data.id,
          ingredientName: item.ingredient.name,
        })

        // If we have at least one item, show the "View in Fridge" button
        showViewFridgeButton.value = true
      }
    } else {
      // If there was an error, revert the checkbox status
      item.status = !item.status
      throw new Error(response.message || 'Failed to update item status')
    }
  } catch (err: any) {
    console.error('Failed to update cart item status:', err)
    // Revert the checkbox status on error
    item.status = !item.status
    ElMessage.error(
      err.response?.data?.message || 'Không thể cập nhật trạng thái. Vui lòng thử lại.',
    )
  } finally {
    // Mark the item as no longer being updated
    updatingItems.value[item.id] = false
  }
}

// Fetch cart items for the current user's family
const fetchCartItems = async () => {
  if (!familyId.value) return

  try {
    isLoading.value = true
    error.value = ''

    const response = await getCartItemsByFamilyId(familyId.value)

    if (response && response.data) {
      cartData.value = response.data
      familyName.value = response.data.family.name
    } else {
      throw new Error('Failed to fetch cart items')
    }
  } catch (err: any) {
    console.error('Failed to fetch cart items:', err)
    error.value =
      err.response?.data?.message || 'Unable to load cart items. Please try again later.'
    ElMessage.error(error.value)
  } finally {
    isLoading.value = false
  }
}

// Fetch family data
const fetchFamilyData = async () => {
  try {
    const response = await getMyFamily()
    if (response && response.data) {
      familyId.value = response.data.id
      familyName.value = response.data.name
      await fetchCartItems()
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

onMounted(() => {
  fetchFamilyData()
})
</script>

<style scoped lang="scss">
.cart-container {
  font-family: 'Segoe UI', sans-serif;
}

.cart-header {
  margin-bottom: 30px;
}

.cart-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.cart-family-name {
  font-size: 20px;
  color: #555;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}

.cart-members {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.cart-member-section {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.member-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.member-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 18px;
  margin: 0 0 5px;
  color: #333;
}

.member-role {
  color: #888;
  margin: 0;
  font-size: 14px;
}

.member-stats {
  padding: 5px 15px;
  background-color: #f7f7f7;
  border-radius: 20px;
  font-size: 14px;
  color: #555;
}

.cart-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 15px;
}

.cart-item {
  display: flex;
  border: 1px solid #eaeaea;
  padding: 15px;
  border-radius: 8px;
  gap: 15px;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  }

  &.purchased {
    background-color: #f5f5f5;
    border-color: #e0e0e0;

    .ingredient-name,
    .ingredient-quantity,
    .dish-name {
      color: #888;
    }

    .cart-item-image {
      opacity: 0.7;
    }
  }
}

.cart-item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.cart-item-info {
  flex: 1;
}

.ingredient-name {
  font-size: 16px;
  margin: 0 0 5px;
  color: #333;
}

.ingredient-quantity {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.cart-item-dish {
  flex: 1;
  font-size: 14px;

  p {
    margin: 0 0 5px;
  }
}

.dish-name {
  color: var(--user-theme-color);
}

.no-items {
  padding: 20px;
  text-align: center;
  color: #888;
  grid-column: 1 / -1;
}

.cart-loading,
.cart-error,
.cart-empty {
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

.view-fridge-section {
  margin: 20px 0;

  .fridge-notification {
    margin-bottom: 30px;
  }

  .view-fridge-btn {
    margin-top: 10px;
    background-color: var(--user-theme-color);
    color: white;
    border: none;
    font-weight: 500;

    &:hover {
      opacity: 0.9;
    }
  }
}

.cart-item-status {
  min-width: 100px;

  .updating-text {
    color: #909399;
    font-style: italic;
  }

  .el-checkbox.is-disabled {
    opacity: 0.8;
  }
}
</style>

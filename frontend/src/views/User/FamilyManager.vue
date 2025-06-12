<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="family-manager">
    <div class="family-manager__header">
      <h2 class="family-manager__title">Quản lí gia đình</h2>
      <div class="family-manager__buttons">
        <button
          class="user-btn btn-action"
          :disabled="!isHousekeeper"
          :class="{ 'disabled-btn': !isHousekeeper }"
          @click="openAddMemberModal"
        >
          Thêm thành viên
        </button>
        <button
          class="user-btn btn-action"
          :disabled="!isHousekeeper || hasFamily"
          :class="{ 'disabled-btn': !isHousekeeper || hasFamily }"
          @click="openCreateFamilyModal"
        >
          Tạo gia đình
        </button>
        <!-- <button class="user-btn btn-action">Chỉnh sửa thành viên</button> -->
      </div>
    </div>

    <div v-if="isLoading" class="family-manager__loading">
      <div class="spinner"></div>
      <p>Đang tải thông tin gia đình...</p>
    </div>

    <div v-else-if="error" class="family-manager__error">
      <p>{{ error }}</p>
      <button class="user-btn btn-action" @click="fetchFamilyData">Thử lại</button>
    </div>

    <div v-else>
      <div v-if="!family" class="family-info family-info--empty">
        <h3 class="family-info__title">Bạn chưa có gia đình</h3>
        <p class="family-info__subtitle" v-if="isHousekeeper">
          Vui lòng tạo gia đình mới để quản lý thành viên
        </p>
        <p class="family-info__subtitle" v-else>
          Vui lòng liên hệ với người quản lý gia đình để gia nhập gia đình
        </p>
      </div>

      <div class="family-info" v-if="family">
        <h3 class="family-info__name">{{ family.name }}</h3>
      </div>

      <div class="family-manager__list" v-if="family">
        <div v-for="member in familyMembers" :key="member.id" class="member-card">
          <img
            :src="member.avatar || '/default-avatar.jpg'"
            alt="avatar"
            class="member-card__avatar"
          />
          <div class="member-card__name">{{ member.name }}</div>
          <div class="member-card__gender">Giới tính: {{ formatGender(member.gender) }}</div>
          <div class="member-card__role">Vai trò: {{ formatRole(member.family_role) }}</div>
          <div class="member-card__email">{{ member.email }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Member Modal -->
  <el-dialog v-model="showAddMemberModal" title="Thêm thành viên vào gia đình" width="50%">
    <div class="search-container">
      <el-input
        v-model="searchQuery"
        placeholder="Tìm kiếm theo tên hoặc email"
        class="search-input"
        @input="searchUsers"
        clearable
      >
        <el-icon><i class="el-icon-search"></i></el-icon>
      </el-input>
    </div>

    <div v-if="isSearching" class="search-loading">
      <div class="spinner"></div>
      <p>Đang tìm kiếm...</p>
    </div>

    <div v-else-if="searchResults.length === 0" class="no-results">Không tìm thấy kết quả nào</div>

    <div v-else class="search-results">
      <div
        v-for="user in searchResults"
        :key="user.id"
        class="user-item"
        :class="{ selected: isUserSelected(user) }"
        @click="selectUser(user)"
      >
        <div class="user-info">
          <div class="user-name">{{ user.full_name }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
        <el-checkbox :model-value="isUserSelected(user)" @click.stop />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAddMemberModal = false">Hủy</el-button>
        <el-button type="primary" @click="addMembers" :disabled="selectedUsers.length === 0">
          Thêm {{ selectedUsers.length }} thành viên
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- Create Family Modal -->
  <el-dialog v-model="showCreateFamilyModal" title="Tạo gia đình mới" width="40%">
    <el-form
      ref="createFamilyFormRef"
      :model="familyForm"
      :rules="familyFormRules"
      label-position="top"
    >
      <el-form-item label="Tên gia đình" prop="name">
        <el-input v-model="familyForm.name" placeholder="Nhập tên gia đình" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateFamilyModal = false">Hủy</el-button>
        <el-button type="primary" @click="createFamily"> Tạo gia đình </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive } from 'vue'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import {
  getMyFamily,
  createNewFamily,
  searchUsersByNameOrEmail,
  addMembersToFamily,
} from '@/services/User/familyService'
import type { Family, FamilyMember } from '@/services/User/familyService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Auth/authStore'
import { ElDialog, ElInput, ElButton, ElForm, ElFormItem } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()
const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Quản lý gia đình', to: '/family-manager' },
])

const isLoading = ref(true)
const error = ref('')
const family = ref<Family | null>(null)

// Check if user is a housekeeper (family_role = 0)
const isHousekeeper = computed(() => {
  return authStore.userInfo?.family_role === 0
})

// Check if user already has a family
const hasFamily = computed(() => {
  return !!family.value || !!authStore.userInfo?.family_id
})

const familyMembers = computed(() => {
  if (!family.value) return []

  console.log('Family members:', family.value.users)

  return family.value.users.map((user) => ({
    id: user.id,
    name: user.full_name,
    gender: user.gender,
    email: user.email,
    family_role: user.family_role,
    avatar: user.avatar_url,
  }))
})

const formatGender = (gender?: number) => {
  if (gender === undefined) return 'Không xác định'
  return gender === 1 ? 'Nam' : gender === 2 ? 'Nữ' : 'Khác'
}

const formatRole = (family_role?: number) => {
  if (family_role === undefined) return 'Thành viên'
  switch (family_role) {
    case 0:
      return 'Người nội trợ'
    case 1:
      return 'Thành viên'
    default:
      return 'Thành viên'
  }
}

// Modal visibility state
const showAddMemberModal = ref(false)
const showCreateFamilyModal = ref(false)

// Search state for add member modal
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const isSearching = ref(false)
const selectedUsers = ref<any[]>([])

// Create family form
const familyForm = reactive({
  name: '',
})

const familyFormRules = {
  name: [
    { required: true, message: 'Vui lòng nhập tên gia đình', trigger: 'blur' },
    { min: 2, message: 'Tên gia đình phải có ít nhất 2 ký tự', trigger: 'blur' },
  ],
}

const createFamilyFormRef = ref()

// Modal control functions
const openAddMemberModal = () => {
  if (!isHousekeeper.value) {
    notifyError('Chỉ người quản lý gia đình mới có thể thêm thành viên')
    return
  }

  if (family.value) {
    showAddMemberModal.value = true
    searchUsers()
  } else {
    notifyError('Bạn cần tạo gia đình trước')
  }
}

const openCreateFamilyModal = () => {
  if (!isHousekeeper.value) {
    notifyError('Chỉ người quản lý gia đình mới có thể tạo gia đình')
    return
  }

  if (hasFamily.value) {
    notifyError('Bạn đã có gia đình')
    return
  }

  showCreateFamilyModal.value = true
}

// User search and selection functions
const searchUsers = async () => {
  try {
    isSearching.value = true

    if (searchQuery.value.trim().length > 0) {
      const response = await searchUsersByNameOrEmail(searchQuery.value)
      searchResults.value = response.data.filter((user: any) => !user.family_id)
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('Error searching users:', error)
    notifyError('Không thể tìm kiếm người dùng')
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

const selectUser = (user: any) => {
  // Check if user is already selected
  const index = selectedUsers.value.findIndex((u) => u.id === user.id)
  if (index === -1) {
    selectedUsers.value.push(user)
  } else {
    selectedUsers.value.splice(index, 1)
  }
}

const isUserSelected = (user: any) => {
  return selectedUsers.value.some((u) => u.id === user.id)
}

// Add members function
const addMembers = async () => {
  if (selectedUsers.value.length === 0) {
    notifyError('Vui lòng chọn ít nhất một thành viên')
    return
  }

  if (!family.value || !family.value.id) {
    notifyError('Không tìm thấy thông tin gia đình')
    return
  }

  try {
    await addMembersToFamily(
      family.value.id,
      selectedUsers.value.map((u) => u.id),
    )

    notifySuccess('Đã thêm thành viên vào gia đình')
    showAddMemberModal.value = false
    selectedUsers.value = []
    await fetchFamilyData() // Refresh family data
  } catch (error) {
    console.error('Error adding members:', error)
    notifyError('Không thể thêm thành viên vào gia đình')
  }
}

// Create family function
const createFamily = async () => {
  if (!createFamilyFormRef.value) return

  await createFamilyFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await createNewFamily(familyForm.name)

        notifySuccess('Đã tạo gia đình thành công')
        showCreateFamilyModal.value = false
        familyForm.name = ''
        await fetchFamilyData() // Refresh family data
      } catch (error) {
        console.error('Error creating family:', error)
        notifyError('Không thể tạo gia đình')
      }
    }
  })
}

const fetchFamilyData = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const response = await getMyFamily()
    family.value = response.data
  } catch (err: any) {
    console.error('Failed to fetch family data:', err)
    error.value =
      err.response?.data?.message || 'Không thể tải thông tin gia đình. Vui lòng thử lại sau.'

    // If unauthorized, redirect to login
    if (err.response?.status === 401) {
      notifyError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
      router.push('/login')
    } else {
      notifyError(error.value)
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
.family-manager {
  font-family: 'Segoe UI', sans-serif;
}

.family-manager__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.family-manager__title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.family-manager__buttons button {
  margin-left: 10px;
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

.family-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  border-left: 4px solid var(--user-theme-color);
}

.family-info--empty {
  padding: 30px;
  text-align: center;
  border-left: none;
  border: 2px dashed #ddd;
}

.family-info__name {
  font-size: 22px;
  color: #333;
  margin: 0;
}

.family-info__title {
  font-size: 22px;
  color: #333;
  margin: 0 0 10px 0;
}

.family-info__subtitle {
  color: #666;
  margin: 0;
}

.family-manager__list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.member-card {
  flex: 1 1 250px;
  max-width: 250px;
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.member-card__avatar {
  width: 80px;
  min-width: 80px;
  min-height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 1px solid var(--user-theme-color);
}

.member-card__name {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 15px;
}

.member-card__gender,
.member-card__role {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.member-card__email {
  font-size: 12px;
  color: #888;
  word-break: break-all;
}

.family-manager__loading,
.family-manager__error {
  text-align: center;
  padding: 40px 0;

  .btn-action {
    margin-top: 20px;
  }
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

/* Button style for disabled buttons */
.disabled-btn {
  opacity: 0.6;
  cursor: not-allowed !important;
}

/* Modal styles */
.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
}

.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.no-results {
  text-align: center;
  padding: 20px 0;
  color: #999;
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-item:hover {
  background-color: #f9f9f9;
}

.user-item.selected {
  background-color: #f0f9eb;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 500;
  margin-bottom: 3px;
}

.user-email {
  font-size: 12px;
  color: #999;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>

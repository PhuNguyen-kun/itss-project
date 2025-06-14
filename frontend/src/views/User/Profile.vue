<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1 class="profile-title">Thông tin cá nhân</h1>
      <p class="profile-subtitle">Quản lý thông tin, tài khoản và bảo mật</p>
    </div>

    <div v-if="isLoading" class="profile-loading">
      <div class="spinner"></div>
      <p>Đang tải thông tin...</p>
    </div>

    <div v-else-if="error" class="profile-error">
      <p>{{ error }}</p>
      <button class="user-btn retry-btn" @click="fetchUserProfile">Thử lại</button>
    </div>

    <div v-else class="profile-content">
      <!-- Profile overview card -->
      <div class="profile-card">
        <div class="profile-avatar-container">
          <img
            v-if="profileData.avatar_url"
            :src="getFullAvatarUrl(profileData.avatar_url)"
            :alt="profileData.full_name"
            class="profile-avatar"
          />
          <el-avatar v-else :size="120">
            {{ userInitials }}
          </el-avatar>

          <div class="avatar-edit-overlay" @click="openAvatarUpload">
            <el-icon><EditPen /></el-icon>
          </div>
        </div>

        <div class="profile-info">
          <h2 class="profile-name">{{ profileData.full_name }}</h2>
          <div class="profile-detail">
            <el-icon><Message /></el-icon>
            <span>{{ profileData.email }}</span>
          </div>
          <div class="profile-detail" v-if="profileData.phone_number">
            <el-icon><Phone /></el-icon>
            <span>{{ profileData.phone_number }}</span>
          </div>
          <div class="profile-detail">
            <el-icon><User /></el-icon>
            <span>{{ formatGender(profileData.gender) }}</span>
          </div>
          <div class="profile-family" v-if="profileData.family && profileData.family.name">
            <span class="family-badge">{{ profileData.family.name }}</span>
            <span class="role-badge">{{ formatFamilyRole(profileData.family_role) }}</span>
          </div>

          <div class="profile-actions">
            <button class="btn-action" @click="activeTab = 'profile'">Chỉnh sửa thông tin</button>
            <button class="btn-action" @click="activeTab = 'password'">Đổi mật khẩu</button>
          </div>
        </div>
      </div>

      <!-- Edit profile form -->
      <div class="profile-edit-section" v-if="activeTab === 'profile'">
        <h3 class="section-title">Chỉnh sửa thông tin cá nhân</h3>

        <el-form
          ref="profileFormRef"
          :model="profileForm"
          :rules="profileRules"
          label-position="top"
          label-width="120px"
          status-icon
        >
          <el-form-item label="Họ và tên" prop="full_name">
            <el-input v-model="profileForm.full_name" placeholder="Nhập họ và tên" />
          </el-form-item>

          <el-form-item label="Email">
            <el-input v-model="profileData.email" disabled />
            <small>Email không thể thay đổi</small>
          </el-form-item>

          <el-form-item label="Số điện thoại" prop="phone_number">
            <el-input v-model="profileForm.phone_number" placeholder="Nhập số điện thoại" />
          </el-form-item>

          <el-form-item label="Giới tính" prop="gender">
            <el-select v-model="profileForm.gender" placeholder="Chọn giới tính">
              <el-option :value="0" label="Nam" />
              <el-option :value="1" label="Nữ" />
              <el-option :value="2" label="Khác" />
            </el-select>
          </el-form-item>

          <el-form-item label="Ngày sinh" prop="birth_date">
            <el-date-picker
              v-model="profileForm.birth_date"
              type="date"
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              :disabled-date="disableFutureDates"
            />
          </el-form-item>

          <!-- family_role (0 for housekeeper, 1 for family member) -->
          <el-form-item label="Vai trò trong gia đình">
            <el-select v-model="profileForm.family_role" placeholder="Chọn vai trò">
              <el-option :value="0" label="Người nội trợ" />
              <el-option :value="1" label="Thành viên" />
            </el-select>
          </el-form-item>

          <el-form-item label="Ảnh đại diện">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="handleAvatarUpload"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="avatarUrl" :src="getFullAvatarUrl(avatarUrl)" class="avatar-preview" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tip">Chọn ảnh có kích thước nhỏ hơn 2MB</div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateProfile" :loading="isUpdating"
              >Cập nhật</el-button
            >
            <el-button @click="resetProfileForm">Hủy</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- Change password form -->
      <div class="profile-edit-section" v-if="activeTab === 'password'">
        <h3 class="section-title">Đổi mật khẩu</h3>

        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-position="top"
          label-width="120px"
          status-icon
        >
          <el-form-item label="Mật khẩu hiện tại" prop="currentPassword">
            <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              show-password
            />
          </el-form-item>

          <el-form-item label="Mật khẩu mới" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới"
              show-password
            />
          </el-form-item>

          <el-form-item label="Xác nhận mật khẩu mới" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updatePassword" :loading="isChangingPassword"
              >Đổi mật khẩu</el-button
            >
            <el-button @click="resetPasswordForm">Hủy</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  formatGender,
  formatFamilyRole,
  type ProfileUpdateData,
} from '@/services/User/profileService'
import { uploadAvatar } from '@/services/uploadService'
import { useAuthStore } from '@/stores/Auth/authStore'
import { notifySuccess, notifyError } from '@/composables/notifications'

// Define interfaces for type safety
interface Family {
  id: number
  name: string
}

interface UserProfile {
  id: number | null
  full_name: string
  email: string
  phone_number: string | null
  gender: number | null
  birth_date: string | null
  family_role: number | null
  avatar_url: string | null
  family_id: number | null
  family: Family | null
}

// State
const authStore = useAuthStore()
const isLoading = ref(true)
const error = ref('')
const profileData = ref<UserProfile>({
  id: null,
  full_name: '',
  email: '',
  phone_number: '',
  gender: null,
  birth_date: '',
  avatar_url: null,
  family_id: null,
  family_role: null,
  family: null,
})

const activeTab = ref('info') // 'info', 'profile', 'password'
const isUpdating = ref(false)
const isChangingPassword = ref(false)
const avatarUrl = ref('')

// Form references
const profileFormRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()

// Form data
const profileForm = reactive({
  full_name: '',
  phone_number: '',
  gender: null as number | null,
  birth_date: '',
  avatar_url: '',
  family_role: null as number | null,
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Form validation rules
const profileRules = reactive<FormRules>({
  full_name: [
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự', trigger: 'blur' },
  ],
  phone_number: [
    { pattern: /^[0-9+\-\s]*$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' },
  ],
})

const passwordRules = reactive<FormRules>({
  currentPassword: [
    { required: true, message: 'Vui lòng nhập mật khẩu hiện tại', trigger: 'blur' },
    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: 'Vui lòng nhập mật khẩu mới', trigger: 'blur' },
    { min: 8, message: 'Mật khẩu mới phải có ít nhất 8 ký tự', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: 'Vui lòng xác nhận mật khẩu mới', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('Mật khẩu xác nhận không khớp'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// Computed values
const userInitials = computed(() => {
  const fullName = profileData.value.full_name || ''
  return fullName
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
})

// Date filter
const disableFutureDates = (time: Date) => {
  return time.getTime() > Date.now()
}

// Function to get full URL for avatar
const getFullAvatarUrl = (avatarUrl: string | null): string => {
  if (!avatarUrl) return ''

  // If the URL already starts with http or https, it's already a full URL
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl
  }

  // Get the base URL from the environment or use a default
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin

  // Return the full URL
  return `${baseUrl}${avatarUrl}`
}

// Methods
const fetchUserProfile = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const response = await getUserProfile()
    profileData.value = response.data

    // Populate form with existing data
    profileForm.full_name = profileData.value.full_name
    profileForm.phone_number = profileData.value.phone_number || ''
    profileForm.gender = profileData.value.gender

    if (profileData.value.birth_date) {
      profileForm.birth_date = new Date(profileData.value.birth_date).toISOString().split('T')[0]
    }

    profileForm.avatar_url = profileData.value.avatar_url || ''
    avatarUrl.value = profileData.value.avatar_url || ''
  } catch (err: any) {
    console.error('Error fetching user profile:', err)
    if (err.response?.status === 401) {
      error.value = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.'
    } else {
      error.value = 'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
    }
  } finally {
    isLoading.value = false
  }
}

const updateProfile = async () => {
  if (!profileFormRef.value) return

  await profileFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        isUpdating.value = true // Create the update data with proper type casting
        // We don't include avatar_url because we handle that with a separate upload API
        const profileUpdateData: ProfileUpdateData = {
          full_name: profileForm.full_name,
          phone_number: profileForm.phone_number || undefined,
          gender: profileForm.gender !== null ? profileForm.gender : undefined,
          birth_date: profileForm.birth_date || undefined,
          family_role: profileForm.family_role !== null ? profileForm.family_role : undefined,
        }

        const response = await updateUserProfile(profileUpdateData)

        // Update local profile data
        profileData.value = response.data

        // Also update store if needed
        authStore.userInfo = {
          ...authStore.userInfo,
          full_name: profileForm.full_name,
          avatar_url: avatarUrl.value,
        }

        notifySuccess('Cập nhật thông tin thành công!')
        activeTab.value = 'info'
      } catch (err: any) {
        console.error('Error updating profile:', err)
        notifyError('Cập nhật thông tin thất bại. Vui lòng thử lại sau.')
      } finally {
        isUpdating.value = false
      }
    }
  })
}
import { useRouter } from 'vue-router'
const router = useRouter()

const updatePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        isChangingPassword.value = true

        await changePassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })

        notifySuccess('Đổi mật khẩu thành công!')
        resetPasswordForm()
        activeTab.value = 'info'
      } catch (err: any) {
        console.error('Error changing password:', err)

        if (err.response?.status === 400) {
          notifyError('Mật khẩu hiện tại không chính xác')
        } else {
          notifyError('Đổi mật khẩu thất bại. Vui lòng thử lại sau.')
        }
      } finally {
        isChangingPassword.value = false
      }
    }
  })

  await authStore.logout()
  await router.push({ name: 'user-login' })
}

const resetProfileForm = () => {
  if (profileFormRef.value) {
    profileFormRef.value.resetFields()
  }

  profileForm.full_name = profileData.value.full_name
  profileForm.phone_number = profileData.value.phone_number || ''
  profileForm.gender = profileData.value.gender

  if (profileData.value.birth_date) {
    profileForm.birth_date = new Date(profileData.value.birth_date).toISOString().split('T')[0]
  } else {
    profileForm.birth_date = ''
  }

  avatarUrl.value = profileData.value.avatar_url || ''
  activeTab.value = 'info'
}

const resetPasswordForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }

  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const openAvatarUpload = () => {
  activeTab.value = 'profile'
  setTimeout(() => {
    const uploadElement = document.querySelector('.avatar-uploader .el-upload')
    if (uploadElement) {
      uploadElement.dispatchEvent(new MouseEvent('click'))
    }
  }, 100)
}

// Avatar upload handlers
const handleAvatarUpload = async (options: any) => {
  try {
    const file = options.file
    isUpdating.value = true

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      avatarUrl.value = e.target?.result as string
    } 
    const uploadResponse = await uploadAvatar(file) 
    const fullUrl = uploadResponse.data.fullAvatarUrl || uploadResponse.data.avatarUrl
    avatarUrl.value = fullUrl

    if (authStore.userInfo) {
      authStore.userInfo.avatar_url = fullUrl
    }

    options.onSuccess()
  } catch (error) {
    console.error('Error uploading avatar:', error)
    notifyError('Không thể tải lên ảnh đại diện')
    options.onError()
  } finally {
    isUpdating.value = false
  }
}

const beforeAvatarUpload = (file: File) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const isValidType = validTypes.includes(file.type)
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isValidType) {
    ElMessage.error('Ảnh đại diện phải là định dạng JPG, PNG, GIF hoặc WEBP!')
    return false
  }

  if (!isLt5M) {
    ElMessage.error('Ảnh đại diện không được vượt quá 5MB!')
    return false
  }

  return true
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  margin-bottom: 2rem;
  text-align: center;
}

.profile-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.profile-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.profile-avatar-container {
  position: relative;
  margin-right: 2rem;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-edit-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.avatar-edit-overlay:hover {
  background-color: #f0f0f0;
}

.profile-info {
  flex: 1;
  min-width: 300px;
}

.profile-name {
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  color: #333;
}

.profile-detail {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #555;
}

.profile-detail .el-icon {
  margin-right: 8px;
  font-size: 1rem;
  color: #666;
}

.profile-family {
  margin-top: 1rem;
  display: flex;
  gap: 8px;
}

.family-badge,
.role-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.family-badge {
  background-color: #ecf5ff;
  color: #409eff;
}

.role-badge {
  background-color: #f0f9eb;
  color: #67c23a;
}

.profile-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-action {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: #f4f4f4;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background-color: #e0e0e0;
}

.profile-edit-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  margin-top: 1rem;
}

.section-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.8rem;
}

.avatar-uploader {
  width: 150px;
  height: 150px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1rem;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.upload-tip {
  color: #8c939d;
  font-size: 0.9rem;
}

.profile-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #409eff;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.profile-error {
  text-align: center;
  padding: 2rem;
  color: #f56c6c;
}

.retry-btn {
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: #f56c6c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background-color: #e64a4a;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .profile-avatar-container {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }

  .profile-actions {
    justify-content: center;
  }

  .profile-detail {
    justify-content: center;
  }

  .profile-family {
    justify-content: center;
  }
}
</style>

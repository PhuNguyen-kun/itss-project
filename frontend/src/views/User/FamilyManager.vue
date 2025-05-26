<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="family-manager">
    <div class="family-manager__header">
      <h2 class="family-manager__title">Quản lí gia đình</h2>
      <div class="family-manager__buttons">
        <button class="user-btn btn-action">Thêm thành viên</button>
        <button class="user-btn btn-action">Chỉnh sửa thành viên</button>
        <button class="user-btn btn-action">Xóa thành viên</button>
      </div>
    </div>

    <div>
      <div class="family-info" v-if="family">
        <h3 class="family-info__name">{{ family.name }}</h3>
      </div>

      <div class="family-manager__list">
        <div v-for="member in familyMembers" :key="member.id" class="member-card">
          <img :src="member.avatar" alt="avatar" class="member-card__avatar" />
          <div class="member-card__name">{{ member.name }}</div>
          <div class="member-card__gender">Giới tính: {{ formatGender(member.gender) }}</div>
          <div class="member-card__role">Vai trò: {{ formatRole(member.family_role) }}</div>
          <div class="member-card__email">{{ member.email }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import { getMyFamily } from '@/services/User/familyService'
import type { Family, FamilyMember } from '@/services/User/familyService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { useRouter } from 'vue-router'

const router = useRouter()
const breadcrumbItems = computed(() => [
  { text: 'Trang chủ', to: '/' },
  { text: 'Quản lý gia đình', to: '/family-manager' },
])

const isLoading = ref(true)
const error = ref('')
const family = ref<Family | null>(null)

const familyMembers = computed(() => {
  if (!family.value) return []

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

.family-info__name {
  font-size: 22px;
  color: #333;
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
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 10px;
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
</style>

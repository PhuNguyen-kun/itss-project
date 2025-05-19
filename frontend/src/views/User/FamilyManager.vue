<template>
  <div class="family-manager">
    <div class="family-manager__header">
      <h2 class="family-manager__title">Quản lí gia đình</h2>
      <div class="family-manager__buttons">
        <button class="user-btn btn-action">Thêm thành viên</button>
        <button class="user-btn btn-action">Chỉnh sửa thành viên</button>
        <button class="user-btn btn-action">Xóa thành viên</button>
      </div>
    </div>
    <div class="family-manager__list">
      <div v-for="member in members" :key="member.id" class="member-card">
        <img :src="member.avatar" alt="avatar" class="member-card__avatar" />
        <div class="member-card__name">{{ member.name }}</div>
        <div class="member-card__gender">Giới tính: {{ member.gender }}</div>
        <div class="member-card__role">Vai trò: {{ member.role }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const members = [
  {
    id: 1,
    name: 'Maria Gonzalez',
    gender: 'Nữ',
    age: 42,
    role: 'Người nội trợ',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 2,
    name: 'Carlos Gonzalez',
    gender: 'Nam',
    age: 16,
    role: 'Thành viên',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    name: 'Lucia Gonzalez',
    gender: 'Nữ',
    age: 12,
    role: 'Thành viên',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
  },
]
</script>

<style scoped lang="scss">
.family-manager {
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
}

.family-manager__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.family-manager__title {
  font-size: 24px;
  font-weight: bold;
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
  margin-bottom: 5px;
}

.member-card__gender,
.member-card__role {
  font-size: 14px;
  color: #666;
}
</style>

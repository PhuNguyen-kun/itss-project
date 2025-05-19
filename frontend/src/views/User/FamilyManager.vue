<template>
  <div class="family-manager">
    <div class="family-manager__header">
      <h2 class="family-manager__title">Family Manager</h2>
      <div class="family-manager__buttons">
        <button class="user-btn btn-action">Add Member</button>
        <button class="user-btn btn-action">Edit Member</button>
        <button class="user-btn btn-action">Delete Member</button>
      </div>
    </div>
    <div class="family-manager__list">
      <div v-for="member in members" :key="member.id" class="member-card">
        <img :src="member.avatar" alt="avatar" class="member-card__avatar" />
        <div class="member-card__name">{{ member.name }}</div>
        <div class="member-card__age">Age: {{ member.age }}</div>
        <div class="member-card__relationship">Relationship: {{ member.relationship }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const members = [
  {
    id: 1,
    name: 'Maria Gonzalez',
    age: 42,
    relationship: 'Mother',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 2,
    name: 'Carlos Gonzalez',
    age: 16,
    relationship: 'Son',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    id: 3,
    name: 'Lucia Gonzalez',
    age: 12,
    relationship: 'Daughter',
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

.member-card__age,
.member-card__relationship {
  font-size: 14px;
  color: #666;
}
</style>

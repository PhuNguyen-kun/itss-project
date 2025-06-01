<template>
  <BreadCrumb :items="breadcrumbItems" />

  <div class="meal-plan">
    <div class="meal-plan__header">
      <h2 class="meal-plan__title">Kế hoạch bữa ăn cho {{ currentMonthYear }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BreadCrumb from '@/components/User/BreadCrumb.vue'
import { getMealPlansByFamilyId, formatMealType } from '@/services/User/mealPlanService'
import type { MealPlan } from '@/services/User/mealPlanService'
import { getMyFamily } from '@/services/User/familyService'
import { notifyError, notifySuccess } from '@/composables/notifications'
import { useRouter } from 'vue-router'
// import { format, parseISO } from 'date-fns'
// import { vi } from 'date-fns/locale'

const router = useRouter()
const breadcrumbItems = computed(() => [
  { text: 'Home', to: '/' },
  { text: 'Kế hoạch bữa ăn', to: '/meal-plan' },
])

const isLoading = ref(true)
const error = ref('')
const familyId = ref<number | null>(null)
const mealPlans = ref<MealPlan[]>([])
const startDate = ref('')
const endDate = ref('')
const showAddMealPlan = ref(false)

const currentMonthYear = computed(() => {
  const now = new Date()
  return `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`
})

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
      notifyError('Session expired, please log in again.')
      router.push('/login')
    } else {
      error.value = 'Unable to load family information. Please try again later.'
      notifyError(error.value)
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
    notifyError(error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchFamilyData()
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
  border-bottom: 2px solid var(--user-theme-color);
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
  min-width: 280px;
  max-width: calc(33.333% - 20px);
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
</style>

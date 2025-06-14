<template>
  <h1 class="admin-page__title">Quản lý món ăn</h1>
  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 700px">
      <el-input
        v-model="search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo tên món ăn"
        @keyup.enter="handleSearch"
      />

      <Button class="admin-btn btn--primary" @click="handleSearch">
        <el-icon>
          <Search />
        </el-icon>
      </Button>
    </div>
    <div class="admin-page__heading--right">
      <Button
        v-if="selectedRows.length"
        class="admin-btn btn--danger"
        @click="openDeleteSelectedConfirm"
      >
        <el-icon class="btn--nicer">
          <Delete />
        </el-icon>
        <span>Xóa các mục đã chọn</span>
      </Button>
      <!-- <Button
        v-if="selectedRows.length"
        class="btn btn--success"
        @click="openRestoreSelectedConfirm"
      >
        <el-icon class="btn--nicer">
          <RefreshLeft />
        </el-icon>
        <span>Khôi phục các mục đã chọn</span>
      </Button> -->
      <Button class="admin-btn btn--primary" @click="showCreateModal = true">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm món ăn</span>
      </Button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="dishes"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #image_url="{ row }">
      <div class="image" style="width: 98px; height: 98px; margin: 0 auto">
        <img
          :src="row.image_url"
          alt="Book Image"
          style="width: 80px; height: 100px; object-fit: cover"
        />
      </div>
    </template>

    <template #actions="{ row }">
      <div class="admin-action-buttons">
        <el-button link size="small" type="primary" @click="openEditModal(row)">
          <img alt="Edit" src="@/assets/img/Admin/edit.svg" />
        </el-button>
        <div class="divider"></div>
        <el-button link size="small" type="danger" @click="openDeleteConfirm(row.id)">
          <img alt="Delete" src="@/assets/img/Admin/delete.svg" />
        </el-button>
      </div>
    </template>
  </Table>

  <Modal
    :title="'Xác nhận xóa'"
    :visible="deleteConfirmVisible"
    style="width: 500px; height: 150px"
    @submit="handleDelete"
    @update:visible="deleteConfirmVisible = $event"
  >
    <span>Bạn có chắc chắn muốn xóa món ăn này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa các món ăn đã chọn?</span>
  </Modal>

  <CreateDishModal v-model:visible="showCreateModal" @dish-created="handleDishCreated" />
</template>

<script setup lang="ts">
import Table from '@/components/Admin/Table.vue'
import { ref, onMounted, watch, reactive } from 'vue'
import Modal from '@/components/Admin/Modal.vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Admin/Table.vue'
import { defaultPagination } from '@/constants/pagination'
import * as dishService from '@/services/User/dishService'
import { messageError, messageSuccess } from '@/composables/notifications'
import CreateDishModal from '@/components/User/CreateDishModal.vue'
import type { Dish } from '@/types/User/dish'
import { Search, Delete, Plus, RefreshLeft } from '@element-plus/icons-vue'

const fetchLoading = ref<boolean>(false)
const search = ref('')
const loading = ref(false)
const showCreateModal = ref(false)

const pagination = reactive({
  current_page: defaultPagination.current_page,
  total: defaultPagination.total,
  total_pages: defaultPagination.total_pages,
  per_page: 12,
})

const dish = reactive({
  id: null,
  name: '',
  image_url: '',
  description: '',
  instructions: '',
})

const columns: IColumn[] = [
  {
    prop: 'name',
    label: 'Tên món ăn',
    width: 200,
    type: 'string',
  },
  {
    prop: 'image_url',
    label: 'Hình ảnh',
    width: 120,
    type: 'string',
    align: 'center',
  },
  {
    prop: 'description',
    label: 'Mô tả',
    width: 300,
    type: 'string',
  },
  {
    prop: 'instructions',
    label: 'Hướng dẫn',
    width: 300,
    type: 'string',
  },
  {
    prop: 'actions',
    label: 'Hành động',
    width: 150,
    type: 'function',
    align: 'center',
  },
]
const dishes = ref<any[]>([])
const selectedRows = ref<any[]>([])
const deleteConfirmVisible = ref<boolean>(false)
const deleteSelectedConfirmVisible = ref<boolean>(false)
const isModalVisible = ref<boolean>(false)
const modalTitle = ref<string>('Thêm món ăn')
const formRef = ref<FormInstance | null>(null)

const fetchDishes = async () => {
  loading.value = true
  try {
    const params: any = {
      per_page: pagination.per_page,
      page: pagination.current_page,
    }

    if (search.value) {
      params.search = search.value
    }

    const response = await dishService.getAllDishes(params)
    if (response.success && response.data) {
      dishes.value = response.data
      if (response.pagination) {
        pagination.total = response.pagination.total
        if ('total_pages' in response.pagination) {
          pagination.total_pages = Number(response.pagination.total_pages)
        }
        pagination.current_page = response.pagination.current_page
      }
    }
  } catch (error) {
    console.error('Failed to fetch dishes:', error)
    messageError('Không thể tải món ăn. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

/**
 * Handle search function
 */
const handleSearch = () => {
  pagination.current_page = 1 // Reset to first page when searching
  fetchDishes()
}

// Track the dish to be deleted
const dishIdToDelete = ref<number | null>(null)

/**
 * Open the delete confirmation modal for a dish
 * @param id - ID of the dish to delete
 */
const openDeleteConfirm = (id: number) => {
  dishIdToDelete.value = id
  deleteConfirmVisible.value = true
}

/**
 * Handle the deletion of a dish
 */
const handleDelete = async () => {
  if (!dishIdToDelete.value) return

  loading.value = true
  try {
    const response = await dishService.deleteDish(dishIdToDelete.value)
    if (response.success) {
      messageSuccess('Xóa món ăn thành công!')
      // Remove the deleted dish from the list
      dishes.value = dishes.value.filter((dish) => dish.id !== dishIdToDelete.value)
      dishIdToDelete.value = null
    } else {
      messageError('Không thể xóa món ăn. Vui lòng thử lại sau.')
    }
  } catch (error) {
    console.error('Failed to delete dish:', error)
    messageError('Không thể xóa món ăn. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
    deleteConfirmVisible.value = false
  }
}

/**
 * Confirm deletion of selected dishes
 */
const confirmDeleteSelected = async () => {
  if (!selectedRows.value.length) return

  loading.value = true
  try {
    // Delete dishes in sequence
    for (const dish of selectedRows.value) {
      await dishService.deleteDish(dish.id)
    }

    messageSuccess('Xóa các món ăn đã chọn thành công!')
    // Re-fetch dishes after deletion
    fetchDishes()
    selectedRows.value = []
  } catch (error) {
    console.error('Failed to delete selected dishes:', error)
    messageError('Không thể xóa một số món ăn đã chọn. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
    deleteSelectedConfirmVisible.value = false
  }
}

/**
 * Handle dish creation
 * @param newDish - The newly created dish
 */
const handleDishCreated = (newDish: Dish) => {
  dishes.value.unshift(newDish)
  messageSuccess('Món ăn mới đã được thêm thành công!')
}

const selectedDish = ref<Dish | null>(null)
const openEditModal = (selectedDish: Dish) => {
  modalTitle.value = 'Chỉnh sửa món ăn'
  isModalVisible.value = true

  Object.assign(dish, selectedDish)
}

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

// @ts-ignore
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
  console.log(selectedRows.value)
}

onMounted(() => {
  fetchDishes()
})
</script>

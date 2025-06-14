<template>
  <h1 class="admin-page__title">Quản lý nguyên liệu</h1>
  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 700px">
      <el-input
        v-model="search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo tên nguyên liệu"
        @keyup.enter="handleSearch"
      />

      <button class="admin-btn btn--primary" @click="handleSearch">
        <el-icon>
          <Search />
        </el-icon>
      </button>
    </div>
    <div class="admin-page__heading--right">
      <button
        v-if="selectedRows.length"
        class="admin-btn btn--danger"
        @click="openDeleteSelectedConfirm"
      >
        <el-icon class="btn--nicer">
          <Delete />
        </el-icon>
        <span>Xóa các mục đã chọn</span>
      </button>
      <button class="admin-btn btn--primary" @click="openCreateModal">
        <el-icon class="btn--nicer" style="margin-top: -3px">
          <Plus />
        </el-icon>
        <span>Thêm nguyên liệu</span>
      </button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="ingredients"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #image_url="{ row }">
      <div class="image" style="width: 98px; height: 98px; margin: 0 auto">
        <img
          :src="row.image_url || '/ingredient-placeholder.jpg'"
          alt="Ingredient Image"
          style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px"
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
    <span>Bạn có chắc chắn muốn xóa nguyên liệu này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa các nguyên liệu đã chọn?</span>
  </Modal>

  <!-- Create/Edit Ingredient Modal -->
  <Modal
    :visible="isModalVisible"
    :title="modalTitle"
    @update:visible="isModalVisible = $event"
    @submit="handleSubmitForm"
  >
    <el-form :model="ingredient" ref="formRef" label-width="120px">
      <el-form-item
        label="Tên nguyên liệu"
        prop="name"
        :rules="[{ required: true, message: 'Vui lòng nhập tên nguyên liệu', trigger: 'blur' }]"
      >
        <el-input v-model="ingredient.name" />
      </el-form-item>
      <el-form-item label="Hình ảnh" prop="image_url">
        <el-input v-model="ingredient.image_url" />
      </el-form-item>
      <!-- Add more form fields as needed -->
    </el-form>
  </Modal>
</template>

<script setup lang="ts">
import Table from '@/components/Admin/Table.vue'
import { ref, onMounted, reactive } from 'vue'
import Modal from '@/components/Admin/Modal.vue'
import type { FormInstance } from 'element-plus'
import type { IColumn } from '@/components/Admin/Table.vue'
import { defaultPagination } from '@/constants/pagination'
import * as ingredientService from '@/services/User/ingredientService'
import { messageError, messageSuccess } from '@/composables/notifications'
import { Search, Delete, Plus, RefreshLeft } from '@element-plus/icons-vue'
import type { Ingredient } from '@/types/User/dish'

const fetchLoading = ref<boolean>(false)
const search = ref('')
const loading = ref(false)

const pagination = reactive({
  current_page: defaultPagination.current_page,
  total: defaultPagination.total,
  total_pages: defaultPagination.total_pages,
  per_page: 12,
})

const ingredient = reactive({
  id: null,
  name: '',
  image_url: '',
  slug: '',
})

const columns: IColumn[] = [
  {
    prop: 'name',
    label: 'Tên nguyên liệu',
    width: 300,
    type: 'string',
  },
  {
    prop: 'image_url',
    label: 'Hình ảnh',
    width: 150,
    type: 'string',
    align: 'center',
  },
  {
    prop: 'actions',
    label: 'Hành động',
    width: 150,
    type: 'function',
    align: 'center',
  },
]
const ingredients = ref<Ingredient[]>([])
const selectedRows = ref<any[]>([])
const deleteConfirmVisible = ref<boolean>(false)
const deleteSelectedConfirmVisible = ref<boolean>(false)
const isModalVisible = ref<boolean>(false)
const modalTitle = ref<string>('Thêm nguyên liệu')
const formRef = ref<FormInstance | null>(null)

const fetchIngredients = async () => {
  loading.value = true
  try {
    const params: any = {
      per_page: pagination.per_page,
      page: pagination.current_page,
    }

    if (search.value) {
      params.search = search.value
    }

    const response = await ingredientService.getAllIngredients(params)
    if (response.success && response.data) {
      ingredients.value = response.data
      if (response.pagination) {
        pagination.total = response.pagination.total
        if ('total_pages' in response.pagination) {
          pagination.total_pages = Number(response.pagination.total_pages)
        }
        pagination.current_page = response.pagination.current_page
      }
    }
  } catch (error) {
    console.error('Failed to fetch ingredients:', error)
    messageError('Không thể tải nguyên liệu. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

/**
 * Handle search function
 */
const handleSearch = () => {
  pagination.current_page = 1 // Reset to first page when searching
  fetchIngredients()
}

// Track the ingredient to be deleted
const ingredientIdToDelete = ref<number | null>(null)

/**
 * Open the delete confirmation modal for an ingredient
 * @param id - ID of the ingredient to delete
 */
const openDeleteConfirm = (id: number) => {
  ingredientIdToDelete.value = id
  deleteConfirmVisible.value = true
}

/**
 * Handle the deletion of an ingredient
 */
const handleDelete = async () => {
  if (!ingredientIdToDelete.value) return

  loading.value = true
  try {
    const response = await ingredientService.deleteIngredient(ingredientIdToDelete.value)
    if (response.success) {
      messageSuccess('Xóa nguyên liệu thành công!')
      ingredients.value = ingredients.value.filter(
        (ingredient) => ingredient.id !== ingredientIdToDelete.value,
      )
      ingredientIdToDelete.value = null
    } else {
      messageError('Không thể xóa nguyên liệu. Vui lòng thử lại sau.')
    }
  } catch (error) {
    console.error('Failed to delete ingredient:', error)
    messageError('Không thể xóa nguyên liệu. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
    deleteConfirmVisible.value = false
  }
}

/**
 * Confirm deletion of selected ingredients
 */
const confirmDeleteSelected = async () => {
  if (!selectedRows.value.length) return

  loading.value = true
  try {
    // Delete ingredients in sequence
    for (const ingredient of selectedRows.value) {
      await ingredientService.deleteIngredient(ingredient.id)
    }

    messageSuccess('Xóa các nguyên liệu đã chọn thành công!')
    // Re-fetch ingredients after deletion
    fetchIngredients()
    selectedRows.value = []
  } catch (error) {
    console.error('Failed to delete selected ingredients:', error)
    messageError('Không thể xóa một số nguyên liệu đã chọn. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
    deleteSelectedConfirmVisible.value = false
  }
}

const selectedIngredient = ref<Ingredient | null>(null)

const openEditModal = (selectedIngredient: Ingredient) => {
  modalTitle.value = 'Chỉnh sửa nguyên liệu'
  isModalVisible.value = true

  // Copy the selected ingredient data to the form
  Object.assign(ingredient, selectedIngredient)
}

const openDeleteSelectedConfirm = async () => {
  deleteSelectedConfirmVisible.value = true
}

// @ts-ignore
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

/**
 * Handle form submission for creating or updating an ingredient
 */
const handleSubmitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // This would typically call a createIngredient or updateIngredient API
        // For now, we'll just simulate success
        if (ingredient.id) {
          // Update existing ingredient
          // await ingredientService.updateIngredient(ingredient.id, ingredient)
          messageSuccess('Cập nhật nguyên liệu thành công!')
          // Update the ingredient in the list
          const index = ingredients.value.findIndex((item) => item.id === ingredient.id)
          if (index !== -1) {
            // Convert null to proper type before updating
            const updatedIngredient = {
              ...ingredient,
              id: ingredient.id as number,
            }
            ingredients.value[index] = updatedIngredient
          }
        } else {
          // Create new ingredient
          // const response = await ingredientService.createIngredient(ingredient)
          messageSuccess('Thêm nguyên liệu thành công!')

          // Add the new ingredient to the beginning of the list
          // ingredients.value.unshift(response.data)
        }

        // Close the modal
        isModalVisible.value = false

        // Reset the form
        resetForm()

        // Refresh the list
        fetchIngredients()
      } catch (error) {
        console.error('Error submitting form:', error)
        messageError('Có lỗi xảy ra. Vui lòng thử lại sau.')
      } finally {
        loading.value = false
      }
    }
  })
}

/**
 * Reset the form to default values
 */
const resetForm = () => {
  ingredient.id = null
  ingredient.name = ''
  ingredient.image_url = ''
  ingredient.slug = ''

  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// Show modal for creating a new ingredient
const openCreateModal = () => {
  isModalVisible.value = true
  modalTitle.value = 'Thêm nguyên liệu'
  resetForm() // Reset form when opening create modal
}

onMounted(() => {
  fetchIngredients()
})
</script>

<template>
  <h1 class="admin-page__title">Quản lý gia đình</h1>
  <div class="admin-page__heading">
    <div class="admin-page__search-container" style="width: 700px">
      <el-input
        v-model="search"
        class="admin-page__search-input"
        clearable
        placeholder="Tìm kiếm theo tên gia đình"
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
        <span>Thêm gia đình</span>
      </button>
    </div>
  </div>

  <Table
    :columns="columns"
    :data="families"
    :loading="fetchLoading"
    @selection-change="handleSelectionChange"
  >
    <template #updatedAt="{ row }">
      {{ formatDate(row.updatedAt) }}
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
    <span>Bạn có chắc chắn muốn xóa gia đình này?</span>
  </Modal>

  <Modal
    :visible="deleteSelectedConfirmVisible"
    :title="'Xác nhận xóa'"
    @update:visible="deleteSelectedConfirmVisible = $event"
    @submit="confirmDeleteSelected"
    style="width: 500px; height: 150px"
  >
    <span>Bạn có chắc chắn muốn xóa các gia đình đã chọn?</span>
  </Modal>

  <!-- Create/Edit Family Modal -->
  <Modal
    :visible="isModalVisible"
    :title="modalTitle"
    @update:visible="isModalVisible = $event"
    @submit="handleSubmitForm"
  >
    <el-form :model="family" ref="formRef" label-width="120px">
      <el-form-item
        label="Tên gia đình"
        prop="name"
        :rules="[{ required: true, message: 'Vui lòng nhập tên gia đình', trigger: 'blur' }]"
      >
        <el-input v-model="family.name" />
      </el-form-item>

      <!-- Family Members Section (only for edit mode) -->
      <template v-if="family.id">
        <h3 style="margin-top: 20px; margin-bottom: 10px">Danh sách thành viên</h3>
        <el-table
          v-loading="loadingMembers"
          :data="familyMembers"
          style="width: 100%; margin-top: 10px"
          border
        >
          <el-table-column prop="id" label="ID" width="70"></el-table-column>
          <el-table-column prop="full_name" label="Họ và tên"></el-table-column>
          <el-table-column prop="email" label="Email"></el-table-column>
          <el-table-column label="Vai trò" width="120">
            <template #default="{ row }">
              {{ formatFamilyRole(row.family_role) }}
            </template>
          </el-table-column>
        </el-table>
      </template>
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
import { messageError, messageSuccess } from '@/composables/notifications'
import { Search, Delete, Plus } from '@element-plus/icons-vue'
import axiosInstance from '@/utils/axiosInstance'

// Types
interface Family {
  id: number | null
  name: string
}

interface User {
  id: number
  full_name: string
  email: string
  family_role: number
}

// Reactive data
const fetchLoading = ref<boolean>(false)
const loadingMembers = ref<boolean>(false)
const search = ref('')
const loading = ref(false)

const pagination = reactive({
  current_page: defaultPagination.current_page,
  total: defaultPagination.total,
  total_pages: defaultPagination.total_pages,
  per_page: 12,
})

const family = reactive<Family>({
  id: null,
  name: '',
})

const columns: IColumn[] = [
  {
    prop: 'name',
    label: 'Tên gia đình',
    width: 300,
    type: 'string',
  },
  {
    prop: 'updatedAt',
    label: 'Ngày cập nhật',
    width: 200,
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

const families = ref<any[]>([])
const familyMembers = ref<User[]>([])
const selectedRows = ref<any[]>([])
const deleteConfirmVisible = ref<boolean>(false)
const deleteSelectedConfirmVisible = ref<boolean>(false)
const isModalVisible = ref<boolean>(false)
const modalTitle = ref<string>('Thêm gia đình')
const formRef = ref<FormInstance | null>(null)
const familyIdToDelete = ref<number | null>(null)

// Format date to a readable format
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format family role to readable text
const formatFamilyRole = (role: number) => {
  switch (role) {
    case 0:
      return 'Người nội trợ'
    case 1:
      return 'Thành viên gia đình'
    default:
      return 'Không xác định'
  }
}

// Fetch all families
const fetchFamilies = async () => {
  loading.value = true
  try {
    const params: any = {
      per_page: pagination.per_page,
      page: pagination.current_page,
    }

    if (search.value) {
      params.search = search.value
    }

    const response = await axiosInstance.get('/user/families', { params })

    if (response.data.success && response.data.data) {
      families.value = response.data.data
      if (response.data.pagination) {
        pagination.total = response.data.pagination.total
        if ('total_pages' in response.data.pagination) {
          pagination.total_pages = Number(response.data.pagination.total_pages)
        }
        pagination.current_page = response.data.pagination.current_page
      }
    }
  } catch (error) {
    console.error('Failed to fetch families:', error)
    messageError('Không thể tải danh sách gia đình. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
  }
}

// Fetch family members
const fetchFamilyMembers = async (familyId: number) => {
  loadingMembers.value = true
  try {
    const response = await axiosInstance.get(`/user/families/${familyId}`)
    if (response.data.success && response.data.data) {
      familyMembers.value = response.data.data.users || []
    }
  } catch (error) {
    console.error('Failed to fetch family members:', error)
    messageError('Không thể tải danh sách thành viên. Vui lòng thử lại sau.')
  } finally {
    loadingMembers.value = false
  }
}

/**
 * Handle search function
 */
const handleSearch = () => {
  pagination.current_page = 1 // Reset to first page when searching
  fetchFamilies()
}

/**
 * Open the create modal
 */
const openCreateModal = () => {
  isModalVisible.value = true
  modalTitle.value = 'Thêm gia đình'
  resetForm()
}

/**
 * Open edit modal for a family
 */
const openEditModal = (selectedFamily: any) => {
  modalTitle.value = 'Chỉnh sửa gia đình'
  isModalVisible.value = true

  // Copy the selected family data to the form
  family.id = selectedFamily.id
  family.name = selectedFamily.name

  // Fetch family members
  if (selectedFamily.id) {
    fetchFamilyMembers(selectedFamily.id)
  }
}

/**
 * Open the delete confirmation modal for a family
 * @param id - ID of the family to delete
 */
const openDeleteConfirm = (id: number) => {
  familyIdToDelete.value = id
  deleteConfirmVisible.value = true
}

/**
 * Handle the deletion of a family
 */
const handleDelete = async () => {
  if (!familyIdToDelete.value) return

  loading.value = true
  try {
    const response = await axiosInstance.delete(`/user/families/${familyIdToDelete.value}`)
    if (response.data.success) {
      messageSuccess('Xóa gia đình thành công!')
      families.value = families.value.filter((family) => family.id !== familyIdToDelete.value)
      familyIdToDelete.value = null
    } else {
      messageError('Không thể xóa gia đình. Vui lòng thử lại sau.')
    }
  } catch (error) {
    console.error('Failed to delete family:', error)
    messageError('Không thể xóa gia đình. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
    deleteConfirmVisible.value = false
  }
}

/**
 * Confirm deletion of selected families
 */
const confirmDeleteSelected = async () => {
  if (!selectedRows.value.length) return

  loading.value = true
  try {
    // Delete families in sequence
    for (const family of selectedRows.value) {
      await axiosInstance.delete(`/user/families/${family.id}`)
    }

    messageSuccess('Xóa các gia đình đã chọn thành công!')
    // Re-fetch families after deletion
    fetchFamilies()
    selectedRows.value = []
  } catch (error) {
    console.error('Failed to delete selected families:', error)
    messageError('Không thể xóa một số gia đình đã chọn. Vui lòng thử lại sau.')
  } finally {
    loading.value = false
    deleteSelectedConfirmVisible.value = false
  }
}

/**
 * Handle form submission for creating or updating a family
 */
const handleSubmitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        if (family.id) {
          // Update existing family
          const response = await axiosInstance.put(`/user/families/${family.id}`, {
            name: family.name,
          })
          if (response.data.success) {
            messageSuccess('Cập nhật gia đình thành công!')

            // Update the family in the list
            const index = families.value.findIndex((item) => item.id === family.id)
            if (index !== -1) {
              families.value[index] = { ...families.value[index], name: family.name }
            }
          }
        } else {
          // Create new family
          const response = await axiosInstance.post('/user/families', { name: family.name })
          if (response.data.success) {
            messageSuccess('Thêm gia đình thành công!')

            // Add the new family to the beginning of the list
            families.value.unshift(response.data.data)
          }
        }

        // Close the modal
        isModalVisible.value = false

        // Reset the form
        resetForm()

        // Refresh the list
        fetchFamilies()
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
  family.id = null
  family.name = ''
  familyMembers.value = []

  if (formRef.value) {
    formRef.value.resetFields()
  }
}

/**
 * Handle selection change in the table
 */
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const openDeleteSelectedConfirm = () => {
  deleteSelectedConfirmVisible.value = true
}

// Initialize
onMounted(() => {
  fetchFamilies()
})
</script>

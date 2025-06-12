<template>
  <el-dialog
    v-model="dialogVisible"
    title="Tạo món ăn mới"
    width="70%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-form
      ref="dishFormRef"
      :model="dishForm"
      :rules="rules"
      label-position="top"
      label-width="120px"
      status-icon
      class="create-dish-form"
      v-loading="isSubmitting"
    >
      <el-row :gutter="20">
        <!-- Left column - Basic information -->
        <el-col :span="12">
          <el-form-item label="Tên món ăn" prop="name">
            <el-input v-model="dishForm.name" placeholder="Nhập tên món ăn" />
          </el-form-item>

          <el-form-item label="Mô tả" prop="description">
            <el-input
              v-model="dishForm.description"
              type="textarea"
              :rows="3"
              placeholder="Nhập mô tả món ăn (không bắt buộc)"
            />
          </el-form-item>

          <el-form-item label="Hình ảnh" prop="image_url">
            <div class="image-upload-container">
              <div
                class="image-preview"
                v-if="imagePreview"
                :style="{ backgroundImage: `url(${imagePreview})` }"
              >
                <el-button
                  type="danger"
                  circle
                  size="small"
                  icon="el-icon-delete"
                  @click="removeImage"
                  class="remove-image-btn"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
              <el-upload
                v-else
                class="image-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleImageChange"
                :accept="'image/jpeg,image/png,image/jpg,image/webp'"
              >
                <el-icon class="upload-icon"><Plus /></el-icon>
                <div class="upload-text">Tải ảnh lên</div>
              </el-upload>
              <div v-if="imageUploadError" class="image-error">{{ imageUploadError }}</div>
            </div>
          </el-form-item>

          <el-form-item label="Hướng dẫn nấu ăn" prop="instructions">
            <el-input
              v-model="dishForm.instructions"
              type="textarea"
              :rows="6"
              placeholder="Nhập hướng dẫn nấu món ăn này"
            />
          </el-form-item>
        </el-col>

        <!-- Right column - Ingredients -->
        <el-col :span="12">
          <div class="ingredients-section">
            <div class="ingredients-header">
              <h3>Nguyên liệu</h3>
              <el-button
                type="primary"
                @click="addIngredient"
                :disabled="!availableIngredients.length"
              >
                <el-icon><Plus /></el-icon>Thêm nguyên liệu
              </el-button>
            </div>

            <el-alert
              v-if="!dishForm.ingredients.length"
              title="Bạn cần thêm ít nhất một nguyên liệu cho món ăn"
              type="info"
              show-icon
            />

            <transition-group name="ingredient-list" tag="div">
              <div
                v-for="(ingredient, index) in dishForm.ingredients"
                :key="ingredient.id"
                class="ingredient-item"
              >
                <div class="ingredient-header">
                  <span>{{ getIngredientName(ingredient.id) }}</span>
                  <el-button
                    type="danger"
                    circle
                    size="small"
                    @click="removeIngredient(index)"
                    class="remove-btn"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>

                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-form-item :prop="`ingredients.${index}.quantity`" label="Số lượng">
                      <el-input-number
                        v-model="ingredient.quantity"
                        :min="1"
                        controls-position="right"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :prop="`ingredients.${index}.unit`" label="Đơn vị">
                      <el-select v-model="ingredient.unit" style="width: 100%">
                        <el-option label="gram" :value="1" />
                        <el-option label="ml" :value="2" />
                        <el-option label="cái" :value="3" />
                        <el-option label="lát" :value="4" />
                        <el-option label="thìa" :value="5" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item :prop="`ingredients.${index}.price`" label="Giá (VND)">
                      <el-input-number
                        v-model="ingredient.price"
                        :min="0"
                        :step="1000"
                        controls-position="right"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </transition-group>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" :disabled="isSubmitting">Hủy</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting"
          >Tạo món ăn</el-button
        >
      </span>
    </template>

    <!-- Ingredient selector dialog -->
    <el-dialog
      v-model="ingredientDialogVisible"
      title="Chọn nguyên liệu"
      width="50%"
      append-to-body
    >
      <el-table
        :data="availableIngredients"
        highlight-current-row
        @row-click="selectIngredient"
        style="width: 100%"
        :max-height="400"
        v-loading="loadingIngredients"
        empty-text="Không có nguyên liệu nào khả dụng"
      >
        <el-table-column label="Hình ảnh" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image_url || '/ingredient-placeholder.jpg'"
              fit="cover"
              style="width: 50px; height: 50px; border-radius: 5px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên nguyên liệu" />
      </el-table>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, defineEmits, defineProps, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import { uploadDishImage, createDish, type CreateDishData } from '@/services/User/dishService'
import { getAllIngredients } from '@/services/User/ingredientService'
import type { Ingredient } from '@/types/User/dish'
import { messageSuccess, messageError } from '@/composables/notifications'

interface DishForm {
  name: string
  description: string
  image_url: string
  instructions: string
  ingredients: {
    id: number
    quantity: number
    unit: number
    price: number
  }[]
}

interface Props {
  visible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'dish-created'])

// Form and validation
const dishFormRef = ref<FormInstance>()
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// Form state
const dishForm = reactive<DishForm>({
  name: '',
  description: '',
  image_url: '',
  instructions: '',
  ingredients: [],
})

const rules = {
  name: [
    { required: true, message: 'Vui lòng nhập tên món ăn', trigger: 'blur' },
    { min: 3, message: 'Tên món ăn phải có ít nhất 3 ký tự', trigger: 'blur' },
  ],
  //   image_url: [{ required: true, message: 'Vui lòng tải lên hình ảnh món ăn', trigger: 'change' }],
  instructions: [{ required: true, message: 'Vui lòng nhập hướng dẫn nấu ăn', trigger: 'blur' }],
  ingredients: [
    {
      type: 'array',
      required: true,
      message: 'Vui lòng thêm ít nhất một nguyên liệu',
      min: 1,
      trigger: 'change',
    },
  ],
}

// Image upload handling
const imageFile = ref<File | null>(null)
const imagePreview = ref<string>('')
const imageUploadError = ref<string>('')
const isSubmitting = ref(false)

// Ingredients
const allIngredients = ref<Ingredient[]>([])
const loadingIngredients = ref(false)
const ingredientDialogVisible = ref(false)

// Computed
const availableIngredients = computed(() => {
  const usedIds = new Set(dishForm.ingredients.map((item) => item.id))
  return allIngredients.value.filter((ingredient) => !usedIds.has(ingredient.id))
})

// Methods
const handleImageChange = (file: any) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt5M = file.raw.size / 1024 / 1024 < 5

  if (!isImage) {
    imageUploadError.value = 'Chỉ có thể tải lên file ảnh!'
    return
  }

  if (!isLt5M) {
    imageUploadError.value = 'Kích thước ảnh không được vượt quá 5MB!'
    return
  }

  imageFile.value = file.raw
  imageUploadError.value = ''
  imagePreview.value = URL.createObjectURL(file.raw)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = ''
  dishForm.image_url = ''
}

const fetchIngredients = async () => {
  loadingIngredients.value = true
  try {
    const response = await getAllIngredients({ per_page: 100 })
    if (response.success) {
      allIngredients.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch ingredients:', error)
    messageError('Không thể tải danh sách nguyên liệu')
  } finally {
    loadingIngredients.value = false
  }
}

const addIngredient = () => {
  if (availableIngredients.value.length === 0) {
    messageError('Không còn nguyên liệu nào khả dụng')
    return
  }

  ingredientDialogVisible.value = true
}

const selectIngredient = (row: Ingredient) => {
  ingredientDialogVisible.value = false
  dishForm.ingredients.push({
    id: row.id,
    quantity: 100,
    unit: 1, // Default to grams
    price: 10000, // Default price
  })
}

const removeIngredient = (index: number) => {
  dishForm.ingredients.splice(index, 1)
}

const getIngredientName = (id: number): string => {
  const ingredient = allIngredients.value.find((ing) => ing.id === id)
  return ingredient ? ingredient.name : 'Unknown'
}

const handleClose = () => {
  if (isSubmitting.value) return

  ElMessageBox.confirm('Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.', 'Xác nhận', {
    confirmButtonText: 'Hủy',
    cancelButtonText: 'Tiếp tục chỉnh sửa',
    type: 'warning',
  })
    .then(() => {
      resetForm()
      dialogVisible.value = false
    })
    .catch(() => {
      // User chose to continue editing
    })
}

const resetForm = () => {
  dishFormRef.value?.resetFields()
  dishForm.name = ''
  dishForm.description = ''
  dishForm.image_url = ''
  dishForm.instructions = ''
  dishForm.ingredients = []
  imageFile.value = null
  imagePreview.value = ''
  imageUploadError.value = ''
}

const handleSubmit = async () => {
  if (!dishFormRef.value) return

  await dishFormRef.value.validate(async (valid) => {
    if (!valid) {
      messageError('Vui lòng điền đầy đủ thông tin')
      return
    }

    isSubmitting.value = true

    try {
      // First upload the image if we have one
      if (imageFile.value && !dishForm.image_url) {
        const uploadResult = await uploadDishImage(imageFile.value)
        dishForm.image_url = uploadResult.imageUrl
      }

      // Now create the dish
      const dishData: CreateDishData = {
        name: dishForm.name,
        image_url: dishForm.image_url,
        description: dishForm.description || '',
        instructions: dishForm.instructions,
        ingredients: dishForm.ingredients,
      }

      const result = await createDish(dishData)

      if (result.success) {
        // messageSuccess('Món ăn đã được tạo thành công!')
        emit('dish-created', result.data)
        resetForm()
        dialogVisible.value = false
      }
    } catch (error: any) {
      console.error('Failed to create dish:', error)
      messageError(error?.response?.data?.message || 'Không thể tạo món ăn. Vui lòng thử lại sau.')
    } finally {
      isSubmitting.value = false
    }
  })
}

// Initialize
onMounted(() => {
  fetchIngredients()
})
</script>

<style scoped lang="scss">
.create-dish-form {
  margin-top: 20px;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .image-error {
    color: #f56c6c;
    font-size: 12px;
    margin-top: 5px;
  }
}

.image-uploader {
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #8c939d;

  &:hover {
    border-color: #409eff;
  }

  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    margin-bottom: 8px;
  }

  .upload-text {
    font-size: 14px;
    color: #8c939d;
  }
}

.image-preview {
  width: 200px;
  height: 200px;
  border-radius: 6px;
  background-size: cover;
  background-position: center;
  position: relative;

  .remove-image-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}

.ingredients-section {
  padding: 0 10px;

  .ingredients-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      margin: 0;
      font-size: 16px;
    }
  }

  .ingredient-item {
    background-color: #f5f7fa;
    border-radius: 8px;
    padding: 10px 15px;
    margin-bottom: 15px;

    .ingredient-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-weight: bold;
    }

    .remove-btn {
      margin-left: 10px;
    }
  }
}

// Animation for ingredient list
.ingredient-list-enter-active,
.ingredient-list-leave-active {
  transition: all 0.3s ease;
}

.ingredient-list-enter-from,
.ingredient-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ isEditMode ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng mới' }}</h1>
      <div>
        <el-button @click="cancel">Hủy</el-button>
        <el-button type="primary" @click="saveOrder">Lưu đơn hàng</el-button>
      </div>
    </div>

    <div class="form-container">
      <el-card class="form-card">
        <template #header>
          <span>Thông tin khách hàng</span>
        </template>
        <el-form :model="order" label-position="top">
          <el-form-item label="Tên khách hàng">
            <el-input v-model="order.customerName" placeholder="Nhập tên khách hàng"></el-input>
          </el-form-item>
          <el-form-item label="Số điện thoại">
            <el-input v-model="order.customerPhone" placeholder="Nhập số điện thoại"></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span>Sản phẩm</span>
            <el-button type="primary" plain @click="addProduct">Thêm sản phẩm</el-button>
          </div>
        </template>
        <el-table :data="order.items" style="width: 100%">
          <el-table-column prop="name" label="Tên sản phẩm"></el-table-column>
          <el-table-column label="Số lượng" width="150">
            <template #default="scope">
              <el-input-number v-model="scope.row.quantity" :min="1" size="small"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="Đơn giá" width="180">
            <template #default="scope">
              <el-input v-model="scope.row.price" placeholder="Nhập đơn giá"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="Thành tiền" width="180" align="right">
            <template #default="scope">
              <span>{{ formatCurrency(scope.row.quantity * scope.row.price) }}</span>
            </template>
          </el-table-column>
           <el-table-column width="80" align="center">
            <template #default="scope">
              <el-button type="danger" :icon="Delete" text @click="removeProduct(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="total-summary">
          <span>Tổng cộng:</span>
          <span class="total-amount">{{ formatCurrency(totalAmount) }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { addOrder } from '@/services/orderService';

const router = useRouter();
const isEditMode = computed(() => !!router.currentRoute.value.params.id);

const order = ref({
  customerName: '',
  customerPhone: '',
  items: [
    { name: 'Mì Hảo Hảo', quantity: 2, price: 3500 },
    { name: 'Trứng gà', quantity: 10, price: 2500 },
  ],
});

const totalAmount = computed(() => {
  return order.value.items.reduce((total, item) => total + (item.quantity * item.price), 0);
});

const addProduct = () => {
  order.value.items.push({ name: '', quantity: 1, price: 0 });
};

const removeProduct = (index) => {
  order.value.items.splice(index, 1);
};

const cancel = () => {
  router.push('/orders');
};

const saveOrder = async () => {
  try {
    await addOrder(order.value);
    ElMessage.success('Đã lưu đơn hàng thành công!');
    router.push('/orders');
  } catch (error) {
    ElMessage.error('Đã có lỗi xảy ra khi lưu đơn hàng.');
    console.error(error);
  }
};

const formatCurrency = (value) => {
  if (isNaN(value)) return '0đ';
  return value.toLocaleString('vi-VN') + 'đ';
};

</script>

<style scoped>
.page-container {
  padding: 24px;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title {
  font-size: 1.75rem;
  font-weight: 700;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.form-card {
  border-radius: 12px;
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.total-summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  font-size: 1.1rem;
}
.total-amount {
  font-weight: 600;
  margin-left: 16px;
  font-size: 1.25rem;
}
</style>

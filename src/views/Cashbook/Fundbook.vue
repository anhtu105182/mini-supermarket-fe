<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Sổ quỹ</h1>
      <div class="action-buttons-group">
        <el-button :icon="Download">Xuất file</el-button>
        <el-button type="primary" :icon="Plus" @click="openDrawer()">
          Thêm giao dịch
        </el-button>
      </div>
    </div>
    <div class="filter-card">
      <el-date-picker
        v-model="filters.dateRange"
        type="daterange"
        range-separator="-"
        start-placeholder="Từ ngày"
        end-placeholder="Đến ngày"
      />
      <el-select v-model="filters.type" placeholder="Loại giao dịch" clearable>
        <el-option label="Tất cả" value="all" />
        <el-option label="Phiếu thu" value="thu" />
        <el-option label="Phiếu chi" value="chi" />
      </el-select>
      <el-select v-model="filters.employee" placeholder="Nhân viên" clearable>
        <el-option label="Tất cả" value="all" />
        <el-option label="Nhân viên A" value="Nhân viên A" />
        <el-option label="Admin" value="Admin" />
      </el-select>
      <el-button type="primary" :icon="Search" @click="handleSearch"
        >Tìm kiếm</el-button
      >
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">Tồn đầu kỳ</div>
        <div class="stat-value">
          {{ formatCurrency(summary.openingBalance) }}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Tổng thu trong kỳ</div>
        <div class="stat-value income">
          {{ formatCurrency(summary.totalIncome) }}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Tổng chi trong kỳ</div>
        <div class="stat-value expense">
          {{ formatCurrency(summary.totalExpense) }}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">Tồn cuối kỳ</div>
        <div class="stat-value closing-balance">
          {{ formatCurrency(summary.closingBalance) }}
        </div>
      </div>
    </div>

    <div class="table-container">
      <el-table
        :data="pagedTransactions"
        v-loading="isLoading"
        style="width: 100%"
      >
        <el-table-column type="index" label="STT" width="60" />
        <el-table-column prop="datetime" label="Thời gian" width="160" />
        <el-table-column prop="code" label="Mã phiếu" width="120" />
        <el-table-column prop="description" label="Diễn giải" min-width="250" />
        <el-table-column label="Loại" width="120" align="center">
          <template #default="scope">
            <el-tag
              :type="scope.row.type === 'thu' ? 'success' : 'danger'"
              size="small"
              >{{
                scope.row.type === "thu" ? "Phiếu thu" : "Phiếu chi"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="Phương thức" width="140" />
        <el-table-column label="Số tiền" width="150" align="right">
          <template #default="scope">
            <span :class="scope.row.type === 'thu' ? 'income' : 'expense'">
              {{ scope.row.type === "thu" ? "+" : "-" }}
              {{ formatCurrency(scope.row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="employee" label="Người thực hiện" width="150" />
        <el-table-column label="Thao tác" width="120" align="center">
          <div class="action-buttons">
            <el-button
              size="small"
              :icon="Edit"
              circle
              @click="openDrawer(scope.row)"
            />
            <el-button
              size="small"
              :icon="Delete"
              type="danger"
              circle
              plain
              @click="handleDelete(scope.row)"
            />
          </div>
        </el-table-column>

        <template #append>
          <div class="table-footer-summary">
            <div class="summary-item">
              <span>Tổng thu:</span>
              <strong class="income">{{
                formatCurrency(summary.totalIncome)
              }}</strong>
            </div>
            <div class="summary-item">
              <span>Tổng chi:</span>
              <strong class="expense">{{
                formatCurrency(summary.totalExpense)
              }}</strong>
            </div>
            <div class="summary-item">
              <span>Chênh lệch:</span>
              <strong>{{
                formatCurrency(summary.totalIncome - summary.totalExpense)
              }}</strong>
            </div>
          </div>
        </template>
      </el-table>

      <el-empty
        v-if="!isLoading && pagedTransactions.length === 0"
        description="Không có giao dịch nào"
      />
    </div>

    <div class="pagination-container">
      <el-pagination
        v-if="filteredTransactions.length > 0"
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredTransactions.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>

    <el-drawer
      v-model="drawerVisible"
      :title="isEditMode ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'"
      direction="rtl"
      size="450px"
    >
      <el-form :model="form" label-position="top" ref="formRef">
        <el-form-item label="Loại giao dịch" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio-button label="thu">Phiếu thu</el-radio-button>
            <el-radio-button label="chi">Phiếu chi</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Số tiền" prop="amount">
          <el-input
            v-model.number="form.amount"
            type="number"
            placeholder="Nhập số tiền"
          />
        </el-form-item>
        <el-form-item label="Diễn giải" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="VD: Thu tiền hàng, Chi mua văn phòng phẩm..."
          />
        </el-form-item>
        <el-form-item label="Phương thức thanh toán" prop="paymentMethod">
          <el-select
            v-model="form.paymentMethod"
            placeholder="Chọn phương thức"
          >
            <el-option label="Tiền mặt" value="Tiền mặt" />
            <el-option label="Chuyển khoản" value="Chuyển khoản" />
            <el-option label="Thẻ" value="Thẻ" />
          </el-select>
        </el-form-item>
        <el-form-item label="Nhân viên thực hiện" prop="employee">
          <el-select v-model="form.employee" placeholder="Chọn nhân viên">
            <el-option label="Nhân viên A" value="Nhân viên A" />
            <el-option label="Admin" value="Admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handleSave">Lưu</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { Search, Plus, Download, Edit, Delete } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

const isMobile = ref(false);
const isLoading = ref(true);
const transactions = ref([]);
const currentPage = ref(1);
const pageSize = 10;
const drawerVisible = ref(false);
const isEditMode = ref(false);

const filters = reactive({
  dateRange: [new Date(), new Date()], // Mặc định hôm nay
  type: "all",
  employee: "all",
});

const form = reactive({
  id: null,
  type: "thu",
  amount: null,
  description: "",
  paymentMethod: "Tiền mặt",
  employee: "Admin",
});

const sampleTransactions = [
  {
    id: 1,
    datetime: "2025-08-08 10:30",
    code: "PT001",
    description: "Thu tiền đơn hàng DH1235",
    type: "thu",
    paymentMethod: "Tiền mặt",
    amount: 1250000,
    employee: "Nhân viên A",
  },
  {
    id: 2,
    datetime: "2025-08-08 09:15",
    code: "PC001",
    description: "Chi mua văn phòng phẩm",
    type: "chi",
    paymentMethod: "Tiền mặt",
    amount: 350000,
    employee: "Admin",
  },
  {
    id: 3,
    datetime: "2025-08-07 15:45",
    code: "PT002",
    description: "Thu tiền đơn hàng DH1234",
    type: "thu",
    paymentMethod: "Chuyển khoản",
    amount: 850000,
    employee: "Nhân viên A",
  },
];

const formatCurrency = (value) => (value || 0).toLocaleString("vi-VN") + "đ";

const filteredTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const typeMatch = filters.type === "all" || t.type === filters.type;
    const employeeMatch =
      filters.employee === "all" || t.employee === filters.employee;
    // Logic lọc theo ngày sẽ phức tạp hơn, tạm thời bỏ qua để demo
    return typeMatch && employeeMatch;
  });
});

const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredTransactions.value.slice(start, start + pageSize);
});

const summary = computed(() => {
  const openingBalance = 5000000; // Giả sử tồn đầu kỳ
  const totalIncome = filteredTransactions.value
    .filter((t) => t.type === "thu")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTransactions.value
    .filter((t) => t.type === "chi")
    .reduce((sum, t) => sum + t.amount, 0);
  const closingBalance = openingBalance + totalIncome - totalExpense;
  return { openingBalance, totalIncome, totalExpense, closingBalance };
});

const handleSearch = () => {
  ElMessage.info("Đã áp dụng bộ lọc!");
};

const openDrawer = (transaction = null) => {
  if (transaction) {
    isEditMode.value = true;
    Object.assign(form, transaction);
  } else {
    isEditMode.value = false;
    Object.assign(form, {
      id: null,
      type: "thu",
      amount: null,
      description: "",
      paymentMethod: "Tiền mặt",
      employee: "Admin",
    });
  }
  drawerVisible.value = true;
};

const handleSave = () => {
  // Thêm logic validation ở đây
  if (isEditMode.value) {
    const index = transactions.value.findIndex((t) => t.id === form.id);
    if (index !== -1) transactions.value[index] = { ...form };
  } else {
    transactions.value.unshift({
      ...form,
      id: Date.now(),
      code: (form.type === "thu" ? "PT" : "PC") + "004",
      datetime: new Date().toLocaleString("vi-VN"),
    });
  }
  ElMessage.success("Lưu giao dịch thành công!");
  drawerVisible.value = false;
};

const handleDelete = (transaction) => {
  ElMessageBox.confirm(
    `Bạn có chắc muốn xóa phiếu "${transaction.code}" không?`,
    "Xác nhận xóa",
    {
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      type: "warning",
    }
  )
    .then(() => {
      transactions.value = transactions.value.filter(
        (t) => t.id !== transaction.id
      );
      ElMessage.success("Xóa thành công");
    })
    .catch(() => {});
};

onMounted(() => {
  setTimeout(() => {
    transactions.value = sampleTransactions;
    isLoading.value = false;
  }, 500);
});
</script>

<style scoped>
/* @import "./responsive-style.css"; */
.filter-card {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
}
.stat-title {
  color: #6b7280;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}
.income {
  color: #16a34a;
}
.expense {
  color: #dc2626;
}
.closing-balance {
  color: #2563eb;
}
.table-footer-summary {
  display: flex;
  justify-content: flex-end;
  gap: 40px;
  padding: 16px 24px;
  font-size: 0.95rem;
  background-color: #f8fafc;
}
.summary-item span {
  color: #6b7280;
}
.summary-item strong {
  color: #111827;
}

/* ----- GLOBAL LAYOUT & TYPOGRAPHY ----- */
.page-container {
  padding: 16px;
  background-color: #f9fafb;
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

/* ----- CONTAINERS & BARS ----- */
.table-container {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* ----- MOBILE CARD STYLES ----- */
.mobile-card-list {
  padding: 16px;
}
.mobile-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-weight: 600;
}
.card-title {
  color: #111827;
}
.card-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}
.card-label {
  color: #6b7280;
}
.card-value {
  color: #111827;
  font-weight: 500;
  text-align: right;
}
.card-footer {
  padding: 8px 16px;
  background-color: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ----- ELEMENT PLUS CUSTOMIZATION ----- */
.page-container :deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
}
.page-container :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none !important;
  border: 1px solid #d1d5db;
}

/* ----- DESKTOP OVERRIDES ----- */
@media (min-width: 768px) {
  .page-container {
    padding: 24px 32px;
  }
  .page-title {
    font-size: 1.75rem;
  }
  .filters-bar {
    padding: 16px 20px;
  }
  .pagination-container {
    justify-content: flex-end;
  }
  .page-container :deep(.el-button--primary) {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  .page-container :deep(.el-input) {
    max-width: 400px;
  }
  .page-container :deep(.el-table th) {
    background-color: #f9fafb !important;
    color: #6b7280;
    font-weight: 600;
  }
  .page-container :deep(.el-table td.el-table__cell) {
    border-bottom: 1px solid #f3f4f6;
    padding: 14px 0;
  }
  .page-container :deep(.el-table .el-table__row:hover > td) {
    background-color: #f9fafb !important;
  }
  .page-container
    :deep(
      .el-pagination.is-background .el-pager li:not(.is-disabled).is-active
    ) {
    background-color: #2563eb;
  }
}
</style>

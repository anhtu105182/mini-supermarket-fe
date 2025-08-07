<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Danh sách khách hàng</h1>
      <el-button type="primary" :icon="Plus" @click="addCustomer">
        Thêm khách hàng
      </el-button>
    </div>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo tên, SĐT, email..."
          clearable
          :prefix-icon="Search"
          @keyup.enter="onSearch"
          @clear="onSearch"
        />
        <div v-if="!isMobile" class="advanced-filters">
          <el-button
            >Nhóm khách hàng
            <el-icon class="el-icon--right"><ArrowDown /></el-icon
          ></el-button>
          <el-button
            >Tag <el-icon class="el-icon--right"><PriceTag /></el-icon
          ></el-button>
        </div>
      </div>

      <el-table v-if="!isMobile" :data="pagedCustomers" style="width: 100%">
        <el-table-column label="Khách hàng" min-width="250">
          <template #default="scope">
            <div class="customer-info">
              <el-avatar :size="40" :src="scope.row.avatarUrl">{{
                scope.row.name.charAt(0)
              }}</el-avatar>
              <div>
                <div class="customer-name">{{ scope.row.name }}</div>
                <div class="customer-contact">{{ scope.row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" width="220" />
        <el-table-column prop="group" label="Nhóm" width="150" />
        <el-table-column
          prop="totalSpent"
          label="Tổng chi tiêu"
          width="180"
          sortable
        >
          <template #default="scope">
            <span class="total-spent">{{
              formatCurrency(scope.row.totalSpent)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="120" align="center">
          <template #default>
            <div class="action-buttons">
              <el-button size="small" :icon="Edit" circle />
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div v-for="item in pagedCustomers" :key="item.id" class="mobile-card">
          <div class="card-header customer-info">
            <el-avatar :size="40" :src="item.avatarUrl">{{
              item.name.charAt(0)
            }}</el-avatar>
            <div>
              <div class="customer-name">{{ item.name }}</div>
              <div class="customer-contact">{{ item.phone }}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Email</span>
              <span class="card-value">{{ item.email }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Nhóm</span>
              <span class="card-value">{{ item.group }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Tổng chi tiêu</span>
              <span class="card-value total-spent">{{
                formatCurrency(item.totalSpent)
              }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" :icon="Edit" text bg>Chỉnh sửa</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredCustomers.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import {
  Search,
  Plus,
  Edit,
  ArrowDown,
  PriceTag,
} from "@element-plus/icons-vue";

// --- RESPONSIVE STATE ---
const isMobile = ref(false);
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});

// --- COMPONENT LOGIC ---
const search = ref("");
const currentPage = ref(1);
const pageSize = 10;

const customers = ref([
  {
    id: 1,
    name: "Trần Văn An",
    phone: "0905123456",
    email: "an.tv@example.com",
    group: "Khách VIP",
    totalSpent: 15600000,
    avatarUrl: "",
  },
  {
    id: 2,
    name: "Nguyễn Thị Bình",
    phone: "0913654321",
    email: "binh.nt@example.com",
    group: "Khách thân thiết",
    totalSpent: 8250000,
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    id: 3,
    name: "Lê Hoàng Cường",
    phone: "0987111222",
    email: "cuong.lh@example.com",
    group: "Khách sỉ",
    totalSpent: 22000000,
    avatarUrl: "",
  },
  {
    id: 4,
    name: "Phạm Mỹ Duyên",
    phone: "0933555888",
    email: "duyen.pm@example.com",
    group: "Khách lẻ",
    totalSpent: 150000,
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
  },
  {
    id: 5,
    name: "Võ Thành Danh",
    phone: "0977999000",
    email: "danh.vt@example.com",
    group: "Khách mới",
    totalSpent: 320000,
    avatarUrl: "",
  },
  {
    id: 6,
    name: "Đỗ Ngọc Giang",
    phone: "0945121212",
    email: "giang.dn@example.com",
    group: "Khách thân thiết",
    totalSpent: 5400000,
    avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
  },
]);

const formatCurrency = (value) =>
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const filteredCustomers = computed(() => {
  if (!search.value) return customers.value;
  const searchTerm = search.value.toLowerCase();
  return customers.value.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.phone.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm)
  );
});

const pagedCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCustomers.value.slice(start, start + pageSize);
});

const onSearch = () => {
  currentPage.value = 1;
};
const addCustomer = () => {};
</script>

<style scoped>
/* @import "./responsive-style.css"; Nhớ import file CSS chung */

.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.customer-name {
  font-weight: 600;
  color: #111827;
}
.customer-contact {
  font-size: 0.85rem;
  color: #6b7280;
}
.total-spent {
  font-weight: 500;
  color: #166534; /* Green for money */
}

/* Thêm style cho card-value của mobile */
.mobile-card .card-value.total-spent {
  font-size: 1rem;
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

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Khuyến mại</h1>
      <el-button type="primary" :icon="Plus" @click="createDiscount">
        Tạo khuyến mại
      </el-button>
    </div>

    <el-tabs v-model="activeTab" class="order-tabs">
      <el-tab-pane label="Tất cả" name="all"></el-tab-pane>
      <el-tab-pane label="Đang diễn ra" name="active"></el-tab-pane>
      <el-tab-pane label="Sắp diễn ra" name="scheduled"></el-tab-pane>
      <el-tab-pane label="Đã kết thúc" name="expired"></el-tab-pane>
    </el-tabs>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo tên hoặc mã khuyến mại..."
          clearable
          :prefix-icon="Search"
        />
      </div>

      <el-table
        v-if="!isMobile"
        :data="pagedDiscounts"
        v-loading="isLoading"
        style="width: 100%"
      >
        <el-table-column label="Tên chương trình" min-width="300">
          <template #default="scope">
            <div class="discount-info">
              <div class="discount-name">{{ scope.row.name }}</div>
              <div class="discount-code">
                Mã: <strong>{{ scope.row.code }}</strong>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Thời gian hiệu lực" width="250">
          <template #default="scope">
            <span>{{ scope.row.startDate }} - {{ scope.row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="usageCount"
          label="Lượt sử dụng"
          width="150"
          align="center"
        />
        <el-table-column label="Trạng thái" width="150" align="center">
          <template #default="scope"
            ><el-tag
              :type="getStatusType(scope.row.status)"
              effect="light"
              size="small"
              >{{ scope.row.status }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column label="Thao tác" width="120" align="center">
          <div class="action-buttons">
            <el-button size="small" :icon="Edit" text bg>Sửa</el-button>
          </div>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list"></div>

      <el-empty
        v-if="!isLoading && pagedDiscounts.length === 0"
        description="Không có khuyến mại nào phù hợp"
      />
    </div>

    <div class="pagination-container">
      <el-pagination
        v-if="filteredDiscounts.length > 0"
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredDiscounts.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Search, Plus, Edit } from "@element-plus/icons-vue";

// --- STATE ---
const isMobile = ref(false);
const isLoading = ref(true);
const search = ref("");
const activeTab = ref("all");
const currentPage = ref(1);
const pageSize = 10;
const discounts = ref([]);

// --- DỮ LIỆU MẪU ---
const sampleDiscounts = [
  {
    name: "Giảm 20% tổng đơn hàng",
    code: "SALE20",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    usageCount: 152,
    status: "Đang diễn ra",
  },
  {
    name: "Freeship cho đơn từ 500k",
    code: "FREESHIP500",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    usageCount: 89,
    status: "Đang diễn ra",
  },
  {
    name: "Lễ Quốc Khánh - Giảm 50k",
    code: " mung2thang9",
    startDate: "2025-09-01",
    endDate: "2025-09-02",
    usageCount: 0,
    status: "Sắp diễn ra",
  },
  {
    name: "Chào hè - Giảm 15%",
    code: "SUMMER15",
    startDate: "2025-06-01",
    endDate: "2025-07-31",
    usageCount: 340,
    status: "Đã kết thúc",
  },
  {
    name: "Giảm 100k cho khách hàng VIP",
    code: "VIP100K",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    usageCount: 25,
    status: "Đang diễn ra",
  },
  {
    name: "Giảm 20% tổng đơn hàng",
    code: "SALE20",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    usageCount: 152,
    status: "Đang diễn ra",
  },
  {
    name: "Freeship cho đơn từ 500k",
    code: "FREESHIP500",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    usageCount: 89,
    status: "Đang diễn ra",
  },
  {
    name: "Lễ Quốc Khánh - Giảm 50k",
    code: " mung2thang9",
    startDate: "2025-09-01",
    endDate: "2025-09-02",
    usageCount: 0,
    status: "Sắp diễn ra",
  },
  {
    name: "Chào hè - Giảm 15%",
    code: "SUMMER15",
    startDate: "2025-06-01",
    endDate: "2025-07-31",
    usageCount: 340,
    status: "Đã kết thúc",
  },
  {
    name: "Giảm 100k cho khách hàng VIP",
    code: "VIP100K",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    usageCount: 25,
    status: "Đang diễn ra",
  },
];

// --- LOGIC ---
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};
const getStatusType = (status) => {
  if (status === "Đang diễn ra") return "success";
  if (status === "Sắp diễn ra") return "warning";
  if (status === "Đã kết thúc") return "info";
  return "";
};

// === SỬA ĐỔI: Thêm hàm chuyển đổi từ tab name sang status text ===
const getStatusFromTab = (tabName) => {
  const statusMap = {
    active: "Đang diễn ra",
    scheduled: "Sắp diễn ra",
    expired: "Đã kết thúc",
  };
  return statusMap[tabName];
};
// =============================================================

const filteredDiscounts = computed(() => {
  return discounts.value.filter((item) => {
    // Lọc theo ô tìm kiếm
    const searchMatch = search.value
      ? item.name.toLowerCase().includes(search.value.toLowerCase()) ||
        item.code.toLowerCase().includes(search.value.toLowerCase())
      : true;

    // === SỬA ĐỔI: Sửa lại logic lọc theo tab cho chính xác ===
    const tabMatch =
      activeTab.value === "all"
        ? true
        : item.status === getStatusFromTab(activeTab.value);
    // ====================================================

    return searchMatch && tabMatch;
  });
});

const pagedDiscounts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredDiscounts.value.slice(start, start + pageSize);
});

const createDiscount = () => {};

// === SỬA ĐỔI: Theo dõi TẤT CẢ các bộ lọc để reset trang về 1 ===
watch([activeTab, search], () => {
  currentPage.value = 1;
});
// =============================================================

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  setTimeout(() => {
    discounts.value = sampleDiscounts;
    isLoading.value = false;
  }, 500);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
/* @import "./responsive-style.css"; */
.filters-bar {
  justify-content: space-between;
}
.order-tabs {
  margin-bottom: 1px;
}
.order-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e5e7eb;
  border-bottom: none;
}
.table-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.discount-info {
}
.discount-name {
  font-weight: 600;
  color: #111827;
}
.discount-code {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 2px;
}
.orders-empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}
.orders-empty-desc {
  font-size: 0.9rem;
  color: #6b7280;
  max-width: 400px;
  margin-top: 8px;
  margin-bottom: 20px;
  line-height: 1.5;
}

@media (max-width: 767px) {
  .order-tabs :deep(.el-tabs__header) {
    padding: 0;
  }
  .order-tabs :deep(.el-tabs__nav) {
    width: 100%;
    display: flex;
  }
  .order-tabs :deep(.el-tabs__item) {
    flex: 1;
    text-align: center;
    padding: 0 5px;
  }
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

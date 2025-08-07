<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Danh sách sản phẩm</h1>
      <div class="action-buttons-group">
        <el-button v-if="!isMobile" :icon="Download">Xuất file</el-button>
        <el-button v-if="!isMobile" :icon="Upload">Nhập file</el-button>
        <el-button type="primary" :icon="Plus" @click="addProduct">
          Thêm sản phẩm
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="product-tabs">
      <el-tab-pane label="Tất cả" name="all"></el-tab-pane>
      <el-tab-pane label="Hoạt động" name="active"></el-tab-pane>
      <el-tab-pane label="Ngừng hoạt động" name="inactive"></el-tab-pane>
      <el-tab-pane label="Hết hàng" name="outofstock"></el-tab-pane>
    </el-tabs>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="searchQuery"
          placeholder="Tìm theo mã, tên sản phẩm..."
          clearable
          :prefix-icon="Search"
        />
        <div v-if="!isMobile" class="advanced-filters">
          <el-button
            >Loại sản phẩm
            <el-icon class="el-icon--right"><ArrowDown /></el-icon
          ></el-button>
          <el-button
            >Bộ lọc khác <el-icon class="el-icon--right"><Filter /></el-icon
          ></el-button>
        </div>
      </div>

      <el-table v-if="!isMobile" :data="pagedProducts" style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column label="Sản phẩm" min-width="300">
          <template #default="scope">
            <div class="product-info">
              <el-image class="product-image" :src="scope.row.imageUrl" lazy />
              <span class="product-name">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="140">
          <template #default="scope">
            <el-tag
              :type="scope.row.isActive ? 'success' : 'info'"
              size="small"
              >{{
                scope.row.isActive ? "Đang hoạt động" : "Ngừng hoạt động"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="stock"
          label="Tồn kho"
          width="120"
          sortable
          align="center"
        />
        <el-table-column prop="type" label="Loại" width="180" />
        <el-table-column prop="brand" label="Nhãn hiệu" width="180" />
      </el-table>

      <div v-else class="mobile-card-list">
        <div v-for="item in pagedProducts" :key="item.id" class="mobile-card">
          <div class="card-header product-info">
            <el-image class="product-image" :src="item.imageUrl" lazy />
            <div class="card-title">{{ item.name }}</div>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Trạng thái</span>
              <span class="card-value"
                ><el-tag
                  :type="item.isActive ? 'success' : 'info'"
                  size="small"
                  >{{
                    item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"
                  }}</el-tag
                ></span
              >
            </div>
            <div class="card-row">
              <span class="card-label">Tồn kho</span>
              <span class="card-value">{{ item.stock }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Loại</span>
              <span class="card-value">{{ item.type }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Nhãn hiệu</span>
              <span class="card-value">{{ item.brand }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredProducts.length"
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
  Upload,
  Download,
  ArrowDown,
  Filter,
  Picture,
} from "@element-plus/icons-vue";
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

const searchQuery = ref("");
const activeTab = ref("all");
const currentPage = ref(1);
const pageSize = 8;
const products = ref([
  {
    id: 1,
    name: "Kem dưỡng ẩm Nivea Soft 200ml",
    imageUrl: "https://i.imgur.com/8mB3H6f.png",
    stock: 150,
    type: "Chăm sóc da mặt",
    brand: "Nivea",
    isActive: true,
  },
  {
    id: 2,
    name: "Mặt nạ ngủ Laneige",
    imageUrl: "https://i.imgur.com/sC7t1qg.png",
    stock: 88,
    type: "Chăm sóc da mặt",
    brand: "Laneige",
    isActive: true,
  },
  {
    id: 3,
    name: "Kem dưỡng V7 Toning Light",
    imageUrl: "https://i.imgur.com/L1dC6dC.png",
    stock: 0,
    type: "Chăm sóc da mặt",
    brand: "Dr.Jart+",
    isActive: false,
  },
]);
const filteredProducts = computed(() => {
  let filtered = products.value;
  if (searchQuery.value)
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  switch (activeTab.value) {
    case "active":
      return filtered.filter((p) => p.isActive);
    case "inactive":
      return filtered.filter((p) => !p.isActive);
    case "outofstock":
      return filtered.filter((p) => p.stock === 0);
    default:
      return filtered;
  }
});
const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredProducts.value.slice(start, start + pageSize);
});
const addProduct = () => {};
</script>

<style scoped>
/* @import "@/style/responsive_style.css"; */
.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.product-image {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  flex-shrink: 0;
  border: 1px solid #f3f4f6;
}
.product-name {
  font-weight: 500;
  color: #111827;
  white-space: normal;
}
/* ... Các style khác cho desktop */

/* Thêm style cho Tabs trên mobile */
.product-list-page :deep(.el-tabs__nav) {
  width: 100%;
}
.product-list-page :deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
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

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Tồn kho sản phẩm</h1>
      <div class="action-buttons-group">
        <el-button :icon="Switch">Chuyển kho</el-button>
        <el-button type="primary" :icon="Plus" @click="receiveStock"
          >Nhập kho</el-button
        >
      </div>
    </div>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo mã, tên sản phẩm..."
          clearable
          :prefix-icon="Search"
        />
        <div v-if="!isMobile" class="advanced-filters">
          <el-button
            >Vị trí kho <el-icon class="el-icon--right"><ArrowDown /></el-icon
          ></el-button>
          <el-button
            >Trạng thái <el-icon class="el-icon--right"><ArrowDown /></el-icon
          ></el-button>
        </div>
      </div>

      <el-table v-if="!isMobile" :data="pagedInventories" style="width: 100%">
        <el-table-column label="Sản phẩm" min-width="350">
          <template #default="scope">
            <div class="product-info">
              <el-image
                class="product-image"
                :src="scope.row.imageUrl"
                fit="cover"
              />
              <div>
                <div class="product-name">{{ scope.row.name }}</div>
                <div class="product-code">Mã SP: {{ scope.row.code }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="Vị trí kho" width="180" />
        <el-table-column
          prop="stock"
          label="Tồn kho"
          width="150"
          sortable
          align="center"
        >
          <template #default="scope">
            <span style="font-weight: 600">{{ scope.row.stock }}</span>
            <span class="product-unit"> {{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="150" align="center">
          <template #default="scope">
            <el-tag
              :type="getStockStatus(scope.row.stock).type"
              effect="light"
              size="small"
              >{{ getStockStatus(scope.row.stock).text }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="150" align="center">
          <div class="action-buttons">
            <el-button size="small" :icon="Edit" text bg>Sửa</el-button>
            <el-button size="small" :icon="View" text bg>Lịch sử</el-button>
          </div>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div
          v-for="item in pagedInventories"
          :key="item.code"
          class="mobile-card"
        >
          <div class="card-header product-info">
            <el-image class="product-image" :src="item.imageUrl" fit="cover" />
            <div>
              <span class="card-title">{{ item.name }}</span>
              <div class="product-code">Mã SP: {{ item.code }}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Tồn kho</span>
              <span class="card-value">
                <span style="font-weight: 600">{{ item.stock }}</span>
                <span class="product-unit"> {{ item.unit }}</span>
              </span>
            </div>
            <div class="card-row">
              <span class="card-label">Trạng thái</span>
              <span class="card-value"
                ><el-tag
                  :type="getStockStatus(item.stock).type"
                  effect="light"
                  size="small"
                  >{{ getStockStatus(item.stock).text }}</el-tag
                ></span
              >
            </div>
            <div class="card-row">
              <span class="card-label">Vị trí</span>
              <span class="card-value">{{ item.location }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" :icon="Edit" text bg>Sửa</el-button>
            <el-button size="small" :icon="View" text bg>Lịch sử</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredInventories.length"
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
  View,
  Switch,
  ArrowDown,
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

const search = ref("");
const currentPage = ref(1);
const pageSize = 10;
const inventories = ref([
  {
    code: "SP001",
    name: "Sữa tươi Vinamilk 1L",
    unit: "Hộp",
    stock: 120,
    location: "Kho chính",
    imageUrl: "https://i.imgur.com/8mB3H6f.png",
  },
  {
    code: "SP004",
    name: "Mì Hảo Hảo",
    unit: "Gói",
    stock: 15,
    location: "Kho 1",
    imageUrl: "https://i.imgur.com/GCRzZ3c.png",
  },
  {
    code: "SP006",
    name: "Trứng gà 10 quả",
    unit: "Vỉ",
    stock: 0,
    location: "Kho 2",
    imageUrl: "https://i.imgur.com/7g2jBGY.png",
  },
]);
const filteredInventories = computed(() => {
  if (!search.value) return inventories.value;
  return inventories.value.filter(
    (item) =>
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.code.toLowerCase().includes(search.value.toLowerCase())
  );
});
const pagedInventories = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredInventories.value.slice(start, start + pageSize);
});
const getStockStatus = (stock) => {
  if (stock === 0) return { type: "danger", text: "Hết hàng" };
  if (stock <= 20) return { type: "warning", text: "Sắp hết" };
  return { type: "success", text: "Còn hàng" };
};
const receiveStock = () => {};
</script>

<style scoped>
/* @import './responsive-stylecss'; */
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
  font-weight: 600;
  color: #111827;
}
.product-code {
  font-size: 0.8rem;
  color: #6b7280;
}
.product-unit {
  color: #6b7280;
  font-size: 0.9em;
  font-weight: 400;
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

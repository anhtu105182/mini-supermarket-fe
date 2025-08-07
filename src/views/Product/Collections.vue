<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Danh mục sản phẩm</h1>
      <el-button type="primary" :icon="Plus" @click="addCollection">
        Thêm danh mục
      </el-button>
    </div>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo mã hoặc tên danh mục..."
          clearable
          :prefix-icon="Search"
        />
      </div>

      <el-table v-if="!isMobile" :data="pagedCollections" style="width: 100%">
        <el-table-column prop="code" label="Mã danh mục" width="180" />
        <el-table-column prop="name" label="Tên danh mục" min-width="300" />
        <el-table-column
          prop="productCount"
          label="Số sản phẩm"
          width="150"
          align="center"
        />
        <el-table-column label="Thao tác" width="120" align="center">
          <div class="action-buttons">
            <el-button size="small" :icon="Edit" circle />
            <el-button size="small" type="danger" :icon="Delete" circle />
          </div>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div
          v-for="item in pagedCollections"
          :key="item.code"
          class="mobile-card"
        >
          <div class="card-header">
            <span class="card-title">{{ item.name }}</span>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Mã danh mục</span>
              <span class="card-value">{{ item.code }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Số sản phẩm</span>
              <span class="card-value">{{ item.productCount }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" :icon="Edit" circle />
            <el-button size="small" type="danger" :icon="Delete" circle />
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredCollections.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
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
const collections = ref([
  { code: "DM001", name: "Sữa, Bơ & Phô mai", productCount: 12 },
  { code: "DM002", name: "Bánh kẹo các loại", productCount: 25 },
  { code: "DM003", name: "Nước giải khát & Trà", productCount: 18 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
  { code: "DM004", name: "Mì, Cháo, Phở ăn liền", productCount: 10 },
]);
const filteredCollections = computed(() => {
  if (!search.value) return collections.value;
  return collections.value.filter(
    (item) =>
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.code.toLowerCase().includes(search.value.toLowerCase())
  );
});
const pagedCollections = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCollections.value.slice(start, start + pageSize);
});
const addCollection = () => {};
</script>

<style scoped>
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

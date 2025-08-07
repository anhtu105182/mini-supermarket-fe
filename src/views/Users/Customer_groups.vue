<template>
  <div class="customer-groups-page">
    <div class="page-header">
      <h1 class="page-title">Nhóm khách hàng</h1>
      <el-button type="primary" :icon="Plus" @click="addGroup">
        Thêm nhóm
      </el-button>
    </div>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo mã hoặc tên nhóm..."
          clearable
          :prefix-icon="Search"
          @keyup.enter="onSearch"
          @clear="onSearch"
        />
      </div>

      <el-table v-if="!isMobile" :data="pagedGroups" style="width: 100%">
        <el-table-column label="Tên nhóm" min-width="350">
          <template #default="scope">
            <div class="group-info">
              <div class="group-icon">
                <el-icon><Folder /></el-icon>
              </div>
              <div>
                <div class="group-name">{{ scope.row.name }}</div>
                <div class="group-description">{{ scope.row.description }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="Mã nhóm" width="180" />
        <el-table-column
          prop="customerCount"
          label="Số khách hàng"
          width="180"
          align="center"
        >
          <template #default="scope">
            <div class="customer-count">
              <el-icon><User /></el-icon>
              <span>{{ scope.row.customerCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="220" align="center">
          <template #default>
            <div class="action-buttons">
              <el-button size="small" :icon="View" text bg>Xem khách</el-button>
              <el-button size="small" :icon="Edit" text bg>Sửa</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div v-for="item in pagedGroups" :key="item.code" class="mobile-card">
          <div class="card-header">
            <div class="group-info">
              <div class="group-icon">
                <el-icon><Folder /></el-icon>
              </div>
              <div>
                <div class="group-name">{{ item.name }}</div>
                <div class="group-description">{{ item.description }}</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Mã nhóm</span>
              <span class="card-value">{{ item.code }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Số khách hàng</span>
              <span class="card-value customer-count">
                <el-icon><User /></el-icon>
                <span>{{ item.customerCount }}</span>
              </span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" :icon="View" text bg>Xem khách</el-button>
            <el-button size="small" :icon="Edit" text bg>Sửa</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container">
      <el-pagination
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredGroups.length"
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
  User,
  Folder,
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

const groups = ref([
  {
    code: "GR001",
    name: "Khách lẻ",
    customerCount: 120,
    description: "Khách hàng mua hàng không thường xuyên.",
  },
  {
    code: "GR002",
    name: "Khách sỉ",
    customerCount: 35,
    description: "Đối tác mua hàng số lượng lớn.",
  },
  {
    code: "GR003",
    name: "Đại lý",
    customerCount: 18,
    description: "Các đại lý phân phối sản phẩm.",
  },
  {
    code: "GR004",
    name: "Khách VIP",
    customerCount: 7,
    description: "Khách hàng có doanh số cao nhất.",
  },
  {
    code: "GR005",
    name: "Khách doanh nghiệp",
    customerCount: 10,
    description: "Khách hàng là các công ty, tổ chức.",
  },
  {
    code: "GR006",
    name: "Khách thân thiết",
    customerCount: 22,
    description: "Khách hàng quay lại mua sắm thường xuyên.",
  },
  {
    code: "GR007",
    name: "Khách mới",
    customerCount: 50,
    description: "Khách hàng phát sinh trong 30 ngày.",
  },
  {
    code: "GR008",
    name: "Khách online",
    customerCount: 15,
    description: "Khách hàng từ các kênh TMĐT.",
  },
  {
    code: "GR009",
    name: "Khách nội bộ",
    customerCount: 5,
    description: "Nhân viên và người thân.",
  },
  {
    code: "GR010",
    name: "Khách nước ngoài",
    customerCount: 2,
    description: "Khách hàng quốc tế.",
  },
]);

const filteredGroups = computed(() => {
  if (!search.value) {
    return groups.value;
  }
  const searchTerm = search.value.toLowerCase();
  return groups.value.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.code.toLowerCase().includes(searchTerm)
  );
});

const pagedGroups = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredGroups.value.slice(start, end);
});

const onSearch = () => {
  currentPage.value = 1;
};

const addGroup = () => {
  console.log("Thêm nhóm khách hàng mới");
};
</script>

<style scoped>
/* ----- STYLES CHUNG (cho cả desktop và mobile) ----- */
.customer-groups-page {
  padding: 16px; /* Giảm padding cho mobile */
  background-color: #f9fafb;
  font-family: "Inter", sans-serif;
  height: 100%;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-title {
  font-size: 1.5rem; /* Giảm font-size cho mobile */
  font-weight: 700;
  color: #111827;
}
.table-container {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.filters-bar {
  display: flex;
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}
.pagination-container {
  display: flex;
  justify-content: center; /* Căn giữa cho mobile */
  margin-top: 24px;
}
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.group-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.group-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #eff6ff;
  color: #2563eb;
  font-size: 20px;
  flex-shrink: 0;
}
.group-name {
  font-weight: 600;
  color: #111827;
}
.group-description {
  font-size: 0.85rem;
  color: #6b7280;
}
.customer-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 500;
  color: #374151;
}
.customer-count .el-icon {
  color: #9ca3af;
}

/* ----- STYLES RIÊNG CHO MOBILE CARD ----- */
.mobile-card-list {
  padding: 16px;
}
.mobile-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
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
}
.card-footer {
  padding: 8px 16px;
  background-color: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ----- ELEMENT PLUS CUSTOMIZATION ----- */
.customer-groups-page :deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
}
.customer-groups-page :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none !important;
  border: 1px solid #d1d5db;
}

/* Desktop styles */
@media (min-width: 768px) {
  .customer-groups-page {
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
  .customer-groups-page :deep(.el-button--primary) {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  .customer-groups-page :deep(.el-input) {
    max-width: 400px;
  }
  .customer-groups-page :deep(.el-table th) {
    background-color: #f9fafb !important;
    color: #6b7280;
    font-weight: 600;
  }
  .customer-groups-page :deep(.el-table td.el-table__cell) {
    border-bottom: 1px solid #f3f4f6;
    padding: 14px 0;
  }
  .customer-groups-page :deep(.el-table .el-table__row:hover > td) {
    background-color: #f9fafb !important;
  }
  .customer-groups-page
    :deep(
      .el-pagination.is-background .el-pager li:not(.is-disabled).is-active
    ) {
    background-color: #2563eb;
  }
}
</style>

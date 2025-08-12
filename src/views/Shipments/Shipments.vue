<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Vận đơn</h1>
      <div class="action-buttons-group">
        <el-button :icon="Upload" @click="importDialogVisible = true"
          >Nhập file</el-button
        >
        <el-button :icon="Download" @click="exportDialogVisible = true"
          >Xuất file</el-button
        >
        <el-button type="primary" :icon="Plus" @click="createShipment">
          Tạo vận đơn
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="order-tabs">
      <el-tab-pane label="Tất cả" name="all"></el-tab-pane>
      <el-tab-pane label="Chờ lấy hàng" name="pending"></el-tab-pane>
      <el-tab-pane label="Đang giao" name="shipping"></el-tab-pane>
      <el-tab-pane label="Giao thành công" name="delivered"></el-tab-pane>
      <el-tab-pane label="Chuyển hoàn" name="returning"></el-tab-pane>
    </el-tabs>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo mã vận đơn, mã đơn hàng..."
          clearable
          :prefix-icon="Search"
        />
        <el-select
          v-if="!isMobile"
          v-model="carrierFilter"
          placeholder="Đối tác giao hàng"
          clearable
        >
          <el-option label="GHTK" value="GHTK"></el-option>
          <el-option label="Viettel Post" value="Viettel Post"></el-option>
          <el-option label="VNPost" value="VNPost"></el-option>
        </el-select>
      </div>

      <el-table
        v-if="!isMobile"
        :data="pagedShipments"
        v-loading="isLoading"
        style="width: 100%"
      >
        <el-table-column prop="shipmentCode" label="Mã vận đơn" width="160" />
        <el-table-column prop="orderCode" label="Mã đơn hàng" width="140" />
        <el-table-column
          prop="customerName"
          label="Khách hàng"
          min-width="180"
        />
        <el-table-column prop="carrier" label="Đối tác GH" width="140" />
        <el-table-column label="Phí vận chuyển" width="150" align="right">
          <template #default="scope"
            ><span class="shipping-fee">{{
              formatCurrency(scope.row.shippingFee)
            }}</span></template
          >
        </el-table-column>
        <el-table-column label="Trạng thái" width="160" align="center">
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
            <el-button size="small" :icon="View" text bg>Xem</el-button>
          </div>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div
          v-for="item in pagedShipments"
          :key="item.shipmentCode"
          class="mobile-card"
        >
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-title">{{ item.shipmentCode }}</span>
              <span class="card-subtitle"
                >ĐH: {{ item.orderCode }} - {{ item.customerName }}</span
              >
            </div>
            <el-tag
              :type="getStatusType(item.status)"
              effect="light"
              size="small"
              >{{ item.status }}</el-tag
            >
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Đối tác GH</span>
              <span class="card-value">{{ item.carrier }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Phí vận chuyển</span>
              <span class="card-value shipping-fee">{{
                formatCurrency(item.shippingFee)
              }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" :icon="View" text bg
              >Xem chi tiết</el-button
            >
          </div>
        </div>
      </div>

      <el-empty
        v-if="!isLoading && pagedShipments.length === 0"
        description="Chưa có vận đơn nào"
      />
    </div>

    <div class="pagination-container">
      <el-pagination
        v-if="filteredShipments.length > 0"
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredShipments.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>

    <el-dialog
      v-model="exportDialogVisible"
      title="Xuất file vận đơn"
      width="500px"
      align-center
    >
      <div class="modal-body">
        <div class="modal-section">
          <div class="modal-label">Phạm vi</div>
          <el-radio-group v-model="exportScope">
            <el-radio label="current_page"
              >Trang này ({{ pagedShipments.length }} vận đơn)</el-radio
            >
            <el-radio label="all_filtered"
              >Tất cả ({{ filteredShipments.length }} vận đơn)</el-radio
            >
          </el-radio-group>
        </div>
        <div class="modal-section">
          <div class="modal-label">Định dạng file</div>
          <el-radio-group v-model="exportFormat">
            <el-radio label="excel">Excel (.xlsx)</el-radio>
            <el-radio label="csv">CSV (.csv)</el-radio>
          </el-radio-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="exportDialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="handleExport">Xuất file</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Search, Plus, View, Upload, Download } from "@element-plus/icons-vue";

const isMobile = ref(false);
const isLoading = ref(true);
const search = ref("");
const activeTab = ref("all");
const carrierFilter = ref("");
const currentPage = ref(1);
const pageSize = 10;
const shipments = ref([]);
const exportDialogVisible = ref(false);
const exportScope = ref("current_page");
const exportFormat = ref("excel");

const sampleShipments = [
  {
    shipmentCode: "GHTK819237123",
    orderCode: "DH1234",
    customerName: "Trần Văn An",
    carrier: "GHTK",
    shippingFee: 35000,
    status: "Đang giao",
  },
  {
    shipmentCode: "VTP293842344",
    orderCode: "DH1235",
    customerName: "Phạm Mỹ Duyên",
    carrier: "Viettel Post",
    shippingFee: 40000,
    status: "Giao thành công",
  },
  {
    shipmentCode: "GHTK819237124",
    orderCode: "DH1233",
    customerName: "Nguyễn Thị Bình",
    carrier: "GHTK",
    shippingFee: 25000,
    status: "Chờ lấy hàng",
  },
  {
    shipmentCode: "VNPOST2384723",
    orderCode: "DH1231",
    customerName: "Võ Thành Danh",
    carrier: "VNPost",
    shippingFee: 30000,
    status: "Chuyển hoàn",
  },
];

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};
const formatCurrency = (value) => value.toLocaleString("vi-VN") + "đ";
const getStatusType = (status) => {
  if (status === "Giao thành công") return "success";
  if (status === "Đang giao") return "primary";
  if (status === "Chờ lấy hàng") return "warning";
  if (status === "Chuyển hoàn") return "danger";
  return "info";
};

// === SỬA ĐỔI: Thêm hàm chuyển đổi từ tab name sang status text ===
const getStatusFromTab = (tabName) => {
  const statusMap = {
    pending: "Chờ lấy hàng",
    shipping: "Đang giao",
    delivered: "Giao thành công",
    returning: "Chuyển hoàn",
  };
  return statusMap[tabName];
};

const filteredShipments = computed(() => {
  return shipments.value.filter((item) => {
    // Lọc theo ô tìm kiếm
    const searchMatch = search.value
      ? item.shipmentCode.toLowerCase().includes(search.value.toLowerCase()) ||
        item.orderCode.toLowerCase().includes(search.value.toLowerCase())
      : true;

    // Lọc theo đối tác giao hàng
    const carrierMatch = carrierFilter.value
      ? item.carrier === carrierFilter.value
      : true;

    // === SỬA ĐỔI: Sửa lại logic lọc theo tab cho chính xác ===
    const tabMatch =
      activeTab.value === "all"
        ? true
        : item.status === getStatusFromTab(activeTab.value);

    return searchMatch && carrierMatch && tabMatch;
  });
});

const pagedShipments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredShipments.value.slice(start, start + pageSize);
});

const createShipment = () => {};
const handleExport = () => {
  console.log(`Xuất file: ${exportScope.value} - ${exportFormat.value}`);
  exportDialogVisible.value = false;
};

// Watcher đã đúng, giữ nguyên
watch([search, activeTab, carrierFilter], () => {
  currentPage.value = 1;
});

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  setTimeout(() => {
    shipments.value = sampleShipments;
    isLoading.value = false;
  }, 500);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
/* @import './responsive-style.css'; */
.shipping-fee {
  font-weight: 500;
}
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

/* Modal Style */
.modal-section {
  margin-bottom: 20px;
}
.modal-label {
  font-weight: 500;
  margin-bottom: 10px;
  color: #374151;
  display: block;
}
.modal-body .el-radio-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.modal-body .el-radio {
  margin-bottom: 10px;
}

/* Responsive */
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

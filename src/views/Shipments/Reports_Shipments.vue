<template>
  <div class="shipment-dashboard">
    <!-- Header + Filters -->
    <div class="shipment-header">
      <h2>Tổng quan vận chuyển</h2>
      <div class="shipment-filters">
        <div class="filter-btn">
          <span class="icon">📅</span>
          {{ selectedDate }}
          <span class="icon">▼</span>
        </div>
        <div class="filter-btn">
          {{ selectedBranch }}
          <span class="icon">▼</span>
        </div>
        <div class="filter-btn">
          {{ selectedArea }}
          <span class="icon">▼</span>
        </div>
        <button class="btn-connect">
          <span style="font-size: 1.2em; margin-right: 4px">➕</span>
          Kết nối vận chuyển
        </button>
      </div>
    </div>

    <!-- Status Cards -->
    <div class="shipment-status-cards">
      <div class="status-card" v-for="item in statusList" :key="item.label">
        <div class="status-title">{{ item.label }}</div>
        <div class="status-value">{{ item.value }}</div>
        <div class="status-cod">
          COD: <b>{{ item.cod }}</b>
        </div>
      </div>
    </div>

    <!-- Reports Section -->
    <div class="shipment-reports">
      <div class="report-card">
        <div class="report-title">Thời gian lấy hàng thành công trung bình</div>
        <div class="report-content">
          <canvas ref="pickupChartRef" class="big-chart"></canvas>
        </div>
      </div>

      <div class="report-card">
        <div class="report-title">
          Thời gian giao hàng thành công trung bình
        </div>
        <div class="report-content">
          <canvas ref="deliveryChartRef" class="big-chart"></canvas>
        </div>
      </div>

      <div class="report-card">
        <div class="report-title">Tỉ lệ giao hàng thành công</div>
        <div class="report-content">
          <canvas ref="successPieRef" class="big-chart"></canvas>
        </div>
      </div>

      <div class="report-card">
        <div class="report-title">Tỉ trọng vận đơn</div>
        <div class="report-content">
          <canvas ref="weightPieRef" class="big-chart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const selectedDate = ref("7 ngày qua (25/07 - 31/07/2025)");
const selectedBranch = ref("Tất cả chi nhánh");
const selectedArea = ref("Khu vực");

const statusList = [
  { label: "Chờ lấy hàng", value: 4, cod: "1.100.000đ" },
  { label: "Đã lấy hàng", value: 10, cod: "3.200.000đ" },
  { label: "Đang giao hàng", value: 7, cod: "2.400.000đ" },
  { label: "Chờ giao lại", value: 2, cod: "500.000đ" },
  { label: "Đang hoàn hàng", value: 1, cod: "150.000đ" },
];

const pickupChartRef = ref(null);
const deliveryChartRef = ref(null);
const successPieRef = ref(null);
const weightPieRef = ref(null);

onMounted(() => {
  new Chart(pickupChartRef.value, {
    type: "bar",
    data: {
      labels: ["CN1", "CN2", "CN3"],
      datasets: [
        {
          label: "Lấy hàng (phút)",
          data: [42, 45, 40],
          backgroundColor: ["#42a5f5", "#90caf9", "#e3f2fd"],
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  new Chart(deliveryChartRef.value, {
    type: "bar",
    data: {
      labels: ["CN1", "CN2", "CN3"],
      datasets: [
        {
          label: "Giao hàng (phút)",
          data: [58, 60, 55],
          backgroundColor: ["#66bb6a", "#a5d6a7", "#e8f5e9"],
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  new Chart(successPieRef.value, {
    type: "doughnut",
    data: {
      labels: ["Thành công", "Thất bại"],
      datasets: [
        {
          data: [93, 7],
          backgroundColor: ["#42a5f5", "#e0e0e0"],
        },
      ],
    },
    options: {
      plugins: { legend: { display: true, position: "bottom" } },
      cutout: "70%",
    },
  });

  new Chart(weightPieRef.value, {
    type: "doughnut",
    data: {
      labels: ["Nặng", "Nhẹ"],
      datasets: [
        {
          data: [90, 45],
          backgroundColor: ["#ffa726", "#ffe0b2"],
        },
      ],
    },
    options: {
      plugins: { legend: { display: true, position: "bottom" } },
      cutout: "70%",
    },
  });
});
</script>

<style scoped>
.shipment-dashboard {
  max-width: 1300px;
  margin: auto;
  padding: 24px;
  background: #f8f9fb;
}
.shipment-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
.shipment-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
}
.shipment-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.filter-btn {
  background: #fff;
  border: 1px solid #ddd;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.icon {
  color: #666;
}
.btn-connect {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: auto;
  transition: background 0.2s;
}
.btn-connect:hover {
  background: #1976d2;
}
.shipment-status-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.status-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 0 0 1px #e0e0e0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 90px;
}
.status-title {
  font-size: 0.95rem;
  color: #777;
  font-weight: 500;
}
.status-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #222;
}
.status-cod {
  font-size: 0.9rem;
  color: #888;
}
.status-cod::before {
  content: "\1F4B0 ";
  margin-right: 4px;
}
.shipment-reports {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.report-card {
  background: #fff;
  border-radius: 10px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  min-height: 240px;
}
.report-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #222;
}
.report-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
}
.big-number {
  font-size: 2rem;
  font-weight: bold;
  color: #222;
}
.no-data {
  color: #888;
  font-size: 1rem;
}
.empty-img {
  width: 80px;
  opacity: 0.5;
  margin-bottom: 6px;
}
@media (max-width: 1024px) {
  .shipment-status-cards {
    grid-template-columns: repeat(3, 1fr);
  }
  .shipment-reports {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .shipment-filters {
    flex-direction: column;
    align-items: stretch;
  }
  .btn-connect {
    margin-left: 0;
    width: 100%;
  }
  .shipment-status-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .shipment-header h2 {
    font-size: 1.4rem;
  }
  .filter-btn {
    font-size: 0.9rem;
    padding: 5px 10px;
  }
  .status-card {
    padding: 12px;
  }
  .report-card {
    padding: 12px;
    min-height: 200px;
  }
  .big-number {
    font-size: 1.6rem;
  }
}
</style>

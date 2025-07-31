<template>
  <div class="shipment-dashboard">
    <div class="shipment-header">
      <h2>Tổng quan vận chuyển</h2>
      <div class="shipment-filters">
        <select v-model="selectedDate">
          <option>7 ngày qua (25/07 - 31/07/2025)</option>
          <option>Tháng này (07/2025)</option>
          <option>Tháng trước (06/2025)</option>
        </select>
        <select v-model="selectedBranch">
          <option>Tất cả chi nhánh</option>
          <option>Chi nhánh 1</option>
          <option>Chi nhánh 2</option>
        </select>
        <select v-model="selectedArea">
          <option>Khu vực</option>
          <option>Hà Nội</option>
          <option>Hồ Chí Minh</option>
        </select>
        <button class="btn-connect">
          <span style="font-size: 1.2em; margin-right: 4px">➕</span> Kết nối
          vận chuyển
        </button>
      </div>
    </div>
    <div class="shipment-status-cards">
      <div class="status-card" v-for="item in statusList" :key="item.label">
        <div class="status-title">{{ item.label }}</div>
        <div class="status-value">{{ item.value }}</div>
        <div class="status-cod">
          COD: <b>{{ item.cod }}</b>
        </div>
      </div>
    </div>
    <div class="shipment-reports">
      <div class="report-card">
        <div class="report-title">Thời gian lấy hàng thành công trung bình</div>
        <div class="report-content">
          <canvas
            ref="pickupChartRef"
            class="big-chart"
            width="260"
            height="160"
          ></canvas>
          <div v-if="avgPickupTime" class="big-number">
            {{ avgPickupTime }} phút
          </div>
          <div v-else class="no-data">Chưa có dữ liệu báo cáo</div>
        </div>
      </div>
      <div class="report-card">
        <div class="report-title">
          Thời gian giao hàng thành công trung bình
        </div>
        <div class="report-content">
          <canvas
            ref="deliveryChartRef"
            class="big-chart"
            width="260"
            height="160"
          ></canvas>
          <div v-if="avgDeliveryTime" class="big-number">
            {{ avgDeliveryTime }} phút
          </div>
          <div v-else class="no-data">Chưa có dữ liệu báo cáo</div>
        </div>
      </div>
      <div class="report-card">
        <div class="report-title">Tỉ lệ giao hàng thành công</div>
        <div class="report-content">
          <canvas
            ref="successPieRef"
            class="big-pie"
            width="120"
            height="120"
          ></canvas>
          <div v-if="successRate !== null" class="big-number">
            {{ successRate }}%
          </div>
          <div v-else class="no-data">Chưa có dữ liệu báo cáo</div>
        </div>
      </div>
      <div class="report-card">
        <div class="report-title">Tỉ trọng vận đơn</div>
        <div class="report-content">
          <canvas
            ref="weightPieRef"
            class="big-pie"
            width="120"
            height="120"
          ></canvas>
          <div v-if="orderWeight !== null" class="big-number">
            {{ orderWeight }} kg
          </div>
          <div v-else class="no-data">Chưa có dữ liệu báo cáo</div>
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
  { label: "Chờ lấy hàng", value: 3, cod: "1.200.000đ" },
  { label: "Đã lấy hàng", value: 8, cod: "2.500.000đ" },
  { label: "Đang giao hàng", value: 5, cod: "1.800.000đ" },
  { label: "Chờ giao lại", value: 1, cod: "200.000đ" },
  { label: "Đang hoàn hàng", value: 0, cod: "0đ" },
];
const avgPickupTime = ref(45); // phút
const avgDeliveryTime = ref(60); // phút
const successRate = ref(92.5); // %
const orderWeight = ref(120); // kg

// Chart refs
const pickupChartRef = ref(null);
const deliveryChartRef = ref(null);
const successPieRef = ref(null);
const weightPieRef = ref(null);

onMounted(() => {
  // Bar chart for pickup time
  if (pickupChartRef.value) {
    new Chart(pickupChartRef.value, {
      type: "bar",
      data: {
        labels: ["CN1", "CN2", "CN3"],
        datasets: [
          {
            label: "Thời gian lấy hàng (phút)",
            data: [45, 50, 40],
            backgroundColor: ["#2196f3", "#21cbf3", "#90caf9"],
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }
  // Bar chart for delivery time
  if (deliveryChartRef.value) {
    new Chart(deliveryChartRef.value, {
      type: "bar",
      data: {
        labels: ["CN1", "CN2", "CN3"],
        datasets: [
          {
            label: "Thời gian giao hàng (phút)",
            data: [60, 55, 65],
            backgroundColor: ["#43a047", "#66bb6a", "#b2dfdb"],
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }
  // Pie chart for success rate
  if (successPieRef.value) {
    new Chart(successPieRef.value, {
      type: "doughnut",
      data: {
        labels: ["Thành công", "Thất bại"],
        datasets: [
          {
            data: [92.5, 7.5],
            backgroundColor: ["#2196f3", "#e0e0e0"],
          },
        ],
      },
      options: {
        plugins: { legend: { display: true, position: "bottom" } },
        cutout: "70%",
      },
    });
  }
  // Pie chart for order weight
  if (weightPieRef.value) {
    new Chart(weightPieRef.value, {
      type: "doughnut",
      data: {
        labels: ["Đơn nặng", "Đơn nhẹ"],
        datasets: [
          {
            data: [80, 40],
            backgroundColor: ["#ff9800", "#ffe0b2"],
          },
        ],
      },
      options: {
        plugins: { legend: { display: true, position: "bottom" } },
        cutout: "70%",
      },
    });
  }
});
</script>

<style scoped>
.shipment-dashboard {
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px 12px 32px 12px;
  background: #f7f7f9;
}
.shipment-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
}
.shipment-header h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #222;
}
.shipment-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.shipment-filters select {
  padding: 7px 16px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: #fff;
  font-size: 1rem;
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
  gap: 10px;
  margin-bottom: 18px;
}
.status-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(44, 62, 80, 0.07);
  padding: 18px 10px 12px 18px;
  text-align: left;
  min-width: 120px;
}
.status-title {
  font-size: 1.05rem;
  color: #2196f3;
  font-weight: 500;
  margin-bottom: 6px;
}
.status-value {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
}
.status-cod {
  font-size: 0.98rem;
  color: #888;
  margin-top: 2px;
}
.shipment-reports {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
.report-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(44, 62, 80, 0.07);
  padding: 18px 18px 18px 18px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.report-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 10px;
}
/* Biểu đồ và số liệu lớn, căn giữa */
.report-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}
.big-chart,
.big-pie {
  max-width: 100%;
  width: 220px;
  height: 120px;
  margin: 0 auto;
  display: block;
}
.big-pie {
  width: 120px;
  height: 120px;
}
.big-number {
  font-size: 2.1rem;
  font-weight: 700;
  color: #222;
  margin-top: 8px;
  text-align: center;
}
.no-data {
  color: #888;
  font-size: 1.1rem;
  margin-top: 8px;
}
@media (max-width: 900px) {
  .shipment-status-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .shipment-reports {
    grid-template-columns: 1fr;
  }
  .big-chart,
  .big-pie {
    width: 100% !important;
    max-width: 100% !important;
    height: 180px !important;
  }
  .report-card {
    min-height: 260px;
    padding: 14px 4px 14px 4px;
  }
  .big-number {
    font-size: 2.3rem;
  }
}
@media (max-width: 600px) {
  .shipment-dashboard {
    padding: 8px 2px 16px 2px;
  }
  .shipment-header h2 {
    font-size: 1.2rem;
  }
  .big-chart,
  .big-pie {
    height: 120px !important;
  }
  .big-number {
    font-size: 1.5rem;
  }
}
</style>

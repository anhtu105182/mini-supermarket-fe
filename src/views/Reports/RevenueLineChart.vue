<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Dữ liệu mẫu cho biểu đồ (bạn có thể thay thế bằng dữ liệu thật từ API)
const chartData = {
  labels: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
  ],
  datasets: [
    {
      label: "Doanh thu",
      backgroundColor: "#3b82f6", // Màu nền của điểm dữ liệu
      borderColor: "#3b82f6", // Màu của đường kẻ
      data: [65, 59, 80, 81, 56, 55, 40], // Dữ liệu doanh thu (triệu đồng)
      tension: 0.3, // Làm cho đường kẻ mượt hơn
    },
  ],
};

// Tùy chọn hiển thị cho biểu đồ
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Ẩn chú thích 'Doanh thu' ở trên cùng
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Thêm đơn vị 'tr' vào sau các số trên trục Y
        callback: function (value) {
          return value + "tr";
        },
      },
    },
  },
};
</script>

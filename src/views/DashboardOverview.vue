<!-- src/views/DashboardOverview.vue -->
<template>
  <div class="dashboard-overview">
    <h1>Dashboard Overview</h1>
    <div class="stats">
      <div class="stat-card">
        <h3>Total Products</h3>
        <p>{{ stats.totalProducts }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Sales</h3>
        <p>{{ formatCurrency(stats.totalSales) }}</p>
      </div>
      <div class="stat-card">
        <h3>Low Stock Items</h3>
        <p>{{ stats.lowStockItems }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { formatCurrency } from '@/utils/formatCurrency';
// import productService from '@/services/productService'; // Tạm comment để giả lập

export default {
  name: 'DashboardOverview',
  setup() {
    const stats = ref({
      totalProducts: 0,
      totalSales: 0,
      lowStockItems: 0,
    });

    const fetchStats = async () => {
      try {
        // Giả lập dữ liệu để test giao diện
        console.log('Fetching stats...');
        stats.value = {
          totalProducts: 150,
          totalSales: 5000000,
          lowStockItems: 10,
        };
        // Khi API sẵn sàng, bỏ comment dòng dưới
        // const response = await productService.getDashboardStats();
        // stats.value = response.data;
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    onMounted(() => {
      console.log('DashboardOverview mounted');
      fetchStats();
    });

    return {
      stats,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.dashboard-overview {
  max-width: 1200px;
  margin: 0 auto;
  border: 1px solid pink; /* Debug */
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 10px;
  color: #2c3e50;
}

.stat-card p {
  font-size: 1.5rem;
  color: #3498db;
}
</style>
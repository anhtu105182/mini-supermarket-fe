<!-- src/views/DashboardOverview.vue -->
<template>
  <div class="dashboard-overview">
    <h1>Dashboard Overview</h1>
    <h2>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi, nobis
      minima! Sed error reiciendis veniam eum incidunt, odio velit quisquam
      obcaecati ipsam praesentium unde magnam tempora, odit consectetur officia
      minima.
    </h2>
  </div>
</template>

<script>
export default {
  name: "DashboardOverview",
  mounted() {
    console.log("DashboardOverview component loaded");
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

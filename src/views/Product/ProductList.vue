<template>
  <div class="product-list-container">
    <div class="product-list-header">
      <h1>Danh sách sản phẩm</h1>
      <div class="filter-section">
        <div class="filter-tabs">
          <button class="filter-tab active">Tất cả</button>
          <!-- Có thể thêm các tab khác nếu cần -->
        </div>

        <div class="search-filter">
          <div class="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
              v-model="searchQuery"
            />
            <button class="search-button">
              <i class="fas fa-search"></i>
            </button>
          </div>

          <div class="advanced-filters">
            <div class="filter-group">
              <span>Kênh bán hàng →</span>
              <span>Loại sản phẩm →</span>
              <span>Tag →</span>
              <span>Bộ lọc khác</span>
            </div>
            <button class="save-filter">
              <i class="fas fa-save"></i> Lưu bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="product-table-container">
      <table class="product-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Sản phẩm</th>
            <th>Có thể bán</th>
            <th>Loại</th>
            <th>Nhãn hiệu</th>
            <th>Ngày khởi tạo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td><input type="checkbox" /></td>
            <td>{{ product.name }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.type }}</td>
            <td>{{ product.brand }}</td>
            <td>{{ product.createdDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductList",
  data() {
    return {
      searchQuery: "",
      products: [
        {
          id: 1,
          name: "Kem dưỡng da Nivea",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
        {
          id: 2,
          name: "Kem dưỡng da Laneige",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
        {
          id: 3,
          name: "Kem dưỡng da Collagen",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
        {
          id: 4,
          name: "Kem dưỡng da Bioaqua",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
        {
          id: 5,
          name: "Kem dưỡng da V7 Toning Light",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
        {
          id: 6,
          name: "Sữa rửa mặt Clinic",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
        {
          id: 7,
          name: "Sữa rửa mặt Eucerin",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
        {
          id: 8,
          name: "Sữa rửa mặt Rice milk",
          stock: 100,
          type: "",
          brand: "",
          createdDate: "27/06/2025",
        },
      ],
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((product) => {
        return product.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
    },
  },
};
</script>

<style scoped>
.product-list-container {
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.product-list-header h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.filter-section {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.filter-tabs {
  margin-bottom: 15px;
}

.filter-tab {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
}

.filter-tab.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.search-box {
  display: flex;
  margin-bottom: 10px;
}

.search-box input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.search-button {
  padding: 0 15px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.advanced-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group span {
  margin-right: 15px;
  color: #666;
  cursor: pointer;
}

.filter-group span:hover {
  color: #1890ff;
}

.save-filter {
  background: transparent;
  border: none;
  color: #1890ff;
  cursor: pointer;
}

.product-table-container {
  overflow-x: auto;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th,
.product-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.product-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.product-table tr:hover {
  background-color: #f9f9f9;
}

.product-table input[type="checkbox"] {
  cursor: pointer;
}

@media (max-width: 768px) {
  .advanced-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    margin-bottom: 10px;
  }
}
</style>

<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <div class="search-container">
      <input
        v-model="searchQuery"
        @focus="showSuggestions = true"
        @blur="onInputBlur"
        class="search-input"
        placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..."
        type="text"
      />

      <div v-if="showSuggestions" class="suggestions-box" @mousedown.prevent>
        <div class="suggestion-header">Gợi ý tìm kiếm</div>

        <div
          v-for="(item, index) in filteredSuggestions"
          :key="index"
          class="suggestion-item"
          @click="selectSuggestion(item)"
        >
          <span class="suggestion-icon">{{ item.icon }}</span>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>

    <div class="question">
      <i class="fa-solid fa-circle-question"></i>
    </div>
    <div class="Notification">
      <i class="fa-solid fa-bell"></i>
    </div>
    <div
      class="user-dropdown"
      @click="toggleDropdown"
      @blur="closeDropdown"
      tabindex="0"
    >
      <div class="user-avatar">{{ userInitials }}</div>
      <span class="user-name">{{ userDisplayName }}</span>
      <i class="fa fa-chevron-down dropdown-icon"></i>
      <div v-if="dropdownOpen" class="dropdown-menu" @mousedown.prevent>
        <div class="dropdown-item">
          <i class="fa fa-user"></i>
          Tài khoản của bạn
        </div>
        <div class="dropdown-item">
          <i class="fa fa-cube"></i>
          Thông tin gói dịch vụ
        </div>
        <div class="dropdown-item" @click="logout">
          <i class="fa fa-sign-out-alt"></i>
          Đăng xuất
        </div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item">Điều khoản dịch vụ</div>
        <div class="dropdown-item">Chính sách bảo mật</div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, computed } from "vue";

const searchQuery = ref("");
const showSuggestions = ref(false);

const suggestions = ref([
  { icon: "🔍", text: "Sản phẩm bán chạy", type: "product" },
  { icon: "📦", text: "Đơn hàng gần đây", type: "order" },
  { icon: "👤", text: "Khách hàng thân thiết", type: "customer" },
  { icon: "💰", text: "Khuyến mãi đặc biệt", type: "promotion" },
]);

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) return suggestions.value;
  return suggestions.value.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

export default {
  name: "AppHeader",
  setup() {
    const dropdownOpen = ref(false);
    const userDisplayName = "Admin TUNA Spa";
    const userInitials = computed(() => {
      // Lấy chữ cái đầu của từng từ
      return userDisplayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    });

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value;
    };
    const closeDropdown = () => {
      setTimeout(() => {
        dropdownOpen.value = false;
      }, 150);
    };
    const logout = () => {
      // Xử lý đăng xuất
      window.location.href = "/login"; /// để tạm chuyển hướng đến trang đăng nhập
      // Có thể gọi API đăng xuất ở đây
      console.log("Đăng xuất");
    };

    return {
      searchQuery,
      showSuggestions,
      filteredSuggestions,
      selectSuggestion,
      onInputBlur,
      dropdownOpen,
      toggleDropdown,
      closeDropdown,
      userDisplayName,
      userInitials,
      logout,
    };
  },
};

const selectSuggestion = (item) => {
  searchQuery.value = item.text;
  showSuggestions.value = false;
  // Có thể emit event hoặc xử lý logic tìm kiếm ở đây
  console.log("Đã chọn:", item);
};

const onInputBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>

<style scoped>
.header {
  position: fixed;
  /* top: 60px;  */
  left: 0;
  width: 100%;
  z-index: 2000; /* Đặt header thấp hơn menu */
  /* background: linear-gradient(90deg, #2c3e50 70%, #2980b9 100%); */
  background: #f5f5f5;
  color: black;
  /* padding: 18px 0px 18px px; */
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.08);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border-bottom: 2px solid #b5b5b5;
}

.sidebar {
  z-index: 2000; /* Đặt sidebar thấp hơn header */
}

/* input */
.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 150%;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #4caf50;
  box-shadow: 0 2px 10px rgba(76, 175, 80, 0.2);
}

.search-input::placeholder {
  color: #999;
}

.question {
  margin-left: 20px;

  font-size: 1.2rem;
  color: #555;
  cursor: pointer;
}
.Notification {
  margin-left: 20px;
  font-size: 1.2rem;
  color: #555;
  cursor: pointer;
}

.suggestions-box {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-header {
  padding: 10px 15px;
  font-weight: bold;
  color: #555;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.suggestion-icon {
  margin-right: 10px;
  color: #4caf50;
}

.user-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 24px;
  outline: none;
  user-select: none;
  margin-right: 20px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  background: #f5b041;
  color: #fff;
  border-radius: 50%;
  font-weight: bold;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  box-shadow: 0 2px 8px rgba(241, 196, 15, 0.12);
}

.user-name {
  font-weight: 600;
  color: #222;
  margin-right: 8px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  font-size: 0.9rem;
  color: #888;
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  min-width: 220px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.18);
  z-index: 1001;
  padding: 8px 0;
  animation: fadeIn 0.18s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 22px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #222;
  cursor: pointer;
  transition: background 0.18s;
  gap: 10px;
}

.dropdown-item:hover {
  background: #f6f6f6;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 6px 0;
}

/* Ẩn nút đăng xuất cũ */
.user-info {
  display: none;
}

@media (max-width: 900px) {
  .header {
    z-index: 1998;
  }
  .sidebar {
    z-index: 2000;
  }
  .header {
    padding: 14px 12px;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .search-container {
    max-width: 100vw;
    width: 100%;
    margin: 0;
    flex: 1 1 0;
    display: flex;
    justify-content: center;
  }
  .search-input {
    width: 100%;
    min-width: 120px;
    max-width: 350px;
    font-size: 15px;
    padding: 8px 8px;
    margin: 0 auto;
    display: block;
  }
  .user-dropdown {
    margin-left: 8px;
    margin-top: 0;
  }
  .user-name {
    max-width: 60px;
    font-size: 0.92rem;
    display: none;
  }
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.95rem;
    margin-right: 4px;
  }
  .dropdown-menu {
    min-width: 200px;
    right: 0;
    top: 110%;
  }
  .dropdown-item {
    padding: 8px 10px;
    font-size: 0.9rem;
  }
  .question,
  .Notification {
    margin-left: 15px;
    padding-right: 15px;
    font-size: 0.95rem;
  }
  .dropdown-icon {
    display: none;
  }
}

@media (max-width: 600px) {
  .header {
    padding: 14px 12px;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }
  .search-container {
    margin-bottom: 0;
    flex: 1 1 0;
    display: flex;
    justify-content: center;
  }
  .search-input {
    width: 60%;
    min-width: 80px;
    max-width: 200px;
    font-size: 0.95rem;
    padding: 7px 6px;
    margin: 0 auto;
    display: block;
  }
  .user-dropdown {
    margin-left: 12px;
    margin-top: 0;
  }
  .user-name {
    display: none;
  }
  .dropdown-menu {
    /* min-width: 200px; */
    right: 0;
    top: 110%;
    width: 120px;
  }
  .dropdown-item {
    padding: 7px 8px;
    font-size: 0.88rem;
    /* width: 10px; */
  }
  .user-avatar {
    width: 24px;
    height: 24px;
    font-size: 0.9rem;
    margin-right: 2px;
  }
  .question,
  .Notification {
    margin-left: 4px;
    font-size: 0.9rem;
  }
}
</style>

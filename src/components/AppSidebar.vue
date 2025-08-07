<template>
  <div>
    <nav
      class="sidebar"
      :class="{
        collapsed: isCollapsed && !isMobile,
        mobile: isMobile,
        open: isMobile && mobileOpen,
      }"
      v-show="!isMobile || mobileOpen"
      :style="
        isMobile && mobileOpen
          ? 'width: 100vw; min-width: 0; max-width: 100vw; left: 0;'
          : ''
      "
    >
      <div class="sidebar-logo">
        <button class="sidebar-toggle" @click="toggleSidebar">
          <i v-if="isMobile && mobileOpen" class="fa-solid fa-xmark"></i>
          <i v-else class="fa-solid fa-bars"></i>
        </button>
        <span v-if="(!isCollapsed && !isMobile) || (isMobile && mobileOpen)"
          >MiniMarket</span
        >
      </div>
      <ul class="sidebar-menu">
        <li v-for="item in menuItems" :key="item.to || item.label">
          <div v-if="item.children" class="sidebar-parent">
            <a
              href="javascript:void(0)"
              @click="handleParentClick(item)"
              :class="{ active: isParentActive(item) }"
            >
              <i class="icon" :class="item.icon"></i>
              <span
                v-if="(!isCollapsed && !isMobile) || (isMobile && mobileOpen)"
                >{{ item.label }}</span
              >
              <span
                class="submenu-arrow"
                v-if="(!isCollapsed && !isMobile) || (isMobile && mobileOpen)"
              >
                <!-- <i
                  :class="
                    isParentOpen(item)
                      ? 'fa-solid fa-chevron-down'
                      : 'fa-solid fa-chevron-right'
                  "
                ></i> -->
              </span>
            </a>
            <ul v-show="isParentOpen(item)" class="sidebar-submenu">
              <li v-for="sub in item.children" :key="sub.to">
                <router-link :to="sub.to" @click="closeMobileSidebar">
                  <span
                    v-if="
                      (!isCollapsed && !isMobile) || (isMobile && mobileOpen)
                    "
                    >{{ sub.label }}</span
                  >
                </router-link>
              </li>
            </ul>
          </div>
          <router-link v-else :to="item.to" @click="closeMobileSidebar">
            <i class="icon" :class="item.icon"></i>
            <span
              v-if="(!isCollapsed && !isMobile) || (isMobile && mobileOpen)"
              >{{ item.label }}</span
            >
          </router-link>
        </li>
      </ul>
    </nav>
    <div
      v-if="isMobile && mobileOpen"
      class="sidebar-overlay"
      @click="closeMobileSidebar"
      style="z-index: 3999"
    ></div>
    <button
      v-if="isMobile && !mobileOpen"
      class="sidebar-hamburger"
      @click="toggleSidebar"
      aria-label="Open menu"
      style="z-index: 4001"
    >
      <i class="fa-solid fa-bars"></i>
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "AppSidebar",
  setup() {
    const isCollapsed = ref(false);
    const isMobile = ref(false);
    const mobileOpen = ref(false);
    const openParent = ref(null);
    const router = useRouter();
    const route = useRoute();

    // Sử dụng Font Awesome icons
    const menuItems = [
      { to: "/dashboard", icon: "fa-solid fa-house", label: "Tổng quan" },
      {
        icon: "fa-solid fa-file-invoice",
        label: "Đơn hàng",
        children: [
          { to: "/orders", label: "Danh sách đơn hàng" },
          { to: "/draft-orders", label: "Đơn hàng nháp" },
          { to: "/order-returns", label: "Trả hàng" },
          { to: "/checkouts", label: "Đơn chưa hoàn tất" },
        ],
      },
      {
        icon: "fa-solid fa-truck",
        label: "Vận chuyển",
        children: [
          { to: "/reports-shipments", label: "Tổng quan" },
          { to: "/shipments", label: "Vận đơn" },
        ],
      },
      {
        icon: "fa-solid fa-box-archive",
        label: "Sản phẩm",
        children: [
          { to: "/products", label: "Danh sách sản phẩm" },
          { to: "/collections", label: "Danh mục sản phẩm" },
          { to: "/catalogs", label: "Bảng giá" },
        ],
      },
      {
        icon: "fa-solid fa-warehouse",
        label: "Quản lý kho",
        children: [
          { to: "/inventories", label: "Tồn kho" },
          { to: "/purchase-orders", label: "Đặt hàng nhập" },
          { to: "/receive-inventories", label: "Nhập hàng" },
          { to: "/supplier-returns", label: "Trả hàng nhập" },
          { to: "/stock-transfers", label: "Chuyển Kho" },
          { to: "/suppliers", label: "Nhà cung cấp" },
        ],
      },
      {
        icon: "fa-solid fa-users",
        label: "Khách hàng",
        children: [
          { to: "/customer-list", label: "Khách hàng" },
          { to: "/customer-groups", label: "Nhóm khách hàng" },
        ],
      },
      { to: "/discounts", icon: "fa-solid fa-tags", label: "Khuyến mại" },
      { to: "/fund", icon: "fa-solid fa-wallet", label: "Sổ quỹ" },
      {
        icon: "fa-solid fa-chart-line",
        label: "Báo cáo",
        children: [
          { to: "/reports", label: "Tổng quan báo cáo" },
          { to: "/reports-list", label: "Danh sách báo cáo" },
        ],
      },
    ];

    const isParentOpen = (item) => openParent.value === item.label;

    // Kiểm tra xem menu cha có chứa route hiện tại không
    const isParentActive = (parentItem) => {
      if (!parentItem.children) return false;
      return parentItem.children.some((child) =>
        route.path.startsWith(child.to)
      );
    };

    const handleParentClick = (item) => {
      if (openParent.value === item.label) {
        // Nếu đang mở thì đóng lại (thu submenu)
        openParent.value = null;
      } else {
        openParent.value = item.label;
        // Nếu có children và có đường dẫn đầu tiên, chuyển hướng sang đó
        if (item.children && item.children[0]?.to) {
          router.push(item.children[0].to);
          closeMobileSidebar();
        }
      }
    };

    // Tự động mở menu cha khi tải trang
    const setInitialOpenParent = () => {
      for (const item of menuItems) {
        if (isParentActive(item)) {
          openParent.value = item.label;
          break;
        }
      }
    };

    const handleResize = () => {
      if (window.innerWidth <= 900) {
        isMobile.value = true;
        isCollapsed.value = false;
      } else if (window.innerWidth <= 1200) {
        isMobile.value = false;
        isCollapsed.value = true;
      } else {
        isMobile.value = false;
        isCollapsed.value = false;
      }
      if (!isMobile.value) mobileOpen.value = false;
    };

    const toggleSidebar = () => {
      if (isMobile.value) {
        mobileOpen.value = !mobileOpen.value;
      } else {
        isCollapsed.value = !isCollapsed.value;
      }
    };

    const closeMobileSidebar = () => {
      if (isMobile.value) mobileOpen.value = false;
    };

    onMounted(() => {
      handleResize();
      setInitialOpenParent();
      window.addEventListener("resize", handleResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleResize);
    });

    return {
      isCollapsed,
      isMobile,
      mobileOpen,
      menuItems,
      toggleSidebar,
      closeMobileSidebar,
      openParent,
      isParentOpen,
      handleParentClick,
      isParentActive,
    };
  },
};
</script>

<style scoped>
/* ----- BASE STYLES ----- */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 260px; /* Tăng chiều rộng cho thoáng */
  height: 100vh;
  background: #ffffff; /* Nền trắng */
  color: #1a1a1a; /* Chữ đen */
  border-right: 1px solid #e5e7eb; /* Đường viền phải tinh tế */
  z-index: 4000;
  display: flex;
  flex-direction: column;
  font-family: "Inter", sans-serif; /* Font hiện đại */
  transition: width 0.3s ease, left 0.3s ease;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

li {
  width: 100%;
}

/* ----- LOGO & TOGGLE ----- */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 65px; /* Tăng chiều cao header */
  padding: 0 20px;
  font-size: 1.4rem; /* Tăng kích thước logo */
  font-weight: 600;
  color: #111827;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 101;
  border-bottom: 1px solid #e5e7eb;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #4b5563; /* Màu icon xám */
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}
.sidebar-toggle:hover {
  background-color: #f3f4f6;
}

/* ----- MENU ----- */
.sidebar-menu {
  flex: 1 1 auto;
  overflow-y: auto;
  /* padding: 20px 10px 20px 10px; Tăng padding trên/dưới và hai bên */
}

.sidebar-menu a {
  display: flex;
  align-items: center;
  color: #374151;
  text-decoration: none;
  font-size: 1rem; /* Tăng nhẹ font-size */
  font-weight: 500;
  padding: 14px 18px; /* Tăng padding cho item */
  border-radius: 8px; /* Bo góc nhiều hơn */
  transition: background 0.2s, color 0.2s;
  gap: 16px; /* Tăng khoảng cách icon và text */
  margin-bottom: 8px; /* Tăng khoảng cách giữa các item */
}

.sidebar-menu a:hover {
  background: #f3f4f6; /* Nền xám nhạt khi hover */
  color: #111827;
}

.icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  color: #6b7280; /* Màu icon xám */
  transition: color 0.2s;
}

a:hover .icon {
  color: #111827;
}

/* Active State */
.router-link-exact-active,
.sidebar-parent > a.active {
  background: #f3f4f6;
  color: #111827;
  font-weight: 600;
}
.router-link-exact-active .icon,
.sidebar-parent > a.active .icon {
  color: #111827;
}

/* ----- SUBMENU ----- */
.sidebar-parent > a {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  /* justify-content: space-between; */ /* XÓA DÒNG NÀY */
  justify-content: flex-start; /* Thêm dòng này */
  gap: 8px; /* Thêm khoảng cách nhỏ giữa icon và chữ */
}
.sidebar-parent > a span {
  /* flex: 1; */
  text-align: left;
}
.sidebar-submenu {
  /* padding-left: 28px;  */
  margin-top: 6px;
}
.sidebar-submenu a {
  padding-left: 40px; /* Tăng lề trái cho text submenu */
  font-size: 0.97rem;
  font-weight: 400;
  color: #4b5563;
  background: none !important;
  margin-bottom: 6px; /* Tăng khoảng cách giữa các submenu item */
}
.sidebar-submenu .router-link-exact-active {
  color: #111827;
  font-weight: 600;
}
.sidebar-submenu a:hover {
  color: #111827;
}

.submenu-arrow {
  font-size: 0.7em;
  color: #9ca3af;
  transition: transform 0.2s;
}
.submenu-arrow i {
  transition: transform 0.2s ease;
}
a.active .submenu-arrow i.fa-chevron-down {
  transform: rotate(0deg);
}

/* ----- COLLAPSED STATE ----- */
.sidebar.collapsed {
  width: 80px;
}
.sidebar.collapsed .sidebar-logo {
  justify-content: center;
  padding: 0;
}
.sidebar.collapsed .sidebar-logo span,
.sidebar.collapsed a span,
.sidebar.collapsed .submenu-arrow {
  display: none !important;
}
.sidebar.collapsed .sidebar-menu {
  /* padding: 12px 8px; */
}
.sidebar.collapsed a {
  justify-content: center;
}
.sidebar.collapsed .icon {
  font-size: 1.4rem;
  margin: 0;
}
.sidebar.collapsed .sidebar-submenu {
  display: none !important;
}

/* ----- MOBILE STATE ----- */
.sidebar-hamburger {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 4001;
  background: #ffffff;
  color: #1f2937;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(9, 30, 66, 0.2); /* Overlay tối hơn một chút */
  z-index: 3999;
}

@media (min-width: 901px) {
  .sidebar-hamburger {
    display: none !important;
  }
}

@media (max-width: 900px) {
  .sidebar {
    width: 300px;
    max-width: calc(100vw - 60px);
    left: -320px; /* Ẩn sidebar */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-right: none;
    transition: left 0.3s ease;
  }
  .sidebar.open {
    left: 0;
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

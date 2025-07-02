<template>
  <div>
    <nav
      class="sidebar"
      :class="{
        collapsed: isCollapsed && !isMobile,
        mobile: isMobile,
        open: isMobile ? mobileOpen : !isCollapsed,
      }"
      v-show="!isMobile || mobileOpen"
    >
      <div class="sidebar-logo">
        <!-- Hamburger luôn hiện khi là mobile hoặc collapsed -->
        <button class="sidebar-toggle" @click="toggleSidebar">
          <span v-if="isMobile ? !mobileOpen : isCollapsed">
            <i class="fa-solid fa-bars"></i>
          </span>
          <span v-else>✕</span>
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
              :class="{ active: isParentOpen(item) }"
            >
              <span class="icon">{{ item.icon }}</span>
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
                      ? 'fa fa-chevron-down'
                      : 'fa fa-chevron-right'
                  "
                ></i> -->
              </span>
            </a>
            <ul v-show="isParentOpen(item)" class="sidebar-submenu">
              <li v-for="sub in item.children" :key="sub.to">
                <router-link :to="sub.to" @click="closeMobileSidebar">
                  <span class="icon">{{ sub.icon }}</span>
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
            <span class="icon">{{ item.icon }}</span>
            <span
              v-if="(!isCollapsed && !isMobile) || (isMobile && mobileOpen)"
              >{{ item.label }}</span
            >
          </router-link>
        </li>
      </ul>
    </nav>
    <!-- Overlay chỉ hiện khi mobileOpen -->
    <div
      v-if="isMobile && mobileOpen"
      class="sidebar-overlay"
      @click="closeMobileSidebar"
    ></div>
    <!-- Hamburger button khi mobile và menu đang đóng -->
    <button
      v-if="isMobile && !mobileOpen"
      class="sidebar-hamburger"
      @click="toggleSidebar"
      aria-label="Open menu"
    >
      <i class="fa-solid fa-bars"></i>
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "AppSidebar",
  setup() {
    const isCollapsed = ref(false);
    const isMobile = ref(false);
    const mobileOpen = ref(false);

    // Thêm state để quản lý submenu đang mở
    const openParent = ref(null);

    // Thay đổi menuItems để có submenu cho "Sản phẩm"
    const menuItems = [
      { to: "/dashboard", icon: "🏠", label: "Tổng quan" },

      {
        icon: "🧾",
        label: "Đơn hàng",
        children: [
          { to: "/orders", icon: "", label: "Danh sách đơn hàng" },
          { to: "/draft-orders", icon: "", label: "Đơn hàng nháp" },
          { to: "/order-returns", icon: "↩", label: "Trả hàng" },
          { to: "/checkouts", icon: "", label: "Đơn chưa hoàn tất" },
        ],
      },

      {
        icon: "🚚",
        label: "Vận chuyển",
        children: [
          { to: "/reports-shipments", icon: "", label: "Tổng quan" },
          { to: "/shipments", icon: "", label: "Vận đơn" },
        ],
      },
      {
        icon: "📦",
        label: "Sản phẩm",
        children: [
          { to: "/products", icon: "", label: "Danh sách sản phẩm" },
          { to: "/collections", icon: "", label: "Danh mục sản phẩm" },
          { to: "/catalogs", icon: "", label: "Bảng giá" },
        ],
      },

      {
        icon: "🏠",
        label: "Quản lý kho",
        children: [
          { to: "/inventories", icon: "", label: "Tồn kho" },
          { to: "/purchase-orders", icon: "", label: "Đặt hàng nhập" },
          { to: "/receive-inventories", icon: "", label: "Nhập hàng" },
          { to: "/supplier-returns", icon: "", label: "Trả hàng nhập" },
          { to: "/stock-transfers", icon: "", label: "Chuyển Kho" },
          { to: "/suppliers", icon: "", label: "Nhà cung cấp" },
        ],
      },
      {
        icon: "👤",
        label: "Khách hàng",
        children: [
          { to: "/customer-list", icon: "", label: "Khách hàng" },
          { to: "/customer-groups", icon: "", label: "Nhóm khách hàng" },
        ],
      },
      { to: "/discounts", icon: "🎁", label: "Khuyến mại" },
      { to: "/fund", icon: "💰", label: "Sổ quỹ" },
      {
        icon: "📈",
        label: "Báo cáo",
        children: [
          { to: "/reports", icon: "", label: "Tổng quan báo cáo" },
          { to: "/reports-list", icon: "", label: "Danh sách báo cáo" },
        ],
      },
    ];

    const router = useRouter();

    // Xác định parent nào đang mở
    const isParentOpen = (item) => openParent.value === item.label;

    // Xử lý khi click vào parent
    const handleParentClick = (item) => {
      if (openParent.value === item.label) {
        openParent.value = null;
      } else {
        openParent.value = item.label;
        // Tự động chuyển hướng sang trang đầu tiên của submenu nếu chưa ở đó
        if (item.children && item.children[0]?.to) {
          router.push(item.children[0].to);
          closeMobileSidebar();
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
    };
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  min-width: 60px;
  height: 100vh;
  background: #19223a;
  color: #fff;
  padding: 0 0 20px 0;
  box-shadow: 2px 0 16px rgba(44, 62, 80, 0.12);
  z-index: 4000; /* Đặt sidebar cao hơn header */
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  transition: width 0.2s;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar.mobile {
  width: 0;
  min-width: 0;
  overflow: hidden;
  transition: width 0.2s;
}

.sidebar.mobile.open {
  width: 220px;
  min-width: 60px;
  box-shadow: 2px 0 16px rgba(44, 62, 80, 0.22);
  overflow: visible;
}

.sidebar-logo {
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #fff;
  padding: 13px 0 18px 18px;
  margin-bottom: 8px;
  background: #19223a;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 101;
  border-bottom: 1px solid #eaf0f5;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 8px;
  outline: none;
  display: flex;
  align-items: center;
  min-width: 40px;
  min-height: 40px;
  padding: 8px;
  justify-content: center;
}

.sidebar-menu {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  width: 100%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

li {
  width: 100%;
  margin-bottom: 2px;
}

.router-link-exact-active,
.router-link-active {
  background: #2c3e50 !important;
  color: #fff !important;
}

.router-link-exact-active .icon,
.router-link-active .icon {
  color: #fff;
}

a {
  display: flex;
  align-items: center;
  color: #bfc9da;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 12px 18px;
  transition: background 0.2s, color 0.2s;
  gap: 12px;
  /* border-radius: 0 20px 20px 0; */
}

a:hover {
  background: #22305a;
  color: #fff;
}

.icon {
  font-size: 1.25rem;
  min-width: 22px;
  text-align: center;
  color: #bfc9da;
}

.sidebar.collapsed .icon {
  margin: 0 auto;
}

.sidebar.collapsed .sidebar-logo span:not(.sidebar-toggle span),
.sidebar.collapsed a span:not(.icon),
.sidebar.mobile:not(.open) a span:not(.icon),
.sidebar.mobile:not(.open) .sidebar-logo span:not(.sidebar-toggle span) {
  display: none !important;
}

::-webkit-scrollbar {
  width: 6px;
  background: #22305a;
}
::-webkit-scrollbar-thumb {
  background: #2c3e50;
  border-radius: 4px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(30, 34, 50, 0.35);
  z-index: 199;
  transition: opacity 0.2s;
}

.sidebar-hamburger {
  position: fixed;
  top: 10px;
  /* left: 16px; */
  z-index: 4000; /* Đặt sidebar cao hơn header */
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 6px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  /* box-shadow: 0 2px 8px rgba(44, 62, 80, 0.12); */
}
@media (min-width: 901px) {
  .sidebar-hamburger {
    display: none !important;
    z-index: 4000; /* Đặt sidebar cao hơn header */
  }
}

/* Responsive */
@media (max-width: 900px) {
  .sidebar {
    width: 0;
    min-width: 0;
    overflow: hidden;
    transition: width 0.2s;
    z-index: 4000; /* Đặt sidebar cao hơn header */
  }
  .sidebar.open {
    width: 220px;
    min-width: 60px;
    box-shadow: 2px 0 16px rgba(44, 62, 80, 0.22);
    overflow: visible;
  }
  .sidebar-logo span:not(.sidebar-toggle span) {
    display: none !important;
  }
  /* Sửa lại: chỉ ẩn label khi menu đóng, khi open thì hiện */
  .sidebar:not(.open) .sidebar-logo span:not(.sidebar-toggle span) {
    display: none !important;
  }
  .sidebar:not(.open) a span:not(.icon) {
    display: none !important;
  }
  /* Khi open thì label vẫn hiện */
  .sidebar.open .sidebar-logo span:not(.sidebar-toggle span),
  .sidebar.open a span:not(.icon) {
    display: inline !important;
  }
}

@media (max-width: 600px) {
  .sidebar.open {
    width: 180px;
    min-width: 0;
    z-index: 4000; /* Đặt sidebar cao hơn header */
  }
}

.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
  margin-top: 80px; /* Để tránh header overlap */
}

.content {
  flex: 1;
  padding: 20px;
  margin-left: 250px; /* Để tránh sidebar overlap, đúng với sidebar rộng 250px */
  transition: margin-left 0.2s;
}

/* Khi sidebar collapsed */
@media (min-width: 901px) {
  .sidebar.collapsed ~ .content {
    margin-left: 70px !important;
  }
}

/* Khi sidebar mobile (ẩn hoặc thu nhỏ) */
@media (max-width: 900px) {
  .content {
    margin-left: 0 !important;
  }
}

.sidebar-submenu {
  background: #202a48;
  padding-left: 0;
  margin: 0;
  list-style: none;
}
.sidebar-submenu li {
  margin-bottom: 0;
}
.sidebar-submenu a {
  padding-left: 38px;
  font-size: 0.88rem;
  background: none;
}
.sidebar-parent > a {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.submenu-arrow {
  margin-left: auto;
  font-size: 0.8em;
  color: #bfc9da;
  min-width: 18px;
  text-align: right;
}
</style>

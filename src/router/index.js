import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import DashboardOverview from "@/views/DashboardOverview.vue";
import AppLayout from "@/layouts/AppLayout.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";
import ProductList from "@/views/Product/ProductList.vue";
const routes = [
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: { name: "DashboardOverview" },
      },
      {
        path: "dashboard",
        name: "DashboardOverview",
        component: DashboardOverview,
      },
      {
        path: "products",
        name: "ProductCollections",
        component: ProductList,
      },

      // Thêm các route con khác nếu cần
    ],
  },
  {
    path: "/login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "Login",
        component: LoginPage,
      },
    ],
  },
  {
    path: "/register",
    component: AuthLayout,
    children: [
      {
        path: "",
        component: RegisterPage,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

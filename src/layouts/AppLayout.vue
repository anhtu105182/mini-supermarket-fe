<!-- src/layouts/AppLayout.vue -->
<template>
  <div class="app-layout">
    <AppHeader />
    <div class="main-content">
      <AppSidebar />
      <div class="content">
        <!-- Nội dung của Dashboard sẽ được render ở đây -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar.vue";
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "AppLayout",
  components: {
    AppSidebar,
    AppHeader,
  },
};
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>

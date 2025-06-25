<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <div class="logo">MiniMarkit</div>
    <div class="user-info">
      <span>Xin chào, TUNA {{ userName }}</span>
      <button @click="logout">Đăng xuất</button>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  // setup() {
  //   const { user, logout } = useAuth();

  //   return {
  //     userName: user.name || 'User',
  //     logout,
  //   };
  // },
};
console.log("AppHeader component loaded");
</script>

<style scoped>
.user-info button {
  background: linear-gradient(90deg, #e74c3c 60%, #ff7675 100%);
  color: #fff;
  border: none;
  padding: 8px 22px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(231, 76, 60, 0.12);
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  outline: none;
  letter-spacing: 0.5px;
  margin-left: 8px;
}

.user-info button:hover {
  background: linear-gradient(90deg, #c0392b 60%, #fd5e53 100%);
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.22);
}
.header {
  position: relative;
  background: linear-gradient(90deg, #2c3e50 70%, #2980b9 100%);
  color: white;
  padding: 25px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(44, 62, 80, 0.08);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.logo {
  font-size: 1.7rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #fff;
  text-shadow: 1px 2px 8px rgba(44, 62, 80, 0.12);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 1.05rem;
}

button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 7px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.08);
}

button:hover {
  background: #c0392b;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.16);
}
</style>

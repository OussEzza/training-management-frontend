<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand text-light" to="/">Navbar</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/' }"
              aria-current="page"
              to="/"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/trainings' }"
              to="/trainings"
              >Training</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/agents' }"
              to="/agents"
              >Agent</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/agent-training' }"
              to="/agent-training"
              >AssignAgentToTraining</router-link
            >
          </li>
          <li class="nav-item">
            <button @click="logout" class="btn btn-outline-light">
              Logout
            </button>
          </li>
        </ul>
        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-light" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  methods: {
    async logout() {
      try {
        await axios.post("http://127.0.0.1:8000/api/logout", null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Remove the token from local storage
        localStorage.removeItem("token");
        // Optionally, you can also remove user data if stored
        localStorage.removeItem("user");
        this.$router.push("/login");
        console.log("logout completed");
      } catch (error) {
        console.error("Logout error:", error.response.data);
      }
    },
  },
};
</script>

<style>
.navbar-nav .btn-logout {
  margin-left: 10px;
}
</style>

<!-- <style>
/* Add custom styles for the active link */
.nav-link.active {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.form-control:focus {
  border-color: #fff;
  box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.25);
}
</style> -->

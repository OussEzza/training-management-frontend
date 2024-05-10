<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <!-- <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #45d62e;"> -->
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
              >Assign Agent</router-link
            >
          </li>
          <li class="nav-item">
          </li>
        </ul>       
          <button type="button" @click="logout" class="btn btn-danger">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              ></path>
              <path
                fill-rule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
              ></path>
            </svg>
            Logout
          </button>
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

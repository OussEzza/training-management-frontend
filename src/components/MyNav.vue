<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <!-- Navbar content -->
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

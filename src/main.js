import { createApp } from "vue";
import App from "./App.vue";
import Index from "./components/TrainingView.vue";
import Edit from "./components/EditTraining.vue";
import Login from "./components/AuthView.vue";
import DashBoard from "./components/DashBoard.vue";
import IndexAgent from "./components/AgentView.vue";
import ViewAssigned from "./components/ViewAssigned.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "Login",
    path: "/login",
    component: Login,
  },
  {
    name: "DashBoard",
    path: "/",
    component: DashBoard,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    name: "Index",
    path: "/trainings",
    component: Index,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    name: "Edit",
    path: "/trainings/edit/:id",
    component: Edit,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    name: "ViewAssigned",
    path: "/trainings/view/:id",
    component: ViewAssigned,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    name: "IndexAgent",
    path: "/agents",
    component: IndexAgent,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check if route requires authentication
    if (!isAuthenticated) {
      // User is not authenticated, redirect to login page
      next({ name: "Login" });
    } else {
      // User is authenticated, proceed to the route
      next();
    }
  } else {
    // If the route doesn't require authentication, proceed as normal
    next();
  }
});

createApp(App).use(router).mount("#app");

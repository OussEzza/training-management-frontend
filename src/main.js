import { createApp } from "vue";
import App from "./App.vue";
import Index from "./components/TrainingView.vue";
import Register from "./components/RegisterView.vue";
import Login from "./components/AuthView.vue";
import DashBoard from "./components/DashBoard.vue";
import IndexAgent from "./components/AgentView.vue";
import ViewAssignedAgent from "./components/ViewAssignedAgent.vue";
import ViewAssignedTraining from "./components/ViewAssignedTraining.vue";
import AssignAgentToTraining from "./components/AssignAgentToTraining.vue";
import { createRouter, createWebHistory } from "vue-router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Set default options
const options = {
  position: 'top-right',
  timeout: 3000,
  transition: 'Vue-Toastification__fade',
  // Add any other default options you want to set
};

const routes = [
  {
    name: "Register",
    path: "/register",
    component: Register,
  },
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
    name: "ViewAssignedAgent",
    path: "/trainings/view/:id",
    component: ViewAssignedAgent,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    name: "ViewAssignedTraining",
    path: "/agents/view/:id",
    component: ViewAssignedTraining,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    name: "IndexAgent",
    path: "/agents",
    component: IndexAgent,
    meta: { requiresAuth: true }, // Add meta field to indicate authentication requirement
  },
  {
    name: "AssignAgentToTraining",
    path: "/agent-training",
    component: AssignAgentToTraining,
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

createApp(App).use(router).use(Toast, options).mount("#app"); // Separate .use() calls
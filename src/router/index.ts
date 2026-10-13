import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    immersive?: boolean
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/recipes',
      name: 'recipes',
      component: () => import('../views/RecipesView.vue'),
      meta: { title: 'Recipes' },
    },
    {
      path: '/recipes/new',
      name: 'add-recipe',
      component: () => import('../views/RecipeFormView.vue'),
      meta: { title: 'Add a recipe' },
    },
    {
      path: '/recipes/:id',
      name: 'recipe',
      component: () => import('../views/RecipeView.vue'),
      props: true,
    },
    {
      path: '/recipes/:id/twist',
      name: 'add-twist',
      component: () => import('../views/RecipeFormView.vue'),
      props: (route) => ({ parentId: route.params.id }),
      meta: { title: 'Add a twist' },
    },
    {
      path: '/recipes/:id/cook',
      name: 'cook',
      component: () => import('../views/CookModeView.vue'),
      props: true,
      meta: { immersive: true, title: 'Cook mode' },
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/GroupsView.vue'),
      meta: { title: 'Family circles' },
    },
    {
      path: '/groups/:id',
      name: 'group',
      component: () => import('../views/GroupView.vue'),
      props: true,
    },
    {
      path: '/activity',
      name: 'activity',
      component: () => import('../views/ActivityView.vue'),
      meta: { title: 'Activity' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { title: 'Your cookbook' },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 24, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} · Rezepe`
    : 'Rezepe — keep your family’s recipes alive'
})

export default router

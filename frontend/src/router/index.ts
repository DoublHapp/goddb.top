import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AboutPage from '@/pages/AboutPage.vue'
import EssaysPage from '@/pages/EssaysPage.vue'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import PostDetailPage from '@/pages/PostDetailPage.vue'
import ProjectDetailPage from '@/pages/ProjectDetailPage.vue'
import ProjectsPage from '@/pages/ProjectsPage.vue'
import ToolsPage from '@/pages/ToolsPage.vue'
import ToolDetailPage from '@/pages/ToolDetailPage.vue'
import DbversePage from '@/pages/DbversePage.vue'
import DbverseDetailPage from '@/pages/DbverseDetailPage.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/projects', name: 'projects', component: ProjectsPage },
  { path: '/projects/:slug', name: 'project-detail', component: ProjectDetailPage },
  { path: '/tools', name: 'tools', component: ToolsPage },
  { path: '/tools/:slug', name: 'tool-detail', component: ToolDetailPage },
  { path: '/essays', name: 'essays', component: EssaysPage },
  { path: '/essays/:slug', name: 'essay-detail', component: PostDetailPage },
  { path: '/dbverse', name: 'dbverse', component: DbversePage },
  { path: '/dbverse/:slug', name: 'dbverse-detail', component: DbverseDetailPage },
  { path: '/blog', redirect: (to) => ({ path: '/essays', query: to.query, hash: to.hash }) },
  { path: '/blog/:slug', redirect: (to) => ({ path: `/essays/${to.params.slug}`, query: to.query, hash: to.hash }) },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router

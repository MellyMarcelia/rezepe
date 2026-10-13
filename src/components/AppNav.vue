<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Home, BookOpen, Plus, Users, Bell, Search } from 'lucide-vue-next'
import { useRezepe } from '@/stores/rezepe'
import BrandMark from './BrandMark.vue'
import PersonAvatar from './PersonAvatar.vue'

const store = useRezepe()
const router = useRouter()

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/recipes', label: 'Recipes', icon: BookOpen },
  { to: '/groups', label: 'Family', icon: Users },
  { to: '/activity', label: 'Activity', icon: Bell },
]

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

/** Focus the search field on this screen, or jump to the recipe search if there isn't one. */
function openSearch() {
  const field = document.querySelector<HTMLInputElement>('[data-search]')
  if (field) field.focus()
  else router.push({ path: '/recipes', query: { focus: '1' } })
}

function onKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  const typing = target.closest('input, textarea, select, [contenteditable]')
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
    e.preventDefault()
    openSearch()
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <nav class="nav" aria-label="Main">
    <RouterLink to="/" class="logo" aria-label="Rezepe home">
      <BrandMark :size="38" class="logo-mark" />
      <BrandMark :size="38" wordmark class="logo-full" />
    </RouterLink>

    <RouterLink to="/recipes/new" class="add" aria-label="Add a recipe">
      <Plus :size="26" stroke-width="2.5" aria-hidden="true" />
      <span class="label">Add<span class="wide-only"> a recipe</span></span>
    </RouterLink>

    <button class="item search-item" title="Search" @click="openSearch">
      <span class="icon-wrap"><Search :size="22" aria-hidden="true" /></span>
      <span class="label">Search</span>
      <kbd>{{ isMac ? '⌘K' : 'Ctrl K' }}</kbd>
    </button>

    <RouterLink
      v-for="item in items"
      :key="item.to"
      v-slot="{ href, navigate, isActive, isExactActive }"
      :to="item.to"
      custom
    >
      <a
        :href="href"
        class="item"
        :class="`item-${item.label.toLowerCase()}`"
        :title="item.label"
        :aria-current="(item.to === '/' ? isExactActive : isActive) ? 'page' : undefined"
        @click="navigate"
      >
        <span class="icon-wrap">
          <component :is="item.icon" :size="24" aria-hidden="true" />
          <span v-if="item.to === '/activity' && store.unreadActivity" class="badge">
            {{ store.unreadActivity > 9 ? '9+' : store.unreadActivity }}
            <span class="sr-only">unread</span>
          </span>
        </span>
        <span class="label">{{ item.label }}</span>
      </a>
    </RouterLink>

    <!-- Desktop only: quick access to each family circle -->
    <section class="circles wide-only" aria-labelledby="nav-circles">
      <h2 id="nav-circles">Your circles</h2>
      <RouterLink
        v-for="g in store.myGroups"
        :key="g.id"
        v-slot="{ href, navigate, isActive }"
        :to="`/groups/${g.id}`"
        custom
      >
        <a
          :href="href"
          class="circle"
          :aria-current="isActive ? 'page' : undefined"
          @click="navigate"
        >
          <img :src="g.cover" alt="" />
          <span>{{ g.name }}</span>
        </a>
      </RouterLink>
    </section>

    <RouterLink v-slot="{ href, navigate, isActive }" to="/profile" custom>
      <a
        :href="href"
        class="item me"
        title="Your profile"
        :aria-current="isActive ? 'page' : undefined"
        @click="navigate"
      >
        <PersonAvatar :person="store.me" :size="30" />
        <span class="label">
          You
          <span class="me-name wide-only">{{ store.me.name }}<small>View profile</small></span>
        </span>
      </a>
    </RouterLink>
  </nav>
</template>

<style scoped>
/* ---------- Phone & portrait tablet: bottom tab bar ---------- */
.nav {
  position: fixed;
  z-index: 20;
  inset: auto 0 0 0;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  background: rgb(255 255 255 / 92%);
  backdrop-filter: blur(14px);
  box-shadow: 0 -1px 0 var(--line);
}

.logo,
.wide-only {
  display: none;
}

.item,
.add {
  display: grid;
  justify-items: center;
  gap: 2px;
  padding: 6px 0;
  border: 0;
  border-radius: 14px;
  background: none;
  color: var(--ink-muted);
  font-size: 12px;
  font-weight: 600;
}

.item[aria-current='page'] {
  color: var(--wine);
}

/* The tab bar has no room for search; it appears in the rail and sidebar. */
.search-item,
kbd {
  display: none;
}

.icon-wrap {
  position: relative;
  display: grid;
}

.badge {
  position: absolute;
  top: -6px;
  right: -12px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #d62f4b;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 0 0 2px var(--surface);
  animation: badge-pop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
}

@keyframes badge-pop {
  from {
    transform: scale(0);
  }
}

.item[aria-current='page'] svg {
  stroke-width: 2.4;
}

.me[aria-current='page'] img {
  box-shadow: 0 0 0 2px var(--wine);
}

.add {
  order: 3;
  color: var(--wine-700);
}

.add svg {
  width: 48px;
  height: 48px;
  padding: 11px;
  margin-top: -26px;
  border-radius: 50%;
  background: var(--orange);
  box-shadow: 0 6px 16px rgb(219 111 2 / 40%);
  transition: transform 0.15s ease;
}

.add:hover svg {
  transform: scale(1.06);
}

.item-home,
.item-recipes {
  order: 1;
}

.item-family,
.item-activity,
.me {
  order: 4;
}

/* ---------- Landscape tablet: icon rail ---------- */
@media (min-width: 1000px), (orientation: landscape) and (min-width: 900px) {
  .nav {
    inset: 0 auto 0 0;
    width: var(--rail-w);
    height: 100dvh;
    padding: 24px 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    background: var(--surface);
    box-shadow: 1px 0 0 var(--line);
  }

  .logo {
    display: block;
    margin-bottom: 18px;
  }

  .logo-full {
    display: none;
  }

  .search-item {
    display: grid;
  }

  .item,
  .add {
    order: 0;
    width: 72px;
    padding: 10px 0;
  }

  .item:hover {
    background: var(--surface-sunk);
  }

  .item[aria-current='page'] {
    background: var(--cream-200);
  }

  .add {
    margin-bottom: 14px;
  }

  .add svg {
    margin-top: 0;
    width: 56px;
    height: 56px;
    padding: 14px;
    border-radius: 18px;
  }

  .add .label {
    display: none;
  }

  .me {
    margin-top: auto;
  }
}

/* ---------- Desktop: labelled sidebar ---------- */
@media (min-width: 1280px) {
  .nav {
    align-items: stretch;
    gap: 2px;
    padding: 28px 16px 18px;
    overflow-y: auto;
  }

  .wide-only {
    display: initial;
  }

  .logo {
    padding: 0 10px;
    margin-bottom: 24px;
  }

  .logo-mark {
    display: none;
  }

  .logo-full {
    display: inline-flex;
  }

  .item,
  .add {
    display: flex;
    align-items: center;
    gap: 14px;
    width: auto;
    min-height: 46px;
    padding: 0 12px;
    font-size: 15px;
    text-align: left;
    cursor: pointer;
  }

  .label {
    flex: 1;
  }

  .badge {
    position: static;
    margin-left: auto;
    box-shadow: none;
  }

  /* With labels, the unread count sits at the end of the row. */
  .item-activity .icon-wrap {
    display: contents;
  }

  .item-activity .badge {
    order: 3;
  }

  .add {
    justify-content: center;
    min-height: 50px;
    margin-bottom: 16px;
    border-radius: 999px;
    background: var(--orange);
    color: var(--wine-700);
    font-weight: 700;
    box-shadow: 0 6px 16px rgb(219 111 2 / 30%);
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;
  }

  .add:hover {
    background: var(--amber);
  }

  .add:active {
    transform: scale(0.98);
  }

  .add svg {
    width: 22px;
    height: 22px;
    padding: 0;
    background: none;
    box-shadow: none;
  }

  .add .label {
    display: inline;
    flex: 0 1 auto;
  }

  kbd {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 6px;
    background: var(--surface-sunk);
    box-shadow: inset 0 -1px 0 var(--line);
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-muted);
  }

  .circles {
    display: grid;
    gap: 2px;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid var(--line);
  }

  .circles h2 {
    padding: 0 12px 8px;
    font-family: var(--font-body);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-muted);
  }

  .circle {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 42px;
    padding: 0 12px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
  }

  .circle:hover {
    background: var(--surface-sunk);
  }

  .circle[aria-current='page'] {
    background: var(--cream-200);
    color: var(--wine);
  }

  .circle img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
  }

  .circle span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .me {
    margin-top: auto;
    padding: 10px 12px;
    min-height: 60px;
    border-top: 1px solid var(--line);
    border-radius: 0 0 12px 12px;
  }

  .me img {
    width: 38px !important;
    height: 38px !important;
  }

  /* On desktop the profile row shows the name instead of "You". */
  .me .label {
    font-size: 0;
  }

  .me-name {
    display: grid;
    font-size: 15px;
    font-weight: 700;
    color: var(--wine);
    line-height: 1.25;
  }

  .me-name small {
    font-size: 12px;
    font-weight: 500;
    color: var(--ink-muted);
  }
}
</style>

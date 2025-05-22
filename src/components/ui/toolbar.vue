<template>
  <transition name="fade">
    <div v-if="visible" class="toolbar-float bg-foreground text-foreground" @mouseenter="hovering = true" @mouseleave="hovering = false">
      <slot />
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  show: Boolean
})

const visible = ref(false)
const hovering = ref(false)

watch(() => props.show, (val) => {
  visible.value = val
})

// Garante que a toolbar não suma enquanto o mouse está sobre ela
watch(hovering, (val) => {
  if (val) visible.value = true
  else if (!props.show) visible.value = false
})
</script>

<style scoped>
.toolbar-float {
  position: absolute;
  top: 0.15rem;
  right: 0.5rem;
  display: flex;
  gap: 0.15rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  padding: 0.15rem 0.15rem;
  z-index: 10;
  align-items: center;
  transition: opacity 0.2s;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 
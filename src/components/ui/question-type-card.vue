<template>
  <div 
    class="flex flex-col items-center p-4 border rounded-lg bg-card hover:bg-accent cursor-pointer transition-colors"
    @click="$emit('click')"
  >
    <div class="w-full h-[100px] rounded-md flex items-center justify-center mb-2">
      <component :is="icon" class="w-4 h-4 text-muted-foreground" />
    </div>
    <span class="text-sm font-medium text-center">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

defineEmits(['click'])
</script> 
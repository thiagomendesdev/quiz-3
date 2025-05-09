<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {{ label }}
    </label>
    <div class="relative">
      <div 
        ref="editor" 
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      ></div>
    </div>
    <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = ref(null)
let quill = null

onMounted(() => {
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    ['formula'],
    [{ 'color': [] }],
    [{ 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }]
  ]

  const options = {
    modules: {
      toolbar: toolbarOptions,
      formula: true
    },
    theme: 'bubble',
    placeholder: 'Digite seu texto aqui...'
  }

  quill = new Quill(editor.value, options)

  // Set initial value if provided
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }

  // Listen for text changes
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML)
  })
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (quill && newValue !== quill.root.innerHTML) {
    quill.root.innerHTML = newValue
  }
})
</script>

<style scoped>
.ql-editor {
  @apply p-0 min-h-0 h-full text-sm whitespace-nowrap overflow-x-auto;
  max-height: 2.5rem;
}

.ql-editor.ql-blank::before {
  @apply text-muted-foreground;
}

.ql-toolbar.ql-bubble {
  @apply bg-background border rounded-md shadow-sm;
}

.ql-toolbar.ql-bubble .ql-formats {
  @apply flex items-center gap-1;
}

.ql-toolbar.ql-bubble button {
  @apply hover:bg-accent hover:text-accent-foreground rounded-sm p-1;
}

.ql-toolbar.ql-bubble .ql-picker {
  @apply text-foreground;
}

.ql-toolbar.ql-bubble .ql-picker-label {
  @apply hover:text-accent-foreground;
}

.ql-toolbar.ql-bubble .ql-picker-options {
  @apply bg-background border rounded-md shadow-sm;
}

/* Add auto-resize functionality */
.ql-editor {
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  overflow-x: auto;
  white-space: nowrap;
}
</style> 
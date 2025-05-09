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
    [{ 'background': [] }]
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

  // Force single line
  const editorElement = quill.root
  editorElement.classList.add('single-line')
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (quill && newValue !== quill.root.innerHTML) {
    quill.root.innerHTML = newValue
  }
})
</script>

<style>
/* Reset Quill's default styles */
.ql-editor {
  padding: 0 !important;
  margin: 0 !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 14px !important;
  font-family: inherit !important;
  color: hsl(var(--foreground)) !important;
}

.ql-editor p {
  margin: 0 !important;
  padding: 0 !important;
  height: 40px !important;
  line-height: 40px !important;
}

.ql-editor.ql-blank::before {
  color: hsl(var(--muted-foreground)) !important;
  opacity: 0.7 !important;
  font-style: normal !important;
  font-family: inherit !important;
}

/* Focus styles */
.ql-editor:focus-within {
  outline: 2px solid hsl(var(--ring)) !important;
  outline-offset: 2px !important;
}

/* Toolbar styles */
.ql-toolbar.ql-bubble {
  background-color: hsl(var(--background)) !important;
  border: 1px solid hsl(var(--border)) !important;
  border-radius: var(--radius) !important;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
}

.ql-toolbar.ql-bubble .ql-formats {
  display: flex !important;
  align-items: center !important;
  gap: 0.25rem !important;
}

.ql-toolbar.ql-bubble button {
  padding: 0.25rem !important;
  border-radius: 0.125rem !important;
}

.ql-toolbar.ql-bubble button:hover {
  background-color: hsl(var(--accent)) !important;
  color: hsl(var(--accent-foreground)) !important;
}

.ql-toolbar.ql-bubble .ql-picker {
  color: hsl(var(--foreground)) !important;
}

.ql-toolbar.ql-bubble .ql-picker-label {
  color: hsl(var(--foreground)) !important;
}

.ql-toolbar.ql-bubble .ql-picker-label:hover {
  color: hsl(var(--accent-foreground)) !important;
}

.ql-toolbar.ql-bubble .ql-picker-options {
  background-color: hsl(var(--background)) !important;
  border: 1px solid hsl(var(--border)) !important;
  border-radius: var(--radius) !important;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
}
</style> 
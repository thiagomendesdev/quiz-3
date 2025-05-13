<template>
  <div class="min-h-[38px] rounded-md border-1px bg-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
    <div ref="editor" class="min-h-[38px]"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Digite seu texto aqui...'
  },
  toolbar: {
    type: Array,
    default: () => [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['formula'],
      [{ 'color': [] }],
      [{ 'background': [] }]
    ]
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = ref(null)
let quill = null

onMounted(() => {
  const options = {
    modules: {
      toolbar: props.toolbar,
      formula: true
    },
    theme: 'bubble',
    placeholder: props.placeholder
  }

  quill = new Quill(editor.value, options)

  // Set initial content
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

// Cleanup
onBeforeUnmount(() => {
  if (quill) {
    quill = null
  }
})
</script>

<style>
.rich-text-editor {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.rich-text-editor .ql-toolbar {
  border-top: none;
  border-left: none;
  border-right: none;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.rich-text-editor .ql-container {
  border: none;
  font-size: 1rem;
  min-height: 100px;
}

.rich-text-editor .ql-editor {
  padding: 1rem;
}

.rich-text-editor .ql-editor.ql-blank::before {
  color: #94a3b8;
  font-style: normal;
}

/* Garantir z-index da bubble do Quill */
.ql-tooltip {
  z-index: 10000 !important;
}
</style> 
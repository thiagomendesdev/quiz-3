<template>
  <div class="min-h-[38px] rounded-md border bg-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
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
      [{ 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }]
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
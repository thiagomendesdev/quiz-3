<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @select="handleSelect"
      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      v-bind="$attrs"
    />
    <div v-if="showQuill" ref="quillContainer" class="absolute z-50"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const showQuill = ref(false)
const quillContainer = ref(null)
let quill = null

const handleSelect = (event) => {
  const selection = window.getSelection()
  if (selection.toString().length > 0) {
    showQuill.value = true
    // Posicionar o container do Quill próximo à seleção
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    if (quillContainer.value) {
      quillContainer.value.style.top = `${rect.bottom + window.scrollY + 5}px`
      quillContainer.value.style.left = `${rect.left + window.scrollX}px`
    }
  } else {
    showQuill.value = false
  }
}

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
    theme: 'bubble'
  }

  // Criar o editor Quill quando o container estiver disponível
  watch(showQuill, (newValue) => {
    if (newValue && quillContainer.value && !quill) {
      quill = new Quill(quillContainer.value, options)
      
      // Aplicar a formatação quando o usuário selecionar uma opção
      quill.on('text-change', () => {
        const selection = window.getSelection()
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          const formattedText = quill.root.innerHTML
          // Aqui você pode aplicar a formatação ao texto selecionado
          // Por exemplo, usando document.execCommand ou uma biblioteca de formatação
          console.log('Texto formatado:', formattedText)
        }
      })
    }
  })
})

// Limpar o editor quando o componente for desmontado
onUnmounted(() => {
  if (quill) {
    quill = null
  }
})
</script>

<style scoped>
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
</style> 
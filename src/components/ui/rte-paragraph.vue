<template>
  <div class="rte-paragraph min-h-[38px]">
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
      [{ 'color': [] }, { 'background': [] }]
    ]
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = ref(null)
let quill = null

onMounted(() => {
  // Desabilitar o módulo de listas do Quill
  const List = Quill.import('formats/list')
  List.tagName = 'DIV' // Isso fará com que as listas sejam renderizadas como divs normais

  const options = {
    modules: {
      toolbar: props.toolbar,
      formula: true,
      keyboard: {
        bindings: {
          // Desabilitar todas as formatações automáticas
          list: {
            key: ' ',
            collapsed: true,
            format: ['list'],
            handler: function() {
              return true;
            }
          },
          'list autofill': {
            key: ' ',
            collapsed: true,
            format: ['list'],
            handler: function() {
              return true;
            }
          }
        }
      }
    },
    theme: 'bubble',
    placeholder: props.placeholder,
    formats: ['bold', 'italic', 'underline', 'strike', 'script', 'color', 'background', 'formula'] // Lista explícita de formatos permitidos
  }

  quill = new Quill(editor.value, options)

  // Set initial content
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }

  // Listen for text changes
  quill.on('text-change', () => {
    let html = quill.root.innerHTML
    // Remover qualquer tag de lista que possa ter sido criada
    html = html.replace(/<ul[^>]*>.*?<\/ul>/gs, '')
    html = html.replace(/<ol[^>]*>.*?<\/ol>/gs, '')
    html = html.replace(/<li[^>]*>.*?<\/li>/gs, '')
    emit('update:modelValue', html)
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
  overflow: hidden;
}

.rich-text-editor .ql-toolbar {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #e2e8f0;
}

.rich-text-editor .ql-container {
  border: none;
  font-size: 1rem;
  min-height: 100px;
}

.rich-text-editor .ql-editor {
  padding: 0;
}

.rich-text-editor .ql-editor.ql-blank::before {
  color: #94a3b8;
  font-style: normal;
}

/* Make editor look like inline text */
.rte-paragraph {
  border: none !important;
  background: none !important;
  box-shadow: none !important;
}

.rte-paragraph .ql-container.ql-bubble {
  border: none !important;
  padding: 0 !important;
  background: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.rte-paragraph .ql-editor {
  border: none !important;
  padding: 0 !important;
  background: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  line-height: normal !important;
}

.rte-paragraph .ql-editor p {
  margin: 0 !important;
  padding: 0 !important;
  line-height: normal !important;
}

/* Remove focus styles only from the editor */
.rte-paragraph .ql-container:focus,
.rte-paragraph .ql-container:focus-within,
.rte-paragraph .ql-editor:focus,
.rte-paragraph .ql-editor:focus-within {
  outline: none !important;
  box-shadow: none !important;
  ring: none !important;
  border: none !important;
}

/* Garantir z-index da bubble do Quill */
.ql-tooltip {
  z-index: 10000 !important;
}
</style> 
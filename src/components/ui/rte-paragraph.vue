<template>
  <div class="rte-inline">
    <div ref="editor"></div>
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
.rte-inline,
.rte-inline .ql-container,
.rte-inline .ql-editor {
  border: none !important;
  background: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
  font-size: 1rem !important; /* text-base */
  line-height: 1.5rem !important; /* leading-normal */
  font-family: inherit !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
  color: hsl(var(--foreground)) !important;
}

.rte-inline .ql-editor:focus,
.rte-inline .ql-container:focus,
.rte-inline .ql-editor:focus-within,
.rte-inline .ql-container:focus-within {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.rte-inline .ql-editor.ql-blank::before {
  color: hsl(var(--muted-foreground)) !important;
  font-style: normal;
  padding: 0 !important;
  font-size: 1rem !important; /* text-base */
  line-height: 1.5rem !important; /* leading-normal */
}

.rte-inline .ql-tooltip {
  z-index: 10000 !important;
  min-width: 320px !important;
  max-width: 100vw !important;
  width: auto !important;
  white-space: nowrap !important;
  background-color: hsl(var(--foreground));
}

.rte-inline .ql-tooltip .ql-toolbar {
  display: flex !important;
  flex-wrap: nowrap !important;
  gap: 0.25rem;
}
</style> 
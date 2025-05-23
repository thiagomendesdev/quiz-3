<template>
  <div class="rte-large">
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

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

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
    
    // Se o conteúdo for apenas <p><br></p> ou <p></p>, considerar como vazio
    if (html === '<p><br></p>' || html === '<p></p>') {
      html = ''
      // Forçar o placeholder a aparecer
      quill.root.innerHTML = '<p><br></p>'
      quill.root.classList.add('ql-blank')
    } else {
      quill.root.classList.remove('ql-blank')
    }
    
    emit('update:modelValue', html)
  })

  // Emitir eventos de focus/blur
  quill.root.addEventListener('focus', () => emit('focus'))
  quill.root.addEventListener('blur', () => emit('blur'))
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
.rte-large {
  font-size: 1.125rem !important; /* text-lg */
  line-height: 1.45rem !important;
}

.rte-large,
.rte-large .ql-container,
.rte-large .ql-editor {
  font-size: 1.125rem !important; /* text-lg */
  line-height: 1.45rem !important;
  font-family: inherit !important;
  font-weight: 500 !important;
  letter-spacing: 0 !important;
  color: #0f172a !important; /* text-slate-900 */
  border: none !important;
  background: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.rte-large .ql-editor:focus,
.rte-large .ql-container:focus,
.rte-large .ql-editor:focus-within,
.rte-large .ql-container:focus-within {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

.rte-large .ql-editor {
  line-height: 1.45rem !important;
  font-size: 1.125rem !important;
  margin: 0 !important;
  padding: 0 !important;
}

.rte-large .ql-editor p {
  margin: 0 !important;
  padding: 0 !important;
}

.rte-large .ql-editor.ql-blank::before {
  color: hsl(var(--muted-foreground)) !important;
  font-style: normal !important;
  font-size: 1.125rem !important;
  line-height: 1.45rem !important;
  left: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  opacity: 1 !important;
  pointer-events: none !important;
  display: block !important;
}

.rte-large .ql-editor.ql-blank > p {
  display: block !important;
  min-height: 1.6rem !important;
}

.rte-large .ql-editor.ql-blank > p > br {
  display: none !important;
}

.rte-large .ql-editor.ql-blank {
  display: block !important;
}

.rte-large .ql-tooltip {
  z-index: 10000 !important;
  min-width: 320px !important;
  max-width: 100vw !important;
  width: auto !important;
  white-space: nowrap !important;
  background-color: hsl(var(--foreground));
}

.rte-large .ql-tooltip .ql-toolbar {
  display: flex !important;
  flex-wrap: nowrap !important;
  gap: 0.25rem;
}
</style> 
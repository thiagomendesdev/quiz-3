<template>
  <div class="rich-text-editor">
    <div ref="editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const editor = ref(null)
let quill = null

onMounted(() => {
  quill = new Quill(editor.value, {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean']
      ]
    },
    placeholder: props.placeholder
  })

  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML)
  })

  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }
})

watch(() => props.modelValue, (newValue) => {
  if (quill && newValue !== quill.root.innerHTML) {
    quill.root.innerHTML = newValue
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
</style> 
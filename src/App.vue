<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Quill Editor with Math Support</h1>
    
    <div class="space-y-4">
      <div class="editor-container">
        <h2 class="text-lg font-semibold mb-2">Editor 1</h2>
        <div ref="editor1" class="h-64 border rounded-lg"></div>
      </div>

      <div class="editor-container">
        <h2 class="text-lg font-semibold mb-2">Editor 2</h2>
        <div ref="editor2" class="h-64 border rounded-lg"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const editor1 = ref(null)
const editor2 = ref(null)

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
    theme: 'snow',
    placeholder: 'Digite seu texto aqui...'
  }

  new Quill(editor1.value, options)
  new Quill(editor2.value, options)
})
</script>

<style>
.editor-container {
  @apply bg-white mb-8;
}

.ql-editor {
  @apply min-h-[100px] max-h-[300px] overflow-y-auto;
}

.ql-formula {
  @apply bg-white;
}

/* Ajusta o espaçamento da toolbar */
.ql-toolbar.ql-snow {
  @apply flex gap-2;
}

.ql-toolbar.ql-snow .ql-formats {
  @apply flex gap-2;
}

.ql-toolbar.ql-snow button,
.ql-toolbar.ql-snow .ql-picker {
  @apply mr-0;
}

/* Remove indentation from first level lists */
.ql-editor ul > li,
.ql-editor ol > li {
  padding-left: 0 !important;
}

/* Keep indentation for nested lists */
.ql-editor ul > li > ul > li,
.ql-editor ol > li > ol > li,
.ql-editor ul > li > ol > li,
.ql-editor ol > li > ul > li {
  padding-left: 1.5em !important;
}
</style> 
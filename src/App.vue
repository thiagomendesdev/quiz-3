<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto p-6 space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold tracking-tight">Quill Editor with Math Support</h1>
        <p class="text-muted-foreground">A modern rich text editor with mathematical formula support</p>
      </header>
      
      <div class="grid gap-8">
        <div class="space-y-4">
          <div class="rounded-lg border bg-card p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Editor 1</h2>
            <div ref="editor1" class="min-h-[200px] rounded-md border bg-background"></div>
          </div>

          <div class="rounded-lg border bg-card p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Editor 2</h2>
            <div ref="editor2" class="min-h-[200px] rounded-md border bg-background"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.bubble.css'

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
    theme: 'bubble',
    placeholder: 'Digite seu texto aqui...'
  }

  new Quill(editor1.value, options)
  new Quill(editor2.value, options)
})
</script>

<style>
.editor-container {
  @apply bg-background;
}

.ql-editor {
  @apply min-h-[200px] max-h-[400px] overflow-y-auto p-4;
}

.ql-formula {
  @apply bg-background;
}

/* Custom styles for the bubble theme */
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
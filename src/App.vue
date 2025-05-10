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
            <div ref="editor1" class="min-h-[38px] rounded-md border bg-background"></div>
          </div>

          <div class="rounded-lg border bg-card p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Editor 2</h2>
            <div ref="editor2" class="min-h-[38px] rounded-md border bg-background"></div>
          </div>

          <div class="rounded-lg border bg-card p-4 shadow-sm">
            <h2 class="text-lg font-semibold mb-4">Campo de Texto Padrão</h2>
            <input
              type="text"
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Digite seu texto aqui..."
            />
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

  const quill1 = new Quill(editor1.value, options)
  const quill2 = new Quill(editor2.value, options)
})
</script>

<style>
.editor-container {
  @apply bg-background;
}

.ql-editor {
  @apply min-h-[38px] h-auto overflow-y-auto;
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
<template>
  <QuizEditor />
</template>

<script setup>
import QuizEditor from './components/QuizEditor.vue'
</script>

<style>
.editor-container {
  @apply bg-background;
}

.ql-editor {
  @apply min-h-[38px] h-auto overflow-y-auto;
  padding: 8px 12px !important;
}

.ql-editor.ql-blank::before {
  padding: 0 !important;
  left: 12px !important;
  right: 12px !important;
  top: 8px !important;
  bottom: 8px !important;
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
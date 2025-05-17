<template>
  <div class="main-container" :class="{ 'bg-secondary': mode === MODE_EDICAO }">
    <div v-if="mode === MODE_EDICAO" class="p-8 min-h-screen">
      <draggable
        v-model="questions"
        group="questions"
        item-key="id"
        handle=".question-drag"
        class="space-y-8"
      >
        <template #item="{ element: question, index: qIdx }">
          <div class="flex items-start gap-4">
            <div class="flex flex-col items-center gap-1 mt-6">
              <span class="text-xl font-regular text-foreground select-none">{{ qIdx + 1 }}</span>
              <button
                class="question-drag flex items-center justify-center h-8 w-8 rounded-md border border-none bg-transparent hover:bg-accent text-muted-foreground transition text-sm"
                title="Arraste para reordenar"
                type="button"
              >
                <GripVertical :size="16" />
              </button>
              <button
                class="flex items-center justify-center h-8 w-8 rounded-md border border-none bg-transparent hover:bg-accent text-muted-foreground transition text-sm"
                @click="removeQuestion(qIdx)"
                title="Remover questão"
                type="button"
              >
                <Trash :size="16" />
              </button>
            </div>
            <div class="flex-1">
              <div class="rounded-lg border bg-card p-4 shadow-sm">
                <div class="mb-4">
                  <div v-if="question.image" class="flex flex-col gap-2">
                    <ImageUploadPreview
                      v-model="question.image"
                      :max-width="true"
                      :max-height="300"
                    />
                    <rich-text-editor
                      v-model="question.text"
                      placeholder="Digite aqui a questão"
                    />
                  </div>
                  <div v-else class="flex items-center gap-2">
                    <ImageUploadPreview
                      v-model="question.image"
                      :max-width="40"
                      :max-height="40"
                    />
                    <rich-text-editor
                      v-model="question.text"
                      placeholder="Digite aqui a questão"
                    />
                  </div>
                </div>
                <draggable
                  v-model="question.alternatives"
                  group="alternatives"
                  item-key="id"
                  handle=".alt-drag"
                  class="space-y-1"
                >
                  <template #item="{ element: alt, index: aIdx }">
                    <div class="flex items-center gap-1 group">
                      <button
                        class="alt-drag flex items-center justify-center h-8 w-8 rounded-md border border-none bg-transparent hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                        title="Arraste para reordenar"
                        type="button"
                      >
                        <GripVertical :size="16" />
                      </button>
                      <div class="flex-1">
                        <div class="flex items-center gap-2">
                          <ImageUploadPreview
                            v-model="alt.image"
                            :max-width="150"
                            :max-height="150"
                          />
                          <div class="flex-1 min-w-0">
                            <rich-text-editor
                              v-model="alt.text"
                              :placeholder="`Alternativa ${aIdx + 1}`"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        class="alt-remove flex items-center justify-center h-8 w-8 rounded-md border border-none bg-transparent hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-sm ml-1"
                        @click="removeAlternative(qIdx, aIdx)"
                        title="Remover alternativa"
                        type="button"
                      >
                        <X :size="16" />
                      </button>
                    </div>
                  </template>
                </draggable>
                <div class="flex justify-center mt-4">
                  <ButtonWithIcon
                    variant="ghost"
                    :icon="Plus"
                    @click="addAlternative(qIdx)"
                    type="button"
                  >
                    Adicionar alternativa
                  </ButtonWithIcon>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <div class="flex justify-center mt-8">
        <ButtonWithIcon
          variant="ghost"
          :icon="Plus"
          @click="addQuestion"
          type="button"
        >
          Adicionar questão
        </ButtonWithIcon>
      </div>
    </div>
    <div v-else class="print-container">
      <div v-for="(question, qIdx) in questions" :key="question.id" class="flex items-start gap-4 mb-6">
        <div class="flex flex-col items-center gap-1 mt-6">
          <span class="text-xl font-regular text-foreground select-none">{{ qIdx + 1 }}</span>
        </div>
        <div class="flex-1">
          <div class="rounded-lg border bg-card p-4 shadow-sm">
            <div class="print-question-title">
              <span v-html="question.text" class="print-question-text" />
            </div>
            <div class="print-alternatives mt-2">
              <div v-for="(alt, aIdx) in question.alternatives" :key="alt.id" class="print-alternative flex items-center mb-1">
                <span class="print-radio"></span>
                <span v-html="alt.text" class="print-alternative-text ml-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="floating-toggle-btn primary"
      @click="toggleMode"
      type="button"
    >
      <component :is="mode === MODE_EDICAO ? Printer : Edit" :size="24" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import draggable from 'vuedraggable'
import RichTextEditor from './ui/rich-text-editor.vue'
import { Trash, GripVertical, X, Plus, Printer, Edit } from 'lucide-vue-next'
import ButtonWithIcon from './ui/button-with-icon.vue'
import ImageUploadPreview from './ui/image-upload-preview.vue'

const MODE_EDICAO = 'edicao'
const MODE_IMPRESSAO = 'impressao'
const mode = ref(MODE_EDICAO)

function toggleMode() {
  mode.value = mode.value === MODE_EDICAO ? MODE_IMPRESSAO : MODE_EDICAO
  document.body.className = mode.value === MODE_EDICAO ? 'bg-secondary' : ''
}

onMounted(() => {
  document.body.className = mode.value === MODE_EDICAO ? 'bg-secondary' : ''
})

onBeforeUnmount(() => {
  document.body.className = ''
})

function newAlternative() {
  return { id: Date.now() + Math.random(), text: '', image: '' }
}
function newQuestion() {
  return {
    id: Date.now() + Math.random(),
    text: '',
    image: '',
    alternatives: [newAlternative(), newAlternative(), newAlternative()],
    correct: 0
  }
}

const questions = ref([newQuestion()])

function addQuestion() {
  questions.value.push(newQuestion())
}
function removeQuestion(qIdx) {
  questions.value.splice(qIdx, 1)
}
function addAlternative(qIdx) {
  questions.value[qIdx].alternatives.push(newAlternative())
}
function removeAlternative(qIdx, aIdx) {
  questions.value[qIdx].alternatives.splice(aIdx, 1)
  if (questions.value[qIdx].correct >= questions.value[qIdx].alternatives.length) {
    questions.value[qIdx].correct = 0
  }
}
function setCorrect(qIdx, aIdx) {
  questions.value[qIdx].correct = aIdx
}
</script>

<style scoped>
.main-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  min-height: 100vh;
}
.bg-secondary {
  background-color: hsl(var(--secondary)) !important;
}
.floating-toggle-btn {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 50;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  border: none;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.floating-toggle-btn.primary {
  background: #111;
  color: #fff;
}
.floating-toggle-btn.primary :deep(svg) {
  color: #fff;
}
.floating-toggle-btn:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.16);
}
.print-container {
  background: #fff;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}
.print-question {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.print-question-title {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  font-size: 1.15rem;
  line-height: 1.4rem;
  font-weight: 600;
}
.print-question-number {
  font-size: 1.15rem;
  font-weight: 600;
  margin-right: 0.5rem;
}
.print-alternatives {
  margin-top: 1rem;
}
.print-alternative {
  font-size: 1rem;
  min-height: 1.7rem;
}
.print-radio {
  display: inline-block;
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid #000000;
  border-radius: 50%;
  background: #fff;
  margin-right: 0.5rem;
}
.print-alternative-text {
  display: inline-block;
  vertical-align: middle;
  line-height: 1.3rem;
}
@media print {
  @page {
    background: #fff;
    margin: 0;
  }
  body {
    background-color: #fff !important;
  }
  html {
    background-color: #fff !important;
  }
  .main-container {
    background-color: #fff !important;
  }
  .print-container {
    padding: 2rem;
    background-color: #fff !important;
  }
  .print-question-title, .print-question-number, .print-alternative {
    color: #000 !important;
  }
  /* Garantir que os estilos inline sejam preservados */
  .print-question-text *,
  .print-alternative-text * {
    all: revert;
  }
}
.bg-card {
  background-color: #fff;
}
.text-muted-foreground {
  color: #888;
}
.text-primary {
  color: #222;
}
.border-input {
  border-color: #e5e7eb;
  border-width: 1px;
}
.border-primary {
  border-color: #222;
}
.hover\:bg-accent:hover {
  background-color: #f3f4f6;
}
.hover\:bg-destructive\/10:hover {
  background-color: #fee2e2;
}
.hover\:text-primary:hover {
  color: #222;
}
.rounded-lg {
  border-radius: 16px;
}
.rounded-md {
  border-radius: 8px;
}
.rounded-full {
  border-radius: 9999px;
}
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
}

/* Ícones de drag/excluir das alternativas só no hover */
.group:hover .alt-drag,
.group:hover .alt-remove {
  opacity: 1 !important;
}

</style> 
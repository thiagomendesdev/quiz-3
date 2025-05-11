<template>
  <div class="p-8 bg-muted min-h-screen">
    <draggable
      v-model="questions"
      group="questions"
      item-key="id"
      handle=".question-drag"
      class="space-y-8"
    >
      <template #item="{ element: question, index: qIdx }">
        <div class="flex items-start gap-4">
          <button
            class="question-drag flex items-center justify-center h-10 w-10 rounded-md border bg-card hover:bg-accent transition"
            title="Arrastar questão"
            type="button"
          >
            <GripVertical :size="20" />
          </button>
          <button
            class="flex items-center justify-center h-10 w-10 rounded-md border bg-card hover:bg-destructive/10 text-destructive transition mt-1"
            @click="removeQuestion(qIdx)"
            title="Remover questão"
            type="button"
          >
            <Trash :size="20" />
          </button>
          <div class="flex-1">
            <div class="rounded-lg border bg-card p-4 shadow-sm">
              <div class="mb-4">
                <rich-text-editor
                  v-model="question.text"
                  placeholder="Digite aqui a questão"
                />
              </div>
              <draggable
                v-model="question.alternatives"
                group="alternatives"
                item-key="id"
                handle=".alt-drag"
                class="space-y-3"
              >
                <template #item="{ element: alt, index: aIdx }">
                  <div class="flex items-center gap-2">
                    <button
                      class="alt-drag flex items-center justify-center h-8 w-8 rounded-md border bg-card hover:bg-accent transition"
                      title="Arrastar alternativa"
                      type="button"
                    >
                      <GripVertical :size="16" />
                    </button>
                    <button
                      class="flex items-center justify-center h-8 w-8 rounded-full border"
                      :class="question.correct === aIdx ? 'border-primary' : 'border-input'"
                      @click="setCorrect(qIdx, aIdx)"
                      type="button"
                      title="Marcar como correta"
                    >
                      <component :is="question.correct === aIdx ? CircleDot : Circle" :size="18" />
                    </button>
                    <div class="flex-1">
                      <rich-text-editor
                        v-model="alt.text"
                        :placeholder="`Alternativa ${aIdx + 1}`"
                      />
                    </div>
                    <button
                      class="flex items-center justify-center h-8 w-8 rounded-md border bg-card hover:bg-destructive/10 text-destructive transition"
                      @click="removeAlternative(qIdx, aIdx)"
                      title="Remover alternativa"
                      type="button"
                    >
                      <X :size="16" />
                    </button>
                  </div>
                </template>
              </draggable>
              <button
                class="flex items-center gap-2 mt-4 text-muted-foreground hover:text-primary transition text-sm"
                @click="addAlternative(qIdx)"
                type="button"
              >
                <span class="text-lg font-bold">+</span> Adicionar alternativa
              </button>
            </div>
          </div>
          <span class="text-2xl font-semibold text-muted-foreground select-none mt-2">{{ qIdx + 1 }}</span>
        </div>
      </template>
    </draggable>
    <div class="flex justify-center mt-8">
      <button
        class="flex items-center gap-2 px-6 py-3 rounded-md bg-muted text-muted-foreground hover:bg-accent transition text-base font-medium shadow-sm"
        @click="addQuestion"
        type="button"
      >
        <span class="text-lg font-bold">+</span> Adicionar questão
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import RichTextEditor from './ui/rich-text-editor.vue'
import { Trash, GripVertical, X, Circle, CircleDot } from 'lucide-vue-next'

function newAlternative() {
  return { id: Date.now() + Math.random(), text: '' }
}
function newQuestion() {
  return {
    id: Date.now() + Math.random(),
    text: '',
    alternatives: [newAlternative(), newAlternative(), newAlternative()],
    correct: 0
  }
}

const questions = ref([newQuestion(), newQuestion()])

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
  // Se a alternativa correta foi removida, resetar para a primeira
  if (questions.value[qIdx].correct >= questions.value[qIdx].alternatives.length) {
    questions.value[qIdx].correct = 0
  }
}
function setCorrect(qIdx, aIdx) {
  questions.value[qIdx].correct = aIdx
}
</script>

<style scoped>
.bg-muted {
  background-color: #fafafa;
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
</style> 
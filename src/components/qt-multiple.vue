<template>
  <div class="p-8 bg-muted min-h-screen" style="background: #FCFCFC;">
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
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        class="shadcn-radio"
                        :checked="question.correct === aIdx"
                        @change="setCorrect(qIdx, aIdx)"
                        :name="'question-' + qIdx"
                      />
                      <span class="ml-2 sr-only">Alternativa {{ aIdx + 1 }}</span>
                    </label>
                    <div class="flex-1">
                      <rich-text-editor
                        v-model="alt.text"
                        :placeholder="`Alternativa ${aIdx + 1}`"
                      />
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
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import RichTextEditor from './ui/rich-text-editor.vue'
import { Trash, GripVertical, X, Plus } from 'lucide-vue-next'
import ButtonWithIcon from './ui/button-with-icon.vue'

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
.bg-muted {
  background-color: #FCFCFC;
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

/* Radio shadcn visual */
.shadcn-radio {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: border-color 0.2s;
  display: inline-block;
  position: relative;
}
.shadcn-radio:checked {
  border-color: #222;
}
.shadcn-radio:checked::after {
  content: '';
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  background: #222;
  border-radius: 9999px;
  position: absolute;
  top: 3px;
  left: 3px;
}

/* Ícones de drag/excluir das alternativas só no hover */
.group:hover .alt-drag,
.group:hover .alt-remove {
  opacity: 1 !important;
}

</style> 
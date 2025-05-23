<template>
  <div class="main-container">
    <div class="p-8 min-h-screen">
      <draggable
        v-model="questions"
        group="questions"
        item-key="id"
        handle=".question-drag"
        class="space-y-8"
      >
        <template #item="{ element: question, index: qIdx }">
          <div class="flex items-start gap-4">
            <div class="flex-1 relative group">
              <div class="rounded-lg border bg-card p-4 shadow-sm question-block relative"
                   @mouseenter="hoveredCard = qIdx"
                   @mouseleave="hoveredCard = null">
                <div class="mb-1">
                  <div class="flex flex-col gap-3">
                    <ImageUploadPreview
                      v-model="question.image"
                      :max-width="true"
                      :max-height="300"
                      :display-mode="question.displayMode"
                      @update:displayMode="val => question.displayMode = val"
                      :ref="setImageUploadRef(qIdx)"
                      hide-add-button
                    />
                    <div class="relative px-2"
                         :class="{'bg-secondary rounded-md': hoveredQuestion === qIdx || focusedQuestion === qIdx}"
                         @mouseenter="hoveredQuestion = qIdx"
                         @mouseleave="hoveredQuestion = null">
                      <Toolbar
                        :show="hoveredQuestion === qIdx"
                        class="z-20 left-float"
                      >
                        <Button
                          size="icon-sm" variant="default"
                          @click="removeQuestion(qIdx)"
                          title="Remover questão"
                          type="button"
                        >
                          <Trash :size="16" />
                        </Button>
                        <Button
                          size="icon-sm" variant="default"
                          @click="triggerImageUpload(qIdx)"
                          title="Adicionar imagem à questão"
                          type="button"
                        >
                          <ImagePlusIcon :size="16" />
                        </Button>
                        <Button size="icon-sm" variant="default"
                          class="question-drag"
                          title="Arraste para reordenar"
                          type="button"
                        >
                          <GripVertical :size="16" />
                        </Button>
                      </Toolbar>
                      <div class="flex items-start gap-1">
                        <div>
                          <span class="inline-block w-6 text-left text-lg font-medium text-primary select-none" style="padding-top: 1px;">{{ (qIdx + 1).toString().padStart(2, '0') }}</span>
                        </div>
                        <RteLarge
                          v-model="question.text"
                          placeholder="Digite aqui a questão"
                          @focus="focusedQuestion = qIdx"
                          @blur="focusedQuestion = null"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <draggable
                    v-model="question.alternatives"
                    group="alternatives"
                    item-key="id"
                    handle=".alt-drag"
                    class="space-y-0"
                  >
                    <template #item="{ element: alt, index: aIdx }">
                      <div class="flex items-center gap-1 group relative alt-block rounded-md"
                        :class="{'bg-secondary': hoveredAlt === `${qIdx}-${aIdx}` || focusedAlt === `${qIdx}-${aIdx}`}"
                        @mouseenter="hoveredAlt = `${qIdx}-${aIdx}`"
                        @mouseleave="hoveredAlt = null"
                      >
                        <Toolbar
                          :show="hoveredAlt === `${qIdx}-${aIdx}`"
                          class="z-20 left-float-alt"
                        >
                          <Button
                            size="icon-sm" variant="default"
                            @click="removeAlternative(qIdx, aIdx)"
                            title="Remover alternativa"
                            type="button"
                          >
                            <Trash :size="16" />
                          </Button>
                          <Button
                            size="icon-sm" variant="default"
                            @click="triggerAltImageUpload(qIdx, aIdx)"
                            title="Adicionar imagem à alternativa"
                            type="button"
                          >
                            <ImagePlusIcon :size="16" />
                          </Button>
                          <Button size="icon-sm" variant="default"
                            class="alt-drag"
                            title="Arraste para reordenar"
                            type="button"
                          >
                            <GripVertical :size="16" />
                          </Button>
                        </Toolbar>
                        <div class="flex-1">
                          <div class="flex items-center gap-2">
                            <ImageUploadPreview
                              v-model="alt.image"
                              :max-width="150"
                              :max-height="150"
                              :display-mode="alt.displayMode"
                              @update:displayMode="val => alt.displayMode = val"
                              :ref="setAltImageUploadRef(qIdx, aIdx)"
                              hide-add-button
                              :class="altImageUploadRefs[qIdx]?.[aIdx]?.hasImage ? 'alt-image-preview' : ''"
                            />
                            <Circle :size="18" class="text-muted-foreground" />
                            <div class="flex-1 min-w-0">
                              <RteParagraph
                                v-model="alt.text"
                                :placeholder="`Alternativa ${aIdx + 1}`"
                                @focus="focusedAlt = `${qIdx}-${aIdx}`"
                                @blur="focusedAlt = null"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <div
                    class="add-alt-float-btn-wrapper"
                    v-show="hoveredCard === qIdx"
                  >
                    <Button
                      variant="default"
                      size="sm"
                      @click="addAlternative(qIdx)"
                      type="button"
                    >
                      <Plus />
                      Adicionar alternativa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
      <div class="flex justify-center mt-8">
        <QuestionTypeCard
          :icon="ListChecks"
          label="Múltipla Escolha"
          @click="addQuestion('multiple')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'
import RteLarge from './ui/rte-large.vue'
import RteParagraph from './ui/rte-paragraph.vue'
import { Trash, GripVertical, Plus, ListChecks, ImagePlus as ImagePlusIcon, Circle } from 'lucide-vue-next'
import { Button } from './ui/button'
import ImageUploadPreview from './ui/image-upload-preview.vue'
import QuestionTypeCard from './ui/question-type-card.vue'
import Toolbar from './ui/toolbar.vue'

function newAlternative() {
  return { id: Date.now() + Math.random(), text: '', image: '', displayMode: 'cover' }
}
function newQuestion() {
  return {
    id: Date.now() + Math.random(),
    text: '',
    image: '',
    displayMode: 'cover',
    alternatives: [newAlternative(), newAlternative(), newAlternative()],
    correct: 0
  }
}

const questions = ref([newQuestion()])

function addQuestion(type) {
  questions.value.push({
    id: Date.now() + Math.random(),
    text: '',
    image: '',
    displayMode: 'cover',
    alternatives: [newAlternative(), newAlternative(), newAlternative()],
    correct: 0,
    type
  })
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

const hoveredQuestion = ref(null)
const focusedQuestion = ref(null)
const hoveredAlt = ref(null)
const focusedAlt = ref(null)
const hoveredCard = ref(null)
const imageUploadRefs = ref([])
const altImageUploadRefs = ref({})

function setImageUploadRef(qIdx) {
  return (el) => {
    if (el) imageUploadRefs.value[qIdx] = el
  }
}
function setAltImageUploadRef(qIdx, aIdx) {
  return (el) => {
    if (!altImageUploadRefs.value[qIdx]) altImageUploadRefs.value[qIdx] = {}
    if (el) altImageUploadRefs.value[qIdx][aIdx] = el
  }
}

function triggerImageUpload(qIdx) {
  nextTick(() => {
    const comp = imageUploadRefs.value[qIdx]
    if (comp && comp.$el) {
      const input = comp.$el.querySelector('input[type="file"]')
      if (input) input.click()
    }
  })
}
function triggerAltImageUpload(qIdx, aIdx) {
  nextTick(() => {
    const comp = altImageUploadRefs.value[qIdx]?.[aIdx]
    if (comp && comp.$el) {
      const input = comp.$el.querySelector('input[type="file"]')
      if (input) input.click()
    }
  })
}

function onQuestionMouseLeave(qIdx) {
  if (focusedQuestion.value !== qIdx) hoveredQuestion.value = null
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

.left-float {
  position: absolute;
  left: 0.1rem;
  top: 50%;
  display: flex;
  width: max-content;
  min-width: unset;
  max-width: max-content;
  transform: translate(-100%, -50%);
  z-index: 200;
}

.left-float-alt {
  position: absolute;
  left: 0.1rem;
  top: 50%;
  display: flex;
  width: max-content;
  transform: translate(-100%, -50%);
  z-index: 200;
}

.add-alt-float-btn-wrapper {
  position: absolute;
  left: 50%;
  bottom: -36px;
  transform: translateX(-50%);
  z-index: 30;
  pointer-events: auto;
}

.alt-image-preview {
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 2px;
  margin-right: 8px;
}

/* Focus state para questão e alternativas */
.relative.rounded-md.bg-secondary,
.flex-1.min-w-0.rounded-md.bg-secondary,
.flex.items-center.gap-1.group.relative.alt-block.rounded-md.bg-secondary {
  background-color: hsl(var(--secondary)) !important;
  transition: background 100ms ease-out;
}

/* Transição suave para toolbars */
.toolbar-float {
  transition: opacity 100ms ease-out;
}

.question-block {
  padding: 20px !important;
}
</style> 
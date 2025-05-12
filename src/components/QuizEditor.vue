<template>
  <div class="quiz-editor">
    <div class="quiz-header">
      <h2>Editor de Quiz</h2>
    </div>

    <div class="quiz-content">
      <!-- Área de arrastar e soltar -->
      <div 
        class="drop-zone"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <div v-if="!questions.length" class="empty-state">
          <Upload class="upload-icon" />
          <p>Arraste e solte suas questões aqui</p>
        </div>

        <div v-else class="questions-list">
          <div 
            v-for="(question, index) in questions" 
            :key="index"
            class="question-item"
            draggable="true"
            @dragstart="handleDragStart($event, index)"
            @dragover.prevent
            @drop.prevent="handleQuestionDrop($event, index)"
          >
            <div class="question-header">
              <span class="question-number">Questão {{ index + 1 }}</span>
              <div class="question-actions">
                <button @click="moveQuestion(index, 'up')" :disabled="index === 0">
                  <ArrowUp />
                </button>
                <button @click="moveQuestion(index, 'down')" :disabled="index === questions.length - 1">
                  <ArrowDown />
                </button>
                <button @click="removeQuestion(index)" class="delete-btn">
                  <Trash2 />
                </button>
              </div>
            </div>

            <div class="question-content">
              <RichTextEditor
                v-model="question.text"
                placeholder="Digite sua pergunta aqui..."
              />

              <div class="options-list">
                <div 
                  v-for="(option, optionIndex) in question.options" 
                  :key="optionIndex"
                  class="option-item"
                >
                  <div class="option-header">
                    <span class="option-letter">{{ String.fromCharCode(65 + optionIndex) }}</span>
                    <button 
                      @click="removeOption(index, optionIndex)"
                      class="delete-btn"
                      :disabled="question.options.length <= 2"
                    >
                      <Trash2 />
                    </button>
                  </div>

                  <RichTextEditor
                    v-model="option.text"
                    placeholder="Digite a opção aqui..."
                  />
                </div>
              </div>

              <button 
                @click="addOption(index)"
                class="add-option-btn"
                :disabled="question.options.length >= 5"
              >
                <Plus /> Adicionar Opção
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowUp, ArrowDown, Trash2, Plus, Upload } from 'lucide-vue-next'
import RichTextEditor from './rich-text-editor.vue'

const questions = ref([])

const createNewQuestion = () => ({
  text: '',
  options: [
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]
})

const handleDrop = (event) => {
  const data = event.dataTransfer.getData('text/plain')
  try {
    const newQuestion = JSON.parse(data)
    questions.value.push(newQuestion)
  } catch (error) {
    console.error('Erro ao processar questão:', error)
  }
}

const handleDragStart = (event, index) => {
  event.dataTransfer.setData('text/plain', JSON.stringify(questions.value[index]))
}

const handleQuestionDrop = (event, targetIndex) => {
  const sourceIndex = parseInt(event.dataTransfer.getData('text/plain'))
  const question = questions.value[sourceIndex]
  questions.value.splice(sourceIndex, 1)
  questions.value.splice(targetIndex, 0, question)
}

const moveQuestion = (index, direction) => {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  const question = questions.value[index]
  questions.value.splice(index, 1)
  questions.value.splice(newIndex, 0, question)
}

const removeQuestion = (index) => {
  questions.value.splice(index, 1)
}

const addOption = (questionIndex) => {
  if (questions.value[questionIndex].options.length < 5) {
    questions.value[questionIndex].options.push({ text: '', isCorrect: false })
  }
}

const removeOption = (questionIndex, optionIndex) => {
  if (questions.value[questionIndex].options.length > 2) {
    questions.value[questionIndex].options.splice(optionIndex, 1)
  }
}
</script>

<style scoped>
.quiz-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.quiz-header {
  margin-bottom: 2rem;
}

.quiz-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
}

.drop-zone {
  min-height: 200px;
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  background-color: #f8fafc;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #64748b;
}

.upload-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: #94a3b8;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-item {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.question-number {
  font-weight: 600;
  color: #1a1a1a;
}

.question-actions {
  display: flex;
  gap: 0.5rem;
}

.question-actions button {
  padding: 0.5rem;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.question-actions button:hover:not(:disabled) {
  background-color: #f1f5f9;
  color: #1a1a1a;
}

.question-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.option-letter {
  font-weight: 600;
  color: #1a1a1a;
}

.delete-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.delete-btn:hover:not(:disabled) {
  background-color: #fee2e2;
}

.delete-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-option-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.add-option-btn:hover:not(:disabled) {
  background-color: #f8fafc;
  color: #1a1a1a;
}

.add-option-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 
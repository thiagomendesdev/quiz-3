<template>
  <div :class="containerClass" :style="containerStyle">
    <button
      v-if="!imageUrl"
      class="icon-btn outline-btn flex-shrink-0 flex items-center justify-center"
      type="button"
      @click="triggerFileInput"
      title="Adicionar imagem"
      style="width: 32px; height: 32px; min-width: 32px; min-height: 32px;"
    >
      <ImagePlusIcon :size="16" />
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />
    <div v-if="imageUrl" class="relative flex-shrink-0" :style="imageBoxStyle">
      <img
        :src="imageUrl"
        :class="['rounded-md w-full h-full', expanded ? 'object-contain' : 'object-cover']"
        :style="imgStyle"
        @click="toggleExpand"
        alt="Imagem da questão ou alternativa"
      />
      <div class="absolute top-2 right-2 flex gap-2 z-10">
        <button @click.stop="toggleExpand" class="icon-btn" type="button">
          <ExpandIcon v-if="!expanded" :size="20" />
          <ShrinkIcon v-else :size="20" />
        </button>
        <button @click.stop="removeImage" class="icon-btn" type="button">
          <TrashIcon :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ImagePlus as ImagePlusIcon, Maximize2 as ExpandIcon, Minimize2 as ShrinkIcon, Trash as TrashIcon } from 'lucide-vue-next'
import { uploadToImageKit } from '@/lib/imagekit-upload'

const props = defineProps({
  modelValue: String,
  maxWidth: { type: [Number, Boolean], default: false },
  maxHeight: { type: [Number, Boolean], default: false }
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const expanded = ref(false)

const imageUrl = computed(() => props.modelValue)

const isAlt = computed(() => props.maxWidth === 150 && props.maxHeight === 150)

const containerClass = computed(() => {
  // Para alternativas, layout inline; para questão, layout block
  return isAlt.value ? 'flex items-center' : 'flex flex-col items-center w-full'
})

const containerStyle = computed(() => {
  // Não reservar espaço extra para alternativas
  return isAlt.value ? '' : 'width: 100%;'
})

const imageBoxStyle = computed(() => {
  // Imagem 150x150 para alternativa, full para questão
  if (isAlt.value) {
    return 'width: 150px; height: 150px; min-width: 150px; min-height: 150px;'
  }
  let style = ''
  if (props.maxWidth === true) style += 'width: 100%;'
  if (props.maxHeight && typeof props.maxHeight === 'number') style += `max-height: ${props.maxHeight}px;`
  return style
})

const imgStyle = computed(() => {
  let style = ''
  // Sempre limitar o tamanho máximo, mesmo expandida
  if (isAlt.value) {
    style += 'max-width: 150px; max-height: 150px; width: 100%; height: 100%;'
  } else {
    if (props.maxHeight && typeof props.maxHeight === 'number') style += `max-height:${props.maxHeight}px;`
    if (props.maxWidth === true) style += 'width: 100%;'
  }
  return style
})

function triggerFileInput() {
  fileInput.value.click()
}

async function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const url = await uploadToImageKit(file)
  emit('update:modelValue', url)
}

function toggleExpand() {
  expanded.value = !expanded.value
}

function removeImage() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.icon-btn {
  @apply flex items-center justify-center p-0 m-0;
}
.outline-btn {
  @apply border border-input bg-background rounded-md hover:bg-accent hover:text-accent-foreground transition;
}
img {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
</style> 
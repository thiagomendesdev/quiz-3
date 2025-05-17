<template>
  <div :class="containerClass" :style="containerStyle">
    <button
      v-if="!imageUrl"
      class="h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      @click="triggerFileInput"
      title="Adicionar imagem"
      :disabled="isLoading"
    >
      <LoaderIcon v-if="isLoading" :size="16" class="animate-spin" />
      <ImagePlusIcon v-else :size="16" />
    </button>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
      :disabled="isLoading"
    />
    <div v-if="imageUrl" class="relative flex-shrink-0" :style="imageBoxStyle">
      <img
        :src="imageUrl"
        :class="['rounded-md w-full h-full', displayModeClass]"
        :style="imgStyle"
        @click="toggleExpand"
        alt="Imagem da questão ou alternativa"
      />
      <div class="absolute top-2 right-2 flex gap-2 z-10">
        <button @click.stop="toggleExpand" class="h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center" type="button">
          <ExpandIcon v-if="!isContain" :size="16" />
          <ShrinkIcon v-else :size="16" />
        </button>
        <button @click.stop="removeImage" class="h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-center" type="button">
          <TrashIcon :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ImagePlus as ImagePlusIcon, Maximize2 as ExpandIcon, Minimize2 as ShrinkIcon, Trash as TrashIcon, Loader2 as LoaderIcon } from 'lucide-vue-next'
import { uploadToImageKit } from '@/lib/imagekit-upload'

const props = defineProps({
  modelValue: String,
  maxWidth: { type: [Number, Boolean], default: false },
  maxHeight: { type: [Number, Boolean], default: false },
  displayMode: { type: String, default: '' } // 'cover' ou 'contain'
})
const emit = defineEmits(['update:modelValue', 'update:displayMode'])

const fileInput = ref(null)
const isLoading = ref(false)
// expanded = true => contain, false => cover
const expanded = ref(false)

const imageUrl = computed(() => props.modelValue)

const isAlt = computed(() => props.maxWidth === 150 && props.maxHeight === 150)

const containerClass = computed(() => {
  if (isAlt.value) return 'flex items-center';
  if (imageUrl.value) return 'flex flex-col items-center w-full';
  return '';
})

const containerStyle = computed(() => {
  return isAlt.value ? '' : (imageUrl.value ? 'width: 100%;' : '');
})

const imageBoxStyle = computed(() => {
  if (isAlt.value) {
    return 'width: 150px; height: 150px; min-width: 150px; min-height: 150px;'
  }
  let style = ''
  if (props.maxWidth === true) style += 'width: 100%;'
  if (props.maxHeight && typeof props.maxHeight === 'number') style += `max-height: ${props.maxHeight}px;`
  return style
})

// Determina o modo de exibição (cover/contain)
const isContain = computed(() => {
  if (props.displayMode) return props.displayMode === 'contain';
  return expanded.value;
})
const displayModeClass = computed(() => isContain.value ? 'object-contain' : 'object-cover')

const imgStyle = computed(() => {
  let style = ''
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
  isLoading.value = true
  try {
    const url = await uploadToImageKit(file)
    emit('update:modelValue', url)
  } finally {
    isLoading.value = false
  }
}

function toggleExpand() {
  expanded.value = !expanded.value
  emit('update:displayMode', expanded.value ? 'contain' : 'cover')
}

function removeImage() {
  emit('update:modelValue', '')
  emit('update:displayMode', 'cover')
}

// Se displayMode prop mudar, sincroniza o estado local
watch(() => props.displayMode, (val) => {
  if (val === 'contain') expanded.value = true
  else expanded.value = false
})
</script>

<style scoped>
img {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
</style> 
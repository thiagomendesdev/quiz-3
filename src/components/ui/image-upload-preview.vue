<template>
  <div :class="containerClass" :style="containerStyle">
    <button
      v-if="!hideAddButton && !imageUrl"
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
    <div v-if="imageUrl" 
         class="relative flex-shrink-0"
         :style="imageBoxStyle"
         :class="{ 'alt-image-preview': isAlt && imageUrl }"
    >
      <div 
        :class="['rounded-md w-full h-full overflow-hidden relative', displayModeClass, printBgClassName]"
        :style="{
          backgroundColor: dominantColor
        }"
      >
        <img
          :src="imageUrl"
          class="w-full h-full peer cursor-pointer"
          :class="[displayModeClass]"
          :style="imgStyle"
          @click="toggleExpand()"
          @load="onImageLoad"
          alt="Imagem da questão ou alternativa"
        />
        <div class="absolute top-2 right-2 flex gap-2 z-10 opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-opacity btn-remove">
          <Button @click.stop="removeImage" size="icon-sm" variant="default" type="button">
            <TrashIcon :size="16" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ImagePlus as ImagePlusIcon, Maximize2 as ExpandIcon, Minimize2 as ShrinkIcon, Trash as TrashIcon, Loader2 as LoaderIcon } from 'lucide-vue-next'
import { uploadToImageKit } from '@/lib/imagekit-upload'
import * as FastAverageColor from 'fast-average-color'
import { Button } from './button'

const props = defineProps({
  modelValue: String,
  maxWidth: { type: [Number, Boolean], default: false },
  maxHeight: { type: [Number, Boolean], default: false },
  displayMode: { type: String, default: '' }, // 'cover' ou 'contain'
  hideAddButton: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'update:displayMode'])

const fileInput = ref(null)
const isLoading = ref(false)
const expanded = ref(false)
const dominantColor = ref('#f3f3f3')
const localPreviewUrl = ref(null)
const printBgClassName = ref('')

const imageUrl = computed(() => localPreviewUrl.value || props.modelValue)

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

const hasImage = computed(() => !!(localPreviewUrl.value || props.modelValue))

function injectPrintBgColor(hex) {
  if (!hex) return '';
  const className = `print-bg-${hex.replace('#', '')}`;
  if (!document.getElementById(className)) {
    const style = document.createElement('style');
    style.id = className;
    style.innerHTML = `
      @media print {
        .${className} {
          background-color: ${hex} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
  return className;
}

async function calculateDominantColor(imgUrl) {
  if (!imgUrl) return
  try {
    // Create a temporary image element to ensure the image is loaded
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = imgUrl
    })

    const fac = new FastAverageColor.FastAverageColor()
    const color = await fac.getColor(img, {
      algorithm: 'dominant',
      mode: 'precision'
    })
    console.log('Dominant color calculated:', color)
    dominantColor.value = color.hex
    // Injeta a classe fixa para impressão
    printBgClassName.value = injectPrintBgColor(color.hex)
  } catch (error) {
    console.error('Error calculating dominant color:', error)
    dominantColor.value = '#f3f3f3'
    printBgClassName.value = ''
  }
}

function onImageLoad(event) {
  console.log('Image loaded:', imageUrl.value)
  if (imageUrl.value) {
    calculateDominantColor(imageUrl.value)
  }
}

function triggerFileInput() {
  fileInput.value.click()
}

async function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  // Cria preview local
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value)
  }
  localPreviewUrl.value = URL.createObjectURL(file)
  isLoading.value = true
  try {
    const url = await uploadToImageKit(file)
    emit('update:modelValue', url)
    // Limpa preview local após upload
    if (localPreviewUrl.value) {
      URL.revokeObjectURL(localPreviewUrl.value)
      localPreviewUrl.value = null
    }
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
  dominantColor.value = '#f3f3f3'
  if (fileInput.value) fileInput.value.value = ''
  if (localPreviewUrl.value) {
    URL.revokeObjectURL(localPreviewUrl.value)
    localPreviewUrl.value = null
  }
}

watch(() => props.displayMode, (val) => {
  if (val === 'contain') expanded.value = true
  else expanded.value = false
})

const printBgClass = computed(() => {
  if (isContain.value && dominantColor.value) {
    return printBgClassName.value;
  }
  return '';
});

defineExpose({ hasImage })
</script>

<style scoped>
img {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.object-contain {
  object-fit: contain;
}

.object-cover {
  object-fit: cover;
}

@media print {
  /* fundo fixo removido */
}
@media screen {
  /* fundo fixo removido */
}
</style> 
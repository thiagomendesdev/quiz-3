<template>
  <div class="relative flex flex-col items-start">
    <div class="flex items-center gap-2 w-full">
      <button
        class="icon-btn"
        type="button"
        @click="triggerFileInput"
        v-if="!imageUrl"
        title="Adicionar imagem"
      >
        <UploadIcon :size="18" />
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      />
      <div v-if="imageUrl" class="relative flex-1" :style="containerStyle">
        <img
          :src="imageUrl"
          :class="[expanded ? 'object-contain' : 'object-cover', 'rounded-md w-full h-full']"
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Upload as UploadIcon, Maximize2 as ExpandIcon, Minimize2 as ShrinkIcon, Trash as TrashIcon } from 'lucide-vue-next'
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

const containerStyle = computed(() => {
  let style = ''
  if (props.maxWidth && typeof props.maxWidth === 'number') style += `max-width:${props.maxWidth}px;`
  if (props.maxHeight && typeof props.maxHeight === 'number') style += `max-height:${props.maxHeight}px;`
  if (props.maxWidth === true) style += 'width:100%;'
  return style
})

const imgStyle = computed(() => {
  if (expanded.value) return 'max-width:100%; max-height:none;'
  let style = ''
  if (props.maxHeight && typeof props.maxHeight === 'number') style += `max-height:${props.maxHeight}px;`
  if (props.maxWidth && typeof props.maxWidth === 'number') style += `max-width:${props.maxWidth}px;`
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
  @apply bg-white/80 hover:bg-accent text-muted-foreground rounded-full p-1.5 shadow border border-input transition-colors;
}
img {
  transition: max-height 0.2s, max-width 0.2s;
  cursor: pointer;
}
</style> 
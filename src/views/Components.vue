<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Componentes</h1>
    
    <!-- Tabs -->
    <div class="mb-8">
      <div class="border-b">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              activeTab === tab.name
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'shadcn'">
      <!-- Seção de Botões -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Button</h2>
        
        <!-- Botões Apenas com Ícone -->
        <div class="mb-8">
          <h3 class="text-xl font-medium mb-4">Button Icon</h3>
          
          <div class="grid gap-4">
            <!-- Variantes -->
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium mb-2">Button Variants</h4>
              <div class="flex gap-4 flex-wrap">
                <Button 
                  size="icon" 
                  variant="default" 
                  title="Button size='icon' variant='default'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  title="Button size='icon' variant='destructive'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  title="Button size='icon' variant='outline'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="secondary" 
                  title="Button size='icon' variant='secondary'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Button size='icon' variant='ghost'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="link" 
                  title="Button size='icon' variant='link'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <!-- Tamanhos -->
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium mb-2">Button Sizes</h4>
              <div class="flex items-center gap-4 mb-4">
                <Button 
                  size="icon-sm" 
                  variant="default" 
                  title="Button size='icon-sm'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="default" 
                  title="Button size='icon'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon-lg" 
                  variant="default" 
                  title="Button size='icon-lg'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </div>
              <div class="flex items-center gap-4">
                <Button size="sm" variant="default"><PlusIcon class="mr-2" />sm</Button>
                <Button variant="default"><PlusIcon class="mr-2" />default</Button>
                <Button size="lg" variant="default"><PlusIcon class="mr-2" />lg</Button>
              </div>
            </div>

            <!-- Estados -->
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium mb-2">Button States</h4>
              <div class="flex gap-4">
                <Button 
                  size="icon" 
                  variant="default" 
                  disabled 
                  title="Button size='icon' disabled"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="default" 
                  title="Button size='icon' with loading icon"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <Loader2Icon class="h-4 w-4 animate-spin" />
                </Button>
              </div>
            </div>

            <!-- Diferentes Ícones -->
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium mb-2">Button Icons</h4>
              <div class="flex gap-4">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Button size='icon' variant='ghost' with TrashIcon"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Button size='icon' variant='ghost' with EditIcon"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <EditIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Button size='icon' variant='ghost' with PlusIcon"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <PlusIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Button size='icon' variant='ghost' with SearchIcon"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <SearchIcon class="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  title="Button size='icon' variant='ghost' with SettingsIcon"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <SettingsIcon class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões com Ícone -->
        <div class="mb-8">
          <h3 class="text-xl font-medium mb-4">Button with Icon</h3>
          
          <div class="grid gap-4">
            <!-- Variantes -->
            <div class="p-4 border rounded-lg">
              <h4 class="font-medium mb-2">Button Variants</h4>
              <div class="flex gap-4 flex-wrap">
                <Button 
                  title="Button variant='default'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="mr-2 h-4 w-4" />
                  Deletar
                </Button>
                <Button 
                  variant="destructive" 
                  title="Button variant='destructive'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="mr-2 h-4 w-4" />
                  Deletar
                </Button>
                <Button 
                  variant="outline" 
                  title="Button variant='outline'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="mr-2 h-4 w-4" />
                  Deletar
                </Button>
                <Button 
                  variant="secondary" 
                  title="Button variant='secondary'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="mr-2 h-4 w-4" />
                  Deletar
                </Button>
                <Button 
                  variant="ghost" 
                  title="Button variant='ghost'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="mr-2 h-4 w-4" />
                  Deletar
                </Button>
                <Button 
                  variant="link" 
                  title="Button variant='link'"
                  @click="copyToClipboard"
                  class="copy-button"
                >
                  <TrashIcon class="mr-2 h-4 w-4" />
                  Deletar
                </Button>
              </div>
              <h4 class="font-medium mb-2 mt-6">Button with Icon Sizes</h4>
              <div class="flex gap-4 flex-wrap items-center">
                <Button size="sm" variant="default"><PlusIcon class="mr-1" />sm</Button>
                <Button variant="default"><PlusIcon class="mr-2" />default</Button>
                <Button size="lg" variant="default"><PlusIcon class="mr-2" />lg</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Inputs -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Input</h2>
        
        <div class="grid gap-4">
          <!-- Inputs Básicos -->
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">Input Types</h4>
            <div class="flex flex-col gap-4 max-w-md">
              <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label 
                  for="email" 
                  title="Label component"
                  @click="copyToClipboard"
                  class="copy-button"
                >Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="Email" 
                  title="Input type='email'"
                  @click="copyToClipboard"
                  class="copy-button"
                />
              </div>
              <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label 
                  for="password" 
                  title="Label component"
                  @click="copyToClipboard"
                  class="copy-button"
                >Senha</Label>
                <Input 
                  type="password" 
                  id="password" 
                  placeholder="Senha" 
                  title="Input type='password'"
                  @click="copyToClipboard"
                  class="copy-button"
                />
              </div>
            </div>
          </div>

          <!-- Estados -->
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-2">Input States</h4>
            <div class="flex flex-col gap-4 max-w-md">
              <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label 
                  for="disabled" 
                  title="Label component"
                  @click="copyToClipboard"
                  class="copy-button"
                >Disabled</Label>
                <Input 
                  type="text" 
                  id="disabled" 
                  disabled 
                  placeholder="Disabled" 
                  title="Input disabled"
                  @click="copyToClipboard"
                  class="copy-button"
                />
              </div>
              <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label 
                  for="error" 
                  title="Label component"
                  @click="copyToClipboard"
                  class="copy-button"
                >Error</Label>
                <Input 
                  type="text" 
                  id="error" 
                  class="border-red-500 copy-button" 
                  placeholder="Error" 
                  title="Input with error state"
                  @click="copyToClipboard"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Border Radius -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">Border Radius</h2>
        
        <div class="grid gap-4">
          <div class="p-4 border rounded-lg">
            <h4 class="font-medium mb-4">Radix Border Radius</h4>
            <div class="grid gap-4">
              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-none flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-none"
                  @click="copyToClipboard"
                >
                  None
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-none</code>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-sm flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-sm"
                  @click="copyToClipboard"
                >
                  Small
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-sm</code>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-md flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-md"
                  @click="copyToClipboard"
                >
                  Medium
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-md</code>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-lg"
                  @click="copyToClipboard"
                >
                  Large
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-lg</code>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-xl"
                  @click="copyToClipboard"
                >
                  XL
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-xl</code>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-2xl"
                  @click="copyToClipboard"
                >
                  2XL
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-2xl</code>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-3xl"
                  @click="copyToClipboard"
                >
                  3XL
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-3xl</code>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div 
                  class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground copy-button"
                  title="rounded-full"
                  @click="copyToClipboard"
                >
                  Full
                </div>
                <div class="flex-1">
                  <code class="text-sm">rounded-full</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else-if="activeTab === 'own'">
      <!-- Question Type Multiple -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">qt-multiple</h2>
        <div class="p-4 border rounded-lg">
          <QtMultiple />
        </div>
      </section>

      <!-- Image Upload Preview -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">image-upload-preview</h2>
        <div class="p-4 border rounded-lg">
          <ImageUploadPreview />
        </div>
      </section>

      <!-- Question Type Card -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">question-type-card</h2>
        <div class="p-4 border rounded-lg">
          <QuestionTypeCard />
        </div>
      </section>

      <!-- Rich Text Editor -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">rich-text-editor</h2>
        <div class="p-4 border rounded-lg">
          <RichTextEditor />
        </div>
      </section>

      <!-- RTE Paragraph -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">rte-paragraph</h2>
        <div class="p-4 border rounded-lg">
          <RteParagraph />
        </div>
      </section>

      <!-- RTE Large -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-4">rte-large</h2>
        <div class="p-4 border rounded-lg">
          <RteLarge />
        </div>
      </section>
    </div>

    <!-- Toast de feedback -->
    <div 
      v-if="showToast" 
      class="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-md shadow-lg transition-opacity duration-300"
      :class="{ 'opacity-0': !showToast }"
    >
      Código copiado para a área de transferência!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  TrashIcon, 
  Loader2Icon, 
  EditIcon, 
  PlusIcon, 
  SearchIcon, 
  SettingsIcon 
} from 'lucide-vue-next'
import QtMultiple from '@/components/qt-multiple.vue'
import ImageUploadPreview from '@/components/ui/image-upload-preview.vue'
import QuestionTypeCard from '@/components/ui/question-type-card.vue'
import RichTextEditor from '@/components/ui/rich-text-editor.vue'
import RteParagraph from '@/components/ui/rte-paragraph.vue'
import RteLarge from '@/components/ui/rte-large.vue'

const activeTab = ref('shadcn')
const tabs = [
  { name: 'shadcn', label: 'Shadcn' },
  { name: 'own', label: 'Own' }
]

const showToast = ref(false)

const copyToClipboard = async (event) => {
  const title = event.currentTarget.getAttribute('title')
  if (title) {
    try {
      await navigator.clipboard.writeText(title)
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }
}
</script>

<style>
/* Estilização do tooltip nativo */
[title] {
  position: relative;
}

[title]:hover::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: #333;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  margin-bottom: 4px;
}

/* Estilo para elementos clicáveis */
.copy-button {
  cursor: pointer;
}
</style> 
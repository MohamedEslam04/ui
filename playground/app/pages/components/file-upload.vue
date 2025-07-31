<template>
  <div class="space-y-8 p-6 max-w-4xl mx-auto">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900">
        FileUpload Component Examples
      </h1>
      <p class="text-gray-600 mt-2">
        Comprehensive examples with loading progress and upload features
      </p>
    </div>

    <!-- Original Form Example (Enhanced) -->
    <div class="p-6 rounded-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">
        Form Integration with Validation
      </h2>
      <div class="flex flex-col items-center gap-8 max-w-md mx-auto">
        <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
          <UFormField name="avatar" label="Avatar" description="JPG, PNG or WebP. 2MB Max." :size="size">
            <UFileUpload
              v-slot="{ open, removeFile }"
              v-model="state.avatar"
              accept="image/*"
              :show-progress="true"
              :upload-fn="realUpload"
              :auto-upload="false"
              @upload:success="onUploadSuccess"
              @upload:error="onUploadError"
            >
              <div class="flex flex-wrap items-center gap-3">
                <UAvatar
                  size="lg"
                  :src="state.avatar ? createObjectUrl(state.avatar.file) : undefined"
                  icon="i-lucide-image"
                />

                <div class="flex flex-col gap-2">
                  <UButton :label="state.avatar ? 'Change image' : 'Upload image'" color="neutral" @click="open()" />

                  <div v-if="state.avatar" class="text-xs space-y-1">
                    <p class="text-gray-600">
                      {{ state.avatar.file.name }}
                    </p>
                    <div v-if="state.avatar.uploading" class="flex items-center gap-2">
                      <UProgress :value="state.avatar.progress || 0" size="xs" class="flex-1" />
                      <span class="text-xs">{{ Math.round(state.avatar.progress || 0) }}%</span>
                    </div>
                    <UButton
                      v-if="!state.avatar.uploading"
                      label="Remove"
                      color="error"
                      variant="link"
                      size="xs"
                      class="p-0"
                      @click="removeFile()"
                    />
                  </div>
                </div>
              </div>
            </UFileUpload>
          </UFormField>

          <UButton label="Submit" type="submit" :disabled="!state.avatar || state.avatar.uploading" block />
        </UForm>
      </div>
    </div>

    <!-- Upload Settings Panel -->
    <div class="p-4 rounded-lg">
      <h3 class="font-semibold mb-3">
        Upload Simulation Settings
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UFormField label="Upload Delay (ms)">
          <UInput v-model.number="uploadSettings.uploadDelay" type="number" min="1000" max="10000" />
        </UFormField>
        <UFormField label="Error Rate (0-1)">
          <UInput v-model.number="uploadSettings.errorRate" type="number" min="0" max="1" step="0.1" />
        </UFormField>
        <UFormField label="Simulate Errors">
          <USwitch v-model="uploadSettings.simulateErrors" />
        </UFormField>
      </div>
    </div>

    <!-- Basic Upload with Progress -->
    <div class="p-6 rounded-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">
        Basic Upload with Progress
      </h2>
      <UFileUpload
        v-model="singleFile"
        label="Upload a file"
        description="Select a file to upload with progress tracking"
        :show-progress="true"
        :auto-upload="true"
        :upload-fn="simulateUpload"
        class="w-full"
        @upload:start="onUploadStart"
        @upload:progress="onUploadProgress"
        @upload:success="onUploadSuccess"
        @upload:error="onUploadError"
        @upload:cancel="onUploadCancel"
      />
    </div>

    <!-- Multiple Files with Auto Upload -->
    <div class="p-6 rounded-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">
        Multiple Files with Auto Upload
      </h2>
      <UFileUpload
        v-model="multipleFiles"
        multiple
        label="Upload multiple files"
        description="Files will be uploaded automatically when selected"
        :show-progress="true"
        auto-upload
        :upload-fn="simulateUpload"
        :allow-cancel="true"
        layout="list"
        class="w-full"
        @upload:start="onUploadStart"
        @upload:progress="onUploadProgress"
        @upload:success="onUploadSuccess"
        @upload:error="onUploadError"
        @upload:cancel="onUploadCancel"
      />
    </div>

    <!-- Grid Layout with Progress -->
    <div class="p-6 rounded-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">
        Grid Layout with Progress Overlay
      </h2>
      <UFileUpload
        v-model="gridFiles"
        multiple
        label="Upload images"
        description="Images will be displayed in a grid with progress overlay"
        accept="image/*"
        :show-progress="true"
        :auto-upload="true"
        :upload-fn="simulateUpload"
        layout="grid"
        class="w-full"
        @upload:start="onUploadStart"
        @upload:progress="onUploadProgress"
        @upload:success="onUploadSuccess"
        @upload:error="onUploadError"
      />
    </div>

    <!-- Advanced Progress Tracking -->
    <div class="p-6 rounded-lg border border-gray-200">
      <h2 class="text-xl font-semibold mb-4">
        Advanced Progress Tracking
      </h2>
      <div class="space-y-4">
        <div v-if="progressFiles.length" class="p-4 rounded-lg">
          <div class="flex items-center justify-between mb-2">
            <span class="font-medium">Overall Progress</span>
            <span class="text-sm text-gray-600">{{ totalProgress }}%</span>
          </div>
          <UProgress :value="totalProgress" size="sm" />
        </div>

        <UFileUpload
          v-model="progressFiles"
          multiple
          label="Upload with detailed progress"
          description="Track overall and individual file progress"
          :show-progress="true"
          :auto-upload="false"
          :upload-fn="simulateUpload"
          layout="list"
          class="w-full"
          @upload:start="onUploadStart"
          @upload:progress="onUploadProgress"
          @upload:success="onUploadSuccess"
          @upload:error="onUploadError"
          @upload:cancel="onUploadCancel"
        >
          <template #actions="{ files, uploadFile, removeFile, cancelUpload }">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-if="files?.length"
                color="primary"
                :disabled="isUploading"
                icon="i-lucide-upload"
                @click="uploadAll(files, uploadFile)"
              >
                Upload All ({{ files.length }})
              </UButton>
              <UButton
                v-if="files?.some(f => f.uploading)"
                color="warning"
                variant="outline"
                icon="i-lucide-x"
                @click="cancelAllUploads(files, cancelUpload)"
              >
                Cancel All
              </UButton>
              <UButton
                v-if="files?.length"
                color="neutral"
                variant="outline"
                :disabled="files.some(f => f.uploading)"
                icon="i-lucide-trash"
                @click="removeAll(removeFile)"
              >
                Clear All
              </UButton>
            </div>
          </template>
        </UFileUpload>
      </div>

      <!-- Custom Upload Control -->
      <div class="p-6 rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">
          Custom Upload Control
        </h2>
        <UFileUpload
          v-model="customFiles"
          multiple
          label="Manual upload control"
          description="Full control over upload process with custom actions"
          :show-progress="true"
          :auto-upload="false"
          :upload-fn="simulateUpload"
          layout="list"
          class="w-full"
          @upload:start="onUploadStart"
          @upload:progress="onUploadProgress"
          @upload:success="onUploadSuccess"
          @upload:error="onUploadError"
          @upload:cancel="onUploadCancel"
        >
          <template #actions="{ files, uploadFile, removeFile, cancelUpload }">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-if="files?.length"
                color="primary"
                :disabled="isUploading"
                @click="uploadAll(files, uploadFile)"
              >
                Upload All ({{ files.length }})
              </UButton>
              <UButton
                v-if="files?.some(f => f.uploading)"
                color="warning"
                variant="outline"
                @click="cancelAllUploads(files, cancelUpload)"
              >
                Cancel All Uploads
              </UButton>
              <UButton
                v-if="files?.length"
                color="neutral"
                variant="outline"
                :disabled="isUploading"
                @click="removeAll(removeFile)"
              >
                Clear All
              </UButton>
            </div>
          </template>

          <!-- Custom file progress display -->
          <template #file-progress="{ fileUpload }">
            <div class="flex items-center gap-2 w-full">
              <UProgress
                :value="fileUpload.progress || 0"
                :color="fileUpload.error ? 'error' : 'primary'"
                size="sm"
                class="flex-1"
              />
              <span class="text-xs font-mono whitespace-nowrap">
                {{ Math.round(fileUpload.progress || 0) }}%
              </span>
            </div>
          </template>
        </UFileUpload>
      </div>

      <!-- Configuration Panel -->
      <div class="p-6 rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">
          Component Configuration
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <UFormField label="Size">
            <USelect v-model="size" :options="sizes" />
          </UFormField>
          <UFormField label="Variant">
            <USelect v-model="variant" :options="variants" />
          </UFormField>
          <UFormField label="Layout">
            <USelect v-model="layout" :options="layouts" />
          </UFormField>
          <UFormField label="Position">
            <USelect v-model="position" :options="positions" />
          </UFormField>
        </div>
      </div>

      <!-- Original Examples (Updated) -->
      <div class="p-6 rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">
          Original Examples with Progress
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="font-medium mb-2">
              Single File Upload
            </h3>
            <UFileUpload
              v-model="singleFile"
              :size="size"
              :variant="variant"
              :layout="layout"
              :position="position"
              label="Drop your image here"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              :show-progress="true"
              auto-upload
              :upload-fn="simulateUpload"
              :class="variant === 'area' ? 'w-full min-h-44' : ''"
              @upload:start="onUploadStart"
              @upload:progress="onUploadProgress"
              @upload:success="onUploadSuccess"
              @upload:error="onUploadError"
            />
          </div>

          <div>
            <h3 class="font-medium mb-2">
              Multiple Files with Custom Actions
            </h3>
            <UFileUpload
              v-model="multipleFiles"
              :size="size"
              :variant="variant"
              :layout="layout"
              :position="position"
              icon="i-lucide-image"
              label="Drop your images here"
              description="SVG, PNG, JPG or GIF (max. 2MB)"
              multiple
              :interactive="false"
              :show-progress="true"
              :upload-fn="simulateUpload"
              class="w-full min-h-44"
              @upload:start="onUploadStart"
              @upload:progress="onUploadProgress"
              @upload:success="onUploadSuccess"
              @upload:error="onUploadError"
            >
              <template #actions="{ open }">
                <UButton
                  label="Select images"
                  icon="i-lucide-upload"
                  color="neutral"
                  variant="outline"
                  :size="size"
                  @click="open()"
                />
              </template>

              <template v-if="layout === 'grid' || position === 'inside'" #files-top="{ open, files }">
                <div v-if="files?.length" class="mb-2 flex items-center justify-between">
                  <p class="font-bold">
                    Files ({{ files?.length }})
                  </p>

                  <UButton
                    label="Add files"
                    color="neutral"
                    variant="outline"
                    :size="size"
                    class="-my-2"
                    @click="open()"
                  />
                </div>
              </template>

              <template v-if="layout === 'list'" #files-bottom="{ removeFile, files }">
                <UButton
                  v-if="files?.length"
                  label="Remove files"
                  color="neutral"
                  variant="outline"
                  class="self-start"
                  :size="size"
                  @click="removeFile(0)"
                />
              </template>
            </UFileUpload>
          </div>
        </div>
      </div>

      <!-- Upload Events Log -->
      <div v-if="uploadEvents.length" class="p-6 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">
            Upload Events Log
          </h2>
          <div class="flex gap-2">
            <UBadge :label="`${uploadEvents.length} events`" color="secondary" variant="soft" />
            <UButton color="neutral" variant="outline" size="xs" @click="clearEvents">
              Clear Log
            </UButton>
          </div>
        </div>

        <div class="rounded-lg max-h-96 overflow-y-auto">
          <div v-for="(event, index) in uploadEvents" :key="index" class="p-3 border-b border-gray-200 last:border-b-0">
            <div class="flex items-start gap-3">
              <span class="font-mono text-xs text-gray-500 whitespace-nowrap mt-0.5">
                {{ event.timestamp }}
              </span>
              <span :class="getEventClass(event.type)" class="whitespace-nowrap">
                {{ event.type }}
              </span>
              <span class="text-sm text-gray-700 flex-1 min-w-0">
                {{ event.message }}
              </span>
              <UBadge
                v-if="event.fileId"
                :label="event.fileId.slice(0, 8) + '...'"
                size="xs"
                color="primary"
                variant="soft"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- API Documentation -->
      <div class="p-6 rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold mb-4">
          API Documentation
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold mb-3">
              New Props
            </h3>
            <div class="space-y-3 text-sm">
              <div class="p-3 rounded">
                <code class="font-mono text-xs">showProgress: boolean</code>
                <p class="text-gray-600 mt-1">
                  Enable/disable progress display
                </p>
              </div>
              <div class="p-3 rounded">
                <code class="font-mono text-xs">allowCancel: boolean</code>
                <p class="text-gray-600 mt-1">
                  Allow cancelling uploads in progress
                </p>
              </div>
              <div class="p-3 rounded">
                <code class="font-mono text-xs">uploadFn: Function</code>
                <p class="text-gray-600 mt-1">
                  Custom upload function with progress callback
                </p>
              </div>
              <div class="p-3 rounded">
                <code class="font-mono text-xs">autoUpload: boolean</code>
                <p class="text-gray-600 mt-1">
                  Automatically start upload when files are selected
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold mb-3">
              New Events
            </h3>
            <div class="space-y-3 text-sm">
              <div class="p-3 rounded">
                <code class="font-mono text-xs">@upload:start</code>
                <p class="text-gray-600 mt-1">
                  Fired when upload begins
                </p>
              </div>
              <div class="p-3 rounded">
                <code class="font-mono text-xs">@upload:progress</code>
                <p class="text-gray-600 mt-1">
                  Fired during upload progress
                </p>
              </div>
              <div class="p-3 rounded">
                <code class="font-mono text-xs">@upload:success</code>
                <p class="text-gray-600 mt-1">
                  Fired on successful upload
                </p>
              </div>
              <div class="p-3 rounded">
                <code class="font-mono text-xs">@upload:error</code>
                <p class="text-gray-600 mt-1">
                  Fired on upload failure
                </p>
              </div>
              <div class="p-3 rounded">
                <code class="font-mono text-xs">@upload:cancel</code>
                <p class="text-gray-600 mt-1">
                  Fired when upload is cancelled
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </template><template> -->
    <div class="space-y-8 p-6">
      <h1 class="text-2xl font-bold">
        FileUpload Component Examples
      </h1>

      <!-- Basic File Upload with Progress -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">
          Basic Upload with Progress
        </h2>
        <UFileUpload
          v-model="singleFile"
          label="Upload a file"
          description="Select a file to upload with progress tracking"
          :show-progress="true"
          :auto-upload="false"
          :upload-fn="simulateUpload"
          @upload:start="onUploadStart"
          @upload:progress="onUploadProgress"
          @upload:success="onUploadSuccess"
          @upload:error="onUploadError"
          @upload:cancel="onUploadCancel"
        />
      </div>

      <!-- Multiple Files with Auto Upload -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">
          Multiple Files with Auto Upload
        </h2>
        <UFileUpload
          v-model="multipleFiles"
          multiple
          label="Upload multiple files"
          description="Files will be uploaded automatically"
          :show-progress="true"
          :auto-upload="true"
          :upload-fn="simulateUpload"
          :allow-cancel="true"
          layout="list"
          @upload:start="onUploadStart"
          @upload:progress="onUploadProgress"
          @upload:success="onUploadSuccess"
          @upload:error="onUploadError"
          @upload:cancel="onUploadCancel"
        />
      </div>

      <!-- Grid Layout with Progress -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">
          Grid Layout with Progress
        </h2>
        <UFileUpload
          v-model="gridFiles"
          multiple
          label="Upload images"
          description="Images will be displayed in a grid"
          accept="image/*"
          :show-progress="true"
          :auto-upload="true"
          :upload-fn="simulateUpload"
          layout="grid"
          @upload:start="onUploadStart"
          @upload:progress="onUploadProgress"
          @upload:success="onUploadSuccess"
          @upload:error="onUploadError"
        />
      </div>

      <!-- Custom Upload Actions -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold">
          Custom Actions
        </h2>
        <UFileUpload
          v-model="customFiles"
          multiple
          label="Custom upload control"
          description="Manual upload control with custom actions"
          :show-progress="true"
          :auto-upload="false"
          :upload-fn="simulateUpload"
          layout="list"
        >
          <template #actions="{ files, uploadFile, removeFile }">
            <UButton v-if="files?.length" color="primary" :disabled="isUploading" @click="uploadAll(files, uploadFile)">
              Upload All ({{ files.length }})
            </UButton>
            <UButton
              v-if="files?.length"
              color="neutral"
              variant="outline"
              :disabled="isUploading"
              @click="removeAll(removeFile)"
            >
              Clear All
            </UButton>
          </template>
        </UFileUpload>
      </div>

      <!-- Upload Status Display -->
      <div v-if="uploadEvents.length" class="space-y-4">
        <h2 class="text-lg font-semibold">
          Upload Events Log
        </h2>
        <div class="p-4 rounded-lg max-h-64 overflow-y-auto">
          <div v-for="(event, index) in uploadEvents" :key="index" class="text-sm mb-2">
            <span class="font-mono text-xs text-gray-500">{{ event.timestamp }}</span>
            <span :class="getEventClass(event.type)">{{ event.type }}</span>
            <span class="text-gray-700">{{ event.message }}</span>
          </div>
        </div>
        <UButton color="neutral" variant="outline" @click="clearEvents">
          Clear Log
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import * as z from 'zod'
import theme from '#build/ui/file-upload'
import type { FileUploadFile, FormSubmitEvent } from '#ui/types'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant) as Array<keyof typeof theme.variants.variant>
const layouts = Object.keys(theme.variants.layout) as Array<keyof typeof theme.variants.layout>
const positions = Object.keys(theme.variants.position) as Array<keyof typeof theme.variants.position>

const size = ref<keyof typeof theme.variants.size>('md')
const variant = ref<keyof typeof theme.variants.variant>('area')
const layout = ref<keyof typeof theme.variants.layout>('grid')
const position = ref<keyof typeof theme.variants.position>('outside')

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MIN_DIMENSIONS = { width: 200, height: 200 }
const MAX_DIMENSIONS = { width: 4096, height: 4096 }
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Enhanced schema to work with FileUploadFile
const schema = z.object({
  avatar: z
    .custom<FileUploadFile>(val => val && typeof val === 'object' && 'file' in val, {
      message: 'Please select an image file.'
    })
    .refine(fileUpload => fileUpload.file.size <= MAX_FILE_SIZE, {
      message: `The image is too large. Please choose an image smaller than ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine(fileUpload => ACCEPTED_IMAGE_TYPES.includes(fileUpload.file.type), {
      message: 'Please upload a valid image file (JPEG, PNG, or WebP).'
    })
    .refine(
      fileUpload =>
        new Promise((resolve) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
              const meetsDimensions
                = img.width >= MIN_DIMENSIONS.width
                  && img.height >= MIN_DIMENSIONS.height
                  && img.width <= MAX_DIMENSIONS.width
                  && img.height <= MAX_DIMENSIONS.height
              resolve(meetsDimensions)
            }
            img.src = e.target?.result as string
          }
          reader.readAsDataURL(fileUpload.file)
        }),
      {
        message: `The image dimensions are invalid. Please upload an image between ${MIN_DIMENSIONS.width}x${MIN_DIMENSIONS.height} and ${MAX_DIMENSIONS.width}x${MAX_DIMENSIONS.height} pixels.`
      }
    )
})

type schema = z.output<typeof schema>

const state = reactive<Partial<schema>>({
  avatar: undefined
})

// File models for different examples
const singleFile = ref<FileUploadFile | null>(null)
const multipleFiles = ref<FileUploadFile[]>([])
const gridFiles = ref<FileUploadFile[]>([])
const customFiles = ref<FileUploadFile[]>([])
const progressFiles = ref<FileUploadFile[]>([])

// Upload events log
const uploadEvents = ref<Array<{
  timestamp: string
  type: string
  message: string
  fileId?: string
}>>([])

// Upload simulation settings
const uploadSettings = reactive({
  simulateErrors: false,
  uploadDelay: 3000,
  errorRate: 0.1
})

// Computed properties
const isUploading = computed(() => {
  return customFiles.value?.some(file => file.uploading) ?? false
})

const totalProgress = computed(() => {
  if (!progressFiles.value?.length) return 0
  const total = progressFiles.value.reduce((sum, file) => sum + (file.progress || 0), 0)
  return Math.round(total / progressFiles.value.length)
})

const upload = useUpload('/api/blob', { method: 'PUT' })

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

// Enhanced upload simulation with more realistic behavior
async function simulateUpload(
  file: File,
  onProgress: (progress: number) => void,
  signal?: AbortSignal
): Promise<{ url: string, id: string }> {
  return new Promise((resolve, reject) => {
    let progress = 0
    const totalTime = uploadSettings.uploadDelay + Math.random() * 2000
    const interval = 50
    const increment = (interval / totalTime) * 100

    // Simulate network delay at start
    setTimeout(() => {
      const timer = setInterval(() => {
        // Check if upload was cancelled
        if (signal?.aborted) {
          clearInterval(timer)
          reject(new Error('Upload cancelled'))
          return
        }

        // Simulate realistic progress curve (slower at start and end)
        const progressFactor = Math.sin((progress / 100) * Math.PI / 2)
        progress += increment * (0.5 + progressFactor)
        progress = Math.min(progress, 100)

        onProgress(progress)

        if (progress >= 100) {
          clearInterval(timer)

          // Simulate occasional failures
          if (uploadSettings.simulateErrors && Math.random() < uploadSettings.errorRate) {
            const errors = [
              'Network error occurred',
              'Server is temporarily unavailable',
              'File type not supported by server',
              'Upload quota exceeded'
            ]
            reject(new Error(errors[Math.floor(Math.random() * errors.length)]))
          } else {
            resolve({
              url: `https://example.com/uploads/${Date.now()}-${file.name}`,
              id: Math.random().toString(36).substr(2, 9)
            })
          }
        }
      }, interval)
    }, Math.random() * 500) // Random initial delay
  })
}

// Real upload function for form submission
async function realUpload(
  file: File,
  onProgress: (progress: number) => void,
  signal?: AbortSignal
): Promise<{ url: string, id: string }> {
  try {
    const result = await upload(file) as unknown as { url: string, id: string }
    onProgress(100)
    return result
  } catch (error) {
    if (signal?.aborted) {
      throw new Error('Upload cancelled')
    }
    throw error
  }
}

// Event handlers
function onUploadStart(file: FileUploadFile, index: number) {
  // index is zero-based; add 1 if you want a human-friendly “1st, 2nd” count
  addEvent(
    'UPLOAD_START',
    `#${index + 1} – Started uploading: ${file.file.name}`,
    file.file.name
  )
}

function onUploadProgress(file: FileUploadFile, progress: number, index: number) {
  if (progress % 25 === 0 || progress === 100) {
    addEvent(
      'UPLOAD_PROGRESS',
      `#${index + 1} – ${file.file.name}: ${Math.round(progress)}%`,
      file.file.name
    )
  }
}

function onUploadSuccess(file: FileUploadFile, result: any, index: number) {
  addEvent(
    'UPLOAD_SUCCESS',
    `#${index + 1} – ${file.file.name} → ${result.url}`,
    file.file.name
  )
}

function onUploadError(file: FileUploadFile, error: string, index: number) {
  addEvent(
    'UPLOAD_ERROR',
    `#${index + 1} – Failed to upload ${file.file.name}: ${error}`,
    file.file.name
  )
}

function onUploadCancel(file: FileUploadFile, index: number) {
  addEvent(
    'UPLOAD_CANCEL',
    `#${index + 1} – Cancelled upload: ${file.file.name}`,
    file.file.name
  )
}

// Helper functions
function addEvent(type: string, message: string, fileId?: string) {
  uploadEvents.value.unshift({
    timestamp: new Date().toLocaleTimeString(),
    type,
    message,
    fileId
  })

  // Keep only last 100 events
  if (uploadEvents.value.length > 100) {
    uploadEvents.value = uploadEvents.value.slice(0, 100)
  }
}

function getEventClass(type: string): string {
  const classes = {
    UPLOAD_START: 'text-blue-600 font-medium',
    UPLOAD_PROGRESS: 'text-yellow-600 font-medium',
    UPLOAD_SUCCESS: 'text-green-600 font-medium',
    UPLOAD_ERROR: 'text-red-600 font-medium',
    UPLOAD_CANCEL: 'text-gray-600 font-medium'
  }
  return `mx-2 px-2 py-1 rounded text-xs ${classes[type as keyof typeof classes] || 'text-gray-600'}`
}

function clearEvents() {
  uploadEvents.value = []
}

// Custom actions
function uploadAll(files: FileUploadFile[], uploadFile: (index: number) => void) {
  files.forEach((file, index) => {
    if (!file.uploading && !file.progress) {
      uploadFile(index)
    }
  })
}

function removeAll(removeFile: (index?: number) => void) {
  removeFile() // Remove all files
}

function cancelAllUploads(files: FileUploadFile[], cancelUpload: (index: number) => void) {
  files.forEach((file, index) => {
    if (file.uploading) {
      cancelUpload(index)
    }
  })
}

// Form submission
async function onSubmit(event: FormSubmitEvent<schema>) {
  if (!event.data.avatar) return

  try {
    const res = await upload(event.data.avatar.file)
    console.log('Form upload result:', res)
    addEvent('FORM_SUCCESS', `Form submitted successfully: ${event.data.avatar.file.name}`)
  } catch (error) {
    console.error('Form upload error:', error)
    const message = error instanceof Error ? error.message : String(error)
    addEvent('FORM_ERROR', `Form submission failed: ${message}`)
  }
}
</script>

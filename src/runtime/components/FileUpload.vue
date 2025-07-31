<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { UseFileDialogReturn } from '@vueuse/core'
import theme from '#build/ui/file-upload'
import type { ButtonProps } from '../types'
import type { ComponentConfig } from '../types/utils'

type FileUpload = ComponentConfig<typeof theme, AppConfig, 'fileUpload'>

export interface FileUploadFile {
  file: File
  progress?: number
  uploading?: boolean
  error?: string
  abortController?: AbortController
}

export interface FileUploadProps<M extends boolean = false> {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  id?: string
  name?: string
  /**
   * The icon to display.
   * @defaultValue appConfig.ui.icons.upload
   * @IconifyIcon
   */
  icon?: string
  label?: string
  description?: string
  /**
   * @defaultValue 'primary'
   */
  color?: FileUpload['variants']['color']
  /**
   * The `button` variant is only available when `multiple` is `false`.
   * @defaultValue 'area'
   */
  variant?: FileUpload['variants']['variant']
  /**
   * @defaultValue 'md'
   */
  size?: FileUpload['variants']['size']
  /**
   * The layout of how files are displayed.
   * Only works when `variant` is `area`.
   * @defaultValue 'list'
   */
  layout?: FileUpload['variants']['layout']
  /**
   * The position of the files.
   * Only works when `variant` is `area` and when `layout` is `list`.
   * @defaultValue 'outside'
   */
  position?: FileUpload['variants']['position']
  /** Highlight the ring color like a focus state. */
  highlight?: boolean
  /**
   * Specifies the allowed file types for the input. Provide a comma-separated list of MIME types or file extensions (e.g., "image/png,application/pdf,.jpg").
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/accept
   * @defaultValue '*'
   */
  accept?: string
  multiple?: M & boolean
  /**
   * Reset the file input when the dialog is opened.
   * @defaultValue false
   */
  reset?: boolean
  /**
   * Create a zone that allows the user to drop files onto it.
   * @defaultValue true
   */
  dropzone?: boolean
  /**
   * Make the dropzone interactive when the user is clicking on it.
   * @defaultValue true
   */
  interactive?: boolean
  required?: boolean
  disabled?: boolean
  /**
   * The icon to display for the file.
   * @defaultValue appConfig.ui.icons.file
   * @IconifyIcon
   */
  fileIcon?: string
  /**
   * Configure the delete button for the file.
   * When `layout` is `grid`, the default is `{ color: 'neutral', variant: 'solid', size: 'xs' }`{lang="ts-type"}
   * When `layout` is `list`, the default is `{ color: 'neutral', variant: 'link' }`{lang="ts-type"}
   */
  fileDelete?: boolean | Partial<ButtonProps>
  /**
   * The icon displayed to delete a file.
   * @defaultValue appConfig.ui.icons.close
   * @IconifyIcon
   */
  fileDeleteIcon?: string
  /**
   * Enable upload progress tracking
   * @defaultValue false
   */
  showProgress?: boolean
  /**
   * Allow cancelling uploads in progress
   * @defaultValue true
   */
  allowCancel?: boolean
  /**
   * Upload function that returns a promise with progress callback
   */
  uploadFn?: (file: File, onProgress: (progress: number) => void, signal?: AbortSignal) => Promise<any>
  /**
   * Auto-start upload when files are selected
   * @defaultValue false
   */
  autoUpload?: boolean
  /**
   * Upload timeout in milliseconds
   * @defaultValue 30000
   */
  uploadTimeout?: number
  /**
   * Max concurrent uploads when multiple is true
   * @defaultValue 3
   */
  maxConcurrentUploads?: number
  class?: any
  ui?: FileUpload['slots']
}

export interface FileUploadEmits<M extends boolean = false> {
  'update:modelValue': [payload: M extends true ? FileUploadFile[] : FileUploadFile | null]
  'change': [event: Event]
  'upload:start': [file: FileUploadFile, index: number]
  'upload:progress': [file: FileUploadFile, progress: number, index: number]
  'upload:success': [file: FileUploadFile, result: any, index: number]
  'upload:error': [file: FileUploadFile, error: string, index: number]
  'upload:cancel': [file: FileUploadFile, index: number]
  'upload:complete': [files: FileUploadFile[]]
}

type FileUploadFiles<M> = (M extends true ? FileUploadFile[] : FileUploadFile) | null

export interface FileUploadSlots<M extends boolean = false> {
  'default'(props: {
    open: UseFileDialogReturn['open']
    removeFile: (index?: number) => void
    uploadFile: (index: number) => void
    cancelUpload: (index: number) => void
  }): any
  'leading'(props?: {}): any
  'label'(props?: {}): any
  'description'(props?: {}): any
  'actions'(props: {
    files?: FileUploadFiles<M>
    open: UseFileDialogReturn['open']
    removeFile: (index?: number) => void
    uploadFile: (index: number) => void
    cancelUpload: (index: number) => void
  }): any
  'files'(props: { files?: FileUploadFiles<M> }): any
  'files-top'(props: {
    files?: FileUploadFiles<M>
    open: UseFileDialogReturn['open']
    removeFile: (index?: number) => void
    uploadFile: (index: number) => void
    cancelUpload: (index: number) => void
  }): any
  'files-bottom'(props: {
    files?: FileUploadFiles<M>
    open: UseFileDialogReturn['open']
    removeFile: (index?: number) => void
    uploadFile: (index: number) => void
    cancelUpload: (index: number) => void
  }): any
  'file'(props: { fileUpload: FileUploadFile, index: number }): any
  'file-leading'(props: { fileUpload: FileUploadFile, index: number }): any
  'file-name'(props: { fileUpload: FileUploadFile, index: number }): any
  'file-size'(props: { fileUpload: FileUploadFile, index: number }): any
  'file-progress'(props: { fileUpload: FileUploadFile, index: number }): any
  'file-trailing'(props: { fileUpload: FileUploadFile, index: number }): any
}
</script>

<script setup lang="ts" generic="M extends boolean = false">
import { computed, watch, ref, nextTick, readonly } from 'vue'
import { Primitive } from 'reka-ui'
import { createReusableTemplate } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useFormField } from '../composables/useFormField'
import { useFileUpload } from '../composables/useFileUpload'
import { tv } from '../utils/tv'
import UAvatar from './Avatar.vue'
import UButton from './Button.vue'
import UIcon from './Icon.vue'
import UProgress from './Progress.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FileUploadProps<M>>(), {
  accept: '*',
  multiple: false as never,
  reset: false,
  dropzone: true,
  interactive: true,
  layout: 'grid',
  position: 'outside',
  showProgress: false,
  allowCancel: true,
  autoUpload: false,
  uploadTimeout: 30000,
  maxConcurrentUploads: 3
})
const emits = defineEmits<FileUploadEmits<M>>()
const slots = defineSlots<FileUploadSlots<M>>()

const modelValue = defineModel<(M extends true ? FileUploadFile[] : FileUploadFile) | null>()

const appConfig = useAppConfig() as FileUpload['AppConfig']

// Track active uploads for concurrency control
const activeUploads = ref(0)
const uploadQueue = ref<{ index: number, fileUpload: FileUploadFile }[]>([])

const [DefineFilesTemplate, ReuseFilesTemplate] = createReusableTemplate()

const { isDragging, open, inputRef, dropzoneRef } = useFileUpload({
  accept: props.accept,
  reset: props.reset,
  multiple: props.multiple,
  dropzone: props.dropzone,
  onUpdate: onFileUpdate
})
const { emitFormInput, emitFormChange, id, name, disabled, ariaAttrs } = useFormField<FileUploadProps>(props)

const variant = computed(() => props.multiple ? 'area' : props.variant)
const layout = computed(() => props.variant === 'button' && !props.multiple ? 'grid' : props.layout)
const position = computed(() => {
  if (layout.value === 'grid' && props.multiple) {
    return 'inside'
  }
  if (variant.value === 'button') {
    return 'outside'
  }

  return props.position
})

// Computed property to determine if progress should be shown
const shouldShowProgress = computed(() => {
  return props.showProgress || props.autoUpload
})

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.fileUpload || {}) })({
  dropzone: props.dropzone,
  interactive: props.interactive,
  color: props.color,
  size: props.size,
  variant: variant.value,
  layout: layout.value,
  position: position.value,
  multiple: props.multiple,
  highlight: props.highlight,
  disabled: props.disabled,
  showProgress: shouldShowProgress.value
}))

function createObjectUrl(file: File): string {
  return URL.createObjectURL(file)
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const size = bytes / Math.pow(k, i)
  const formattedSize = i === 0 ? size.toString() : size.toFixed(0)

  return `${formattedSize}${sizes[i]}`
}

function createFileUploadObject(file: File): FileUploadFile {
  return {
    file,
    progress: 0,
    uploading: false,
    error: undefined,
    abortController: undefined
  }
}

async function onFileUpdate(files: File[], reset = false) {
  const fileUploads = files.map(createFileUploadObject)

  if (props.multiple) {
    if (reset) {
      modelValue.value = fileUploads as (M extends true ? FileUploadFile[] : FileUploadFile) | null
    } else {
      const existingFiles = (modelValue.value as FileUploadFile[]) || []
      modelValue.value = [...existingFiles, ...fileUploads] as (M extends true ? FileUploadFile[] : FileUploadFile) | null
    }
  } else {
    modelValue.value = fileUploads?.[0] as (M extends true ? FileUploadFile[] : FileUploadFile) | null
  }

  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value: modelValue.value } })
  emits('change', event)
  emitFormChange()
  emitFormInput()

  // Auto upload if enabled
  if (props.autoUpload && props.uploadFn) {
    await nextTick() // Ensure DOM is updated

    const newFiles = props.multiple ? fileUploads : (fileUploads[0] ? [fileUploads[0]] : [])

    for (let i = 0; i < newFiles.length; i++) {
      const actualIndex = props.multiple && !reset
        ? ((modelValue.value as FileUploadFile[])?.length || 0) - newFiles.length + i
        : i

      if (props.multiple) {
        // Queue uploads for multiple files to respect concurrency limit
        if (newFiles[i]) {
          queueUpload(actualIndex, newFiles[i]!)
        }
      } else {
        // Single file upload immediately
        uploadFile(actualIndex)
      }
    }
  }
}

function queueUpload(index: number, fileUpload: FileUploadFile) {
  if (!props.multiple) {
    uploadFile(index)
    return
  }

  if (activeUploads.value < props.maxConcurrentUploads) {
    uploadFile(index)
  } else {
    uploadQueue.value.push({ index, fileUpload })
  }
}

function processUploadQueue() {
  while (uploadQueue.value.length > 0 && activeUploads.value < props.maxConcurrentUploads) {
    const queueItem = uploadQueue.value.shift()
    if (queueItem) {
      uploadFile(queueItem.index)
    }
  }
}

function removeFile(index?: number) {
  if (!modelValue.value) {
    return
  }

  if (!props.multiple || index === undefined) {
    // Cancel any ongoing upload for single file
    const singleFile = modelValue.value as FileUploadFile
    if (singleFile.abortController) {
      singleFile.abortController.abort()
    }

    onFileUpdate([], true)
    return
  }

  const files = [...(modelValue.value as FileUploadFile[])]

  // Cancel upload if in progress
  const file = files[index]
  if (file?.abortController) {
    file.abortController.abort()
  }

  // Remove from queue if it's there
  uploadQueue.value = uploadQueue.value.filter(item => item.index !== index)

  files.splice(index, 1)
  onFileUpdate(files.map(f => f.file), true)
}

async function uploadFile(index: number) {
  if (!props.uploadFn || !modelValue.value) return

  const files = props.multiple ? modelValue.value as FileUploadFile[] : [modelValue.value as FileUploadFile]
  const fileUpload = files[index]

  if (!fileUpload || fileUpload.uploading) return

  // Increment active uploads counter
  activeUploads.value++

  // Create abort controller for cancellation
  const abortController = new AbortController()
  fileUpload.abortController = abortController
  fileUpload.uploading = true
  fileUpload.progress = 0
  fileUpload.error = undefined

  emits('upload:start', fileUpload, index)

  // Set up timeout
  const timeoutId = setTimeout(() => {
    if (!abortController.signal.aborted) {
      abortController.abort()
    }
  }, props.uploadTimeout)

  try {
    const result = await props.uploadFn(
      fileUpload.file,
      (progress: number) => {
        fileUpload.progress = Math.min(100, Math.max(0, progress))
        emits('upload:progress', fileUpload, fileUpload.progress, index)
      },
      abortController.signal
    )

    clearTimeout(timeoutId)
    fileUpload.uploading = false
    fileUpload.progress = 100
    emits('upload:success', fileUpload, result, index)
  } catch (error) {
    clearTimeout(timeoutId)
    fileUpload.uploading = false

    if (abortController.signal.aborted) {
      emits('upload:cancel', fileUpload, index)
    } else {
      fileUpload.error = error instanceof Error ? error.message : 'Upload failed'
      emits('upload:error', fileUpload, fileUpload.error, index)
    }
  } finally {
    fileUpload.abortController = undefined
    activeUploads.value--

    // Process next item in queue
    if (props.multiple) {
      processUploadQueue()
    }

    // Check if all uploads are complete
    if (props.multiple && activeUploads.value === 0 && uploadQueue.value.length === 0) {
      emits('upload:complete', files)
    }
  }
}

function cancelUpload(index: number) {
  if (!modelValue.value) return

  const files = props.multiple ? modelValue.value as FileUploadFile[] : [modelValue.value as FileUploadFile]
  const fileUpload = files[index]

  if (fileUpload?.abortController) {
    fileUpload.abortController.abort()
  }

  // Remove from queue if it's there
  uploadQueue.value = uploadQueue.value.filter(item => item.index !== index)
}

// Function to check if a file should show progress
function shouldShowFileProgress(fileUpload: FileUploadFile): boolean {
  return shouldShowProgress.value && (
    fileUpload.uploading
    || (fileUpload.progress ?? 0) > 0
    || !!fileUpload.error
  )
}

watch(modelValue, (newValue) => {
  const hasModelReset = !Array.isArray(newValue) || !newValue.length

  if (hasModelReset && inputRef.value) {
    inputRef.value.value = ''
    // Clear upload queue and reset counters
    uploadQueue.value = []
    activeUploads.value = 0
  }
})

defineExpose({
  inputRef,
  dropzoneRef,
  uploadFile,
  cancelUpload,
  activeUploads: readonly(activeUploads),
  uploadQueue: readonly(uploadQueue)
})
</script>

<template>
  <DefineFilesTemplate>
    <template v-if="modelValue && (Array.isArray(modelValue) ? modelValue.length : true)">
      <slot
        name="files-top"
        :files="modelValue"
        :open="open"
        :remove-file="removeFile"
        :upload-file="uploadFile"
        :cancel-upload="cancelUpload"
      />

      <div :class="ui.files({ class: props.ui?.files })">
        <slot name="files" :files="modelValue">
          <div
            v-for="(fileUpload, index) in Array.isArray(modelValue) ? modelValue : [modelValue]"
            :key="(fileUpload as FileUploadFile).file.name + index"
            :class="ui.file({ class: props.ui?.file })"
          >
            <slot name="file" :file-upload="fileUpload" :index="index">
              <slot name="file-leading" :file-upload="fileUpload" :index="index">
                <UAvatar
                  :src="createObjectUrl((fileUpload as FileUploadFile).file)"
                  :icon="fileIcon || appConfig.ui.icons.file"
                  :size="props.size"
                  :class="ui.fileLeadingAvatar({ class: props.ui?.fileLeadingAvatar })"
                />
              </slot>

              <div :class="ui.fileWrapper({ class: props.ui?.fileWrapper })">
                <span :class="ui.fileName({ class: props.ui?.fileName })">
                  <slot name="file-name" :file-upload="fileUpload" :index="index">
                    {{ (fileUpload as FileUploadFile).file.name }}
                  </slot>
                </span>

                <span :class="ui.fileSize({ class: props.ui?.fileSize })">
                  <slot name="file-size" :file-upload="fileUpload" :index="index">
                    {{ formatFileSize((fileUpload as FileUploadFile).file.size) }}
                  </slot>
                </span>

                <!-- Progress bar - Now shows automatically when autoUpload is true -->
                <div
                  v-if="shouldShowFileProgress(fileUpload as FileUploadFile)"
                  :class="ui.fileProgress({ class: props.ui?.fileProgress })"
                >
                  <slot name="file-progress" :file-upload="fileUpload" :index="index">
                    <UProgress
                      :model-value="(fileUpload as FileUploadFile).progress || 0"
                      :color="(fileUpload as FileUploadFile).error ? 'error' : color"
                      :size="size === 'xs' ? 'xs' : 'sm'"
                    />
                    <span :class="ui.fileProgressText({ class: props.ui?.fileProgressText })">
                      {{ Math.round((fileUpload as FileUploadFile).progress || 0) }}%
                    </span>
                  </slot>
                </div>

                <!-- Error message -->
                <div v-if="(fileUpload as FileUploadFile).error" :class="ui.fileError({ class: props.ui?.fileError })">
                  {{ (fileUpload as FileUploadFile).error }}
                </div>

                <!-- Upload status indicator -->
                <div v-if="autoUpload && (fileUpload as FileUploadFile).uploading" class="text-xs text-gray-500 mt-1">
                  Uploading...
                </div>
              </div>

              <slot name="file-trailing" :file-upload="fileUpload" :index="index">
                <div :class="ui.fileActions({ class: props.ui?.fileActions })">
                  <!-- Upload button (if not auto-upload and uploadFn provided) -->
                  <UButton
                    v-if="uploadFn && !autoUpload && !(fileUpload as FileUploadFile).uploading && !((fileUpload as FileUploadFile).progress ?? 0)"
                    color="primary"
                    variant="ghost"
                    :size="layout === 'grid' ? 'xs' : size"
                    :trailing-icon="appConfig.ui.icons.upload || 'i-lucide-upload'"
                    :class="ui.fileUploadButton({ class: props.ui?.fileUploadButton })"
                    @click.stop.prevent="uploadFile(index)"
                  />

                  <!-- Cancel button (during upload) -->
                  <UButton
                    v-if="allowCancel && (fileUpload as FileUploadFile).uploading"
                    color="neutral"
                    variant="ghost"
                    :size="layout === 'grid' ? 'xs' : size"
                    :trailing-icon="appConfig.ui.icons.close || 'i-lucide-x'"
                    :class="ui.fileCancelButton({ class: props.ui?.fileCancelButton })"
                    @click.stop.prevent="cancelUpload(index)"
                  />

                  <!-- Delete button -->
                  <UButton
                    v-if="!(fileUpload as FileUploadFile).uploading"
                    color="neutral"
                    v-bind="{
                      ...(layout === 'grid' ? {
                        variant: 'solid',
                        size: 'xs'
                      } : {
                        variant: 'link',
                        size
                      }),
                      ...typeof fileDelete === 'object' ? fileDelete : undefined
                    }"
                    :trailing-icon="fileDeleteIcon || appConfig.ui.icons.close"
                    :class="ui.fileTrailingButton({ class: props.ui?.fileTrailingButton })"
                    @click.stop.prevent="removeFile(index)"
                  />
                </div>
              </slot>
            </slot>
          </div>
        </slot>
      </div>

      <slot
        name="files-bottom"
        :files="modelValue"
        :open="open"
        :remove-file="removeFile"
        :upload-file="uploadFile"
        :cancel-upload="cancelUpload"
      />
    </template>
  </DefineFilesTemplate>

  <Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <slot :open="open" :remove-file="removeFile" :upload-file="uploadFile" :cancel-upload="cancelUpload">
      <component
        :is="variant === 'button' ? 'button' : 'div'"
        ref="dropzoneRef"
        :role="variant === 'button' ? undefined : 'button'"
        :data-dragging="isDragging"
        :class="ui.base({ class: props.ui?.base })"
        :tabindex="interactive && !disabled ? 0 : -1"
        @click="interactive && !disabled && open()"
      >
        <ReuseFilesTemplate v-if="position === 'inside'" />

        <div
          v-if="position === 'inside' ? (multiple ? !(modelValue as FileUploadFile[])?.length : !modelValue) : true"
          :class="ui.wrapper({ class: props.ui?.wrapper })"
        >
          <slot name="leading">
            <UIcon
              v-if="variant === 'button'"
              :name="icon || appConfig.ui.icons.upload"
              :class="ui.icon({ class: props.ui?.icon })"
            />
            <UAvatar
              v-else
              :icon="icon || appConfig.ui.icons.upload"
              :size="props.size"
              :class="ui.avatar({ class: props.ui?.avatar })"
            />
          </slot>

          <template v-if="variant !== 'button'">
            <div v-if="label || !!slots.label" :class="ui.label({ class: props.ui?.label })">
              <slot name="label">
                {{ label }}
              </slot>
            </div>
            <div v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
              <slot name="description">
                {{ description }}
              </slot>
            </div>

            <div v-if="!!slots.actions" :class="ui.actions({ class: props.ui?.actions })">
              <slot
                name="actions"
                :files="modelValue"
                :open="open"
                :remove-file="removeFile"
                :upload-file="uploadFile"
                :cancel-upload="cancelUpload"
              />
            </div>
          </template>
        </div>
      </component>

      <ReuseFilesTemplate v-if="position === 'outside'" />
    </slot>

    <input
      :id="id"
      ref="inputRef"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="(multiple as boolean)"
      :required="required"
      :disabled="disabled"
      v-bind="{ ...$attrs, ...ariaAttrs }"
      class="sr-only"
      tabindex="-1"
    >
  </Primitive>
</template>

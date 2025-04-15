import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { ComputedRef, DeepReadonly, Ref } from 'vue'
import type { Schema as JoiSchema } from 'joi'
import type { ObjectSchema as YupObjectSchema } from 'yup'
import type { GetObjectField } from './utils'
import type { Struct as SuperstructSchema } from 'superstruct'

export interface Form<I extends object, O extends object = I> {
  validate (opts?: { name?: keyof I | (keyof I)[], silent?: boolean, nested?: boolean, transform?: boolean }): Promise<O | false>
  clear (path?: string): void
  errors: Ref<FormError[]>
  setErrors (errs: FormError[], name?: keyof I): void
  getErrors (name?: keyof I): FormError[]
  submit (): Promise<void>
  disabled: ComputedRef<boolean>
  dirty: ComputedRef<boolean>
  loading: Ref<boolean>

  dirtyFields: DeepReadonly<Set<keyof I>>
  touchedFields: DeepReadonly<Set<keyof I>>
  blurredFields: DeepReadonly<Set<keyof I>>
}

export type FormSchema<I extends object, O extends object = I> =
  | YupObjectSchema<I>
  | JoiSchema<I>
  | SuperstructSchema<I>
  | StandardSchemaV1<I, O>

export type FormInputEvents = 'input' | 'blur' | 'change' | 'focus'

export interface FormError<P extends string = string> {
  name?: P
  message: string
}

export interface FormErrorWithId extends FormError {
  id?: string
}

export type FormSubmitEvent<T> = SubmitEvent & { data: T }

export type FormValidationError = {
  errors: FormErrorWithId[]
  children?: FormValidationError[]
}

export type FormErrorEvent = SubmitEvent & FormValidationError

export type FormEventType = FormInputEvents

export type FormChildAttachEvent = {
  type: 'attach'
  formId: string | number
  validate: Form<any>['validate']
}

export type FormChildDetachEvent = {
  type: 'detach'
  formId: string | number
}

export type FormInputEvent<T extends object> = {
  type: FormEventType
  name: keyof T
  eager?: boolean
}

export type FormEvent<T extends object> =
  | FormInputEvent<T>
  | FormChildAttachEvent
  | FormChildDetachEvent

export interface FormInjectedOptions {
  disabled?: boolean
  validateOnInputDelay?: number
}

export interface FormFieldInjectedOptions<T> {
  name?: string
  size?: GetObjectField<T, 'size'>
  error?: string | boolean
  eagerValidation?: boolean
  validateOnInputDelay?: number
  errorPattern?: RegExp
  hint?: string
  description?: string
  help?: string
  ariaId: string
}

export interface ValidateReturnSchema<T> {
  result: T
  errors: FormError[] | null
}

export class FormValidationException extends Error {
  formId: string | number
  errors: FormErrorWithId[]
  children?: FormValidationException[]

  constructor(formId: string | number, errors: FormErrorWithId[], childErrors?: FormValidationException[]) {
    super('Form validation exception')
    this.formId = formId
    this.errors = errors
    this.children = childErrors
    Object.setPrototypeOf(this, FormValidationException.prototype)
  }
}

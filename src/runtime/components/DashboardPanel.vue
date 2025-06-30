<script lang="ts">
import type { AppConfig } from '@nuxt/schema';
import type { ComponentConfig } from '@nuxt/ui';
import theme from '#build/ui/dashboard-panel';
import type { UseResizableProps } from '../composables/useResizable';
type DashboardPanel = ComponentConfig<typeof theme, AppConfig, 'dashboardPanel', 'uiPro'>;
export interface DashboardPanelProps extends Pick<UseResizableProps, 'id' | 'minSize' | 'maxSize' | 'defaultSize' | 'resizable'> {
    class?: any;
    ui?: DashboardPanel['slots'];
}
export interface DashboardPanelSlots {
    'default'(props?: {}): any;
    'header'(props?: {}): any;
    'body'(props?: {}): any;
    'footer'(props?: {}): any;
    'resize-handle'(props: {
        onMouseDown: (e: MouseEvent) => void;
        onTouchStart: (e: TouchEvent) => void;
    }): any;
}


</script>

<script setup lang="ts">
import { computed, useId, toRef } from "vue";
import { useAppConfig } from "#imports";
import { useResizable } from "../composables/useResizable";
import { useDashboard } from "../utils/dashboard";
import { tv } from "../utils/tv";
const props = defineProps({
  class: { type: null, required: false },
  ui: { type: null, required: false },
  id: { type: String, required: false },
  minSize: { type: Number, required: false, default: 15 },
  maxSize: { type: Number, required: false },
  defaultSize: { type: Number, required: false },
  resizable: { type: Boolean, required: false, default: false }
});
defineSlots();
const appConfig = useAppConfig();
const dashboardContext = useDashboard({ storageKey: "dashboard", unit: "%" });
const id = `${dashboardContext.storageKey}-panel-${props.id || useId()}`;
const { el, size, isDragging, onMouseDown, onTouchStart } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })));
const ui = computed(() => tv({ extend: tv(theme), ...appConfig.uiPro?.dashboardPanel || {} })({
  size: !!size.value
}));
</script>

<template>
  <div
    :id="id"
    ref="el"
    :data-dragging="isDragging"
    :class="ui.root({ class: [props.ui?.root, props.class] })"
    :style="[size ? { '--width': `${size}${dashboardContext.unit}` } : void 0]"
  >
    <slot>
      <slot name="header" />

      <div :class="ui.body({ class: props.ui?.body })">
        <slot name="body" />
      </div>

      <slot name="footer" />
    </slot>
  </div>

  <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart">
    <UDashboardResizeHandle
      v-if="resizable"
      :aria-controls="id"
      :class="ui.handle({ class: props.ui?.handle })"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
    />
  </slot>
</template>

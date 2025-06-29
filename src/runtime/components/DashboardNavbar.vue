<script lang="ts"></script>
<script setup lang="ts"></script>
<template>
<DefineToggleTemplate>
    <slot name="toggle" v-bind="dashboardContext">
    <UDashboardSidebarToggle
        v-if="toggle"
        v-bind="typeof toggle === 'object' ? toggle : {}"
        :side="toggleSide"
        :class="ui.toggle({ class: props.ui?.toggle, toggleSide })"
    />
    </slot>
</DefineToggleTemplate>

<Primitive :as="as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.left({ class: props.ui?.left })">
    <ReuseToggleTemplate v-if="toggleSide === 'left'" />

    <slot name="left" v-bind="dashboardContext">
        <slot name="leading" v-bind="dashboardContext">
        <UIcon v-if="icon" :name="icon" :class="ui.icon({ class: props.ui?.icon })" />
        </slot>

        <h1 :class="ui.title({ class: props.ui?.title })">
        <slot name="title">
            {{ title }}
        </slot>
        </h1>

        <slot name="trailing" v-bind="dashboardContext" />
    </slot>
    </div>

    <div v-if="!!slots.default" :class="ui.center({ class: props.ui?.center })">
    <slot v-bind="dashboardContext" />
    </div>

    <div :class="ui.right({ class: props.ui?.right })">
    <slot name="right" v-bind="dashboardContext" />

    <ReuseToggleTemplate v-if="toggleSide === 'right'" />
    </div>
</Primitive>
</template>
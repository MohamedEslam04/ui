import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { h } from 'vue'
import Marquee from '../../src/runtime/components/Marquee.vue'
import type { MarqueeProps, MarqueeSlots } from '../../src/runtime/components/Marquee.vue'
import ComponentRender from '../component-render'

describe('Marquee', () => {
  it.each([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'text-xl' } }],
    ['with pauseOnHover', { props: { pauseOnHover: true } }],
    ['with reverse', { props: { reverse: true } }],
    ['with orientation', { props: { orientation: 'vertical' as const } }],
    ['with repeat', { props: { repeat: 6 } }],
    ['with overlay off', { props: { overlay: false } }],
    ['with ui', { props: { ui: { content: 'gap-4' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: MarqueeProps, slots?: Partial<MarqueeSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, Marquee)
    expect(html).toMatchSnapshot()
  })

  it('handles pauseOnClick correctly', async () => {
    const wrapper = await mountSuspended(Marquee, {
      props: {
        pauseOnClick: true,
        duration: 30
      },
      slots: {
        default: () => 'Content'
      }
    })

    // Check duration style
    expect(wrapper.attributes('style')).toContain('--duration: 30s')

    // Initial state: not paused
    expect(wrapper.find('[data-slot="content"]').attributes('style')).toBeUndefined()

    // Check overlay exists and is visible (conditionally based on implementation, here check class or existence)
    const overlay = wrapper.find('.absolute.inset-0.z-10')
    expect(overlay.exists()).toBe(true)

    // Click wrapper to pause
    await wrapper.trigger('click')

    // Paused state
    expect(wrapper.find('[data-slot="content"]').attributes('style')).toContain('animation-play-state: paused')

    // Overlay should be gone when paused
    expect(wrapper.find('.absolute.inset-0.z-10').exists()).toBe(false)

    // Click wrapper to resume
    await wrapper.trigger('click')
    expect(wrapper.find('[data-slot="content"]').attributes('style')).toBeUndefined()
  })

  it('prevents pause when clicking interactive elements', async () => {
    const wrapper = await mountSuspended(Marquee, {
      props: {
        pauseOnClick: true,
        // Reduce repeat to 1 to simplify finding
        repeat: 1
      },
      slots: {
        default: () => h('button', { id: 'btn' }, 'Click me')
      }
    })

    const button = wrapper.find('#btn')
    expect(button.exists()).toBe(true)
    await button.trigger('click')

    // Should NOT be paused
    expect(wrapper.find('[data-slot="content"]').attributes('style')).toBeUndefined()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Marquee, {
      slots: {
        default: () => 'Default slot'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})

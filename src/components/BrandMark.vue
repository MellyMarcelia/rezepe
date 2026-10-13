<script setup lang="ts">
import logoSvg from '@/assets/logo-mark.svg?raw'
import wordSvg from '@/assets/logo-wordmark.svg?raw'

withDefaults(defineProps<{ size?: number; wordmark?: boolean; stacked?: boolean }>(), {
  size: 36,
  wordmark: false,
  stacked: false,
})

function parse(svg: string) {
  const viewBox = /viewBox="([^"]+)"/.exec(svg)?.[1] ?? '0 0 1 1'
  const [, , w = 1, h = 1] = viewBox.split(/\s+/).map(Number)
  return { viewBox, ratio: w / h, d: /\sd="([^"]+)"/.exec(svg)?.[1] ?? '' }
}

const mark = parse(logoSvg)
const word = parse(wordSvg)
</script>

<template>
  <span
    class="brand"
    :class="{ stacked }"
    :style="{ '--s': `${size}px`, '--mark-r': mark.ratio, '--word-r': word.ratio }"
  >
    <svg :viewBox="mark.viewBox" aria-hidden="true" class="mark">
      <path :d="mark.d" fill="currentColor" fill-rule="evenodd" />
    </svg>
    <svg v-if="wordmark" :viewBox="word.viewBox" role="img" aria-label="rezepe" class="word">
      <path :d="word.d" fill="currentColor" fill-rule="evenodd" />
    </svg>
  </span>
</template>

<style scoped>
.brand {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--s) * 0.32);
  color: var(--wine);
}

.mark {
  width: var(--s);
  height: calc(var(--s) / var(--mark-r));
  flex-shrink: 0;
}

/* Side-by-side lockup: the mark leads, the wordmark sits at under half its height, as in the master logo. */
.word {
  height: calc(var(--s) * 0.46);
  width: calc(var(--s) * 0.46 * var(--word-r));
  flex-shrink: 0;
}

/* Proportions taken from the master logo: wordmark ~1.29× the mark's width */
.stacked {
  flex-direction: column;
  gap: calc(var(--s) * 0.25);
}

.stacked .word {
  width: calc(var(--s) * 1.29);
  height: calc(var(--s) * 1.29 / var(--word-r));
}
</style>

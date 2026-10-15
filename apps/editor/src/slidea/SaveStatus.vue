<template>
  <div class="slidea-save-status" :class="saveStatus">{{ label }}</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { saveStatus } from './deckSync'

const LABELS: Record<string, string> = {
  idle: '',
  dirty: '未保存',
  saving: '保存中…',
  saved: '保存済み',
  error: '保存に失敗（再試行します）',
  conflict: '競合のため保存停止',
}
const label = computed(() => LABELS[saveStatus.value])
</script>

<style lang="scss" scoped>
.slidea-save-status {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
  white-space: nowrap;

  &.error, &.conflict {
    color: #d14424;
  }
}
</style>

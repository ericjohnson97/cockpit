<template>
  <div v-if="showAltitudeSlider" class="slider-div">
    <slider
      v-model="altitude_setpoint"
      orientation="vertical"
      width="100%"
      height="20"
      color="rgb(59 130 246)"
      track-color="rgb(59 130 246 / 0.5)"
      always-show-handle="true"
      step="0.1"
    />
    <div class="slider-value"><span>Alt (Rel)</span></div>
    <div class="slider-value">{{ formattedValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import slider from 'vue3-slider'

import { altitude_setpoint, showAltitudeSlider } from '@/libs/altitude-slider'

const formattedValue = computed(() => altitude_setpoint.value.toFixed(1))
</script>
<style scoped>
.slider-value {
  white-space: nowrap;
  text-align: center;
  font-size: 0.8rem;
}
.slider-div {
  height: 100%;
  width: 100%;
}
</style>

<template>
  <div v-if="showAltitudeSlider" class="slider-div">
    <slider
      v-model="altitude_setpoint_raw"
      :min="sliderMinVal"
      :max="sliderMaxVal"
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
import { computed, ref, watch } from 'vue';
import slider from 'vue3-slider';

// Import or define your reactive properties
import { altitude_setpoint, showAltitudeSlider } from '@/libs/altitude-slider';

// Constants for slider range and center value
const sliderMinVal = ref(0); // Example minimum value
const sliderMaxVal = ref(100); // Example maximum value
const sliderCenterValue = ref((sliderMaxVal.value + sliderMinVal.value) / 2);

// Function to calculate exponential altitude setpoint based on slider position
const calculatealtitude_setpoint = (value: number): number => {
  const decreaseRange = Math.max(sliderCenterValue.value - sliderMinVal.value, 0);
  const increaseRange = Math.max(sliderMaxVal.value - sliderCenterValue.value, 0);
  const isAboveCenter = value > sliderCenterValue.value;
  const normalizedValue = (value - sliderCenterValue.value) / (isAboveCenter ? increaseRange : decreaseRange);
  const valExp = Math.pow(normalizedValue, 3);
  const delta = valExp * (isAboveCenter ? increaseRange : -decreaseRange);
  return sliderCenterValue.value + delta;
};
// Intermediate variable to hold the exponential value before setting altitude_setpoint_raw
const altitude_setpoint_raw = ref(10);
altitude_setpoint.value = calculatealtitude_setpoint(altitude_setpoint_raw.value);

const formattedValue = computed(() => altitude_setpoint.value.toFixed(1));


// Watcher to update the intermediate variable based on altitude_setpoint_raw changes
watch(altitude_setpoint_raw, (newValue) => {
  altitude_setpoint.value = calculatealtitude_setpoint(newValue);
  // Computed property to format the altitude setpoint
  
});

// Optional: Watch the intermediate variable to perform additional actions if needed
watch(altitude_setpoint, (newValue, oldValue) => {
    // Here you can implement additional logic if needed, for example:
    // - Updating the altitude_setpoint_raw only if the difference exceeds a threshold
    // - Triggering other side effects based on the updated value
});



</script>
<style scoped>
.slider-value {
  white-space: nowrap;
  text-align: center;
  font-size: 0.8rem;
}
/* .slider-div {
  height: 100%;
  width: 100%;
} */
.slider-div {
  position: fixed; /* or absolute, depending on your layout */
  right: 2%;
  top: 25%;
  bottom: 0;
  width: 25px; /* Adjust width as necessary */
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centers the slider vertically */
  z-index: 100; /* Ensure it's above other content */
}
</style>

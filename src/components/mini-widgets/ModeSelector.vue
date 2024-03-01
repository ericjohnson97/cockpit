<template>
  <div>
    <Dropdown v-model="currentMode" :options="vehicleStore.modesAvailable()" class="min-w-[128px]" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { debounce } from "ts-debounce"

import { datalogger, DatalogVariable } from '@/libs/sensors-logging'
import { useMainVehicleStore } from '@/stores/mainVehicle'

import Dropdown from '../Dropdown.vue'
import { de } from 'date-fns/locale'

datalogger.registerUsage(DatalogVariable.mode)
const vehicleStore = useMainVehicleStore()
const currentMode = ref()

const settingMode = ref(false)

async function setMode(): Promise<void> {
  if (currentMode.value === undefined) return
  const desiredMode = currentMode.value
  console.log('Setting mode to', desiredMode)
  const success = await vehicleStore.setFlightMode(desiredMode)

  const startTime = Date.now();
  const timeout = 10000; // Timeout in milliseconds, e.g., 10000ms = 10 seconds
  while (vehicleStore.mode !== desiredMode) {
    if (Date.now() - startTime > timeout) {
      console.log('Timeout: Mode change not reflected in vehicleStore within', timeout / 1000, 'seconds');
      break; // Exit the loop if we've exceeded the timeout
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for a second before checking again
  }
  if (vehicleStore.mode === desiredMode) {
    await nextTick(); // Ensure the update is reflected in the DOM/reactive system
    console.log('Done: Mode set to', vehicleStore.mode);
  }
  settingMode.value = false;
}

watch(currentMode, async () => {
  if (currentMode.value === undefined) return
  // don't set mode if we are in setting mode
  if (settingMode.value)
  {
    console.log('SettingMode', settingMode.value)
    console.log('Setting mode in progress, skipping');
    return
  }else{
    console.log('SettingMode', settingMode.value)
    settingMode.value = true
    // Ensure all reactive changes are flushed
    await nextTick();
    await setMode()
  }
})

async function updateMode() {
  await nextTick();
  // Add a check to ensure this function does not conflict with recent setMode operation.
  if (settingMode.value) {
    console.log('updateMode skipped due to ongoing setMode operation');
    return;
  }

  if (currentMode.value !== vehicleStore.mode) {
    console.log('Mode is different than telemetry. updating', currentMode.value, vehicleStore.mode);
    currentMode.value = vehicleStore.mode;
    await nextTick(); // Ensure the update is reflected in the DOM/reactive system
  }
}

// eslint-disable-next-line no-undef
let modeUpdateInterval: NodeJS.Timer | undefined = undefined
onMounted(() => {
  if (!modeUpdateInterval) {
    modeUpdateInterval = setInterval(() => (updateMode()), 500);
  }
})
onUnmounted(() => clearInterval(modeUpdateInterval))
</script>

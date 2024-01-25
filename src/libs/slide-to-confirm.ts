import { ref, watch } from 'vue' // Adjust this import based on your Vue version

// Reactive variables (if they are not provided from outside)
export const showSlideToConfirm = ref(false)
export const confirmed = ref(false)

/**
 * Calls the provided action function if the user confirms through the slide-to-confirm component.
 * @param {() => void} actionFunc - A function representing the action to be confirmed.
 * @returns {Promise<void>} A Promise that resolves if the action is successfully executed or rejects in case of cancellation or errors.
 */
export function slideToConfirm(actionFunc: () => void): Promise<void> {
  console.log('slideToConfirm')
  return new Promise((resolve, reject) => {
    // Show slide to confirm component
    showSlideToConfirm.value = true

    // Watch for changes on confirmed variable
    const stopWatching = watch(confirmed, (newValue) => {
      if (newValue === true) {
        // Stop the watcher to prevent memory leaks
        stopWatching()

        confirmed.value = false

        // Execute the provided action function
        try {
          actionFunc()
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      if (showSlideToConfirm.value === false) {
        stopWatching()
        reject(new Error('User cancelled the action'))
      }
    })
  })
}

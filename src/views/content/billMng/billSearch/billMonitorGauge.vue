<script setup>
import { defineProps, computed } from "vue";
import 'primeicons/primeicons.css'

const props = defineProps({
  count: Number,
  progressValue: Number,
});

const stepperClass = computed(() => {

  // STEP 0: Reception

  if (props.count === 0 ) {

    if(props.progressValue === 0) {
        return "stepper-item active";
    } else if(props.progressValue > 0)  {
        return "stepper-item complete";
    } else {
        return "stepper-item proceed";
    }

  } else if(props.count === 1 ) { // committee


    if(props.progressValue === 1) {
        return "stepper-item active";
    } else if(props.progressValue > 1)  {
        return "stepper-item complete";
    } else {
        return "stepper-item proceed";
    }

  } else if(props.count === 2 ) { // Plenary


    if(props.progressValue === 2) {
        return "stepper-item active";
    } else if(props.progressValue > 2)  {
        return "stepper-item complete";
    } else {
        return "stepper-item proceed";
    }

  } else if(props.count === 3 ) { // Government transfer


    if(props.progressValue === 3) {
        return "stepper-item active";
    } else if(props.progressValue > 3)  {
        return "stepper-item complete";
    } else {
        return "stepper-item proceed";
    }

  } else if(props.count === 4 ) { // horror


    if(props.progressValue >= 4) {
        return "stepper-item complete";
    } else {
        return "stepper-item proceed";
    }

  } else {
    // Basic status (not proceeded)

    return "stepper-item proceed";
  }

});

</script>

<template>
  <div
    :class="stepperClass"
    :style="{ '--hide-before': props.count === 0 ? 'none' : 'block', '--hide-after': props.count === 4 ? 'none' : 'block' }"
  >
    <div class="step-counter">
        <template v-if="stepperClass === 'stepper-item complete'">
            <i class="pi pi-check" style="font-size: 1.4rem"></i>
          </template>
          <template v-else-if="stepperClass === 'stepper-item active'">
            <i class="pi pi-ellipsis-h" style="font-size: 1.4rem"></i>
        </template>
        <template v-else>{{ props.count + 1 }}</template>
    </div>
  </div>
</template>

<style scoped>
.stepper-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stepper-item::before {
  position: absolute;
  content: "";
  border-bottom: 5px solid #e8e8e8; 
  width: 100%;
  top: 8px;
  left: -55%;
  z-index: 2;
  display: var(--hide-before, block);
}

.stepper-item::after {
  position: absolute;
  content: "";
  border-bottom: 5px solid #e8e8e8; 
  width: 96%;
  top: 8px;
  left: 45%;
  z-index: 2;
  display: var(--hide-after, block);
}

.stepper-item .step-counter {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e8e8e8; 
  color: white;
}

.stepper-item.complete .step-counter {
  background: #0b588f; 
}

.stepper-item.complete::before,
.stepper-item.complete::after {
  border-bottom-color: #0b588f; 
}

.stepper-item.active .step-counter {
  background: #246BEB; 
}

.stepper-item.active::before,
.stepper-item.active::after {
  border-bottom-color: #0b588f; 
}
</style>
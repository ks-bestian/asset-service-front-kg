<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  stepNo: Number,
});

console.log("props", props);

</script>

<template>
  <div class="billStepDiagram">

    <div class="step-diagram" :class="{'done': props.stepNo > 0, 'current-step': props.stepNo === 0}">
      <div class="step-icon">
      <img src="@/assets/images/added/ico_billStep_1.png" alt="Step 1" />
      </div>
      <div class="step-label">
      <p>{{ t('10114') }}</p><!--Billing-->
      </div>
    </div>

    <div class="step-diagram" :class="{'done': props.stepNo > 1, 'current-step': props.stepNo === 1}">
      <div class="step-icon">
      <img src="@/assets/images/added/ico_billStep_2.png" alt="Step 2" />
      </div>
      <p class="step-label">
        {{ t('10045') }}
      </p><!--committee-->
    </div>

    <!-- <div class="step-diagram" :class="{'done': props.stepNo > 3, 'current-step': props.stepNo === 3}">
      <div class="step-icon">
      <img src="@/assets/images/added/ico_billStep_3.png" alt="Step 3" />
      </div>
      <p class="step-label">
      түзүлүштүк текшерүү
      </p>
    </div> -->

    <div class="step-diagram" :class="{'done': props.stepNo > 2, 'current-step': props.stepNo === 2}">
      <div class="step-icon">
      <img src="@/assets/images/added/ico_billStep_4.png" alt="Step 4" />
      </div>
      <p class="step-label">
        {{ t('10046') }}
      </p><!--Plenary-->
    </div>

    <div class="step-diagram" :class="{'done': props.stepNo > 3, 'current-step': props.stepNo === 3}">
      <div class="step-icon">
      <img src="@/assets/images/added/ico_billStep_5.png" alt="Step 5" />
      </div>
      <p class="step-label">
        {{ t('10047') }}
      </p><!--Government transfer-->
    </div>

    <div class="step-diagram" :class="{'done': props.stepNo > 4, 'current-step': props.stepNo === 4}">
      <div class="step-icon">
      <img src="@/assets/images/added/ico_billStep_6.png" alt="Step 6" />
      </div>
      <p class="step-label">
        {{ t('10048') }}
      </p><!--horror-->
    </div>

  </div>
</template>

<style scoped>
.billStepDiagram {
  width: 100%;
  height: 140px;
  background-color: transparent;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  font-size: 20px;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.billStepDiagram * {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.step-diagram {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  position: relative;
}

.step-diagram::before {
  content: "";
  position:absolute;
  width: 25px;
  height: 5px;
  background-color: #e3ecfb;
  border-radius: 5px;
  top: 62px;
  right: -14px;
  transform: rotate(45deg);
}
.step-diagram::after {
  content: "";
  position:absolute;
  width: 25px;
  height: 5px;
  background-color: #e3ecfb;
  border-radius: 5px;
  top: 76.5px;
  right: -14px;
  transform: rotate(-45deg);
}
.step-diagram:last-child::before,
.step-diagram:last-child::after {
  display: none;
}

.step-icon {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  border-radius: 100%;
}

.step-icon::before {
  content: "";
  width: 80px;
  height: 80px;
  background-color: transparent;
  border-radius: 100%;
  border: 5px solid #e3ecfb;
  position: absolute;
}

.step-icon img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(91%) sepia(12%) saturate(256%) hue-rotate(179deg) brightness(100%) contrast(97%);
}
.step-label {
  text-align: center;
  font-size: 14px;
  height: 20px;
  line-height: 20px;
}

.step-diagram.done::before, 
.step-diagram.done::after {
  background-color: #0094d3;
}
.step-diagram.current-step .step-icon,
.step-diagram.done .step-icon {
  background-color: #0094d3;
}
.step-diagram.current-step .step-icon::before,
.step-diagram.done .step-icon::before {
  border-color: #32bdf8;
}
.step-diagram.current-step .step-icon img, 
.step-diagram.done .step-icon img {
  filter: none;
}

@keyframes blinking {
  0% { background-color: #e3ecfb; }
  35% { background-color: #0094d3; }
  65% { background-color: #0094d3; }
  100% { background-color: #e3ecfb; }
}

/* Animation style for the current stage display */
.step-diagram:not(:last-child).current-step::before, 
.step-diagram:not(:last-child).current-step::after {
  animation: blinking 2s linear infinite;
  /* If you do not want to use the animation, please comment on the above anime properties and turn off the comments below. */
  /* background-color: #0094d3; */
}

</style>

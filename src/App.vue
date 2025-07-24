<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ConfirmPopup from 'primevue/confirmpopup';

import Toast from 'primevue/toast';

</script>

<template>
  <RouterView />
  <ConfirmPopup></ConfirmPopup>
	<Toast position="bottom-right" />
</template>

<style scoped>
</style>

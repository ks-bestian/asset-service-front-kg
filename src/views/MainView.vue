<script setup>
import { ref, onMounted } from 'vue'
//import WebSocketService from "@/services/WebSocketService";

import { RouterLink, RouterView } from 'vue-router'
import HeaderComp from "@/components/HeaderComp.vue"
import LeftSidebarComp from "@/components/LeftSidebarComp.vue"
import FooterComp from "@/components/FooterComp.vue"
import QuickMenuComp from "@/components/QuickMenuComp.vue"
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner';
import BlockUI from 'primevue/blockui';
import { useStore } from '@/store'

// const route = useRoute()
const store = useStore();
const fnBzentyList = () => {
    let param = {
    }
    store.API_LIST('/asset/bzenty', param).then((data) => {
        store.bzentyList = data.data.data;
        console.log(list.value)
    }).catch(({ message }) => {
        console.log(message)
    })
}
// const userId = 'gduser1'; // User ID currently logged in

// const notifications = ref([]);
// let websocket;

// const connectWebSocket = () => {

//       websocket = new WebSocket('ws://localhost:8081/ws'); // Spring Boot Web Socket End Point


//       websocket.onopen = () => {
//         console.log('Web socket access successfully');
//       };

//       websocket.onmessage = (event) => {
//         console.log('Received message:', event.data);
//         notifications.value.push(event.data);
//         // Notification UI update logic (e.g. toast message)

//       };

//       websocket.onclose = () => {
//         console.log('End of web socket connection');
//         // If necessary

//         setTimeout(connectWebSocket, 5000);
//       };

//       websocket.onerror = (error) => {
//         console.error('Web socket error:', error);
//       };
//     };

onMounted(() => {

	//connectWebSocket();

//   const wsService = new WebSocketService(userId);
//   wsService.connect((msg) => {
//     notification.value = msg; // Update when new messages arrive

//   });

	fnBzentyList();
});

</script>

<template>
	<div :class="{'v_wrapper': true, 'main_wrapper': $route.name === 'main'}">
		<HeaderComp />
		<div id="v_container">
			<div class="v_inner">
				<LeftSidebarComp />
				<div id="v_content">
					<RouterView />
					<FooterComp />
				</div>
			</div>
		</div>
		<QuickMenuComp />
	</div>
	<BlockUI v-if="store.isLoading" :blocked="true" :fullScreen="false"></BlockUI>
	<div class="overlay" v-if="store.isLoading">
		<ProgressSpinner />
	</div>
</template>

<style>

.overlay {
    position:fixed !important;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    z-index: 100000;
	display: flex;
	align-items: center;
}

</style>

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Lara from '@primevue/themes/lara';
import Nora from '@primevue/themes/nora';
import { definePreset } from '@primevue/themes';
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Tooltip from 'primevue/tooltip';
import i18n from './i18n';
import CKEditor from '@mayasabha/ckeditor4-vue3';
import '@/assets/scss/common.scss';
import '@/assets/scss/content.scss';
import '@/assets/scss/layout.scss';


import '@/assets/js/jquery-1.12.4.min.js';
// Import '@/assets/js/swiper.min.js';

import '@/assets/js/ui-common.js';


const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(i18n)
app.use(router)
app.use(CKEditor)
// app.use(PrimeVue);
// app.use(PrimeVue, { unstyled: true });

app.use(ConfirmationService);
app.use(ToastService);

const MyPreset = definePreset(Aura, {
    semantic: {
        // Default color change (emerald (default) ->

        primary: {
            50: '{sky.50}',
            100: '{sky.100}',
            200: '{sky.200}',
            300: '{sky.300}',
            400: '{sky.400}',
            500: '{sky.500}',
            600: '{sky.600}',
            700: '{sky.700}',
            800: '{sky.800}',
            900: '{sky.900}',
            950: '{sky.950}'
        },
        // Icon size change

        icon: {
            size: '1.5rem'
        },
    },
    components: {
        // Style Pagator

        paginator: {
            gap: '2px',
            padding: '2rem 0 0 0',
            'nav.button': {
                width: '3.2rem',
                height: '3.2rem',
                color: '#525960',
                'border.radius': '0.2rem',
                hover: {
                    background: '#f0f0f0',
                },
                selected: {
                    color: '#fff',
                    background: '#0094D3',
                }
            }
        },
        // style tree

        tree: {
            background: 'transparent',
            node: {
                'padding': '0.5rem 0 0.5rem 0',
            }
        },
        // style checkbox

        checkbox: {
            width: '2rem',
            height: '2rem',
        },
        // style inputtext

        inputtext: {
            lg: {
                'font.size': '1.4rem',
                'padding.x': '1.5rem',
                'padding.y': '0.5rem',
            }
        },
        //style textarea

        textarea: {
            lg: {
                'font.size': '1.4rem',
                'padding.x': '1.5rem',
                'padding.y': '0.5rem',
            }
        }
    },
});

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false
        }
    },
    pt: {
        // Datatable -Sort in the header

        DataTable: {
            Column: {
                columnHeaderContent: {
                    style: { "justify-content": "center" }
                }
            }
        }
    },
});

app.directive('tooltip', Tooltip);
app.mount('#app')

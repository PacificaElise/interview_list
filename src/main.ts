import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import ToastService from 'primevue/toastservice'
import Card from 'primevue/card'

import 'primeflex/primeflex.css'

import { initializeApp } from 'firebase/app'

import App from './App.vue'
import router from './router'

const firebaseConfig = {
  apiKey: 'AIzaSyBA9tx1ZJlPPiZNBs7SdaWK7-gsfYsDpBQ',
  authDomain: 'interview-list-c6a82.firebaseapp.com',
  projectId: 'interview-list-c6a82',
  storageBucket: 'interview-list-c6a82.appspot.com',
  messagingSenderId: '765056639220',
  appId: '1:765056639220:web:6222bf61aa7dc31ea93ea1'
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(ToastService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-toast', Toast)
app.component('app-progress-spinner', ProgressSpinner)
app.component('app-card', Card)

app.mount('#app')

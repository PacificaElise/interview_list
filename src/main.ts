import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Menubar from 'primevue/menubar'
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

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.component('app-menubar', Menubar)

app.mount('#app')

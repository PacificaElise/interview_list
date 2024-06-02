import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import RadioButton from 'primevue/radiobutton'
import Toast from 'primevue/toast'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import InlineMessage from 'primevue/inlinemessage'
import Calendar from 'primevue/calendar'
import Badge from 'primevue/badge'
import Tooltip from 'primevue/tooltip'
import Chart from 'primevue/chart'

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
app.use(ConfirmationService)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.directive('tooltip', Tooltip)

app.component('app-menubar', Menubar)
app.component('app-button', Button)
app.component('app-input-text', InputText)
app.component('app-input-number', InputNumber)
app.component('app-textarea', Textarea)
app.component('app-radio-button', RadioButton)
app.component('app-toast', Toast)
app.component('app-progress-spinner', ProgressSpinner)
app.component('app-card', Card)
app.component('app-data-table', DataTable)
app.component('app-column', Column)
app.component('app-confirm-dialog', ConfirmDialog)
app.component('app-inline-message', InlineMessage)
app.component('app-calendar', Calendar)
app.component('app-badge', Badge)
app.component('app-chart', Chart)

app.mount('#app')

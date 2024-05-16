<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore'
import type { InterviewType } from '@/types'

const userId = getAuth().currentUser?.uid
const db = getFirestore()
const confirm = useConfirm()
const interviews = ref<InterviewType[]>([])

const isLoading = ref<boolean>(true)

const getAllInterviews = async <T extends InterviewType>(): Promise<T[]> => {
  const getData = query(collection(db, `users/${userId}/interviews`), orderBy('createdAt', 'desc'))

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
}

const setInterviews = async (): Promise<void> => {
  const listInterviews = await getAllInterviews()
  interviews.value = [...listInterviews]
}
const confirmRemoveInterview = async (id: string): Promise<void> => {
  confirm.require({
    message: 'Вы уверены, что хотите удалить собеседование?',
    header: 'Подтверждение',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Отмена',
    acceptLabel: 'Удалить',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(doc(db, `users/${userId}/interviews`, id))
      setInterviews()
      isLoading.value = false
    }
  })
}

onMounted(async () => {
  setInterviews()
  isLoading.value = false
})
</script>

<template>
  <app-confirm-dialog />
  <div v-if="isLoading" class="loader"><app-progress-spinner /></div>
  <app-inline-message v-else-if="!isLoading && !interviews.length" severity="info"
    >Список собеседований пуст</app-inline-message
  >
  <div v-else>
    <h1>Список собеседований</h1>
    <app-data-table :value="interviews">
      <app-column field="company" header="Компания" />
      <app-column field="hrName" header="Имя HR" />
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">{{
            slotProps.data.vacancyLink
          }}</a></template
        >
      </app-column>
      <app-column header="Контакты">
        <template #body="slotProps">
          <div class="contacts">
            <a
              v-if="slotProps.data.contactTelegram"
              :href="`https://t.me/${slotProps.data.contactTelegram}`"
              target="_blank"
              class="contacts__telegram"
              ><span class="contacts__icon pi pi-telegram"
            /></a>
            <a
              v-if="slotProps.data.contactWhatsApp"
              :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
              target="_blank"
              class="contacts__whatsapp"
              ><span class="contacts__icon pi pi-whatsapp"
            /></a>
            <a
              v-if="slotProps.data.contactPhone"
              :href="`https://tel:${slotProps.data.contactPhone}`"
              target="_blank"
              class="contacts__phone"
              ><span class="contacts__icon pi pi-phone"
            /></a>
          </div>
        </template>
      </app-column>
      <app-column>
        <template #body="slotProps">
          <div class="flex gap-2">
            <router-link :to="`/interview/${slotProps.data.id}`">
              <app-button icon="pi pi-pencil" severity="info" />
            </router-link>
            <app-button
              icon="pi pi-trash"
              severity="danger"
              @click="confirmRemoveInterview(slotProps.data.id)"
            />
          </div>
        </template>
      </app-column>
    </app-data-table>
  </div>
</template>

<style scoped>
.contacts {
  display: flex;
  align-items: center;
  gap: 20px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
</style>

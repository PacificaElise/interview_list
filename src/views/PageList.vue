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
  doc,
  where
} from 'firebase/firestore'
import type { InterviewType } from '@/types'

const userId = getAuth().currentUser?.uid
const db = getFirestore()
const confirm = useConfirm()
const interviews = ref<InterviewType[]>([])

const isLoading = ref<boolean>(true)

const selectedFilterResult = ref<string>('')

const setInterviews = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<InterviewType> = await getAllInterviews()
  interviews.value = [...listInterviews]
  isLoading.value = false
}

const submitFilter = async (): Promise<void> => {
  isLoading.value = true
  const listInterviews: Array<InterviewType> = await getAllInterviews(true)
  interviews.value = listInterviews
  isLoading.value = false
}

const clearFilter = async (): Promise<void> => {
  setInterviews()
  selectedFilterResult.value = ''
}

const getAllInterviews = async <T extends InterviewType>(isFilter?: boolean): Promise<T[]> => {
  let getData

  if (isFilter) {
    getData = query(
      collection(db, `users/${userId}/interviews`),
      orderBy('createdAt', 'desc'),
      where('result', '==', selectedFilterResult.value)
    )
  } else {
    getData = query(collection(db, `users/${userId}/interviews`), orderBy('createdAt', 'desc'))
  }

  const listDocs = await getDocs(getData)

  return listDocs.docs.map((doc) => doc.data() as T)
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
      await deleteDoc(doc(db, `users/${userId}/interviews`, id))
      setInterviews()
    }
  })
}

onMounted(async () => {
  setInterviews()
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
    <div class="flex align-items-center gap-5 mb-5">
      <div class="flex align-items-center gap-3">
        <div class="flex align-items-center">
          <app-radio-button
            inputId="result1"
            name="result"
            value="refusal"
            v-model="selectedFilterResult"
          />
          <label for="result1" class="ml-2">Отказ</label>
        </div>
        <div class="flex align-items-center">
          <app-radio-button
            inputId="result2"
            name="result"
            value="offer"
            v-model="selectedFilterResult"
          />
          <label for="result2" class="ml-2">Оффер</label>
        </div>
      </div>

      <div class="flex align-items-center gap-3">
        <app-button @click="submitFilter" :disabled="!selectedFilterResult">Применить</app-button>
        <app-button severity="danger" @click="clearFilter" :disabled="!selectedFilterResult"
          >Сбросить</app-button
        >
      </div>
    </div>

    <app-data-table :value="interviews">
      <app-column field="company" header="Компания" />
      <app-column field="hrName" header="Имя HR" />
      <app-column field="vacancyLink" header="Вакансия">
        <template #body="slotProps">
          <a :href="slotProps.data.vacancyLink" target="_blank">Ссылка на вакансию</a></template
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

      <app-column header="Пройденные этапы">
        <template #body="slotProps">
          <span v-if="!slotProps.data.stages">Не пройдено</span>
          <div v-else class="flex gap-1 cursor-pointer">
            <app-badge
              rounded
              v-for="(stage, i) in slotProps.data.stages"
              :key="i"
              :value="i + 1"
              v-tooltip.top="stage.name"
            />
          </div>
        </template>
      </app-column>

      <app-column header="Зарплатная вилка">
        <template #body="slotProps">
          <span v-if="!slotProps.data.salaryFrom">Не заполнено</span>
          <span v-else>{{ slotProps.data.salaryFrom }} - {{ slotProps.data.salaryTo }}</span>
        </template>
      </app-column>

      <app-column header="Результат">
        <template #body="slotProps">
          <span v-if="!slotProps.data.result">Не пройдено</span>
          <template v-else>
            <app-badge
              :severity="slotProps.data.result === 'offer' ? 'success ' : 'danger'"
              :value="slotProps.data.result"
            />
          </template>
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

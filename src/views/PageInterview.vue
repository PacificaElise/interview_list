<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getFirestore, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { InterviewType, StageType } from '@/types'
import { getAuth } from 'firebase/auth'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()

const isLoading = ref<boolean>(true)

const interview = ref<InterviewType>()
const userId = getAuth().currentUser?.uid

const docref = doc(db, `users/${userId}/interviews`, route.params.id as string)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)

  if (docSnap.exists()) {
    const data = docSnap.data() as InterviewType

    if (data.stages && data.stages.length > 0) {
      data.stages = data.stages.map((stage: StageType) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate()
          }
        }
        return stage
      })
    }
    interview.value = data
  }

  isLoading.value = false
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }

    interview.value.stages.push({ name: '', date: null, description: '' })
  }
}

const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}

const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  if (interview.value) {
    await updateDoc(docref, { ...interview.value })
  }
  await getData()
}

onMounted(async () => {
  await getData()
})
</script>

<template>
  <app-progress-spinner class="loader" v-if="isLoading" />
  <div class="content-interview" v-else-if="interview && !isLoading">
    <app-card>
      <template #title>Собеседование в компанию {{ interview.company }}</template>
      <template #content>
        <div class="flex flex-column gap-2">
          <label for="company">Название компании</label>
          <app-input-text class="input mb-3" id="company" v-model="interview.company" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="vacancyLink">Описание вакансии (ссылка)</label>
          <app-input-text class="input mb-3" id="vacancyLink" v-model="interview.vacancyLink" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="hrName">Контакт (имя)</label>
          <app-input-text class="input mb-3" id="hrName" v-model="interview.hrName" />
        </div>

        <div class="flex flex-column gap-2">
          <label for="contactTelegram">Telegram username</label>
          <app-input-text
            class="input mb-3"
            id="contactTelegram"
            v-model="interview.contactTelegram"
          />
        </div>

        <div class="flex flex-column gap-2">
          <label for="contactWhatsApp">WhatsApp</label>
          <app-input-text
            class="input mb-3"
            id="contatcWhatsApp"
            v-model="interview.contactWhatsApp"
          />
        </div>

        <div class="flex flex-column gap-2">
          <label for="contactPhone">Телефон</label>
          <app-input-text class="input mb-3" id="contactPhone" v-model="interview.contactPhone" />
        </div>

        <div class="flex flex-wrap gap-3 p-fluid mb-3">
          <div class="flex-auto">
            <app-input-number
              inputId="salaryFrom"
              placeholder="Зарплата от"
              v-model="interview.salaryFrom"
            />
          </div>
          <div class="flex-auto">
            <app-input-number
              inputId="salaryTo"
              placeholder="Зарплата до"
              v-model="interview.salaryTo"
            />
          </div>
        </div>

        <app-button
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3"
          @click="addStage"
        />

        <template v-if="interview.stages">
          <div v-for="(stage, index) in interview.stages" :key="index" class="interview-stage">
            <div class="flex flex-column gap-2">
              <label :for="`stage-name-${index}`">Название этапа</label>
              <app-input-text class="input mb-3" :id="`stage-name-${index}`" v-model="stage.name" />
            </div>

            <div class="flex flex-column gap-2">
              <label :for="`stage-date-${index}`">Дата прохождения этапа</label>
              <app-calendar
                class="input mb-3"
                :id="`stage-date-${index}`"
                dateFormat="dd.mm.yy"
                v-model="stage.date"
              />
            </div>

            <div class="flex flex-column gap-2">
              <label :for="`stage-description-${index}`">Комментарий</label>
              <app-textarea
                class="input mb-3"
                :id="`stage-description-${index}`"
                rows="5"
                v-model="stage.description"
              />
            </div>

            <app-button
              label="Удалить этап"
              severity="danger"
              icon="pi pi-minus"
              class="mb-3"
              @click="removeStage(index)"
            />
          </div>
        </template>

        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <app-radio-button
              inputId="result1"
              name="result"
              value="refusal"
              v-model="interview.result"
            />
            <label for="result1" class="ml-2">Отказ</label>
          </div>

          <div class="flex align-items-center">
            <app-radio-button
              inputId="result2"
              name="result"
              value="offer"
              v-model="interview.result"
            />
            <label for="result2" class="ml-2">Оффер</label>
          </div>
        </div>

        <app-button label="Сохранить этап" icon="pi pi-save" @click="saveInterview" />
      </template>
    </app-card>
  </div>
</template>

<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>

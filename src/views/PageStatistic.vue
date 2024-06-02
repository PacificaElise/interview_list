<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, orderBy, getDocs } from 'firebase/firestore'
import type { InterviewType } from '@/types'

const userId = getAuth().currentUser?.uid
const db = getFirestore()
const interviews = ref<InterviewType[]>([])

const data = ref()

const getAllInterviews = async <T extends InterviewType>(): Promise<T[]> => {
  const getData = query(collection(db, `users/${userId}/interviews`), orderBy('createdAt', 'desc'))
  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => doc.data() as T)
}

const setData = () => {
  const documentStyle = getComputedStyle(document.body)
  const data: number[] = [0, 0, 0]
  interviews.value.forEach((interview: InterviewType) => {
    if (interview.result === 'offer') {
      data[0] += 1
    } else if (interview.result === 'refusal') {
      data[1] += 1
    } else {
      data[2] += 1
    }
  })

  return {
    labels: ['Оффер', 'Отказ', 'В процессе'],
    datasets: [
      {
        data,
        backgroundColor: [
          documentStyle.getPropertyValue('--blue-500'),
          documentStyle.getPropertyValue('--red-500'),
          documentStyle.getPropertyValue('--yellow-500')
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--blue-700'),
          documentStyle.getPropertyValue('--red-700'),
          documentStyle.getPropertyValue('--yellow-700')
        ]
      }
    ]
  }
}

onMounted(async () => {
  interviews.value = await getAllInterviews()
  data.value = setData()
})
</script>

<template>
  <h1>Статистика</h1>
  <div class="card flex justify-content-center">
    <app-chart type="doughnut" :data="data" class="w-full md:w-30rem" />
  </div>
</template>

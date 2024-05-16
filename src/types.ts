export type InterviewType = {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  createdAt: Date
  contactTelegram?: string
  contactWhatsApp?: string
  contactPhone?: string
  salaryFrom?: number
  salaryTo?: number
  stages: StageType[]
  result?: 'refusal' | 'offer'
}

export type StageType = {
  name: string
  date: string
  description?: string
}

import { apiEndpoint } from '../config'
import { Backlog } from '../types/Backlog';
import { SprintType } from '../types/Sprint'
import { CreateBacklogRequest } from '../types/CreateBacklogRequest';
import Axios from 'axios'
import { UpdateBacklogRequest } from '../types/UpdateBacklogRequest';

export async function getBacklogs(idToken: string): Promise<Backlog[]> {
  console.log('Fetching backlogs')

  const response = await Axios.get(`${apiEndpoint}/sprint/0/backlog`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Backlogs:', response.data)
  return response.data.items
}

export async function getSprints(idToken: string): Promise<SprintType[]> {

  const response = await Axios.get(`${apiEndpoint}/sprint`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })

  return response.data.items
}

export async function getSprintBacklogs(idToken:string, sprint:string): Promise<Backlog[]> {
  console.log('Fetching backlogs')

  const response = await Axios.get(`${apiEndpoint}/sprint/${sprint}/backlog`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Backlogs:', response.data)
  return response.data.items
}

export async function createBacklog(
  idToken: string,
  newBacklog: CreateBacklogRequest
): Promise<Backlog> {
  const response = await Axios.post(`${apiEndpoint}/backlog`,  JSON.stringify(newBacklog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function createSprint(
  idToken: string
): Promise<void> {
  const response = await Axios.post(`${apiEndpoint}/sprint`,  JSON.stringify(''), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function patchBacklog(
  idToken: string,
  backlogId: string,
  updatedBacklog: UpdateBacklogRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/backlog/${backlogId}`, JSON.stringify(updatedBacklog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBacklog(
  idToken: string,
  backlogId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/backlog/${backlogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

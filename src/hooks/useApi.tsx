import { useKeycloak } from "@react-keycloak/web"
import { App } from "antd"
import axios, { AxiosRequestConfig } from "axios"

const useApi = () => {
  const { notification } = App.useApp()
  const { keycloak } = useKeycloak()

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
  })

  const throwUnauthenticated = (e: any) => {
    keycloak.updateToken()
    throw e
  }

  const get = async (url: string, params?: AxiosRequestConfig["params"]) => {
    try {
      const res = await api.get(url, {
        params,
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      return res.data.data
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return null
    }
  }

  const post = async (url: string, body: Record<string, any>) => {
    try {
      const res = await api.post(url, body, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      if (res.data) return res.data.data
      return null
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return null
    }
  }

  const put = async (url: string, id: string, body: Record<string, any>) => {
    try {
      const res = await api.put(`${url}/${id}`, body, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      if (res.data) return res.data.data
      return null
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return null
    }
  }

  const del = async (url: string, id: string) => {
    try {
      const res = await api.delete(`${url}/${id}`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      })
      if (res.data) return true
      return false
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return false
    }
  }

  const postFormData = async (url: string, formData: FormData) => {
    try {
      const res = await api.post(url, formData, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
          // ❌ Không set Content-Type cho multipart/form-data, để axios tự set
        },
      })
      // ✅ Trả về toàn bộ response để có thể access data
      return res.data
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return null
    }
  }

  return { get, post, put, del, postFormData }

  

}

export default useApi

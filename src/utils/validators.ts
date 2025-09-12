import dayjs from "dayjs"
import { FormInstance } from "rc-field-form/lib/interface"

export const maxDateByValue =
  (field: string, label: string, valueCompare: Date, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      if (!value || dayjs(valueCompare).isAfter(getFieldValue(field))) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message ||
            `${label} must be less than or equal ${dayjs(valueCompare).format(
              "DD-MM-YYYY HH:mm:ss"
            )}!`
        )
      )
    },
  })
export const minDateByValue =
  (field: string, label: string, valueCompare: Date, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      if (!value || dayjs(valueCompare).isBefore(getFieldValue(field))) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message ||
            `${label} must be greater than or equal ${dayjs(
              valueCompare
            ).format("DD-MM-YYYY HH:mm:ss")}!`
        )
      )
    },
  })
export const maxDateByField =
  (field: string, label: string, fieldCompare: string, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      const valueCompare = getFieldValue(fieldCompare)
      if (
        !value ||
        !valueCompare ||
        dayjs(valueCompare).isAfter(getFieldValue(field))
      ) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message ||
            `${label} must be less than or equal ${dayjs(valueCompare).format(
              "DD-MM-YYYY HH:mm:ss"
            )}!`
        )
      )
    },
  })
export const minDateByField =
  (field: string, label: string, fieldCompare: string, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      const valueCompare = getFieldValue(fieldCompare)
      if (
        !value ||
        !valueCompare ||
        dayjs(valueCompare).isBefore(getFieldValue(field))
      ) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message ||
            `${label} must be greater than or equal ${dayjs(
              valueCompare
            ).format("DD-MM-YYYY HH:mm:ss")}!`
        )
      )
    },
  })

export const maxByValue =
  (field: string, label: string, valueCompare: number, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      if (!value || getFieldValue(field) <= valueCompare) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message || `${label} must be less than or equal ${valueCompare}!`
        )
      )
    },
  })
export const minByValue =
  (field: string, label: string, valueCompare: number, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      if (value == null || getFieldValue(field) >= valueCompare) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message || `${label} must be greater than or equal ${valueCompare}!`
        )
      )
    },
  })
export const maxByField =
  (field: string, label: string, fieldCompare: string, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      const valueCompare = getFieldValue(fieldCompare)
      if (
        value == null ||
        !valueCompare ||
        getFieldValue(field) <= valueCompare
      ) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message || `${label} must be less than or equal ${valueCompare}!`
        )
      )
    },
  })
export const minByField =
  (field: string, label: string, fieldCompare: string, message?: string) =>
  ({ getFieldValue }: FormInstance) => ({
    validator(_: any, value: any) {
      const valueCompare = getFieldValue(fieldCompare)
      if (
        value == null ||
        valueCompare == null ||
        getFieldValue(field) >= valueCompare
      ) {
        return Promise.resolve()
      }
      return Promise.reject(
        new Error(
          message || `${label} must be greater than or equal ${valueCompare}!`
        )
      )
    },
  })

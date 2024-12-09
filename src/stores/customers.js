import { defineStore } from 'pinia'
import axios from 'axios'

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchCustomers() {
      this.loading = true
      try {
        const response = await axios.get('http://localhost:8000/api/v1/customers/')
        this.customers = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },
    async addCustomer(customer) {
      try {
        const response = await axios.post('http://localhost:8000/api/v1/customers/', customer)
        this.customers.push(response.data)
      } catch (error) {
        this.error = error
      }
    },
    async updateCustomer(id, updatedCustomer) {
      try {
        const response = await axios.put(`http://localhost:8000/api/v1/customers/${id}`, updatedCustomer)
        const index = this.customers.findIndex(c => c.id === id)
        if (index !== -1) this.customers[index] = response.data
      } catch (error) {
        this.error = error
      }
    },
    async deleteCustomer(id) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/customers/${id}`)
        this.customers = this.customers.filter(c => c.id !== id)
      } catch (error) {
        this.error = error
      }
    }
  }
})
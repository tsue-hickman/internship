<template>
  <v-parallax
    :src="backgroundImage"
    height="100vh"
    class="customer-dashboard"
  >
    <v-container fluid class="dashboard-container">
      <v-fade-transition>
        <v-row class="content" justify="center">
          <v-col cols="12" class="px-6">
            <!-- Dashboard Header -->
            <v-row class="mb-6" align="center">
              <v-col cols="12" md="4">
                <h1 class="text-h4 font-weight-bold text-white">
                  Customer Dashboard
                </h1>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search".''
                  density="comfortable"
                  prepend-inner-icon="mdi-magnify"
                  label="Search Customers"
                  variant="solo-filled"
                  :bg-color="searchBgColor"
                  class="search-field rounded-lg"
                  hide-details
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="4" class="text-right">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="openDialog"
                  class="px-6 text-capitalize"
                  elevation="2"
                >
                  Add Customer
                </v-btn>
              </v-col>
            </v-row>

            <!-- Main Card -->
            <v-card
              class="customer-card rounded-lg"
              elevation="10"
              :theme="isDark ? 'dark' : 'light'"
            >
              <v-data-table
                :headers="headers"
                :items="customers"
                :search="search"
                :items-per-page="itemsPerPage"
                :items-per-page-options="[5, 10, 25, 50]"
                class="customer-table"
                hover
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.name }}</td>
                    <td>{{ item.organization }}</td>
                    <td>{{ item.phone }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ formatDate(item.created_at) }}</td>
                    <td>
                      <v-tooltip text="Edit Customer">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-pencil"
                            size="small"
                            color="primary"
                            variant="text"
                            @click="editItem(item)"
                            class="mr-2"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                      <v-tooltip text="Delete Customer">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            icon="mdi-delete"
                            size="small"
                            color="error"
                            variant="text"
                            @click="deleteItem(item)"
                          ></v-btn>
                        </template>
                      </v-tooltip>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>
      </v-fade-transition>

      <!-- Add/Edit Dialog -->
      <v-dialog
        v-model="dialog"
        max-width="600px"
        transition="dialog-bottom-transition"
      >
        <v-card class="customer-form-card">
          <v-card-title class="d-flex justify-space-between pa-4">
            <span class="text-h5">{{ formTitle }}</span>
            <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-4">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.name"
                    :rules="nameRules"
                    label="Full Name"
                    prepend-inner-icon="mdi-account"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.organization"
                    :rules="organizationRules"
                    label="Organization"
                    prepend-inner-icon="mdi-domain"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.phone"
                    :rules="phoneRules"
                    @input="editedItem.phone = formatPhone($event.target.value)"
                    label="Phone Number"
                    prepend-inner-icon="mdi-phone"
                    required
                    variant="outlined"
                    placeholder="(xxx) - xxx - xxxx"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editedItem.email"
                    :rules="emailRules"
                    label="Email Address"
                    prepend-inner-icon="mdi-email"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="close"
              class="me-4"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="save"
              :loading="saving"
              :disabled="!valid"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog
        v-model="dialogDelete"
        max-width="500px"
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-card-title class="text-h5 pa-4">
            Confirm Deletion
          </v-card-title>
          <v-card-text class="pa-4">
            Are you sure you want to delete this customer? This action cannot be undone.
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn
              color="grey-darken-1"
              variant="text"
              @click="closeDelete"
            >
              Cancel
            </v-btn>
            <v-btn
              color="error"
              @click="deleteItemConfirm"
              :loading="deleting"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Success Snackbar -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        :timeout="3000"
        location="top"
      >
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn
            color="white"
            variant="text"
            @click="snackbar.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-parallax>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useCustomersStore } from '@/stores/customers'

//Customers.js store
const customersStore = useCustomersStore()

onMounted(() => {
  customersStore.fetchCustomers()
})

// Theme setup
const theme = useTheme()
const isDark = computed(() => theme.global.current.value.dark)
const searchBgColor = computed(() => isDark.value ? 'grey-darken-3' : 'grey-lighten-4')

// State management
const search = ref('')
const dialog = ref(false)
const dialogDelete = ref(false)
const valid = ref(false)
const saving = ref(false)
const deleting = ref(false)
const form = ref(null)
const itemsPerPage = ref(10)
const editedIndex = ref(-1)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const backgroundImage = '/src/assets/images/soldier.jpg' // Update with your image path

// Table headers
const headers = [
  { title: 'Name', key: 'name', align: 'start' },
  { title: 'Organization', key: 'organization' },
  { title: 'Phone', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

// Data
const customers = ref([])
const editedItem = ref({
  id: null,
  name: '',
  organization: '',
  phone: '',
  email: '',
  created_at: ''
})

// Computed
const formTitle = computed(() => {
  return editedIndex.value === -1 ? 'New Customer' : 'Edit Customer'
})

// Validation rules
const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length <= 50) || 'Name must be less than 50 characters'
]

const organizationRules = [
  v => !!v || 'Organization is required',
  v => (v && v.length <= 100) || 'Organization must be less than 100 characters'
]

const phoneRules = [
  v => !!v || 'Phone is required',
  v => /^\(\d{3}\) - \d{3} - \d{4}$/.test(v) || 'Phone must be in format (xxx) - xxx - xxxx'
]

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

// Methods
const showSnackbar = (text, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '')
  let formatted = ''
  if (digits.length > 0) formatted += `(${digits.slice(0, 3)}`
  if (digits.length > 3) formatted += `) - ${digits.slice(3, 6)}`
  if (digits.length > 6) formatted += ` - ${digits.slice(6, 10)}`
  return formatted.trim()
}

const openDialog = () => {
  editedItem.value = {
    id: null,
    name: '',
    organization: '',
    phone: '',
    email: '',
    created_at: ''
  }
  editedIndex.value = -1
  form.value?.resetValidation()
  dialog.value = true
}

const editItem = (item) => {
  editedIndex.value = customers.value.indexOf(item)
  editedItem.value = { ...item }
  dialog.value = true
}

const deleteItem = (item) => {
  editedIndex.value = customers.value.indexOf(item)
  editedItem.value = { ...item }
  dialogDelete.value = true
}

const close = () => {
  dialog.value = false
  form.value?.reset()
}

const closeDelete = () => {
  dialogDelete.value = false
}

const save = async () => {
  if (!form.value?.validate()) return

  saving.value = true
  try {
    const now = new Date()
    const timestamp = now.toISOString()

    if (editedIndex.value > -1) {
      Object.assign(customers.value[editedIndex.value], editedItem.value)
      showSnackbar('Customer updated successfully')
    } else {
      const newItem = {
        ...editedItem.value,
        id: `cust_${Date.now()}`,
        created_at: timestamp
      }
      customers.value.push(newItem)
      showSnackbar('Customer added successfully')
    }

    saveToLocalStorage()
    close()
  } catch (error) {
    showSnackbar('Error saving customer', 'error')
  } finally {
    saving.value = false
  }
}

const deleteItemConfirm = async () => {
  deleting.value = true
  try {
    customers.value.splice(editedIndex.value, 1)
    saveToLocalStorage()
    showSnackbar('Customer deleted successfully')
    closeDelete()
  } catch (error) {
    showSnackbar('Error deleting customer', 'error')
  } finally {
    deleting.value = false
  }
}

const saveToLocalStorage = () => {
  localStorage.setItem('customers', JSON.stringify(customers.value))
}

// Lifecycle hooks
onMounted(() => {
  const storedCustomers = localStorage.getItem('customers')
  if (storedCustomers) {
    customers.value = JSON.parse(storedCustomers)
  }
})
</script>

<style scoped>
.customer-dashboard {
  min-height: 100vh;
  background-attachment: fixed;
}

.dashboard-container {
  padding-top: 2rem;
}

.customer-card {
  backdrop-filter: blur(10px);
  background-color: rgba(18, 18, 18, 0.9) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.customer-table {
  background: transparent !important;
}

.customer-table :deep(th) {
  font-weight: 600 !important;
  color: #03fbff !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.customer-table :deep(td) {
  color: #ffffff !important;
}

.customer-table :deep(.v-data-table__wrapper) {
  border-radius: 8px;
}

.search-field {
  transition: all 0.3s ease;
}

.search-field:hover {
  transform: translateY(-2px);
}

</style>

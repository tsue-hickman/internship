<template>
  <v-parallax :src="earthImage" height="100vh">
    <v-container fluid class="destinations-container">
      <v-row class="content" justify="center">
        <v-col cols="12">
          <v-card elevation="10" class="main-card">
            <v-card-title class="d-flex align-center">
              <v-fade-transition>
                <h2 class="destinations-title">Destination Table</h2>
              </v-fade-transition>
              <v-spacer></v-spacer>
              <v-slide-x-transition>
                <v-text-field 
                  v-model="search"
                  density="compact"
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                  variant="solo-filled"
                  flat
                  clearable
                  single-line
                  hide-details 
                  class="searchbar"
                  @focus="searchbarWidth = '300px'"
                  @blur="searchbarWidth = '169px'"
                  :style="{ width: searchbarWidth }"
                ></v-text-field>
              </v-slide-x-transition>
              <v-spacer></v-spacer>
              <v-btn 
                color="primary" 
                @click="openDialog" 
                class="add-btn"
                :loading="loading"
                prepend-icon="mdi-plus"
              >
                Add Destination
              </v-btn> 
            </v-card-title>

            <v-data-table
              :items="destinations"
              :headers="headers"
              :search="search"
              :items-per-page="5"
              :items-per-page-options="[5, 10, 25, 50, 100]"
              class="dest-table"
              :loading="loading"
              hover
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.name }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.description }}</td>
                  <td>{{ formatDateToCST(item.createdAt) }}</td>
                  <td>
                    <v-tooltip text="Edit">
                      <template v-slot:activator="{ props }">
                        <v-icon 
                          v-bind="props"
                          size="small" 
                          class="mr-2" 
                          @click="editItem(item)"
                          color="primary"
                        >
                          mdi-pencil
                        </v-icon>
                      </template>
                    </v-tooltip>
                    <v-tooltip text="Delete">
                      <template v-slot:activator="{ props }">
                        <v-icon 
                          v-bind="props"
                          size="small" 
                          @click="deleteItem(item)"
                          color="error"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>

      <!-- Add/Edit Dialog -->
      <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" @submit.prevent="save">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      :rules="nameRules"
                      label="Name"
                      required
                      autofocus
                      :loading="loading"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.type"
                      :rules="typeRules"
                      label="Type"
                      required
                      :loading="loading"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.description"
                      :rules="descriptionRules"
                      label="Description"
                      required
                      auto-grow
                      rows="3"
                      :loading="loading"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      v-model="numDuplicates"
                      :items="duplicateOptions"
                      label="Number of duplicates"
                      :disabled="editedIndex > -1"
                      :loading="loading"
                    ></v-select>
                  </v-col>
                  <v-col v-if="editedIndex > -1" cols="12">
                    <p class="created-at">Created At: {{ formatDateToCST(editedItem.createdAt) }}</p>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="save" 
              class="save-btn"
              :loading="loading"
              :disabled="!valid"
            >
              Save
            </v-btn>
            <v-btn 
              color="secondary" 
              variant="text" 
              @click="close" 
              class="cancel-btn"
              :disabled="loading"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Delete Dialog -->
      <v-dialog v-model="dialogDelete" max-width="650px" persistent class="centered-dialog">
        <v-card>
          <v-card-title class="text-h5">
            Confirm Deletion
            <v-spacer></v-spacer>
            <v-btn icon="mdi-close" variant="text" @click="closeDelete"></v-btn>
          </v-card-title>
          <v-card-text class="irreversible">
            Are you sure you want to delete destination "{{ editedItem.name }}"? This action is
            <span class="emphasized">irreversible</span>.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="closeDelete" 
              class="deletion-cancel-btn"
              :disabled="loading"
            >
              Cancel
            </v-btn>
            <v-btn 
              color="error" 
              variant="text" 
              @click="deleteItemConfirm" 
              class="deletion-ok-btn"
              :loading="loading"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-parallax>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDestinationsStore } from '@/stores/destinations'
import { storeToRefs } from 'pinia'
import earthImage from '@/assets/images/destroyer.png'

const destinationsStore = useDestinationsStore()
const { destinations } = storeToRefs(destinationsStore)

// State
const loading = ref(false)
const search = ref('')
const searchbarWidth = ref('169px')
const dialog = ref(false)
const dialogDelete = ref(false)
const editedIndex = ref(-1)
const editedItem = ref({
  id: null,
  name: '',
  type: '',
  description: '',
  createdAt: ''
})
const form = ref(null)
const valid = ref(false)
const numDuplicates = ref(1)

// Constants
const headers = [
  { title: 'Name', key: 'name', align: 'start', sortable: true },
  { title: 'Type', key: 'type', align: 'start', sortable: true },
  { title: 'Description', key: 'description', align: 'start', sortable: true },
  { title: 'Created At', key: 'createdAt', align: 'start', sortable: true },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false }
]

const duplicateOptions = [
  { title: '1 copy', value: 1 },
  { title: '2 copies', value: 2 },
  { title: '3 copies', value: 3 },
  { title: '5 copies', value: 5 },
  { title: '10 copies', value: 10 }
]

// Validation rules
const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length <= 50) || 'Name must be less than 50 characters'
]

const typeRules = [
  v => !!v || 'Type is required',
  v => (v && v.length <= 50) || 'Type must be less than 50 characters'
]

const descriptionRules = [
  v => !!v || 'Description is required',
  v => (v && v.length <= 500) || 'Description must be less than 500 characters'
]

// Computed
const formTitle = computed(() => 
  editedIndex.value === -1 ? 'New Destination' : 'Edit Destination'
)

// Lifecycle hooks
onMounted(async () => {
  try {
    loading.value = true
    const storedDestinations = localStorage.getItem('destinations')
    if (storedDestinations) {
      destinations.value = JSON.parse(storedDestinations)
    } else {
      await destinationsStore.fetchDestinations()
    }
  } catch (error) {
    console.error('Error loading destinations:', error)
    // You can add error handling UI here
  } finally {
    loading.value = false
  }
})

// Watch for changes to save to localStorage
watch(destinations, (newDestinations) => {
  saveToLocalStorage()
}, { deep: true })

// Methods
function formatDateToCST(date) {
  if (!date) return ''
  
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZone: 'America/Chicago',
    hour12: false
  }
  return new Date(date).toLocaleString('en-US', options).replace(',', '')
}

function openDialog() {
  editedItem.value = { id: null, name: '', type: '', description: '', createdAt: '' }
  editedIndex.value = -1
  numDuplicates.value = 1
  form.value?.resetValidation()
  dialog.value = true
}

function editItem(item) {
  editedIndex.value = destinations.value.indexOf(item)
  editedItem.value = { ...item }
  dialog.value = true
}

function deleteItem(item) {
  editedIndex.value = destinations.value.indexOf(item)
  editedItem.value = { ...item }
  dialogDelete.value = true
}

async function deleteItemConfirm() {
  try {
    loading.value = true
    // Here you can add API call when ready
    // await destinationsStore.deleteDestination(editedItem.value.id)
    destinations.value.splice(editedIndex.value, 1)
    closeDelete()
  } catch (error) {
    console.error('Error deleting destination:', error)
    // Add error handling UI here
  } finally {
    loading.value = false
  }
}

function close() {
  dialog.value = false
  editedIndex.value = -1
  editedItem.value = {
    id: null,
    name: '',
    type: '',
    description: '',
    createdAt: ''
  }
  numDuplicates.value = 1
}

function closeDelete() {
  dialogDelete.value = false
  editedIndex.value = -1
}

async function save() {
  if (!form.value) return
  
  if (form.value.validate()) {
    try {
      loading.value = true
      const now = new Date().toISOString()
      
      if (editedIndex.value > -1) {
        // Editing existing destination
        // Here you can add API call when ready
        // await destinationsStore.updateDestination(editedItem.value)
        Object.assign(destinations.value[editedIndex.value], {
          ...editedItem.value,
          createdAt: editedItem.value.createdAt || now
        })
      } else {
        // Adding new destination(s)
        for (let i = 0; i < numDuplicates.value; i++) {
          const newItem = {
            ...editedItem.value,
            id: `dest_${Date.now()}_${i}`,
            createdAt: now
          }
          // Here you can add API call when ready
          // await destinationsStore.createDestination(newItem)
          destinations.value.push(newItem)
        }
      }
      
      close()
      form.value.reset()
      form.value.resetValidation()
    } catch (error) {
      console.error('Error saving destination:', error)
      // Add error handling UI here
    } finally {
      loading.value = false
    }
  }
}

function saveToLocalStorage() {
  localStorage.setItem('destinations', JSON.stringify(destinations.value))
}
</script>

<style scoped>
.destinations-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.destinations-title {
  color: white;
  padding: 20px;
  text-align: center;
  margin: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}

.searchbar {
  position: absolute;
  right: 30px;
  transition: width 0.3s ease;
} 

.main-card {
  backdrop-filter: blur(10px);
  background-color: rgba(18, 18, 18, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.main-card:hover {
  transform: translateY(-5px);
}

.dest-table {
  background-color: transparent;
  color: #03fbff !important;
  max-height: 600px;
}

  </style> 
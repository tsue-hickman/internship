<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="3">
            <v-list>
              <v-list-item
                v-for="(item, i) in settingsItems"
                :key="i"
                :to="item.to"
                link
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="9">
            <v-card>
              <v-card-title>Settings</v-card-title>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="12">
                      <v-switch
                        v-model="displaySettings.nightLight"
                        label="Night Light"
                      ></v-switch>
                    </v-col>
                    <v-col cols="12">
                      <v-slider
                        v-model="displaySettings.brightness"
                        label="Brightness"
                        thumb-label
                      ></v-slider>
                    </v-col>
                    <v-col cols="12">
                      <v-select
                        v-model="displaySettings.colorProfile"
                        label="Color Profile"
                        :items="colorProfiles"
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SettingsPage',
  setup() {
    const settingsItems = [
      { title: 'Display', to: '/settings/display' },
      { title: 'Date & Time', to: '/settings/date-time' },
      { title: 'Privacy', to: '/settings/privacy' },
      { title: 'Updates', to: '/settings/updates' }
    ]

    const displaySettings = ref({
      nightLight: true,
      brightness: 50,
      colorProfile: 'Default'
    })

    const colorProfiles = ['Default', 'Warm', 'Cool', 'Vivid']

    return {
      settingsItems,
      displaySettings,
      colorProfiles
    }
  }
})
</script>
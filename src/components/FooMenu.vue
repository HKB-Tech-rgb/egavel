<template>
  <div class="text-center">
    <v-menu>
        <template #activator="{ on: onMenu }">
            <v-btn v-on="onMenu">Menu Trigger</v-btn>
            <v-tooltip bottom>
                <template #activator="{ on: onTooltip }">
                <v-btn v-on="{ ...onMenu, ...onTooltip }">Menu Trigger with Tooltip</v-btn>
                </template>
                <span>Tooltip Content</span>
            </v-tooltip>
        </template>
        <v-list>
          <v-list-tile 
             v-for="(item, index) in items" :key="index"
             @click.prevent>
             <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
    </v-menu>
  </div>
</template>
<script>
  export default {
    data: () => ({
      items: [
        { title: 'Click Me1' },
        { title: 'Click Me2' },
        { title: 'Click Me3' },
        { title: 'Click Me4' },
      ]
    }),
  }
</script>
	
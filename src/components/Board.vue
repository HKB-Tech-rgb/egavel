<template>
  <div :id="id" class="board" @dragover.prevent @drop.prevent="dropCard">
    <slot />
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    id: {
      type: String,
      value: ""
    }
  },
  methods: {
    dropCard: e => {
      const card_id = e.dataTransfer.getData("card_id");
      const card = document.getElementById(card_id);
      var val = document.getElementById(card_id).getAttribute("value");

      var roles = this.$store.getters.getDndRoles;
      if (e.target.id == "Board-1") {
        roles.filter(role => role.id != val);
      } else if (e.target.id == "Board-2") {
        roles.push({ id: val });
      }
      card.style.display = "block";
      e.target.appendChild(card);
    }
  },
  computed: {
    roles() {
      return this.$store.getters.getDndRoles;
    }
  }
};
</script>

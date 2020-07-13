<template>
    <div>
      <b-dropdown size="lg"  variant="link" toggle-class="text-decoration-none" no-caret class="hamburger">
        <template v-slot:button-content>
           <div class="h2 mb-0">
           <b-icon icon="list" class="text-dark"></b-icon>
           </div>
        </template>
          <b-dropdown-item href="#">About Us</b-dropdown-item>
          <b-dropdown-item href="#">Contacts</b-dropdown-item>
          <b-dropdown-item href="#">Legal</b-dropdown-item>
      </b-dropdown>
    </div>
</template>

<script>

export default {
  name: "Hamburger"
}

</script>

<style scoped>
</style>

<script setup>

</script>

<template>
  <div class="main_area">
    <div class="left_section">
    </div>
    <div class="right_section">

    </div>
  </div>
</template>

<style scoped>
.main_area{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding: 1rem;
  border-radius: 2rem;
  justify-content: space-between;
}
.left_section{
  background-color: #fff;
  width: 49%;
  border-radius: 1rem;
  padding: 1.5rem;
}
.right_section{
  background-color: #fff;
  width: 49%;
  border-radius: 1rem;
}
.left_section div{
  padding: 1rem;
}
.right_section div{
  padding: 0.5rem;
}
</style>
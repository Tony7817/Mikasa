<template>
  <q-page>
    <div class="row q-pt-lg">
      <!--Left display area-->
      <div class="col-2 column q-gutter-md q-px-sm" style="width: 20.5%">
        <StarBrand
          v-for="b in starbrands"
          :key="b.id"
          :avatar="b.avatar"
          :id="b.id"
          :link="tes"
          :desc="b.desc"
        />
      </div>
      <!--Right star display area-->
      <div class="col">
        <div class="row q-gutter-md">
          <StarItem
            class="q-mt-sm"
            v-for="s in stars"
            :key="s.link"
            :id="s.id"
            :link="s.link"
            :name="s.name"
            :desc="s.desc"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import StarBrand from "src/components/StarBrand.vue";
import StarItem from "src/components/StarItem.vue";
import { ref } from "vue";

defineOptions({
  name: "StarList",
});

const stars = ref([
  {
    id: "1",
    link: "https://m.media-amazon.com/images/I/81kOQC3knnL._AC_SY879_.jpg",
    name: "Olivia",
    desc: "Pornhub Homepage: https://www.pornhub.com/xxx",
  },
  {
    id: "2",
    link: "https://m.media-amazon.com/images/I/71OIiMeephL._AC_SY879_.jpg",
    name: "Ava",
    desc: "See me in the youtube https://youtube.com/sxxxx",
  },
  {
    id: "3",
    link: "https://m.media-amazon.com/images/I/81isle9qwaL._AC_SY879_.jpg",
    name: "Scarlett",
    desc: "Find me in pornhub: https://www.pornhub.com/",
  },
  {
    id: "4",
    link: "https://m.media-amazon.com/images/I/61ZFIlnKNkL._AC_.jpg",
    name: "Lucy",
    desc: "Pornhub Homepage: https://www.pornhub.com/",
  },
  {
    id: "5",
    link: "https://m.media-amazon.com/images/I/81A4D9VAa1L._AC_SY879_.jpg",
    name: "Audrey",
    desc: "Pornhub Homepage: https://www.pornhub.com/",
  },
  {
    id: "6",
    link: "https://m.media-amazon.com/images/I/81IL7GpFdEL._AC_SY879_.jpg",
    name: "Lily",
    desc: "Pornhub Homepage: https://www.pornhub.com/",
  },
]);

const starbrands = ref([
  {
    id: "1",
    avatar: "https://cdn.quasar.dev/img/avatar.png",
    desc: "Lucy wears a sexy black stocking on Pornhub, come and watch it",
  },
  {
    id: "2",
    avatar: "https://cdn.quasar.dev/img/avatar6.jpg",
    desc: "Ruby wore a red sexy lingerie, come and watch it on pornhub",
  },
  {
    id: "3",
    avatar: "https://cdn.quasar.dev/img/avatar2.jpg",
    desc: "What did Ava wear today? Come and find out.",
  },
]);
</script>

<style scoped></style>

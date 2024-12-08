<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="User" />
        <q-breadcrumbs-el label="Star" />
        <q-breadcrumbs-el label="Add" />
      </q-breadcrumbs>
    </div>
    <div class="q-pa-md">
      <div class="text-h5 text-bold">Poster Image</div>
      <q-uploader
        label="Add Poster Image"
        color="primary"
        square
        flat
        bordered
        style="width: 100%"
      />
    </div>
  </q-page>
</template>

<script setup></script>

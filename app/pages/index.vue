<template>
  <main
    class="min-h-screen bg-sky-400 flex flex-col items-center justify-start sm:justify-center px-4 sm:px-6 py-6 sm:py-10"
  >
    <div
      class="w-full max-w-lg sm:max-w-2xl bg-white sm:bg-transparent sm:shadow-none rounded-2xl sm:rounded-none flex flex-col items-stretch sm:items-center p-4 sm:p-6"
    >
      <h1 class="text-2xl sm:text-3xl font-semibold text-center sm:text-left text-white mb-6">
        Weather — Поиск города
      </h1>

      <div class="w-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
        <SearchInput @on-select="onCitySelect" />
      </div>

      <ForecastModal v-model:visible="modalVisible" :city="selectedCity" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { WeatherService } from '~/service/api';
import type { ICity } from '~/service/api.interface';

const route = useRoute();
const modalVisible = ref(false);

const selectedCity = ref<ICity | null>(null);
const shouldOpenModal = computed(() => !!route.query?.city?.length);

const { data } = useAsyncData(
  'city-data',
  () => WeatherService.getCity(route.query.city as string),
  {
    immediate: shouldOpenModal.value,
  },
);

watch(
  data,
  () => {
    if (data.value) {
      selectedCity.value = data.value;
      modalVisible.value = true;
    }
  },
  { immediate: true },
);

const onCitySelect = (city: ICity) => {
  selectedCity.value = city;
  navigateTo({ query: { city: city.id } });
  modalVisible.value = true;
};
</script>

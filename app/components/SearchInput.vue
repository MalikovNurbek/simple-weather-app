<template>
  <div class="relative">
    <input
      v-model="searchText"
      type="search"
      list="city-list"
      placeholder="Введите город"
      class="w-full p-3 border rounded focus:outline-none text-white"
    />

    <ul
      v-if="results.length && showList"
      class="absolute left-0 right-0 bg-white border rounded mt-1 max-h-60 overflow-auto z-10"
    >
      <li
        v-for="city in results"
        :key="city.id"
        @click="select(city)"
        class="p-2 hover:bg-slate-100 cursor-pointer"
      >
        {{ city.name }}, {{ city.sys?.country }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { WeatherService } from '~/service/api';
import { debounce } from '~/utils/debounce';
import type { ICity } from '~/service/api.interface';

interface ISearchInputEmits {
  (event: 'onSelect', city: ICity): void;
}

const emit = defineEmits<ISearchInputEmits>();

const searchText = ref('');
const showList = ref(false);

const getCityRequest = useAsyncData(() => WeatherService.findCities(unref(searchText)), {
  default: () => ({ list: [] }),
});

const results = computed<ICity[]>(() => getCityRequest.data.value?.list ?? []);

watch(
  searchText,
  debounce(async () => {
    showList.value = true;
    await getCityRequest.execute();
  }, 500),
);

const select = (city: ICity) => {
  emit('onSelect', city);
  showList.value = false;
};
</script>

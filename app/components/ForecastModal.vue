<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4 md:px-6"
    >
      <div class="absolute inset-0 bg-black/40" @click="onClose"></div>

      <div
        class="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-2xl p-4 sm:p-6 shadow-lg overflow-y-auto max-h-[90vh] flex flex-col"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-slate-200 pb-3 mb-3 gap-3 sm:gap-0"
        >
          <div class="flex-1">
            <h3
              class="text-lg sm:text-xl font-semibold text-slate-800 leading-tight text-center sm:text-left"
            >
              {{ city?.name }}, {{ city?.sys?.country }}
            </h3>
            <p class="text-sm text-slate-500 text-center sm:text-left">
              {{ weekday }}, {{ dateStr }}
            </p>

            <select
              v-model="unitValue"
              class="mt-2 rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition w-full sm:w-auto"
            >
              <option v-for="option in options" :key="option" :value="option" class="text-gray-800">
                {{ getUnitLabel(option) }}
              </option>
            </select>
          </div>

          <button
            @click="onClose"
            class="absolute sm:relative top-3 right-3 sm:top-0 sm:right-0 text-slate-500 hover:text-slate-700 text-lg font-semibold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div
          v-if="isLoading && !forecast"
          class="p-6 text-center text-slate-500 text-base sm:text-lg"
        >
          Загрузка данных...
        </div>

        <div v-else class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
          <div
            class="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6"
          >
            <div class="text-4xl sm:text-5xl font-bold text-slate-800 text-center sm:text-left">
              {{ Math.round(temp) }}{{ unitSymbol }}
            </div>
            <div class="flex flex-col text-center sm:text-left text-sm text-slate-500">
              <span>Min: {{ Math.round(min) }}{{ unitSymbol }}</span>
              <span>Max: {{ Math.round(max) }}{{ unitSymbol }}</span>
            </div>
          </div>

          <div class="flex flex-col items-center sm:items-end justify-center">
            <img
              v-if="iconUrl"
              :src="iconUrl"
              alt="weather icon"
              class="w-16 h-16 sm:w-20 sm:h-20"
            />
            <div class="mt-2 capitalize text-slate-600 text-center sm:text-right">
              {{ desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { WeatherService } from '~/service/api';
import { type ICity, Units } from '~/service/api.interface';

interface IForecastModalProps {
  visible: boolean;
  city: ICity;
}

interface IForecastModalEmits {
  (event: 'update:visible', value: boolean): void;
}

const props = defineProps<IForecastModalProps>();
const emit = defineEmits<IForecastModalEmits>();

const unitValue = ref(Units.METRIC);
const options = [Units.METRIC, Units.IMPERIAL];

const forecastParams = computed(() => {
  if (props.city) {
    return {
      lat: props.city.coord.lat,
      lon: props.city.coord.lon,
      units: unref(unitValue),
    };
  }
  return { lat: 0, lon: 0, units: unref(unitValue) };
});

const getForecastRequest = useAsyncData(
  'forecast-data',
  () => WeatherService.getForecast(unref(forecastParams)),
  { watch: [unitValue] },
);

const isLoading = computed(() => getForecastRequest.pending.value);
const forecast = computed(() => getForecastRequest.data.value);

watch(
  () => props.visible,
  newValue => {
    if (newValue && props.city) {
      getForecastRequest.execute();
    } else {
      emit('update:visible', false);
    }
  },
);

const temp = computed(() => forecast.value?.current?.temp ?? 0);
const desc = computed(() => forecast.value?.current?.weather?.[0]?.description ?? '');
const min = computed(() => forecast.value?.daily?.[0]?.temp?.min ?? 0);
const max = computed(() => forecast.value?.daily?.[0]?.temp?.max ?? 0);
const iconUrl = computed(() => {
  const icon = forecast.value?.current?.weather?.[0]?.icon;
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : '';
});

const weekday = computed(() => {
  const ts = forecast.value?.current?.dt;
  return ts ? new Date(ts * 1000).toLocaleDateString(undefined, { weekday: 'long' }) : '';
});
const dateStr = computed(() => {
  const ts = forecast.value?.current?.dt;
  return ts ? new Date(ts * 1000).toLocaleDateString() : '';
});

function onClose() {
  navigateTo('/');
  emit('update:visible', false);
}

const unitSymbol = computed(() => (unitValue.value === Units.METRIC ? '°C' : '°F'));
function getUnitLabel(option: Units) {
  return option === Units.METRIC ? 'Celsius (°C)' : 'Fahrenheit (°F)';
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

import { computed } from "vue";

import useNiceNumbers from "composables/useNiceNumbers";

function mergeArrays(arrays) {
  const merged = [];

  arrays.forEach((array) => {
    array.forEach((value, index) => {
      if (!merged[index]) {
        merged[index] = 0;
      }

      merged[index] += value;
    });
  });

  return merged;
}

export default function useDataset(props) {
  const getMaxValue = (dataset, stacked) => {
    if (stacked) {
      const values = dataset.map((item) => item.values);
      const merged = mergeArrays(values);
      return Math.max(...merged);
    }

    return Math.max(...props.dataset.map((item) => Math.max(...item.values)));
  };

  const maxValue = computed(() => getMaxValue(props.dataset, props.stacked));
  const ticks = computed(() => useNiceNumbers(0, maxValue.value));
  const maxEffectiveValue = computed(() => ticks.value[ticks.value.length - 1]);

  return {
    maxValue,
    ticks,
    maxEffectiveValue,
  };
}

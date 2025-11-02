<template>
  <div class="flex items-center space-x-1">
    <div 
      v-for="(count, pointType) in points" 
      :key="pointType"
      class="flex items-center space-x-0.5"
    >
      <UBadge 
        :color="getPointColor(pointType)"
        variant="soft"
        :size="size"
        class="font-mono"
      >
        {{ pointType }}:{{ count }}
      </UBadge>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  points: Object,
  size: {
    type: String,
    default: 'xs'
  }
})

const getPointColor = (pointType) => {
  switch (pointType) {
    case '5pt': return 'red'
    case '3pt': return 'orange'
    case '2pt': return 'yellow'
    case '1pt': return 'blue'
    case '0pt': return 'gray'
    default: return 'gray'
  }
}
</script>
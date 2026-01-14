<script setup>
import { useBannerStore } from '@/stores/banner';
import Button from '@/components/button.vue';

const bannerStore = useBannerStore();

defineProps({
    text: {
        type: String,
        default: 'Erreiche jetzt mehr mit Projectify Pro!',
    }
});
</script>

<template>
    <div id="specialbanner" class="text-center py-3" v-if="bannerStore.isVisible">
        {{ text }}&nbsp;&nbsp;
        <Button variant="dark" @click="bannerStore.hideBanner">OK!</Button>
    </div>
</template>

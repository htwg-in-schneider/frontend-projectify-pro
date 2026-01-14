<script setup>
import { useBannerStore } from '@/stores/banner';
import { useRouter } from 'vue-router'; // Import des Routers

const bannerStore = useBannerStore();
const router = useRouter();

defineProps({
    text: {
        type: String,
        default: 'Erreiche jetzt mehr mit Projectify Pro!',
    }
});

function handleBannerClick() {

    bannerStore.hideBanner();
    
    router.push('/dashboard');
}
</script>

<template>
    <div id="specialbanner" class="text-center py-3" v-if="bannerStore.isVisible">
        <span 
            @click="handleBannerClick" 
            style="cursor: pointer; text-decoration: underline;" 
            title="Jetzt registrieren und Vorteile sichern">
            {{ text }}
        </span>
    </div>
</template>
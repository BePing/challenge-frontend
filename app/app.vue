<template>
  <div class="min-h-screen bg-background">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  title: 'Top 6 - Classements Tennis de Table',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Consultez les classements Top 6 du tennis de table belge. Rankings hebdomadaires pour toutes les régions et niveaux (National WB, Provincial 1-6)' },
    { name: 'keywords', content: 'tennis de table, classements, top 6, ping pong, belgique, rankings, tt' },
    
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Top 6 Tennis de Table' },
    { property: 'og:locale', content: 'fr_BE' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    
    // Mobile
    { name: 'theme-color', content: '#0F172A' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'Top 6' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://top6.beeping.com' },
    { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }
  ]
})

useSeoMeta({
  title: 'Top 6 - Classements Tennis de Table',
  description: 'Consultez les classements Top 6 du tennis de table belge. Rankings hebdomadaires pour toutes les régions et niveaux (National WB, Provincial 1-6)',
  ogTitle: 'Top 6 - Classements Tennis de Table',
  ogDescription: 'Consultez les classements Top 6 du tennis de table belge. Rankings hebdomadaires pour toutes les régions et niveaux (National WB, Provincial 1-6)',
  ogType: 'website',
  ogSiteName: 'Top 6 Tennis de Table',
  ogLocale: 'fr_BE',
  ogImage: 'https://top6.beeping.com/og-image.svg',
  ogUrl: 'https://top6.beeping.com',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Top 6 - Classements Tennis de Table',
  twitterDescription: 'Consultez les classements Top 6 du tennis de table belge. Rankings hebdomadaires pour toutes les régions et niveaux (National WB, Provincial 1-6)',
  twitterImage: 'https://top6.beeping.com/og-image.svg'
})
</script>

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
  title: 'Challenges communautaires - Beping',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Consultez les challenges communautaires et non officiels de tennis de table publiés par Beping.' },
    { name: 'keywords', content: 'tennis de table, challenges, classements communautaires, ping pong, belgique, Beping' },
    
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Challenges Beping' },
    { property: 'og:locale', content: 'fr_BE' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    
    // Mobile
    { name: 'theme-color', content: '#0F172A' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'Challenges Beping' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: 'https://challenges.beping.be' },
    { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }
  ]
})

useSeoMeta({
  title: 'Challenges communautaires - Beping',
  description: 'Consultez les challenges communautaires et non officiels de tennis de table publiés par Beping.',
  ogTitle: 'Challenges communautaires - Beping',
  ogDescription: 'Classements communautaires et non officiels de tennis de table.',
  ogType: 'website',
  ogSiteName: 'Challenges Beping',
  ogLocale: 'fr_BE',
  ogImage: 'https://challenges.beping.be/og-image.svg',
  ogUrl: 'https://challenges.beping.be',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Challenges communautaires - Beping',
  twitterDescription: 'Classements communautaires et non officiels de tennis de table.',
  twitterImage: 'https://challenges.beping.be/og-image.svg'
})
</script>

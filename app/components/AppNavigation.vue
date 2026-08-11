<template>
  <header class="border-b bg-card">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Logo and Title -->
        <div class="flex items-center gap-2 sm:gap-4">
          <Trophy class="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
          <div>
            <h1 class="text-lg sm:text-xl font-bold">{{ challenge?.shortName || challenge?.name || 'Challenges' }}</h1>
            <p class="hidden sm:block text-sm text-muted-foreground">
              {{ challenge?.unofficialLabel || 'Beping' }}
            </p>
          </div>
        </div>

        <!-- Main Navigation -->
        <nav class="hidden md:flex items-center gap-1">
          <NuxtLink 
            :to="challenge ? `/challenges/${challenge.slug}` : '/'"
            class="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md"
            active-class="text-primary font-semibold bg-muted"
          >
            Accueil
          </NuxtLink>
          <NuxtLink
            v-if="challenges.length > 1"
            to="/"
            class="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md"
          >
            Changer de challenge
          </NuxtLink>
          <Separator orientation="vertical" class="h-6 mx-1" />
          <NuxtLink 
            v-for="region in regions" 
            :key="region.code"
            :to="`/challenges/${challenge.slug}/region/${region.code.toLowerCase().replace(/_/g, '-')}`"
            class="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md"
            active-class="text-primary font-semibold bg-muted"
          >
            {{ region.name }}
          </NuxtLink>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center gap-3">
          <!-- Mobile Menu -->
          <Sheet>
            <SheetTrigger as-child>
              <Button variant="ghost" size="sm" class="md:hidden">
                <Menu class="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div class="mt-6 space-y-4">
                <NuxtLink 
                  :to="challenge ? `/challenges/${challenge.slug}` : '/'"
                  class="text-lg font-medium hover:text-primary transition-colors block px-3 py-2 rounded-md"
                  active-class="text-primary font-semibold bg-muted"
                >
                  Accueil
                </NuxtLink>
                <NuxtLink
                  v-if="challenges.length > 1"
                  to="/"
                  class="text-lg font-medium hover:text-primary transition-colors block px-3 py-2 rounded-md"
                >
                  Changer de challenge
                </NuxtLink>
                <Separator />
                <h3 class="text-lg font-medium text-muted-foreground mb-4">Régions</h3>
                <div class="space-y-3">
                  <NuxtLink 
                    v-for="region in regions" 
                    :key="region.code"
                    :to="`/challenges/${challenge.slug}/region/${region.code.toLowerCase().replace(/_/g, '-')}`"
                    class="text-lg font-medium hover:text-primary transition-colors block px-3 py-2 rounded-md"
                    active-class="text-primary font-semibold bg-muted"
                  >
                    {{ region.name }}
                  </NuxtLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Trophy, Menu } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'

const { challenge, challenges } = useChallengeContext()
const { regions } = useChampionship()
</script>

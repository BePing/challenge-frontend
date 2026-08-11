<script setup lang="ts">
const route = useRoute()
const { loadChallenges } = useChallengeContext()
const challenges = await loadChallenges()
if (challenges.length === 0) {
  throw createError({ statusCode: 404, statusMessage: 'Aucun challenge actif' })
}
const target = singleChallengePath(challenges)
await navigateTo(
  target ? `${target}/region/${String(route.params.id)}` : '/',
  { replace: true },
)
</script>

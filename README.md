# Challenge frontend

Site public générique des challenges communautaires Beping.

## Configuration

- `NUXT_PUBLIC_BEPING_API_BASE_URL`: URL publique de l'API Beping.

Toutes les données visibles (nom, description, régions, niveaux, classements et
calendrier de publication) viennent de PostgreSQL via l'API. Le site ne possède
aucune connexion directe au datastore.

## Développement

```bash
npm ci
npm run dev
```

Le conteneur écoute sur le port 3000 et cible `challenges.beping.be` dans
Coolify.

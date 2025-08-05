# Pitch Digest (prototype sans login ni paiement)

Un mini-site Next.js : URL YouTube en entrée → résumé en 5 puces avec timestamps (Markdown) en sortie.

## Déploiement en 15 minutes (sans coder)

### 1) Préparez un compte et une clé
- Créez un compte sur https://platform.openai.com/
- Allez dans **API keys** et créez une clé secrète. Copiez-la.

### 2) Déployez sur Vercel
- Créez un compte gratuit sur https://vercel.com/
- Dans Vercel, cliquez **New Project** → **Import** depuis votre repo Git (ou utilisez l’upload GitHub du ZIP).
- Une fois le projet importé, allez dans **Settings → Environment Variables** :
  - `OPENAI_API_KEY` = votre clé OpenAI
- Lancez **Deploy**.

### 3) Utilisation
- Ouvrez l’URL fournie par Vercel.
- Collez une URL YouTube (idéalement avec sous-titres).
- Cliquez **Résumer la vidéo**.

## Dév local (optionnel)
```bash
npm i
npm run dev
# http://localhost:3000
```
Créez un fichier `.env.local` (à la racine) avec :
```
OPENAI_API_KEY=sk-...
```

## Limitations
- Pas d’authentification ni de paiement (MVP ultra-simple).
- Dépend des sous-titres YouTube ; si absents, pas de résumé.
- La clé OpenAI est utilisée **côté serveur** (sécurisée par Vercel).

## Étapes suivantes (quand prêt)
- Ajouter un compteur de 3 essais gratuits + packs payants (Stripe).
- Compte utilisateur (Clerk) pour conserver l’historique.
- Mise en file (Upstash Redis) si les vidéos sont longues.

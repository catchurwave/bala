# Guide d'administration / Admin Guide

## Accéder au back office

Aller sur : **`/admin`** (ex: `http://localhost:3000/admin`)

Mot de passe défini dans `.env.local` → `ADMIN_PASSWORD`

---



## Ajouter un tableau / Add a painting

Créer un fichier `.mdx` dans `content/oeuvres/` :

```
content/oeuvres/nom-du-tableau.mdx
```

Template :

```mdx
---
titre: "Titre en français"
titre_en: "Title in English"
annee: 2024
technique: "Huile sur toile"
dimensions: "60 × 80 cm"
categorie: "paysage"        # paysage | nature | portrait | marine | autre
image: "/images/oeuvres/nom-du-tableau.jpg"
prix: 1200                  # Supprimer cette ligne si pas en vente
disponible: true            # true = disponible, false = vendue
featured: true              # true = affiché sur la page d'accueil
description: "Description courte en français."
description_en: "Short description in English."
---
```

Puis placer la photo dans : `public/images/oeuvres/nom-du-tableau.jpg`

---

## Modifier le nom de l'artiste

Chercher `Jean Dupont` dans :
- `app/[lang]/page.tsx` (hero + section about)
- `app/[lang]/artiste/page.tsx` (biographie)
- `components/Footer.tsx` (optionnel)

---

## Modifier la biographie

Éditer directement le texte dans `app/[lang]/artiste/page.tsx` — objet `bio.fr` et `bio.en`.

---

## Modifier la citation du héros

Dans `dictionaries/fr.json` et `dictionaries/en.json` : champ `home.quote`.

---

## Activer les paiements Stripe

1. Créer un compte sur https://stripe.com
2. Récupérer les clés API (Dashboard → Developers → API keys)
3. Modifier `.env.local` :
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
   ```

---

## Activer le formulaire de contact par email

Voir les instructions dans `app/api/contact/route.ts`.

---

## Déployer sur Vercel

```bash
npx vercel
```

Ajouter les variables d'environnement dans le dashboard Vercel.

# Atmos

*Un site météo éditorial et atmosphérique.*

## À propos

Atmos est un site météo qui met la photographie et la typographie au premier plan plutôt qu'un dashboard technique classique : une photo full-bleed de la ville sélectionnée, un overlay qui change de teinte selon l'heure locale réelle et la météo du moment, et la température affichée en grand, directement sur l'image. C'est un projet de portfolio réalisé dans le cadre d'une candidature en alternance.

## Aperçu

![Aperçu du hero Atmos — Paris, Tour Eiffel au crépuscule](docs/preview.jpg)

## Stack technique

- **Frontend** — React 19, Vite, Tailwind CSS v4
- **Backend** — Node.js, Express (proxy léger entre le frontend et les APIs externes)
- **Météo** — [Open-Meteo](https://open-meteo.com) — choisi pour ne dépendre d'aucune clé API ni carte bancaire, gratuit jusqu'à 10 000 appels/jour en usage non commercial
- **Animation** — GSAP (transitions du fond dynamique), Lenis (smooth scroll)
- **Data fetching** — React Query

## Fonctionnalités

- **Signature element** : fond photographique dynamique dont le dégradé et la teinte changent selon l'heure locale réelle de la ville (aube / jour / crépuscule / nuit) et la condition météo du moment
- **19 villes curées** avec photographie propre (pas de dépendance à une API d'images tierce)
- **Prévisions sur 7 jours** en cartes flottantes numérotées
- **Données détaillées** : UV, vent, humidité, pression
- **Actualités** liées à la météo (données mockées pour l'instant)

## Installation locale

**Backend** (terminal 1) :

```bash
cd server
npm install
npm run dev
```

Écoute par défaut sur `http://localhost:3001`. Aucune variable d'environnement n'est obligatoire (voir `server/.env.example`).

**Frontend** (terminal 2, depuis la racine) :

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173` — le serveur de dev Vite redirige automatiquement `/api/*` vers le backend.

## Démarche

Le développement (architecture, système de design, revue visuelle) s'est appuyé sur Claude Code comme partenaire de conception et de QA. Le détail des décisions et itérations est conservé dans `CLAUDE.md`, pour qui veut approfondir.

## Données météo

Données fournies par [Open-Meteo.com](https://open-meteo.com), sous licence [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## Licence

MIT — voir le fichier [LICENSE](./LICENSE).

## Crédits photo

- Paris — photo par Chris Karidis, via [Unsplash](https://unsplash.com)
- Lyon — photo par Adrien Olichon, via [Unsplash](https://unsplash.com)

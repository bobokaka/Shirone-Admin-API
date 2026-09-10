---
title: Données structurées
description: Éditer visuellement les huit familles de données structurées du blog — projets, compétences, timeline, appareils, animes, boussole, playlist, liens amis — avec import d'animes par recherche, import de musique et brouillons de timeline par IA.
---

# Données structurées

Les projets, compétences et liste d'appareils de la page « À propos », la liste d'animes suivis, les liens amis et la playlist de fond de la barre latérale — tout cela relève des **données structurées** : chaque famille est un tableau TypeScript dans `data/*.ts` du dépôt de contenu. La page « Données » les transforme toutes en édition visuelle tableaux + formulaires, chaque modification étant **écrite immédiatement dans le dépôt**.

![Données](/assets/guide/data.png)

## Les huit familles de données

| Onglet | Entrées | Champs typiques |
|------|------|----------|
| Projets | projets | nom, résumé, catégorie, phase (publié / en développement / exploration), pile technique, coup de cœur |
| Compétences | compétences | nom, catégorie (frontend / backend / outils / développement de jeux), niveau (débutant → expert), icône |
| Timeline | événements | titre, date, catégorie (jalon / projet / expérience / vie), points clés, liens associés |
| Appareils | appareils | nom, marque, catégorie, statut (en service / de réserve / retiré / convoité), caractéristiques |
| Animes | animes | titre, statut (en cours / terminé / prévu / en pause / abandonné), note, progression, genres, pochette |
| Boussole | bibliothèque | nom, icône, entrées de navigation (nom + lien + note) |
| Playlist | morceaux | titre, artiste, pochette, adresse audio, durée |
| Liens amis | liens amis | nom du site, avatar, description, adresse, tags |

## Opérations communes

- **Ajouter** — ouvre la fenêtre modale d'édition champ par champ ; un champ obligatoire manquant bloque avec un message
- **Bascules directes dans le tableau** — les champs booléens « coup de cœur », « activé », etc. sont des interrupteurs dans le tableau, actionnés = enregistrés
- **Trier** — les boutons ↑↓ à droite de chaque ligne ajustent l'ordre (l'ordre du tableau est l'ordre d'affichage public), écrit immédiatement
- **Éditer / Supprimer** — l'édition rouvre la fenêtre modale avec tous les champs ; la suppression exige une double confirmation

Quelques détails qui économisent des efforts :

- **Identifiants générés automatiquement** — les colonnes d'identification (clé de projet, id d'appareil, id de morceau…) ne se remplissent pas à la main : à la création, le titre est converti en slug pinyin (numéroté en cas de doublon), et l'id de lien ami prend la valeur maximale +1
- **Champs d'icône** — saisissez un nom d'icône Iconify (ex. `simple-icons:typescript`) pour un aperçu immédiat ; les icônes sont toutes intégrées localement, sans requête réseau
- **Champs d'image** — les pochettes acceptent un téléversement local (déposé automatiquement dans le répertoire de ressources correspondant au type de données) ou un chemin collé ; animes et playlist disposent d'un import dédié en un clic, voir ci-dessous
- **Listes d'entrées boussole et timeline** — les tableaux imbriqués « entrées de navigation », « liens associés » s'éditent en cartes visuelles : nom / icône / adresse de chaque sous-entrée sur une rangée, avec validation des champs obligatoires

Toutes les modifications reviennent dans `data/*.ts` via une **file d'enregistrement séquentielle** — les définitions interface, commentaires et instructions d'export du fichier sont conservés au caractère près, seule la partie littérale du tableau est remplacée : le code maintenu à la main n'est jamais touché.

## Animes : import par recherche

Le bouton « **Importer par recherche** », propre à l'onglet Animes, s'appuie sur l'API publique de [Bangumi](https://bgm.tv/) :

![Import d'animes par recherche](/assets/guide/data-anime.png)

1. **Rechercher** — saisissez un titre chinois / japonais / anglais, la liste de candidates revient (avec année, nombre d'épisodes, note, pochette)
2. **Choisir une entrée** — le détail est récupéré automatiquement : studio de production, créneau de diffusion, tags de genres les plus fréquents
3. **Confirmer** — génère un brouillon d'anime avec titre / année / genres / résumé / pochette / studio déjà remplis ; **statut et note restent à votre main** ; la pochette est téléchargée depuis l'hébergeur officiel de Bangumi vers `public/assets/anime/`

Votre liste d'animes n'a plus besoin de saisie manuelle de métadonnées — terminez une série, recherchez-la, recommencez.

## Playlist : importer de la musique

Le bouton « **Importer de la musique** » de l'onglet Playlist propose trois voies d'entrée :

- **Recherche IA** — décrivez le morceau cherché (titre / style), l'IA cherche en ligne et fournit les **informations de licence** (usage commercial gratuit ou non, lien justificatif) ; après confirmation, audio et pochette sont déposés automatiquement
- **Import par lien direct** — collez un lien direct audio, le serveur télécharge à votre place (même ce qu'un navigateur bloqué par CORS ne peut obtenir)
- **Téléversement local** — envoyez directement le fichier audio

Après l'import, cliquez **▶ écoute** dans le tableau : la barre de lecture en bas joue à la demande, et vous n'enregistrez qu'une fois convaincu.

## Timeline : brouillons par IA

Le bouton « **Brouillons par IA** » de l'onglet Timeline (visible si l'IA est active) génère par lots des brouillons d'événements en deux modes :

- **Mode git** — scanne l'historique de commits des trois dépôts (jusqu'à 30 par dépôt, avec statistiques de fichiers ajoutés/supprimés), l'IA les condense en événements de timeline : parfait pour un bilan « qu'ai-je fait ce mois-ci »
- **Mode description** — vous écrivez une phrase, l'IA la transforme en événement bien formé (titre / date / catégorie / points clés / tags)

La liste de brouillons générés se coche **entrée par entrée**, avec déduplication automatique des événements déjà collectés (comparaison titre + date). À la confirmation, chaque insertion trouve sa place par date dans la liste puis écrit dans le dépôt ; le format de date est converti automatiquement dans le style à points du site (`2025.06.01`).

## IA au niveau des champs

Les champs de texte long type résumé ou description (résumé de projet, description de compétence, description d'anime, description de lien ami, description de timeline, description d'appareil) disposent d'un **bouton ✨** en haut à droite de la fenêtre modale : une fois le titre de l'entrée renseigné, un clic fait générer ou réécrire le champ par l'IA en 1 à 3 phrases ; le résultat pousse en flux directement dans la zone de saisie, arrêtable et retouchable à la main.

## Prochaines étapes

- Après la vitrine du site, voir les [Paramètres du site](./settings.md)
- Données complétées, passer par [Commit et publication](./publish.md)

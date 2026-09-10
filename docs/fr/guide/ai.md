---
title: Assistant IA
description: Configurer et utiliser les capacités IA de Shirone-Admin — bascule entre plusieurs fournisseurs, double protocole, console globale en flux, et le recensement des entrées IA disséminées dans les pages.
---

# Assistant IA

Les capacités IA de Shirone-Admin sont une **amélioration facultative** : sans configuration, tout fonctionne comme avant ; une fois configurées, la rédaction, l'import et la publication gagnent une série d'assistances intelligentes. Ce chapitre couvre d'abord la configuration, puis l'usage.

## Configurer les fournisseurs

Cliquez sur l'**engrenage** de la barre supérieure pour ouvrir la fenêtre « Réglages », puis choisissez « Assistant IA » dans le menu de gauche.

![Configuration des fournisseurs IA](/assets/guide/app-settings.png)

### Concepts clés

- **Fournisseurs multiples** — plusieurs jeux de connexion enregistrables (20 au maximum), avec bascule à tout moment du jeu actif. Convient à qui détient à la fois l'API officielle et un relais proxy, ou alterne entre modèles selon les besoins
- **Double protocole** — un choix binaire par configuration :
  - `anthropic` — protocole compatible Anthropic (`v1/messages`), pour l'API officielle et les relais « compatibles Anthropic »
  - `openai` — protocole compatible OpenAI (`chat/completions`), pour OpenAI et la grande majorité des API de modèles
- **Interrupteur général** — « Activer » désactivé : toutes les entrées IA disparaissent et l'API refuse systématiquement

### Champs de chaque configuration

| Champ | Description |
|------|------|
| Nom | nom affiché, ex. `Anthropic officiel` / `relais GLM` |
| Protocole | anthropic / openai |
| Adresse API | la racine suffit (`https://api.anthropic.com` ou `https://api.openai.com/v1`) ; tolère la racine nue, avec `/v1`, un sous-chemin de proxy, etc. |
| API Key | conservée uniquement dans `server/data/ai-settings.json` sur votre machine, **jamais écrite dans le dépôt de contenu**, sans risque de fuite à la publication |
| Modèle principal | pour les tâches courantes, ex. `claude-sonnet-5` / `gpt-4o-mini` / `glm-5.3` |
| Modèle léger | pour résumés, suggestions de tags et autres tâches simples ; **vide = identique au modèle principal** (une configuration en moins) |
| Recherche web | ajoute l'outil de recherche web aux services qui le supportent ; repli automatique en requête ordinaire si le service ne le supporte pas |
| Température | température d'échantillonnage 0–2, 0.7 par défaut |
| Délai d'expiration | en secondes par requête, 5–86400, 30 par défaut |

### Déroulé

1. Cliquez sur + **nouveau fournisseur** (nom par défaut « configuration par défaut N », saisir directement renomme)
2. Renseignez les champs, ou utilisez l'**import par collage** : collez en bloc le bloc env du `settings.json` de Claude Code, des `export` shell ou un contenu dotenv — les 10 clés `ANTHROPIC_*` / `OPENAI_*` et apparentées sont reconnues et réparties dans le formulaire
3. **Tester la connexion** — testable sans enregistrer, renvoie latence et réponse du modèle ; enregistrez ensuite

> [!WARNING]
> `server/data/ai-settings.json` contient l'API Key en clair. Le fichier est gitignore, mais évitez de le copier vers un emplacement soumis à commit ou à partage.

## Console IA

Le volet global ouvert par le **bouton ✨** de la barre supérieure est le lieu d'exécution de toutes les tâches IA :

![Console IA](/assets/guide/ai-console.png)

Deux formes :

- **Forme tâche** — les actions IA déclenchées depuis les pages (amélioration, poursuite, brouillon…) s'exécutent ici : entrée d'instruction marquée « tâche », **processus de réflexion** du modèle (repliable), corps affiché en flux, durée et modèle employé annotés
- **Forme conversation** — la tâche terminée, poursuivez dans la zone de saisie (reprise avec le contexte), ou posez des questions en simple discussion ; Enter envoie, Shift+Enter insère un saut de ligne

Capacités communes : **arrêt à tout moment** (après arrêt, le contenu produit est conservé ou restauré selon le contexte), clic sur la barre de titre pour **replier** sans encombrer l'écran, **nouvelle conversation** pour repartir de zéro. L'historique d'une conversation dépassant 60 000 caractères évite automatiquement les messages les plus anciens ; le flux de réflexion conserve les derniers 8000 caractères.

## Entrées IA de chaque page

Une fois activé, ces emplacements proposent des fonctions IA (classés par page) :

| Page | Entrée | Capacité |
|------|------|------|
| [Éditeur d'articles](./post-editor.md#redaction-assistee-par-ia) | menu déroulant IA de la barre d'outils | compléter / optimiser le formatage / améliorer (sélection prioritaire) / poursuivre / générer le résumé / instructions personnalisées, réécriture intégrale avec prévisualisation diff |
| [Moments](./moments.md#assistance-ia-facultatif) | boutons du composeur | amélioration du corps (renvoi en flux), suggestions de tags et d'humeur |
| [Données](./data.md#ia-au-niveau-des-champs) | ✨ dans la fenêtre modale | génération et réécriture des champs description (projets, compétences, animes, etc.) |
| [Données · Timeline](./data.md#timeline-brouillons-par-ia) | bouton brouillons par IA | condensation de l'historique git / brouillons depuis une description, insertion après sélection |
| [Données · Playlist](./data.md#playlist-importer-de-la-musique) | importer de la musique | recherche de morceaux en ligne avec informations de licence |
| [Paramètres du site](./settings.md#informations-de-base) | ✨ sur les champs | génération en une phrase du sous-titre et de la signature |
| [Paramètres du site · bannière](./settings.md#fonds-d-ecran-de-banniere) | IA - Générer | génération du jeu complet de phrases du carrousel machine à écrire |
| [Import depuis plateformes](./import.md#coller-un-article-unique) | déclenchement automatique | complétion titre / résumé / catégorie / tags de l'article collé |
| [Commit et publication](./publish.md#messages-de-commit) | bouton IA - Générer | génération des messages de commit des deux dépôts (repli automatique si non conforme) |

En outre, le menu IA de la barre d'outils de l'éditeur affiche une animation de chargement et interdit les déclenchements répétés pendant la génération ; toutes les tâches en flux partagent une seule console, une seule à la fois.

## Philosophie de conception

- **L'IA ne bloque jamais le fil principal** — échec de génération du message de commit : repli heuristique ; échec des métadonnées d'import : repli sur le résumé du corps ; arrêt de l'amélioration : restauration du texte d'origine
- **Prévisualiser avant d'appliquer** — les réécritures intégrales passent toutes par une confirmation diff, sans jamais écraser directement votre texte
- **Tâches légères, modèle léger** — suggestions de tags, résumés et autres petites tâches passent par `modelFast` réflexion coupée, pour économiser temps et argent

## Prochaines étapes

- Retourner dans l'[Éditeur d'articles](./post-editor.md) essayer une amélioration IA
- Voir la génération IA des messages de commit dans [Commit et publication](./publish.md)

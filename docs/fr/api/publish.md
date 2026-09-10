---
title: Publication et validation
description: Référence des interfaces /api/publish/* (aperçu de publication, sonde distante, publication en un clic) et /api/validate (validation dry-run).
---

# Publication et validation

Le module de publication encapsule les opérations git des deux dépôts (contenu + thème). Les deux dépôts sont **sans blocage croisé** et renvoient chacun un `RepoPublishResult` indépendant.

## GET /api/publish/preview

Données du premier écran de la page de publication : détail des changements des deux dépôts, messages de commit générés automatiquement, commits récents et état. Sans paramètre.

**Valeur de retour** `PublishPreview`, champs clés :

| Champ | Description |
|------|------|
| `branch` / `ahead` / `behind` | branche du dépôt de contenu et avance / retard (valeurs du cache local) |
| `changes` / `files` | détail des changements du dépôt de contenu `{ path, state: "new" \| "modified" }[]` et liste de fichiers |
| `message` | message de commit automatique du dépôt de contenu |
| `themeChanges` / `themeFiles` / `themeMessage` / `themeStatus` / `themeRecent` | informations correspondantes du dépôt du thème (`themeStatus` à `null` si non connecté) |
| `themeDepsInstalled` | dépendances du thème installées ou non (conditionne la validation locale) |
| `recent` | 20 derniers commits du dépôt de contenu `{ hash, date, subject }` |

```bash
curl http://127.0.0.1:5175/api/publish/preview
```

## POST /api/publish/probe

Comparaison distante légère : `git ls-remote` compare le tip de branche, **sans récupérer aucun code / objet**.

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `repo` | `"content" \| "theme"` | oui | dépôt à sonder |

**Valeur de retour** `RemoteProbe` : `{ behind: number | null }` — `0` synchronisé avec le distant ; `>0` nombre exact de commits de retard ; `null` le distant a avancé mais le nombre est inconnu (à déterminer après récupération).

```bash
curl -X POST http://127.0.0.1:5175/api/publish/probe \
  -H "Content-Type: application/json" -d '{"repo":"content"}'
```

## POST /api/publish

Publication en un clic. Flux : dépôt de contenu (**validation → add -A → commit → pull --rebase --autostash → push**, un échec de validation bloque ce dépôt) + dépôt du thème (commit → push, sans validation locale).

| Champ du corps | Type | Requis | Description |
|-----------|------|------|------|
| `contentMessage` | `string` | non | message de commit du dépôt de contenu ; **vide = génération automatique** (doit respecter `type(scope): ≤30 caractères`) |
| `themeMessage` | `string` | non | message de commit du dépôt du thème ; idem |

**Valeur de retour** `PublishResult` :

```json
{
  "ok": true,
  "content": { "ok": true, "hadChanges": true, "commitHash": "a1b2c3d", "pushed": true, "log": ["..."] },
  "theme":  { "ok": true, "hadChanges": false, "pushed": false, "log": ["无变更，跳过"] }
}
```

`RepoPublishResult` d'un dépôt : `ok` (succès global du dépôt), `hadChanges`, `commitHash?`, `pushed`, `validationOutput?` (journal complet en cas d'échec de validation du dépôt de contenu), `log[]` (trace d'exécution étape par étape). Le `ok` de premier niveau vaut `content.ok && theme.ok`.

```bash
curl -X POST http://127.0.0.1:5175/api/publish \
  -H "Content-Type: application/json" -d '{}'
```

> [!WARNING]
> C'est l'interface qui produit réellement commits et push git. Avant l'appel, un passage par `preview` est recommandé pour confirmer le périmètre des changements ; en cas d'échec de validation du dépôt de contenu, aucun commit n'est produit.

## POST /api/validate

Exécute isolément la validation préalable à la publication : lance `scripts/content/sync.mjs --dry-run` dans le dépôt du thème (environnement avec `CONTENT_DIR`, délai 180 secondes, sortie tronquée à 4000 caractères). **Précontrôle purement en mémoire : aucune écriture sur disque, aucune modification produite**.

**Valeur de retour** `{ ok: boolean, output: string }` — `output` est la sortie du validateur (localisation des problèmes de format YAML, de coquilles de champs, de schéma frontmatter).

```bash
curl -X POST http://127.0.0.1:5175/api/validate
```

# Dark mode natif dans theme.json (FSE/Gutenberg)

Méthode 1 — `light-dark()` + `color-scheme` : dark mode automatique basé sur la préférence OS, sans JavaScript, sans toggle manuel.

---

## 1. Principe

Deux mécanismes CSS natifs travaillent ensemble :

| Mécanisme | Rôle |
|-----------|------|
| `color-scheme: light dark` | Indique au navigateur que la page supporte les deux modes. Active les styles système (scrollbars, inputs, fond par défaut). |
| `light-dark(valeur-light, valeur-dark)` | Fonction CSS qui retourne la première valeur si le mode actif est `light`, la seconde si `dark`. |

Le navigateur choisit automatiquement selon `prefers-color-scheme` (préférence OS de l'utilisateur). Aucun JavaScript n'est nécessaire.

**Condition :** `color-scheme` doit être déclaré sur l'élément (ou un ancêtre) avant que `light-dark()` puisse fonctionner.

---

## 2. Implémentation complète dans theme.json

```json
{
  "version": 3,

  "styles": {
    "css": ":root { color-scheme: light dark; }"
  },

  "settings": {
    "color": {
      "custom": false,
      "customDuotone": false,
      "customGradient": false,

      "palette": [
        {
          "slug": "background",
          "color": "light-dark(#ffffff, #111111)",
          "name": "Fond"
        },
        {
          "slug": "text",
          "color": "light-dark(#111111, #ffffff)",
          "name": "Texte"
        },
        {
          "slug": "primary",
          "color": "light-dark(#0056b3, #4da3ff)",
          "name": "Primaire"
        },
        {
          "slug": "surface",
          "color": "light-dark(#f5f5f5, #1e1e1e)",
          "name": "Surface"
        },
        {
          "slug": "border",
          "color": "light-dark(#dddddd, #333333)",
          "name": "Bordure"
        }
      ]
    }
  }
}
```

### Pourquoi `styles.css` et pas `styles.color.background` ?

`styles.color.background` n'accepte pas `light-dark()` — WordPress sérialise cette valeur dans des attributs HTML qui ne supportent pas la fonction CSS. L'injection via `styles.css` cible `:root` directement dans la feuille de style globale, là où `light-dark()` est évalué par le moteur CSS.

---

## 3. Interdire les couleurs custom dans le Site Editor

Les trois clés `false` verrouillent la palette :

| Clé | Effet |
|-----|-------|
| `"custom": false` | Désactive le color picker libre — l'éditeur ne peut choisir qu'une couleur de la palette définie |
| `"customDuotone": false` | Désactive la création de filtres duotone personnalisés |
| `"customGradient": false` | Désactive la création de dégradés personnalisés |

Sans ces verrous, un éditeur peut choisir `#ff0000` directement, ce qui casse la cohérence du dark mode (la valeur codée en dur ne s'adapte pas).

---

## 4. Ce que WordPress génère automatiquement

Pour chaque entrée de `settings.color.palette`, WordPress génère une variable CSS :

```css
:root {
  --wp--preset--color--background: light-dark(#ffffff, #111111);
  --wp--preset--color--text:       light-dark(#111111, #ffffff);
  --wp--preset--color--primary:    light-dark(#0056b3, #4da3ff);
  --wp--preset--color--surface:    light-dark(#f5f5f5, #1e1e1e);
  --wp--preset--color--border:     light-dark(#dddddd, #333333);
}
```

Ces variables sont disponibles globalement — dans tous les blocs, tous les styles inline générés par Gutenberg, et dans les SCSS du plugin.

WordPress génère aussi des classes utilitaires :

```css
.has-background-color         { color: var(--wp--preset--color--background); }
.has-background-background-color { background-color: var(--wp--preset--color--background); }
/* ... pour chaque slug */
```

---

## 5. Utilisation dans les blocs du plugin

Les blocs héritent du dark mode **sans code supplémentaire** si leurs styles référencent les variables preset.

### Dans un bloc via les supports (automatique)

```json
{
  "supports": {
    "color": {
      "text": true,
      "background": true
    }
  }
}
```

Quand un éditeur choisit "Fond" dans la palette, Gutenberg écrit `has-background-background-color` sur le bloc — la variable CSS fait le reste.

### Dans style.scss (manuel)

```scss
.wp-block-dcx-benchmark-luxe-stat-card {
  background-color: var(--wp--preset--color--surface);
  color:            var(--wp--preset--color--text);
  border:           1px solid var(--wp--preset--color--border);
}
```

Aucune media query `prefers-color-scheme` nécessaire — la variable se résout déjà avec la bonne valeur selon le mode actif.

### Ce qu'il ne faut pas faire

```scss
// Mauvais — valeur codée en dur, ne s'adapte pas
background-color: #f5f5f5;

// Mauvais — duplication de logique déjà dans les variables
@media (prefers-color-scheme: dark) {
  background-color: #1e1e1e;
}
```

---

## 6. Limites

Ce que cette méthode **ne peut pas faire** :

| Limitation | Raison |
|------------|--------|
| Toggle manuel (bouton soleil/lune) | `light-dark()` est piloté par `color-scheme`, pas par une classe CSS — impossible à surcharger via JS sans réécrire toutes les valeurs |
| Persistance du choix utilisateur | Pas de localStorage, pas d'état — le mode suit toujours la préférence OS |
| Aperçu dans l'éditeur Gutenberg | L'éditeur s'exécute dans son propre contexte, il peut ne pas refléter le mode OS de la page front |
| Couleurs intermédiaires calculées | `light-dark()` ne fait pas d'interpolation — les deux valeurs sont discrètes |
| Support IE / anciens navigateurs | `light-dark()` requiert Chrome 123+, Firefox 120+, Safari 17.5+ |

Pour un toggle manuel, il faut la **méthode 2** (variables CSS redéfinies via une classe `.dark` sur `<html>`), qui est plus complexe mais plus flexible.

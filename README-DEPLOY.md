# Glow by Rim — Guide de Déploiement GitHub Pages & Configuration Backend

Ce projet est conçu pour être déployé en haute disponibilité sur **GitHub Pages** (ou tout hébergeur statique comme Vercel, Netlify, Cloudflare Pages) tout en bénéficiant de la base de données temps réel et de l'authentification sécurisée **Google Firebase Firestore**.

---

## 1. Déploiement sur GitHub Pages

### A. Configuration automatique via GitHub Actions
Le fichier `.github/workflows/deploy.yml` est déjà configuré dans le dépôt.

1. Poussez votre code sur GitHub :
   ```bash
   git add .
   git commit -m "feat: site Glow by Rim avec espace admin"
   git push origin main
   ```
2. Dans votre dépôt GitHub :
   - Allez dans **Settings** > **Pages**.
   - Sous **Build and deployment** > **Source**, sélectionnez **GitHub Actions**.
3. Le workflow se lance automatiquement à chaque mise à jour sur la branche `main` et publie le site.

### B. Configuration de l'URL de base dans `vite.config.ts`
Si votre site est hébergé sur un sous-chemin (ex: `https://<votre-utilisateur>.github.io/<nom-du-repo>/`), spécifiez la propriété `base` dans `vite.config.ts` :
```ts
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/glow-by-rim/' : '/',
  // ...
});
```
Si vous utilisez un nom de domaine personnalisé (ex: `glowbyrim.ma`), laissez `base: '/'`.

### C. Nom de domaine personnalisé (ex: `glowbyrim.ma`)
1. Placez un fichier nommé `CNAME` dans le dossier `public/` contenant votre domaine :
   ```
   glowbyrim.ma
   ```
2. Chez votre registrar DNS (Genious, OVH, GoDaddy, etc.) :
   - Ajoutez des enregistrements **A** pointant vers les adresses IP de GitHub Pages :
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Ajoutez un enregistrement **CNAME** pour `www` pointant vers `<votre-compte>.github.io`.

---

## 2. Configuration Backend Firebase

### A. Fichier de configuration client
Le fichier `firebase-applet-config.json` contient les identifiants de connexion :
- **Project ID** : `gen-lang-client-0813330945`
- **Database ID** : `ai-studio-glowbyrimsalonde-a550d8f9-6df2-436e-951b-a465f1eeb616`
- **Auth Provider** : Google Sign-In

### B. Déploiement des Règles de Sécurité Firestore
Le fichier `firestore.rules` protège toutes les écritures :
- **Lecture publique** : Services, Tarifs, Catégories, Galerie, Avis, Horaires.
- **Création publique** : Formulaire de demande de réservation (statut 'pending' obligatoire).
- **Accès restreint Propriétaire / Admin** : Lecture et modification des réservations, mise à jour des prix, photos, paramètres.

Pour déployer les règles avec la CLI Firebase :
```bash
npm install -g firebase-tools
firebase login
firebase use gen-lang-client-0813330945
firebase deploy --only firestore:rules
```

### C. Autorisation de l'Administrateur
Par défaut, l'adresse email de la session propriétaire (`inviora.digital@gmail.com`) dispose des droits complets. Vous pouvez inviter ou autoriser une autre adresse email directement depuis l'onglet **Infos & Horaires** du tableau de bord.

# Guide de test du système de notification par email

## Étape 1 : Créer un utilisateur de test

Exécutez cette requête SQL dans Supabase :

```sql
-- Créer un utilisateur de test
INSERT INTO users (id, username, email)
VALUES (
  gen_random_uuid(),
  'test_user',
  'votre-email@example.com'  -- Remplacez par votre vrai email
)
RETURNING id;
```

Notez l'ID retourné, vous en aurez besoin.

## Étape 2 : Activer les notifications email

```sql
-- Activer les notifications email pour cet utilisateur
INSERT INTO email_preferences (user_id, email_enabled)
VALUES (
  'VOTRE_USER_ID',  -- Remplacez par l'ID de l'étape 1
  true
);
```

## Étape 3 : Créer un follow d'artiste

```sql
-- Vérifier les artistes disponibles
SELECT id, name FROM artists LIMIT 5;

-- Suivre un artiste (par exemple NAN)
INSERT INTO user_follows (user_id, artist_id)
VALUES (
  'VOTRE_USER_ID',  -- Remplacez par votre ID utilisateur
  (SELECT id FROM artists WHERE name = 'NAN' LIMIT 1)
);
```

## Étape 4 : Simuler la sortie d'une nouvelle chanson

```sql
-- Ajouter une nouvelle chanson pour l'artiste suivi
INSERT INTO songs (title, artist_id, audio_url, cover_url, release_date)
VALUES (
  'Test Song',
  (SELECT id FROM artists WHERE name = 'NAN' LIMIT 1),
  'https://example.com/test.mp3',
  'https://example.com/cover.jpg',
  now()
);
```

Cette insertion va automatiquement :
1. Créer une notification dans la table `notifications`
2. Créer une entrée dans `email_queue` (si email activé)

## Étape 5 : Vérifier que l'email est en file d'attente

```sql
-- Vérifier les emails en attente
SELECT * FROM email_queue WHERE sent = false;
```

Vous devriez voir votre email avec le sujet et le contenu.

## Étape 6 : Déclencher l'envoi des emails

### Option A : Via l'interface (si vous avez un utilisateur connecté)

Dans votre application, exécutez dans la console du navigateur :

```javascript
import { triggerEmailSending } from './src/supabase.js';
const result = await triggerEmailSending();
console.log(result);
```

### Option B : Via curl

```bash
curl -X POST \
  'https://gvomaytabedjluqlxgmk.supabase.co/functions/v1/send-notification-email' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2b21heXRhYmVkamx1cWx4Z21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MDUyOTYsImV4cCI6MjA3ODk4MTI5Nn0.IIY-r3C6SXJJMRufZbpKW76YshJb3KGEEhhMwqz3ClM' \
  -H 'Content-Type: application/json'
```

## Étape 7 : Vérifier que l'email a été marqué comme envoyé

```sql
SELECT * FROM email_queue WHERE sent = true ORDER BY sent_at DESC LIMIT 5;
```

## Note importante

Pour le moment, l'Edge Function **simule** l'envoi d'email (elle log juste le contenu).

Pour envoyer des vrais emails, vous devez :

1. Créer un compte sur [Resend](https://resend.com) (gratuit pour 3000 emails/mois)
2. Obtenir une clé API
3. Configurer le secret dans Supabase :
   ```bash
   supabase secrets set RESEND_API_KEY=votre_cle_api
   ```
4. Décommenter le code d'envoi dans l'Edge Function

## Tester depuis l'interface web

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur l'icône de notification (cloche) en haut à droite
3. Activez le toggle "Notifications par email"
4. Suivez un artiste en cliquant sur sa carte
5. Ajoutez manuellement une chanson dans la base de données (étape 4)
6. Vérifiez vos notifications dans l'app
7. Déclenchez l'envoi d'email (étape 6)

## Dépannage

Si rien ne se passe :

1. Vérifiez que RLS est bien configuré :
   ```sql
   SELECT tablename, policyname FROM pg_policies
   WHERE tablename IN ('email_preferences', 'email_queue', 'notifications');
   ```

2. Vérifiez les logs de l'Edge Function dans Supabase Dashboard > Edge Functions > send-notification-email > Logs

3. Vérifiez que l'utilisateur a bien activé les emails :
   ```sql
   SELECT * FROM email_preferences WHERE email_enabled = true;
   ```

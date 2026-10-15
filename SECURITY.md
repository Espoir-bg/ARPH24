# 🔐 Politique de sécurité — ARPH24

## Notre engagement

La sécurité, la confidentialité et l'intégrité des opérations constituent des exigences fondamentales d'ARPH24.

Cette politique s'applique au code, aux services, aux intégrations et aux processus de développement du projet.

## Signaler une vulnérabilité

Ne publiez pas de détails exploitables concernant une vulnérabilité dans une issue publique.

Utilisez le mécanisme de signalement privé de vulnérabilités GitHub lorsqu'il est activé pour ce dépôt.

Si ce mécanisme n'est pas disponible, contactez les responsables du projet par un canal privé approprié avant toute divulgation publique.

Un signalement devrait préciser :

- Le composant concerné.
- Les conditions nécessaires à la reproduction.
- L'impact potentiel.
- Les étapes de reproduction.
- Les mesures correctives éventuellement suggérées.

N'incluez aucune donnée personnelle ou aucun secret réel dans le rapport.

## Règles obligatoires

- Ne jamais publier de clés API ou de secrets.
- Ne jamais contourner les contrôles d'accès.
- Vérifier les permissions côté serveur.
- Isoler les données de chaque entreprise.
- Valider les entrées provenant de sources externes.
- Contrôler les opérations sensibles avant exécution.
- Limiter les privilèges des services et des connecteurs.
- Maintenir les dépendances et corriger les vulnérabilités connues.
- Tester les contrôles de sécurité avant les publications importantes.

## Intelligence artificielle et outils

Les sorties d'IA et les contenus provenant de services externes doivent être considérés comme des données non fiables.

Ils ne doivent pas pouvoir modifier les permissions, divulguer des secrets ou déclencher des opérations sensibles sans les contrôles prévus.

## Réponse aux incidents

Les incidents de sécurité devront être évalués, documentés et traités selon leur gravité.

Les mesures peuvent inclure la suspension d'un connecteur, la révocation d'identifiants, l'arrêt des tâches concernées, la restauration des services et la notification des personnes concernées lorsque la loi l'exige.

## Divulgation responsable

Le projet vise à examiner les signalements de bonne foi et à coordonner les corrections avant la divulgation publique, dans la mesure du possible.

Cette politique ne constitue pas une garantie de délai de réponse tant qu'un processus opérationnel n'a pas été défini.

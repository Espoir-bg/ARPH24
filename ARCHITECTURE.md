# 🏗️ ARPH24 — Architecture technique

> **Projet :** ARPH24  
> **Produit :** Application opérationnelle du propriétaire d’entreprise  
> **Cœur intelligent :** ARP  
> **Statut :** Architecture initiale — en cours de réalisation  
> **Version :** 1.0.0

## 1. Vision

ARPH24 est une application installable conçue pour permettre aux propriétaires d’entreprise de superviser leurs activités, de coordonner des opérations et d’automatiser les tâches autorisées grâce à ARP.

L’application cliente, les services serveur et le moteur d’exécution constituent des composants distincts.

Les opérations planifiées doivent pouvoir continuer côté serveur sans que l’application mobile reste ouverte.

## 2. Architecture générale

```text
PROPRIÉTAIRE
     |
     v
APPLICATION ARPH24
     |
     v
API SÉCURISÉE
     |
     v
CŒUR OPÉRATIONNEL ARP
     |
     +---- Gestion des identités et permissions
     |
     +---- Planification et orchestration
     |
     +---- Registre des branches opérationnelles
     |
     +---- Moteur de politiques et d'approbation
     |
     +---- Vérification des résultats
     |
     v
FILE DE TÂCHES ET WORKERS
     |
     +---- Branches opérationnelles
     |
     +---- Connecteurs externes autorisés
     |
     v
SERVICES EXTERNES COMPATIBLES

Infrastructure transversale :
PostgreSQL · Redis · Journalisation · Surveillance
Sauvegardes · Gestion des secrets · Tests

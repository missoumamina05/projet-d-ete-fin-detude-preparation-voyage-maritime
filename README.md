# Portail Maritime – Préparation au Voyage Maritime

Application web développée dans le cadre d'un projet de fin d'étude visant à centraliser, consulter et rechercher des ressources maritimes réglementaires et opérationnelles.

## Description

Ce projet propose un portail numérique permettant d'accéder à des documents officiels, des lois maritimes, des aides à la navigation et des ressources internationales (SOLAS, MARPOL, Transport Canada, USCG). Il inclut un backend complet avec API REST et une interface d'administration, ainsi qu'un frontend React en cours de développement.

## Ce qui a été réalisé

### Backend (Django REST Framework)
- Mise en place du projet Django avec structure modulaire
- Création des modèles `Document` et `DocSection`
- API REST fonctionnelle avec Django REST Framework
- Interface d'administration Django configurée
- Upload et gestion de fichiers PDF via `media/`
- Extraction automatique de sections depuis certains documents avec `pdfplumber`
- Recherche et filtrage par pays, langue et type de document
- Gestion des utilisateurs et authentification de base

### Documents intégrés
- Loi de 2001 sur la marine marchande du Canada (FR/EN)
- Radio Aids to Marine Navigation 2026
- List of Lights – Côte Atlantique, Terre-Neuve, Eaux intérieures 2026
- NOTMAR – Avis aux navigateurs 2026
- TP14619 – Stabilité des navires (FR/EN)
- COLREG – Règles de navigation USCG
- USCG Light List Vol.1 Northeast 2026
- MARPOL – Résumé IMO
- SOLAS – Résumé IMO

### Frontend (en cours)
- Structure React initialisée
- Développement de l'interface de consultation et de recherche à venir

## Technologies utilisées

- Python / Django
- Django REST Framework
- PostgreSQL
- pdfplumber
- React / JavaScript
- HTML / CSS

## Structure du projet

```txt
projet-d-ete-fin-detude-preparation-voyage-maritime/
├── Backend/
│   ├── accounts/
│   ├── maritime_portal/
│   ├── media/
│   └── manage.py
├── Documents officiels/
│   ├── Canada/
│   ├── international/
│   └── usa/
├── frontend/
└── README.md
```

## Installation et lancement

### Prérequis
- Python 3.x
- pip
- Environnement virtuel Python

### Backend

```bash
git clone https://github.com/missoumamina05/projet-d-ete-fin-detude-preparation-voyage-maritime.git
cd projet-d-ete-fin-detude-preparation-voyage-maritime/Backend

python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

### Points d'accès disponibles

| URL | Description |
|-----|-------------|
| `http://127.0.0.1:8000/admin/` | Interface d'administration Django |
| `http://127.0.0.1:8000/api/documents/` | Liste des documents (JSON) |
| `http://127.0.0.1:8000/api/sections/` | Liste des sections (JSON) |

## État d'avancement

| Composant | État |
|-----------|------|
| Backend Django | ✅ Terminé |
| API REST | ✅ Fonctionnelle |
| Administration Django | ✅ Opérationnelle |
| Intégration des documents | ✅ Terminée |
| Extraction PDF | ✅ Fonctionnelle |
| Frontend React | 🚧 En cours |



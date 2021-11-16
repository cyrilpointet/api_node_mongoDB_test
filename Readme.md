# Api REST Node & MongoDB + Admin

## Lancement
Copier/coller **.env.dev.override** en le renommant **.env**<br>
Lancer le projet : `make run` <br>
Remplir la base avec des données de l'api kering pour avoir au moins un compte admin: `make import`

Identifiant de connexion au back office:<br>
Email : admin@admin.admin<br/>
Password : admin

## Détail des scripts
- **run.sh**<br>
  Lance les containers (ce qui lance aussi pm2), génère la doc api (voir ci-dessous) et lance le watcher webpack


- **apidoc.sh**<br>
  Génère la doc api à partir des commentaires dans les controlleurs avec la lib apidoc.<br>
  https://apidocjs.com/


- **make run**<br>
  Lance les containers et pm2 mais sans lancer webpack ni générer la doc. Permet de garder l'affichage des logs.

- **make import**<br>
  Importe les données des databases de workplace

- **make watch**<br>
  Lance le watcher webpack

- **yarn.sh**<br>
  Lance une commande yarn dans le container node. `ex: bin/yarn.sh add @babel/cli -D`

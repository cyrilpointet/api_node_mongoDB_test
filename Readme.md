# Api REST Node & MongoDB + Admin

## Lancement
Copier/coller **.env.dev.override** en le renommant **.env**<br>
Lancer le projet : `bin/run.sh` <br>
Remplir la base avec des fixtures pour avoir au moins un compte admin: `bin/seed_db.sh`

Identifiant de connexion au back office:<br>
Email : admin@admin.admin<br/>
Password : admin

## Détail des scripts
- **run.sh**<br>
  Lance les containers (ce qui lance aussi pm2), génère la doc api (voir ci-dessous) et lance le watcher webpack


- **apidoc.sh**<br>
  Génère la doc api à partir des commentaires dans les controlleurs avec la lib apidoc.<br>
  https://apidocjs.com/


- **server_run.sh**<br>
  Lance les containers et pm2 mais sans lancer webpack ni générer la doc. Permet de garder l'affichage des logs.


- **seed_db.sh**<br>
  Remplit la base avec des fixtures. Génère également un compte admin pour se connecter au BO.


- **webpack_watch.sh**<br>
  Lance le watcher webpack


- **yarn.sh**<br>
  Lance une commande yarn dans le container node. `ex: bin/yarn.sh add @babel/cli -D`

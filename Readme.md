# Api REST Node & MongoDB + Admin

### Frameworks utilisés
Back: Express, Mongoose<br/>
Front: React, React-admin


## Lancement
Après le clonage, installer les dépendances : `npm i`<br/>
Lancer les containers (cela lance également le serveur Node avec PM2) : `docker-compose up`<br/>
Au premier run, remplir la db pour avoir au moins un user : `npm run seed`<br/>
Lancer le watcher webpack : `npm run watch`<br/>
Aller sur : `http://localhost:8081/`

Email : admin@admin.admin<br/>
Password : admin

## Notes
- **ATTENTION: Il n'y a pas de système de migration en mongoDB avec l'orm mongoose !!!**<br>
Ni avec les autres, d'ailleurs ! Le moindre changement mal géré dans un model peut pourrir définitivement la db et faire planter toute l'appli.<br>
  Je recommande **très fortement** l'utilisation de bases mySql (ou MariaDB, Postgres,...) avec l'orm Sequelize qui gère très bien tout ça (comme Doctrine mais en JS).
  
- Le projet est compsé d'une api rest et d'un front en react-admin qui consomme cette api. Pour des raisons de facilité (et de paresse), j'ai mis les deux dans le même projet.
Je pense toutefois que dans un "vrai projet en prod", la maintenance serait plus simple en séprant les deux dans deux projets distincts.<br>
  Il faut juste penser à gérer le CORS dans Express `app.use(cors({origin: '*' }));`
  
- J'ai mis une collection Postman pour les test api : `test_mongo_db.postman_collection.json`. A utiliser aussi pour ajouter des users/admin.

## Conclusion
Le fonctionnement de React-Admin est assez simple: il consomme une api-rest en CRUD en lui passant des arguments (ex: ?sort=id).
Si l'api est propre et bien organisée, le dev du front peut être très rapide. La communication entre devs back/front avec des specs précises sera très importante.

Par contre, je suis très frileux sur l'utilisation de mongoDB.
Pour un petit projet de type blog/site vitrine, pourquoi pas ?
Mais avec plusieurs devs bossant dessus, des données avec des jonctions et qui risquent d'évoluer en fonction des demandes client...
Ça implique la nécéssité de créer de toutes pièces à la main un système qui permettrait de versionner tout ça avec un risque majeur de plantage général au moindre renommage d'attribut de modèle.<br>
Alors que l'utilisation de mySql (ou MariaDB, Postgres...) avec l'orm Sequelize (que j'ai testé aussi, mais pas poussé sur Github) permet de gérer facilement les migrations, fixtures, bases de test... 
et toutes ces bonnes choses qu'on utilise couramment avec symfony/doctrine.

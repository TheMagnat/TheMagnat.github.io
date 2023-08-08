---
title: "Collisions"
summary: Developement d'un system de Collision pour mon moteur de voxels Mavoxel
date: 2023-08-08T14:53:43+02:00
series: ["Mavoxel"]
tags: ["Mavoxel", "Ray-Casting"]
author: Guillaume Magniadas
draft: false
---

## Introduction

Cet article est un devlog parlant de l'implémentation d'un système de collision pour mon moteur de voxels Mavoxel.

Le principe d'une collision est assez simple : si une entité est en mouvement, on va s'assurer que la position d'arrivée de cette dernière ne chevauche pas celle d'un autre objet.

Bien sûr, ici nous somme dans un environnement 3D et nous traitons des volumes, donc il ne s'agit pas simplement de vérifier la position d'arrivée de l'entité, mais l'entièreté de l'espace qu'elle prend.

---

## AABB

Étant donné qu'il existe une infinité de positions possibles dans un volume, nous allons simplifier la représentation de cet espace en utilisant une boîte alignée avec les axes, système de collision appelé "AABB" pour "Axis Aligned Bounding Box". Il existe d'autre représentation possible mais cette dernière nous convient particulièrement bien dans le cadre de notre moteur de voxels.

{{< img src="AABB_Types.png" align="center">}}

Avec ce système, chaque entité possèdera sa boite de collision "AABB" qui se déplacera en même temps qu'elle, et pour vérifier les collisions avec les autres objets il suffira de vérifier leurs boite de collision entrent en intersection.

{{< img src="aabbtoaabb.png" align="center">}}

## Algorithme

Super, ça paraît simple ! Mais il y a un problème : À quel moment devons-nous vérifier une possible collision ? Après un déplacement, vous me direz et je vous répondrais que oui, mais c'est un peu plus compliqué que cela. Imaginez un objet qui se déplace sur un terrain fait de plusieurs cubes. Cet objet possède une vitesse de 2 en avant (comprenez qu'il se déplace d'une distance de 2 cubes en avant). Après le déplacement, il se retrouvera donc avancé de 2 cubes, et nous allons donc vérifier si il y a une collision sur son nouvel emplacement. Mais qu'en est-il s'il y avait un cube entre sa position de départ et celle d'arrivée ?

Vous devez maintenant comprendre le problème. Bien sûr, dans la plupart des cas, aucun objet n'est censé pouvoir se déplacer de 2 cubes en 1 frame, mais il existe plusieurs situations où cela peut arriver et qui sont mêmes assez connues dans l'univers du Jeu vidéo, qui utilisent très souvent ce système de collision. Par exemple, si la machine du joueur freeze, l'accumulation de temps écoulé entre 2 frames durant ce freeze va devenir très grande, et comme la plupart des jeux utilisent le temps entre les frames pour calculer la vitesse des déplacements (pour éviter qu'un joueur avec plus de FPS puisse aller plus vite qu'un joueur avec moins de FPS), il serait donc possible qu'un gros freeze permette de donner une vélocité assez grande à un objet pour pouvoir ignorer des collisions sur son chemin. Ce problème étant très connu des développeurs de jeu vidéo, quelques fixes sont des fois mis en place pour éviter de telles situations, comme par exemple en donnant une borne maximale au temps écoulé entre 2 frames. Mais du coup avec un tel fix, un joueur qui freeze trop pourrait voir l'horloge de son jeu se décaler lentement par rapport à une personne qui ne freeze pas, chose que l'on veut éviter (nous voulons que chaque joueur se retrouve dans la même situation après les mêmes inputs, indépendamment de leurs machines).

Malheureusement, il n'existe pas beaucoup de solutions documentées en ligne pour régler ce problème.

En effet, le système que je vous ai présenté au-dessus est en fait assez satisfaisant dans une très grande majorité des cas, et même pour mon projet en réalité ! Donc pourquoi m'embêter ? En plus, cette solution a le bon goût d'être très peu complexe pour la machine (je parle ici de complexité algorithmique).

Mais je n'ai pas envie de me satisfaire d'un système de collision que je trouve imparfait, c'est pourquoi j'ai décidé de chercher une solution !

Après pas mal de temps de réflexion, j'ai commencé à penser à une idée : et si j'utilisais le ray-casting ?

## Ray-Casting

L'idée derrière le ray-casting est assez simple : on part d'une position et on tire un rayon dans une direction donnée et on s'arrête lorsque notre rayon rencontre un obstacle.

{{< img src="raycast_exemple.png" align="center">}}

C'est un algorithme qui est assez souvent utilisé pour faire de l'affichage et calculer de manière assez précise si oui ou non un objet est visible pour l'utilisateur. Cela est aussi utilisé pour voir si une surface est éclairée ou non par une source lumineuse.

Bref, ici l'idée serait de s'en servir pour savoir si oui ou non notre entité va rencontrer un autre objet.

Et cela tombe bien ! Il se trouve que j'ai déjà implémenté un algorithme de Ray-casting pour mon moteur (code disponible ici) ! Actuellement, il ne me servait qu'à déterminer les objets que l'utilisateur pointe du regard (l'objet au centre de son écran) et rien ne m'empêche de le réutiliser dans mon autre cas de figure.

Problème : Le ray-casting est fait pour tirer un rayon partant d'un point, pas d'un volume (ici notre boîte de collision AABB). Il faut trouver une solution pour adapter l'algorithme à un volume... Et bien pourquoi ne pas effectuer un ray-casting mais en partant de chacun des sommets de notre boîte de collision ?

C'est donc ce que j'ai décidé d'implémenter ! Mais dans quel ordre ? Comment fait-on un ray-casting de plusieurs points en même temps ? Eh bien, l'idée que j'ai sélectionnée est d'effectuer le ray-casting sur chacun des points de la boite de collision (8 points ici). On pourrait aussi optimiser cela en ne vérifiant que 7 points, car on sait qu'il y en aura toujours un qui sera couvert par les 7 autres, mais c'est un détail. Ensuite, on retient la collision la plus proche obtenue avec ces 8 ray-castings et on recommence en adaptant les entrées, c'est-à-dire les positions de départ des ray-castings et la direction :

* Position de départ : On ajoute le déplacement effectué jusqu'à la collision à toutes les positions.
* Direction : On ajoute le déplacement effectué jusqu'à la collision et on met à 0 la direction dans laquelle on a rencontré la collision.

Et étant donné que nous sommes en 3D et que nous avons "seulement" 3 axes maximum avec lesquels nous pouvons rencontrer une collision avant que notre direction ne devienne un vecteur nul, on sait que nous n'allons répéter cet algorithme que 3 fois dans le pire des cas.

Nous allons à chaque collision sauvegarder le déplacement effectué jusqu'à la collision, et cet algorithme retournera donc la somme de tous ces déplacements avec le vecteur direction restant (s'il n'est pas nul).

Voici un petit schéma pour que vous puissiez essayer de visualiser l'algorithme :

{{< img src="collision_schem.png" align="center">}}

Ici, les cubes verts représentent notre environnement, le cube rouge représente notre boîte de collision et les flèches bleues représentent les ray-castings effectués !

Bon, dit comme ça, ça a l'air simple, mais en pratique, ça donne quoi ? Eh bien, après environ trois semaines de galère en tout genre, principalement due à des problèmes de nombres flottants, de calcul de longueur de vecteurs et d'intersection entre les voxels, l'algorithme fonctionne !

Pour faire simple, les principaux problèmes que j'ai rencontrés pendant ces trois semaines et leurs solutions :

* Que se passe-t-il si l'on commence un Ray-Casting entre deux voxels sur un axe ? Et bien le voxel ayant la coordonnée la plus "grande" sera arbitrairement sélectionné. C'est un comportement qu'on veut à tout prix éviter, car cela veut dire qu'on n'est pas sûr dans cette situation de bien commencer là où l'on veut le ray-casting. J'ai donc ajouté une vérification pour détecter cette situation, et si elle est rencontrée, on va bien préciser que le prochain voxel se trouve à une distance de 0 et on va reculer notre position de 1 dans le sens inverse de notre vecteur de direction. On va aussi rajouter une distance minimale à un voxel pour ne pas coller nos boîtes de collisions à ces derniers.

* Un autre souci que j'ai rencontré est une erreur basique de calcul de longueur d'un vecteur. En fait, j'estimais mal la distance parcourue pendant un Ray-Casting, ce qui entraînait des situations où je ne détectais pas de collisions et me retrouvais avec des coordonnées à l'intérieur de voxels, chose que je ne pouvais pas ensuite gérer. Mon erreur était que j'additionnais mes déplacements sur tous les axes, et je considérais ensuite cette valeur comme la distance parcourue, sauf que cela ne fonctionne pas ainsi avec des vecteurs. Si j'avance de 1 en x et 1 en y, je n'aurai pas avancé de 2 mais d'environ 1,41... Donc pour calculer cela, rien de mieux que de stocker tous les déplacements sur les axes dans un vecteur et ensuite calculer la longueur de ce dernier pour obtenir la distance parcourue !
  
Et voilà, avec tout ça, on dispose d'un algorithme de détection de collision entre nos entités et notre monde fonctionnel !

Voici une vidéo démo du résultat :

{{< youtube UnvhOSIVxfY >}}

## Bonus

Maintenant que le système de collision est implémenté, il est assez simple de rajouter un petit système de simulation de gravité et de saut ! Voici une petite démo de ce que ça donne :

{{< youtube lMb-mrkqZjY >}}

N’hésitez pas à me contacter si vous avez des questions / suggestions.

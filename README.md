Trinkwasser Visualisierung: Härtegrad, Bestandteile und Kosten
=======================

* Im Verzeichnis converter/ befinden sich die Rohdaten + kleine Skripte, die diese Rohdaten für die Webansicht aufbereiten
* Im Verzeichnis src/ befinden sich die HTML, CSS und JavaScript Dateien + die aufbereiteten Daten für die Visualisierung. Nach Änderungen einfach grunt gh-pages ausführen, um die Online-Version zu aktualisieren.

Online-Version Potsdam: https://trinkwasser.oklab-potsdam.de

Datenquellen:
==================

* Stadtwerke Potsdam https://www.swp-potsdam.de/swp/de/wasser/beratung-ewpw/fragen-und-antworten-ewpw/fragen-und-antworten.php

Entwicklung
==================

Im Docherfile-Dev ist definiert, dass das aktuelle Verzeichniss in dem das Image gebaut wird als Volume im Container zur Verfuegung steht.
Die Option ``-v`` beim Starten eines Containers uebergibt dann den konkreten Pfad der im Container eingehangen werden soll. Der Container hat als Einstiegspunkt die Befehle ``yarn install && yarn run serve``. Es werden zu erst alle Abhaengikeiten installiert und dann ein Server gestartet der die Anwendung bereits stellt. Auf Port 8081 laeuft die Anwendung und Port 35729 ist fuer den Livereload vorgesehen.

```shell
# Docker image bauen
docker build -f Dockerfile-Dev -t <name>:1.0.0 .

# Docker container starten
docker run -it -v <absolute path to repo folder>:/home/node/app -p 8081:8081 -p 35729:35729 <name>:1.0.0
```

Alle Aenderungen an Javascript- und HTML-Dateien werden automatisch im Browser neu geladen. Dazu muss das Livereload Plugin installiert sein.

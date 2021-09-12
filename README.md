# ngBienchen

APP zur Verwaltung von Schülerleistungen.

- ionic Projekt erstellen (ionic start ngBienchen blank --type ionic1)
- www - Ordner des neu erstellten Projekts löschen (rm -r www)
- das rep nach www clonen
- ionic cordova build ios
- config.xml ins Projektverzeichnis kopieren
- npm install -g cordova-res // Resourcen Plugin installieren
- resources - Verzeichnis erstellen  
- icon.png und splash.png nach resource kopieren und Ressourcen erzeugen (cordova-res ios --skip-config --copy) 
- ionic cap run ios

Ionic Native (für Cordova-Plugins)
- siehe: https://github.com/ionic-team/ionic-native

Cordova Plugins hinzufügen:
- cordova plugin add cordova-plugin-camera
- cordova plugin add cordova-plugin-file
- cordova plugin add eeschiavo-cordova-plugin-clipboard

Für Icons und Spash-Screen
- www/gimp icon.png und splash.png in resources erzeugen
- ionic cordova resources / bzw cordova-res android --skip-config --copy
- Unter Android: https://www.youtube.com/watch?v=QOsDG5RSQ-Q&feature=youtu.be&ab_channel=RockyLon

# Mögliche Buildfehler:
Android:
- Findet tools.jar nicht, obwohl JDK installiert ist.(siehe: https://stackoverflow.com/questions/64968851/could-not-find-tools-jar-please-check-that-library-internet-plug-ins-javaapple)
iOS:
- ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"
- Gupl-Reference-Error: https://timonweb.com/javascript/how-to-fix-referenceerror-primordials-is-not-defined-error/
- npm install -g ios-deploy --unsafe-perm=true

Deployment auf Device:
- https://support.apple.com/de-de/HT204460

# ngBienchen

APP zur Verwaltung von Schülerleistungen.

- ionic Projekt erstellen (ionic start ngBienchen blank --type ionic1)
- www - Ordner des neu erstellten Projekts löschen (rm -r www)
- das rep nach www clonen
- config.xml ins Projektverzeichnis kopieren
- icon.png und splash.png nach resource kopieren und Ressourcen erzeugen (ionic cordova resources)
- ionic cordova build ios

Ionic Native (für Cordova-Plugins)
- siehe: https://github.com/ionic-team/ionic-native

Cordova Plugins hinzufügen:
- cordova plugin add cordova-plugin-camera
- cordova plugin add cordova-plugin-file
- cordova plugin add eeschiavo-cordova-plugin-clipboard

Für Icons und Spash-Screen
- www/gimp icon.png und splash.png in resources erzeugen
- ionic cordova resources

Mögliche Buildfehler:
- ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"
- Gupl-Reference-Error: https://timonweb.com/javascript/how-to-fix-referenceerror-primordials-is-not-defined-error/
- npm install -g ios-deploy --unsafe-perm=true

Deployment auf Device:
- https://support.apple.com/de-de/HT204460

# ngBienchen

APP zur Verwaltung von Schülerleistungen.

- ionic Projekt erstellen (ionic start ngBienchen blank --type ionic1)
- www - Ordner des neu erstellten Projekts löschen (rm -r www)
- das rep nach www clonen
- ionic cordova build ios

Cordova Plugins hinzufügen:
- cordova plugin add cordova-plugin-camera
- cordova plugin add cordova-plugin-file
- cordova plugin add eeschiavo-cordova-plugin-clipboard

Mögliche Buildfehler:
- ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"
- Gupl-Reference-Error: https://timonweb.com/javascript/how-to-fix-referenceerror-primordials-is-not-defined-error/

Deployment auf Device:
- https://support.apple.com/de-de/HT204460

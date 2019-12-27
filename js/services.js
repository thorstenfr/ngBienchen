angular.module('app.services', [])

.factory('Courses', [function(){
    // var appname = "soteam";
    var appname = "bienchen";
    return {
		all: function() {   
            var courseString = window.localStorage['courses'];
            if(courseString) {
                return angular.fromJson(courseString);
                
            }
          return [];
        },
        save: function(courses) {
            window.localStorage['courses'] = angular.toJson(courses);
			
        },
		loadConfig: function() {
			var configString = window.localStorage['bn-config'];
			if (configString) {
				return angular.fromJson(configString);
			}
			return [];
		},
		saveConfig: function(configs) {
			window.localStorage['bn-config'] = angular.toJson(configs);
		},
		newConfig: function() {
			return {
				
				showTagesUebersicht : false,
				tagesUebersichtText : '<div class="icon ion-toggle"></div>Tagesauswertung',
				showUebersicht : false,
				uebersichtText : '<div class="icon ion-toggle"></div>Gesamtauswertung',
				showViewKompakt : false,
				showViewKompaktText : '<div class="icon ion-toggle"></div>Kompakt',
				showViewNormal : true,
				showViewNormalText : '<div class="icon ion-toggle-filled"></div>Normal',
				showViewUebersicht : false,
				showViewUebersichtText : '<div class="icon ion-toggle"></div>Übersicht',
				showViewDetail : false,
				showViewDetailText : '<div class="icon ion-toggle"></div>Detail',
				showViewFilterFilter : false,
				showViewFilterFilterText : '<div class="icon ion-toggle"></div>Text',
				showViewFilterDatePeriod : false,
				showViewFilterDatePeriodText : '<div class="icon ion-toggle"></div>Datum',
				showFilterBestlist : false,				
				showBuchungsdatum : false,
				showBuchungsdatumText : '<div class="icon ion-toggle"></div> Buchungsdatum setzen',
				showCreate : false,
				showCreateText : '<div class="icon ion-toggle"></div> Schnelleingabe',
                showErledigteAnzeigen : true
			};
		},
		
        newCourse: function(courseTitle) {
            // Add a new course
            return {
                title: courseTitle,
                maxBienchen : 0,
                mittel : 0,
                maxBienchenName : '',
                subjects: [],
                pupils: []
            };
            
        },
        getTotalNumberOfRatings: function() {
            return parseInt(window.localStorage['totalNumberOfRatings']) || 0;
            
        },
        getFirstRun: function() {
            return window.localStorage['firstRun'] || '0';
            
        },
		getLastRun: function() {
            return window.localStorage['lastRun'] || '0';
            
        },        
        getLastActiveIndex: function() {
            return parseInt(window.localStorage['lastActiveCourse']) || 0;
            
        },
        getAzEinheit: function() {
			if (appname == "bienchen") {
				return 1;
			}
			else {
				// soteam: Arbeitszeiteinheit
				return parseInt(window.localStorage['azEinheit']) || 4;
			}
            
        },
        setAzEinheit: function(azEinheit) {
        	window.localStorage['azEinheit'] = azEinheit;
        },
        
        setTotalNumberOfRatings: function(ratings) {
            window.localStorage['totalNumberOfRatings'] = ratings;
            
        },
        setFirstRun: function(wann) {
            window.localStorage['firstRun'] = wann;
            
        },
		setLastRun: function(wann) {
            window.localStorage['lastRun'] = wann;
            
        },
        setLastActiveIndex: function(index) {
            window.localStorage['lastActiveCourse'] = index;
            
        },
        setLastActiveSubjectIndex : function(index) {
            window.localStorage['lastActiveSubject'] = index;
        },
        
        getLastActiveSubjectIndex: function(index) {
             return parseInt(window.localStorage['lastActiveSubject']) || 0;
            
        },
        newSubject : function(subjectTitle) {
            // Add a new Subject
            return {
                title : subjectTitle
            };
        },
        getVariables : function() {
            // get Variables
            if (appname == "bienchen") {
                return {
                    appname : 'Bienchen',
                    popupTitle : 'Neuer Kurs',
		            subTitle: 'z.B. Kursbezeichnung oder Klassenname',             
                    isSoteam : false,
                    titlePageOne : 'Kurs',
                    placeholder : 'Neuen Kurs hinzufügen',
					welcome : 'Willkommen bei Bienchen!',
					welcomeText : 'Erfassen Sie als erstes Ihre Kurse. Sie können später über "+ Neu" weitere hinzufügen.',
					detailViewTitle : 'In die Kursansicht wechseln!',
					detailViewText : 'Sobald Sie Ihre Kurse angelegt haben, klicken Sie auf einen Kurs, um die Teilnehmer zu erfassen',
                    titlePageTwo : 'Aufgabe',       
                    schueler : 'Schüler',    
                    bienchen : 'Bienchen', 
                    neuerSchuelerTitle : 'Neuer Schüler',
                    neuerSchuelerSubtitle : 'z.B Vor- und Zuname oder Nick',    
                    teilnehmerHinzufuegen : 'Teilnehmer hinzufügen',  
                    ratings : 'Bewertungen', 
                    bienchenErfassen : 'Bienchen erfassen!',  
                    bienchenErfassenTemplate : 'Sobald Sie Teilnehmer angelegt haben, klicken Sie auf einen Teilnehmer, um ihm ein <b>Bienchen</b> zu geben. Tappen Sie auf einen Teilnehmer, um ihm ein <b>Teufelchen</b> zu geben.',
                    erfassenSieTeilnehmer : 'Erfassen Sie die Teilnehmer!',
                    erfassenSieTeilnehmerTemplate : 'Sie können später über "+ Neu" weitere Teilnehmer hinzufügen.',
                    sortierenDerKurse : 'Sortieren der Kurse',
                    sortierenDerTeilnehmer : 'Sortieren der Teilnehmer',
                    nachBienchen : 'Nach Bienchen',
                    schuelerPlaceholder : 'Max Mustermann',
                    hatBewertungen : 'Buchungen',
                    denSchueler : 'den Schüler löschen wollen.',
					showDoneTemplate : 'Sie haben Ihr erstes Bienchen vergeben. So können Sie direkt Leistungen und Nicht-Leistungen festhalten.',
					bienchenDetails : 'Bienchen',
					teufelchenDetails : 'Teufelchen',
					csvsubject : 'CSV Export aus bienchen by Thorsten Freimann',
                    showDelete : false,
                    showFilterBestlistText : '<div class="icon ion-toggle"></div>Bestenliste',
                    schuelerNameEingeben : 'Name ändern ...'
                    
                }; 
              
            }
            if (appname == "soteam") {
                return {
                    appname : 'soteam',
                    popupTitle : 'Neue Aufgabe',
                    subTitle: 'z.B. Service für Kollegen',
                    isSoteam : true,
                    titlePageOne : 'Aufgaben',
                    placeholder : 'Neue Aufgabe hinzufügen',
                    welcome : 'Willkommen bei soteam!',
                    welcomeText : 'Erfassen Sie als erstes Ihre Aufgaben. Sie können später über "+ Neu" weitere hinzufügen.',
                    detailViewTitle : 'In die Tätigkeitenansicht wechseln!',
                    detailViewText : 'Sobald Sie Ihre Aufgaben angelegt haben, klicken Sie auf eine Aufgabe, um die Tätigkeiten zu erfassen',
                    courseName : 'Tätigkeiten und Aufwand erfassen',
                    schueler : 'Aufgaben',  
                    bienchen : 'Summe',
                    neuerSchuelerTitle : 'Neue Tätigkeit',
                    neuerSchuelerSubtitle : 'z.B Bezeichnung der Tätigkeit',
                    teilnehmerHinzufuegen : 'Tätigkeit hinzufügen',
                    ratings : 'Arbeitseinheiten', 
                    bienchenErfassen : 'Aufwand erfassen!', 
                    bienchenErfassenTemplate : 'Sobald Sie Tätigkeiten angelegt haben, klicken Sie auf eine Tätigkeit, um eine <b>Zeiteinheit</b> zu buchen. Tappen Sie auf einen Tätigkeit, um eine <b>Zeiteineinheit</b> zu entfernen.',                    
                    erfassenSieTeilnehmer : 'Erfassen Sie die Tätigkeiten!',
                    erfassenSieTeilnehmerTemplate : 'Sie können später über "+ Neu" weitere Tätigkeiten hinzufügen.',
                    sortierenDerKurse : 'Sortieren der Aufgaben',
                    sortierenDerTeilnehmer : 'Sortieren der Tärigkeiten',
                    nachBienchen : 'Nach Arbeitseinheiten',
                    schueler : 'Tätigkeit',
                    schuelerPlaceholder : 'Dokumente erstellen',
                    hatBewertungen : 'Bewertungen',
                    denSchueler : 'die Tätigkeit löschen wollen. Damit werden die Buchungen gelöscht.',
					showDoneTemplate : 'Sie haben Ihren ersten Aufwand auf eine Tätigkeit gebucht.',
					bienchenDetails : 'Arbeitszeitbuchungen',
					teufelchenDetails : 'Minus-Buchungen',
					csvsubject : 'CSV Export aus soteam by Thorsten Freimann',
                    TitlePageTwo : 'Tätigkeit',                   
                    TitlePageTwo : 'Tätigkeit',                   
                    showFilterBestlistTextFalse : '<div class="icon ion-toggle"></div>Aufwand',
                    showFilterBestlistTextTrue : '<div class="icon ion-toggle-filled"></div>Aufwand',
                    erledigteTaetigkeitenAnzeigenTrue : 'Erledigte Tätigkeiten verbergen',
                    erledigteTaetigkeitenAnzeigenFalse : 'Erledigte Tätigkeiten anzeigen',
                    schuelerNameEingeben : 'Neue Bezeichnung'
                    
                    
            }; 
            } 
           
        }
    }
}])

.factory('UserService', function() {
    return {
        name : 'anonymous'
    };
  })
.factory('uiFieldState', function () {
    return {uiObject: {data: null} }
  })

.service('BlankService', [function(){
    var appPageOne = "Kurs";
}]);
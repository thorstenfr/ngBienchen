angular.module('app.services', [])

.factory('Courses', [function(){
    var appname = "soteam";
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
                    showDelete : false
                }; 
              
            }
            if (appname == "soteam") {
                return {
                    appname : 'soteam',
                    popupTitle : 'Neues Projekt',
                    subTitle: 'z.B. Service für Kollegen',
                    isSoteam : true,
                    titlePageOne : 'Projekt',
                    placeholder : 'Neues Projekt hinzufügen',
                    welcome : 'Willkommen bei soteam!',
                    welcomeText : 'Erfassen Sie als erstes Ihre Aufgaben. Sie können später über "+ Neu" weitere hinzufügen.',
                    detailViewTitle : 'In die Tätigkeitenansicht wechseln!',
                    detailViewText : 'Sobald Sie Ihre Aufgaben angelegt haben, klicken Sie auf eine Aufgabe, um die Tätigkeiten zu erfassen',
                    courseName : 'Tätigkeiten und Aufwand erfassen',
                    schueler : 'Aufgaben',  
                    bienchen : 'Summe',
                    neuerSchuelerTitle : 'Neue Aufgabe',
                    neuerSchuelerSubtitle : 'z.B Bezeichnung der Aufgabe',
                    teilnehmerHinzufuegen : 'Aufgabe hinzufügen',
                    TitlePageTwo : 'Aufgabe'
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

.service('BlankService', [function(){
    var appPageOne = "Kurs";
}]);
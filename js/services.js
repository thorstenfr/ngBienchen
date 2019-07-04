angular.module('app.services', [])

.factory('Courses', [function(){
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
        getVariables : function(appname) {
            // get Variables
            if (appname == "bienchen") {
                return {
                    appname : 'Bienchen',
                    popupTitle : 'Neuer Kurs',
		            subTitle: 'z.B. Kursbezeichnung oder Klassenname',             
                    isSoteam : false,
                    titlePageOne : 'Kurs',
                    placeholder : 'Neuen Kurs hinzufügen',
                    titlePageTwo : 'Aufgabe'
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
                titlePageTwo : 'Aufgabe'
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
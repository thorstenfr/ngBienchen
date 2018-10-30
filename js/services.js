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
        }
    }
}])

.service('BlankService', [function(){

}]);
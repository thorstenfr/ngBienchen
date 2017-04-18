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
                subjects: [],
                pupils: []
            };
            
        },
        getLastActiveIndex: function() {
            return parseInt(window.localStorage['lastActiveCourse']) || 0;
            
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
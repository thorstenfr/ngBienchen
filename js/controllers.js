angular.module('app.controllers', [])
  
.controller('kursCtrl', ['$scope', '$stateParams', 'Courses', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses) {
    $scope.courses =  Courses.all();
    $scope.showDelete = false;
    
    
    // Called to create a new course
    $scope.newCourse = function() {
        var courseTitle = prompt('Kursbezeichnung');
        if(courseTitle) {
            createCourse(courseTitle);
        }
    };
    
    // A utility function for creating a new course
    // with the given courseTitle
    var createCourse = function(courseTitle) {
        var newCourse = Courses.newCourse(courseTitle);
        $scope.courses.push(newCourse);
        $scope.selectCourse(newCourse, $scope.courses.length-1);
        Courses.save($scope.courses);
    };

    // Called to select the given course
    $scope.selectCourse = function(course, index) {
        $scope.activeCourse = course;
        Courses.setLastActiveIndex(index);
        Courses.save($scope.courses);
        
    };
    
    // Kurs löschen
    $scope.deleteCourse = function(course) {  
    
        // Sicherheitshalber nur löschen, wenn keine Schüler mehr vorhanden sind
        if($scope.courses[$scope.courses.indexOf(course)].pupils.length !== 0) {
            alert("Kurs hat Schüler!");
            
        }
        else {
            $scope.courses.splice($scope.courses.indexOf(course), 1);
            // Inefficient, but save all the subjects
            Courses.save($scope.courses);
            
        }
	};
	
    $scope.toggle= function (v) {
        $scope[v] = !$scope[v];
    };
    
    // Kurse anordnen
    $scope.reorder = function(course, fromIndex, toIndex) {
        // löschen
        $scope.courses.splice(fromIndex, 1);
        $scope.courses.splice(toIndex, 0, course);
    }
    
  

}])
   
.controller('themenCtrl', ['$scope', '$stateParams', 'Courses', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses) {
    $scope.courses =  Courses.all();
    $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];
    
    
    
    // Called to create a new subject
    $scope.newSubject = function() {
        var subjectTitle = prompt('Thema');
        if(subjectTitle) {
            createSubject(subjectTitle);
        }
    };
    
    // A utility function for creating a new subject
    // with the given subjectTitle
    var createSubject = function(subjectTitle) {
        if (!$scope.activeCourse || !subjectTitle) {
            return;
        }
        $scope.activeCourse.subjects.push({
            title : subjectTitle,
            firstRating : '' , // Datum des ersten Rating zum Thema
            lastRating : '', // Datum des letzten Ratings zum Thema
            ratings : 0, // Anzahl der zum Thema erfassten ratings
            finished : 0 // 0 = noch nicht fertig, 1 = fertig
        });
        
        // Nicht effinzient ...
        Courses.save($scope.courses);
    };
    
    // Called to select the given subject
    $scope.selectSubject = function(subject, index) {
        $scope.activeSubject = subject;
        
      
        Courses.setLastActiveSubjectIndex(index);
        
        // Nicht effinzient ...
        Courses.save($scope.courses);
        
    };
    // Thema löschen
    $scope.delete = function(subject) {
        $scope.activeCourse.subjects.splice($scope.activeCourse.subjects.indexOf(subject), 1);
        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
        
    };
     $scope.toggle= function (v) {
        $scope[v] = !$scope[v];
    };
    
    // Kurse anordnen
    $scope.reorder = function(subject, fromIndex, toIndex) {
        // löschen
        $scope.activeCourse.subjects.splice(fromIndex, 1);
        $scope.activeCourse.subjects.splice(toIndex, 0, subject);
    }
}])
   
.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses) {
    $scope.courses =  Courses.all();
    $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];
    $scope.activeSubject = $scope.courses[Courses.getLastActiveSubjectIndex()];
    
    
    // Called to create a new pupil
    $scope.newPupil = function() {
        var pupilName = prompt('Schülername');
        if(pupilName) {
            createPupil(pupilName);
        }
    };
    
    // A utility function for creating a new pupil
    // with the given pupilName
    var createPupil = function(pupilName) {
        console.log("createPupil : " + pupilName);
        if (!$scope.activeCourse || !pupilName) {
            return;
        }
        
        $scope.activeCourse.pupils.push({
            name : pupilName,
            bienchen : 0, // ratings - teufelchen
            ratings : [],
            teufelchen : []
        });
        
        
        
        // Nicht effinzient ...
        Courses.save($scope.courses);
    };
    
    // Schüler löschen
    $scope.delete = function(pupil) {
        $scope.activeCourse.pupils.splice($scope.activeCourse.pupils.indexOf(pupil), 1);
        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
        };
    
    // Rating hinzufügen
    $scope.addRating = function(pupil) {
        
        var d = new Date();
        var now = d.getTime();	 
        if(!$scope.activeCourse || !pupil) {
            return;
            
        }
        // Rating hinzufügen
        pupil.ratings.push({
            datum : now,
            thema : $scope.activeSubject.title
        });
        // Bienchen-Anzahl anpassen
        pupil.bienchen = pupil.bienchen + 1;
        
        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
        
    }
    
    // Teufelchen hinzufügen
    $scope.addTeufelchen = function(pupil) {
        
        var d = new Date();
        var now = d.getTime();	 
        if(!$scope.activeCourse || !pupil) {
            return;
            
        }
        // Rating hinzufügen
        pupil.teufelchen.push({
            datum : now
        });
        // Bienchen-Anzahl anpassen
        pupil.bienchen = pupil.bienchen - 1;
        
        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
    
    }
        
    
}])
 
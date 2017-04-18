angular.module('app.controllers', [])
  
.controller('kursCtrl', ['$scope', '$stateParams', 'Courses', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses) {
    $scope.courses =  Courses.all();
    
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
        
    };
    $scope.deleteCourse = function(course) {  
        console.log(' Soll course löschen (' + $scope.courses[$scope.courses.indexOf(course)].pupils.length);
        // Sicherheitshalber nur löschen, wenn keine Schüler mehr vorhanden sind
        if($scope.courses[$scope.courses.indexOf(course)].pupils.length != 0) {
            alert("Kurs hat Schüler!");
            
        }
        else {
            $scope.courses.splice($scope.courses.indexOf(course), 1);
            // Inefficient, but save all the subjects
            Courses.save($scope.courses);
            
        }
	};
  

}])
   
.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses) {
    $scope.courses =  Courses.all();
    $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];
    $scope.activeSubject = "kein Thema"
    
    
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
 
angular.module('app.controllers', ['ionic'])

.controller('kursCtrl', ['$scope', '$stateParams', 'Courses', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses) {
    $scope.courses =  Courses.all();
    
    $scope.data = {
    	'title': 'test123'
    }

    
    $scope.form = {
    	kursForm: {}
    };
    
    // Called to create a new course
    $scope.newCourse = function() {
        var courseTitle = prompt('Kursbezeichnung');
        if(courseTitle) {
            createCourse(courseTitle);
        }
    };
    
    $scope.createCourse = function(course) {
    		if (course.title) {
    			var nc = Courses.newCourse(course.title);
    			$scope.courses.push(nc);
    		
    		// Nicht effinzient ...
        Courses.save($scope.courses);
        
        course.title = "";
    		}
    } 
    
    $scope.addCourse = function(kurs) {
        if(kurs && kurs.titel) {
        	createCourse(kurs.titel);
        }
        $scope.reset();
        
    };
    	
    $scope.reset = function() {
    		console.log("ok: " + $scope.kurs.titel);
    		$scope.kurs = {};
    		$scope.form.myForm.$setPristine();
    		$scope.form.myForm.$setUntouched();
    };
    
    // A utility function for creating a new course
    // with the given courseTitle
    var createCourseEx = function(courseTitle) {
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
   
.controller('themenCtrl', ['$scope', '$stateParams', 'Courses', '$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicModal) {
    $scope.courses =  Courses.all();
    $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];
    
    $scope.tolate = function(s){
    	return s.geplant_fuer<$scope.today;
    }
    
    	$scope.showReorder = false;
    	
    	// Speicher das aktuelle Datum
    	$scope.today = new Date();
    	
    
    	
      // Create our modal
	  $ionicModal.fromTemplateUrl('templates/new-subject.html', function(modal)
	  {
    		$scope.subjectModal = modal;
    	}, {
    		scope: $scope
  		});

    	
    $scope.newSubject = function(subject, index) {
    	$scope.activeSubject = subject;
        Courses.setLastActiveSubjectIndex(index);
        Courses.save($scope.courses);
        $scope.subjectModal.show();
    }
    $scope.closeNewSubject = function() {
    	$scope.subjectModal.hide();
    }
/*
      $scope.newPupil = function() {
    $scope.pupilModal.show();
  };

  $scope.closeNewPupil = function() {
    $scope.pupilModal.hide();
  }

  */  
    
    // Called to create a new subject
    $scope.newSubjectEx = function() {
        var subjectTitle = prompt('Thema');
        if(subjectTitle) {
            createSubject(subjectTitle);
        }
    };
    
    $scope.addSubject = function(subject) {
    	if (subject.title) {
    		createSubject(subjectTitle);
    	}
    }
    $scope.closeEditSubject = function(subject) {
    	if(subject && subject.title) {
    			$scope.activeSubject.title = subject.title;	
    	}
    	
    			$scope.activeSubject.geplant_fuer = subject.geplant_fuer;
    	
				// Inefficient, but save all the subjects
				Courses.save($scope.courses);
		
    	
		$scope.subjectModal.hide();	
    	
    }
    $scope.openEditSubject = function(subject, index) {
    	if(!$scope.activeCourse || ! subject) {
    		return;
    	}
    	$scope.activeSubject = subject;
        Courses.setLastActiveSubjectIndex(index);

	   	$scope.subjectModal.show();
			
		
	}
    
        
    
    // A utility function for creating a new subject
    // with the given subjectTitle
    $scope.createSubject = function(subject) {
        if (!$scope.activeCourse || !subject) {
    
        
            return;
        }
        $scope.activeCourse.subjects.push({
            title : subject.title,
            firstRating : '' , // Datum des ersten Rating zum Thema
            lastRating : '', // Datum des letzten Ratings zum Thema
            ratings : 0, // Anzahl der zum Thema erfassten ratings
            geplant_fuer : subject.geplant_fuer, // Falls Datum des Themas geplant wird
            finished : false // true: Thema erledit
        });
        

        // Nicht effinzient ...
        Courses.save($scope.courses);
        
        subject.title = "";
    };
    
    // Called to select the given subject
    $scope.selectSubject = function(subject, index) {
    	$scope.activeSubject = subject;
        Courses.setLastActiveSubjectIndex(index);
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
    };
   
     // Thema auf erledigt setzen oder wieder zurück
    $scope.toogleFinished = function(s) {
    	s.finished = !s.finished;
    	
    	// Inefficient, but save all the subjects
        Courses.save($scope.courses);
        
    };
    /*
      $scope.compiltedFilter(object) {
   		return object.finished === true;
   }
   */

   
}])

   
.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicModal',    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicModal) {


	$scope.setzeDatum = function(von, bis) {
		$scope.vonDatum = von;
		$scope.bisDatum = bis;
		$scope.closeNewDatumFilter();
		
	}
    $scope.courses =  Courses.all();
    $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];	
    $scope.activeSubject = $scope.activeCourse.subjects[Courses.getLastActiveSubjectIndex()];

      // Create our modal
	  $ionicModal.fromTemplateUrl('templates/new-datum-filter.html', function(modal)
	  {
    		$scope.datumModal = modal;
    	}, {
    		scope: $scope
  		});

    
    	
    $scope.newDatumFilter = function() {
    	$scope.datumModal.show();
    }
    $scope.closeNewDatumFilter = function() {
    	$scope.datumModal.hide();
    }
	
	$scope.show = function() {
	
	// Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: '<ion-icon name="heart"></ion-icon>Nach Name aufsteigend' },
	   { text: 'Nach Name absteigend' },
       { text: 'Nach Bienchen aufsteigend' },
	   { text: 'Nach Bienchen absteigend' }
     ],
     // destructiveText: 'Delete',
     titleText: 'Sortieren der Teilnehmer',
     cancelText: 'Cancel',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
     	   switch (index) {
	  	case 0:
		  	$scope.orderByMe('name');
		   	break;
		case 1:
			$scope.orderByMe('-name');
		   	break;
		case 2:
			$scope.orderByMe('bienchen');
			break;
		case 3:
			$scope.orderByMe('-bienchen');
		   break;
		   
	   }

       
		 
		 return true;
     }
   });
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 20000);
};
/*
  // Create our modal
  $ionicModal.fromTemplateUrl('datum-modal.html', function(modal) {
    $scope.datumModal = modal;
  }, {
    scope: $scope
  });


  // Modal-Dialog zur Auswahl des Datum-Filters
  $scope.datumFilter = function() {
    $scope.datumModal.show();
  };
    $scope.closedatumFilter = function() {
    $scope.datumModal.hide();
  }
*/

$scope.asFilterDatum= function() {
	
	// Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Von-Datum eingeben' },
	   { text: 'Bis-Datum eingeben' }
     ],
     // destructiveText: 'Delete',
     titleText: 'Nach Datum filtern',
     cancelText: 'Abbruch',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
     	   switch (index) {
	  	case 0:
		  	$scope.orderByMe('name');
		   	break;
		case 1:
			$scope.orderByMe('-name');
		   	break;
		   
	   }

       
		 
		 return true;
     }
   });
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
     hideSheet();
   }, 20000);
};


 $scope.toggle= function (v) {
        $scope[v] = !$scope[v];
    };
    
 
	// Filter zum Sortieren nach Name oder Bienchen 
	$scope.orderByMe = function(x) {
	        $scope.myOrderBy = x;
	    };
	


	
    
    
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
            datum : now,
            thema : $scope.activeSubject.title
        });
        // Bienchen-Anzahl anpassen
        pupil.bienchen = pupil.bienchen - 1;
        
        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
    
    }
        
    
}])
 
angular.module('app.controllers', ['ionic'])

.controller('kursCtrl', ['$scope', '$stateParams', 'Courses', '$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicModal) {
    $scope.courses =  Courses.all();
      		
	  
	// Create our modal
	$ionicModal.fromTemplateUrl('templates/modal-kurs.html', function(modal)
	{
    	$scope.courseModal = modal;
    }, {
    	scope: $scope
  	});
	
	$scope.changeCourse = function(course) {
		$scope.activeCourse = course;
	    $scope.courseModal.show();
		
	}
	$scope.closeModalCourse = function () {
		$scope.courseModal.hide();
	}
	$scope.closeEditCourse = function(course) {
		$scope.activeCourse.title = course.title;
	    
		$scope.courseModal.hide();	
	}
    
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
    			nc.mittel=0;
    			nc.maxBienchen=0;
    			nc.maxBienchenName='';
    			
    			$scope.courses.push(nc);
    		
    		// Nicht effinzient ...
        Courses.save($scope.courses);
        
        course.title = "";
    		}
    } 
    
    $scope.addCourse = function(kurs) {
        if(kurs && kurs.titel) {
        	kurs.bienchen = 0;
        	kurs.maxBienchen = 0;
        	kurs.maxBienchenName='';
        	
        	
        	createCourse(kurs);
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
    
    $scope.showFinished = true;
    $scope.showFinishedText="Erledigte Themen verbergen";
    
    
	$scope.reorderItems = function(event) {
		alert("Hello");
		
	}
	
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
    			subject.title = "";
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

        // Inefficient, but save all the subjects
        Courses.save($scope.courses);

    };
   
     // Thema auf erledigt setzen oder wieder zurück
    $scope.toogleFinished = function(s) {
    	s.finished = !s.finished;
    	
    	// Inefficient, but save all the subjects
        Courses.save($scope.courses);
        
    };
    $scope.toggleShowFinished = function (v) {
        $scope[v] = !$scope[v];
        if($scope[v]){
        	$scope.showFinishedText="Erledigte Themen verbergen";
        } else {
        	$scope.showFinishedText="Erledigte Themen anzeigen";
        }
    };
    
    /*
      $scope.compiltedFilter(object) {
   		return object.finished === true;
   }
   */

   
}])

   
.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicPopup', '$ionicModal',    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicPopup, $ionicModal) {
	
	 $scope.modalData = { "msg" : "Test!" };
	$scope.showNormal = true;
	 
//	$scope.activeCourse.datumfilter = false;
	
	$scope.myFunction = function() {
    var x = document.getElementById("snackbar")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

	 $scope.toggle= function (v) {
        $scope[v] = !$scope[v];
    };
	
	$scope.setzeDatum = function() {
		$scope.activeCourse.datumfilter = true;
		$scope.activeCourse.vonDatum = new Date(von);
		$scope.activeCourse.bisDatum = new Date(bis);
		$scope.datumModal.hide();
		
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);
		
	}
    $scope.courses =  Courses.all();
    $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];	
    

      // Create our modal
	  $ionicModal.fromTemplateUrl('templates/modal-new-datum-filter.html', function(modal)
	  {
    		$scope.datumModal = modal;
    	}, {
    		scope: $scope
  		});

    
    	
    $scope.newDatumFilter = function() {		
    
    	$scope.datumModal.show();
    }
    $scope.setNewDatumFilter = function(von,bis) {
    	$scope.datumfilter = true;    
    	$scope.datumModal.hide();
    	$scope.vonDatum = von;
    	$scope.activeCourse.vonDatum= von;
    	$scope.activeCourse.bis = bis;
    	
    	$scope.bisDatum = bis;
    	
    //	Inefficient, but save all the subjects
		Courses.save($scope.courses);
    	
    }
    $scope.closeNewDatumFilter = function() {
		$scope.activeCourse.datumfilter = false;
    	$scope.activeCourse.vonDatum = "";
    	$scope.vonDatum="";
    	
    	$scope.activeCourse.bisDatum = "";
    	$scope.bisDatum="";
    	
    	$scope.datumModal.hide();
		
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);
		
    }
	
	
	// Action Sheet "Sortierung"
	$scope.showView = function() {
		
		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
       			{ text: 'Normale Anzeige' },
				{ text: 'Übersicht (keine Klicks)' },
			    { text: 'Detail-Anzeige (keine Klicks)' }
			],
     	// destructiveText: 'Delete',
     	titleText: 'Anzeige',
     	cancelText: 'Abbruch',
     	cancel: function() {
        	  // add cancel code..
        },
     	buttonClicked: function(index) {
     	   	switch (index) {
	  		case 0:
	  			$scope.showNormal = true;
	  			$scope.showUebersicht = false;
	  			$scope.showDetail = false;
			  	break;
			case 1:
				$scope.showNormal = false;
	  			$scope.showUebersicht = true;
	  			$scope.showDetail = false;
			
				break;
			case 2:
				$scope.showNormal = true;
	  			$scope.showUebersicht = false;
	  			$scope.showDetail = true;
			
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
	
	
	
	// old
	
	// Action Sheet "Sortierung"
	$scope.showOrder = function() {
	
		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
       			{ text: 'Nach Name aufsteigend' },
				{ text: 'Nach Name absteigend' },
			    { text: 'Nach Bienchen aufsteigend' },
				{ text: 'Nach Bienchen absteigend' }
     		],
     	// destructiveText: 'Delete',
     	titleText: 'Sortieren der Teilnehmer',
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
	

		// Triggered on a button click, or some other target
	 $scope.editPupil = function(pupil) {
		 pupil.isExistent = true;
		 $scope.pupilModal.show();
	 
	};

	
    // Create our modal
	$ionicModal.fromTemplateUrl('templates/new-pupil.html', function(modal)
	{
    	$scope.pupilModal = modal;
    	}, {
    		scope: $scope
  	});
	
	$scope.closeNewPupil = function() {
		$scope.pupilModal.hide();
	}
	
	 $scope.closeEditPupil = function(pupil) {
    	if(pupil && pupil.name) {
		//	alert("name: " + pupil.name + " isExistent: " + pupil.isExistent);
			if (!pupil.isExistent) {
				createPupil(pupil.name);			
			}
			pupil.name = "";
    	}
    	
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);
		
    	
		$scope.pupilModal.hide();	
    	
    }
    
    // Called to create a new pupil
    $scope.newPupil = function() {
		$scope.pupilModal.show();
        // var pupilName = prompt('Schülername');
        // if(pupilName) {
        //    createPupil(pupilName);
        //}
    };
    $scope.createPupilEx = function(pupil) {
    	
    	createPupil(pupil.name);
    	pupil.name = "";
    	
    }
    
    // Zufallsgenerator
    $scope.zufallGen = function() {
    	
    }
    
    
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
			isExistent : true, // bei false wird pupil geändert, nicht neu angelegt
            teufelchen : []
        });
        
        
        
        // Nicht effinzient ...
        Courses.save($scope.courses);
    };
    
    // Schüler löschen
    $scope.delete = function(pupil) {
        $scope.activeCourse.pupils.splice($scope.activeCourse.pupils.indexOf(pupil), 1);
		$scope.activeCourse.bienchen = $scope.activeCourse.bienchen - pupil.bienchen;
        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
        };
        
    // Berechne max/min/mittel
    $scope.calcMaxMinMittel = function(pupil) {
    
    // Max berechnen
    if ($scope.activeCourse.maxBienchen < pupil.bienchen)
    {
   
    	  $scope.activeCourse.maxBienchen = pupil.bienchen;
    	  $scope.activeCourse.maxBienchenName = pupil.name;
    	  
    	  
    }
    
    
    $scope.activeCourse.mittelBienchen = Math.round($scope.activeCourse.bienchen / $scope.activeCourse.pupils.length);
    
    }
    // Rating hinzufügen
    $scope.addRating = function(pupil) {
        
        var d = new Date();
        var now = d.getTime();	 
        if(!$scope.activeCourse || !pupil) {
            return;
            
        }
        
        // Bienchen des Kurses erhöhen
        if (isNaN($scope.activeCourse.bienchen)) {
        	$scope.activeCourse.bienchen = 0;
        	}
        	
        $scope.activeCourse.bienchen = $scope.activeCourse.bienchen + 1;
        
        // Werte berechnen
        $scope.calcMaxMinMittel(pupil);
        
        
        
        
        // Rating hinzufügen
        pupil.ratings.push({
            datum : now
        });
        // Bienchen-Anzahl anpassen
        pupil.bienchen = pupil.bienchen + 1;
    
    /*
    
        if(isNaN($scope.activeCourse.maxBienchen)) {
        	$scope.activeCourse.maxBienchen=0;
        	}
        if (pupil.bienchen>$scope.activeCourse.maxBienchen) {
        	$scope.activeCourse.maxBienchen = pupil.bienchen;
        	}
        
        	
      */  	
        
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
        // Bienchenanzahl des Kurses reduzieren
        $scope.activeCourse.bienchen = $scope.activeCourse.bienchen - 1;
        
        // min max berechnen
        $scope.calcMaxMinMittel(pupil);
        
        
        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
    
    }

	   		
  $scope.filterMaxBienchen = function(pupil) {
  	var max;
  	if (isNaN(max)) {
  		max = 0;
  	}
  	
  	if (pupil.bienchen>max) {
  		max = pupil.bienchen;
  		return true;
  	} else {
  		return false
  	}
  	return true;
  };
        
   $scope.reorder = function(pupil, fromIndex, toIndex) {
        // löschen
        $scope.activeCourse.pupils.splice(fromIndex, 1);
        $scope.activeCourse.pupils.splice(toIndex, 0, pupil);

        // Inefficient, but save all the subjects
        Courses.save($scope.courses);

    };
    
}])
 
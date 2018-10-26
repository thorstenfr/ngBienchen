angular.module('app.controllers', ['ionic'])

.controller('kursCtrl', ['$scope', '$stateParams', 'Courses','$ionicModal',  '$timeout', '$ionicPopup', '$ionicActionSheet',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicModal,  $timeout, $ionicPopup, $ionicActionSheet, ) {
    $scope.courses =  Courses.all();
	var mytoggle = true;
	
	// A confirm dialog
   $scope.showConfirm = function(course) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Kurs ' + course.title + ' hat Schüler',
       template: 'Sind Sie sicher, dass Sie den Kurs löschen wollen?'
     });
     confirmPopup.then(function(res) {
       if(res) {	         
			$scope.courses.splice($scope.courses.indexOf(course), 1);
			// Nicht effinzient ...
			Courses.save($scope.courses);
       } else {
         console.log('You are not sure');
		 
       }
     });
   };

   
	
	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Erfassen Ihren ersten Kurs!',
	     template: 'Sie können später über "+ Neu" weitere hinzufügen.'
	   });
	
	   alertPopup.then(function(res) {
	     console.log('Thank you for not eating my delicious ice cream cone');
	   });
	};


	// 
	// Noch keine Kurse
	//
	if($scope.courses.length == 0) {
		// An alert dialog
		$scope.showAlert();
		$scope.noCourses=true;
	} else {
		$scope.noCourses=false;
	}
	
	
	
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
		console.log("Erzeuge Kurs " + course.title);
    	if (course.title) {
    			var nc = Courses.newCourse(course.title);
    			nc.mittel=0;
    			nc.maxBienchen=0;
    			nc.maxBienchenName='';
        	  nc.vonDatum='';
          	nc.bisDatum='';
          	nc.datumfilter=false;

			$scope.courses.push(nc);
		console.log("selectCourse");

        $scope.selectCourse(nc, $scope.courses.length-1);

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
    	console.log("selectCourse " + index);
        $scope.activeCourse = course;
        Courses.setLastActiveIndex(index);
        Courses.save($scope.courses);

    };

    // Kurs löschen
    $scope.deleteCourse = function(course) {

        // Sicherheitsabfrage, falls Schüler vorhanden sind
        if($scope.courses[$scope.courses.indexOf(course)].pupils.length !== 0) {
			$scope.showConfirm(course);
        }
        else {
            $scope.courses.splice($scope.courses.indexOf(course), 1);
            // Inefficient, but save all the subjects
            Courses.save($scope.courses);

        }
	};

    $scope.toggle= function (v) {
		console.log("toggle in kursCtrl: " + v);
        $scope[v] = !$scope[v];
		console.log("dann: (" + $scope[v] + ")");
    };

    // Kurse anordnen
    $scope.reorder = function(course, fromIndex, toIndex) {
		
		$scope.courses.splice(fromIndex, 1);
        $scope.courses.splice(toIndex, 0, course);
        
        // Nicht effinzient ...
        Courses.save($scope.courses);

    }
	
	// Triggered on a button click, or some other target
		 $scope.showPopup = function() {
		   $scope.data = {}
		
		   // An elaborate, custom popup
		   var myPopup = $ionicPopup.show({
		     template: '<input type="text" ng-model="data.neuerKurs">',
		     title: 'Neuer Kurs',
		     subTitle: 'z.B. Kursbezeichnung oder Klassenname',
		     scope: $scope,
		     buttons: [
		       { text: 'Abbruch' },
		       {
		         text: '<b>Speichern</b>',
		         type: 'button-positive',
		         onTap: function(e) {
					 /*
		            if (!$scope.data.wifi) {
		             //don't allow the user to close unless he enters wifi password
					 } else {
		             return $scope.data.wifi;
		           }
				   */
				   
				  createCourseEx($scope.data.neuerKurs);
				   
					 
				   
		         }
		       },
		     ]
		   });
		   myPopup.then(function(res) {
		     console.log('Tapped!', res);
		   });
		   $timeout(function() {
		      myPopup.close(); //close the popup after 3 seconds for some reason
		   }, 30000);
	   };
	   
	   
	   // Filter zum Sortieren nach Name oder Bienchen
	$scope.orderByMe = function(x) {
	        $scope.myOrderBy = x;
	    };
		
		// Action Sheet "Sortierung"
			$scope.showOrder = function() {
				
				// Show the action sheet
		   		var hideSheet = $ionicActionSheet.show({
		     		buttons: [
		       			{ text: 'Nach Name' }
									
		     		],
		     	// destructiveText: 'Delete',
		     	titleText: 'Sortieren der Kurse',
		     	cancelText: 'Abbruch',
		     	cancel: function() {
		        	  // add cancel code..
		        },
		     	buttonClicked: function(index) {
		     	   	switch (index) {
			  		case 0:
						mytoggle=!mytoggle;
						if (mytoggle) {
							console.log("if mytoggle true");
							$scope.orderByMe('title');
						}
						else {
							console.log("if mytoggle false");
							$scope.orderByMe('-title')
						}				
				  		break;
						
					case 1:
						mytoggle	=!mytoggle;
						if (mytoggle) {
							$scope.orderByMe('bienchen');
						}
						else {
							$scope.orderByMe('-bienchen')
						}	
						
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


}])



.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicPopup', '$ionicModal',    // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicPopup, $ionicModal) {

 $scope.modalData = { "msg" : "Test!" };
	$scope.showNormal = true;
	var mytoggle=true;

	

	$scope.myFunction = function() {
	    var x = document.getElementById("snackbar")
	    x.className = "show";
	    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
	};

	

	$scope.changePupil = function(pupil) {
		$scope.activeCourse.activePupil = pupil;
	    $scope.pupilModal.show();

	}

	$scope.setzeDatum = function() {
		$scope.activeCourse.datumfilter = true;
		$scope.activeCourse.vonDatum = new Date(von);
		$scope.activeCourse.bisDatum = new Date(bis);
		$scope.datumModal.hide();
    console.log("Setze Datum!");

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
	
	
		
		// Try to create the first project, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  /*
  $timeout(function() {
    if($scope.activeCourse.pupils.length == 0) {
      while(true) {
        var projectTitle = prompt('Your first project title:');
        if(projectTitle) {
          createPupil(projectTitle);
          break;
        }
      }
    }
  }, 1000);
*/


	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Erfassen Sie die Teilnehmer!',
	     template: 'Sie können später über "+ Neu" weitere Teilnehmer hinzufügen.'
	   });
	
	   alertPopup.then(function(res) {
	     console.log('Thank you for not eating my delicious ice cream cone');
	   });
	};


	// 
	// Noch keine Schüler
	//
	if($scope.activeCourse.pupils.length == 0) {
		// An alert dialog
		$scope.showAlert();
		$scope.nopupils=true;
	} else {
		$scope.nopupils=false;
	}
	
	

	
	

    function daysInMonth (month, year) {
      return new Date(year, month, 0).getDate();
    }
    $scope.setNewDatumFilter = function(von,bis,set_monat) {
    	$scope.datumfilter = true;
    	$scope.activeCourse.datumfilter=true;

      if (set_monat)
      {
        var heute = new Date(); // aktuelles Datum und aktuelle Zeit
        //var monat = heute.getMonth();
        var monat = ("0" + (heute.getMonth() + 1)).slice(-2)
        var jahr = heute.getFullYear();
        var monat_von = jahr + "-" + monat + "-01";
        var monat_bis = jahr + "-" + monat + "-" + daysInMonth(monat,jahr);
        var d = new Date(monat_von);
        var e = new Date(monat_bis);

        $scope.vonDatum = d;
        $scope.bisDatum = e;
      	$scope.activeCourse.vonDatum= $scope.vonDatum;
      	$scope.activeCourse.bisDatum = $scope.bisDatum;
        $scope.activeCourse.datumfilter=true;


      }
      else {
      	$scope.vonDatum=von;
      	$scope.bisDatum=bis;
      }
    	$scope.datumModal.hide();


    //	Inefficient, but save all the subjects'
		Courses.save($scope.courses);

    }
    $scope.closeNewDatumFilter = function() {

      $scope.datumfilter = false;
      $scope.activeCourse.datumfilter=false;
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
          { text: 'Normal' },
				  { text: 'Übersicht' },
			    { text: 'Details' }
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
				$scope.showNormal = false;
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



	

	// Action Sheet "Sortierung"
	$scope.showOrder = function() {

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
       			{ text: 'Nach Name' },
				{ text: 'Nach Bienchen' }				
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
				mytoggle=!mytoggle;
				if (mytoggle) {
					$scope.orderByMe('name');
				}
				else {
					$scope.orderByMe('-name')
				}				
		  		break;
				
			case 1:
				mytoggle	=!mytoggle;
				if (mytoggle) {
					$scope.orderByMe('bienchen');
				}
				else {
					$scope.orderByMe('-bienchen')
				}	
				
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
	$ionicModal.fromTemplateUrl('templates/modal-pupil.html', function(modal)
	{
    	$scope.pupilModal = modal;
    	}, {
    		scope: $scope
  	});

	$scope.closeNewPupil = function() {
		$scope.pupilModal.hide();
	}

	$scope.closeEditPupil = function(pupil) {
		$scope.activeCourse.activePupil.name = pupil.name;

		$scope.pupilModal.hide();

    // Inefficient, but save all the subjects
    Courses.save($scope.courses);
	}

    // Called to create a new pupil
    $scope.newPupil = function() {
		$scope.pupilModal.show();
        // var pupilName = prompt('Schülername');
        // if(pupilName) {
        //   createPupil(pupilName);
       //  }
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
		console.log("Neuer Schüler: " + pupilName);
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

		// Rating hinzufügen
        pupil.ratings.push({
            datum : now
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
        // Bienchenanzahl des Kurses reduzieren
        $scope.activeCourse.bienchen = $scope.activeCourse.bienchen - 1;


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


    	// Nicht effinzient ...
        Courses.save($scope.courses);

		

    };
	
	 // Triggered on a button click, or some other target
		 $scope.showPopup = function() {
		   $scope.data = {}
		
		   // An elaborate, custom popup
		   var myPopup = $ionicPopup.show({
		     template: '<input type="text" ng-model="data.neuerschueler">',
		     title: 'Neuer Schüler',
		     subTitle: 'z.B. Vor- und Zuname oder Nick',
		     scope: $scope,
		     buttons: [
		       { text: 'Abbruch' },
		       {
		         text: '<b>Speichern</b>',
		         type: 'button-dark',
		         onTap: function(e) {
					 /*
		            if (!$scope.data.wifi) {
		             //don't allow the user to close unless he enters wifi password
					 } else {
		             return $scope.data.wifi;
		           }
				   */
				   
				  
				    createPupil($scope.data.neuerschueler);
					 
				   
		         }
		       },
		     ]
		   });
		   myPopup.then(function(res) {
		     console.log('Tapped!', res);
		   });
		   $timeout(function() {
		      myPopup.close(); //close the popup after 3 seconds for some reason
		   }, 30000);
		};
		
		 $scope.toggle = function (v) {
		 console.log("toogle in teilnehmerCtrl: " + v);
        $scope[v] = !$scope[v];
    };

}])

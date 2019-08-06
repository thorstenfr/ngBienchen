angular.module('app.controllers', ['ionic'])

.controller('kursCtrl', ['$scope', '$stateParams', 'Courses', '$ionicModal',  '$timeout', '$ionicPopup', '$ionicActionSheet','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicModal,  $timeout, $ionicPopup, $ionicActionSheet,$state) {
	
	$scope.courses =  Courses.all();
	$scope.firstRun = Courses.getFirstRun();
	$scope.consts = Courses.getVariables();
	$scope.azEinheit = Courses.getAzEinheit();
	console.log("azEinheit: " + $scope.azEinheit);
	if ($scope.consts.appname=='soteam') {
		$scope.soteam=true;
	}
	else {
		$scope.soteam=false;
	}
	
	

	calcRatings = function() {
		var heute = 0;
		var woche = 0;
		var monat = 0;
		var jahr = 0;

		// Iteriere durch Struktur.
		angular.forEach($scope.courses,function(value,key){
			angular.forEach(value,function(v1,k1){			
					if (k1=="pupils") {						
						angular.forEach(v1,function(v2,k2){
							angular.forEach(v2, function(v3,k3) {
								if (k3=="ratings") {
										angular.forEach(v3, function(v4,k4) {
												angular.forEach(v4, function(v5,k5) {
													// Ratings von heute
													var d = new Date(v5);
													var now = new Date();
													console.log(d + ":" + now);
													if ((d.getDate()==now.getDate()) && (d.getMonth()==now.getMonth()) && (d.getFullYear()==now.getFullYear())) {
													console.log(d.getDate() + " : " + now.getDate());
														heute = heute + 1;
													}													
													if ((d.getMonth()==now.getMonth()) && (d.getFullYear()==now.getFullYear())) {
														monat = monat + 1;
														if ((now.getDate()-now.getDay())<(d.getDate())) {
															woche = woche + 1;
														}
													}
													if ((d.getFullYear()==now.getFullYear())) {
														jahr = jahr + 1;
													}
																																	
											});
										});
									}
							});							
					});
				}					
			});	
		});

	$scope.ratingsHeute = heute;
	$scope.ratingsWoche = woche;
	$scope.ratingsMonat = monat;
	$scope.ratingsJahr = jahr;
	}
	
	// Aktuelles Datum
	var d = new Date();
	
	
	$scope.$on("$ionicView.afterEnter", function(){
		// Anything you can think of
		console.log("Enter");
	});

	$scope.$on("$ionicView.loaded", function(event, data){
	   		// handle event
				 	console.log("loaded");
				 
				 
			   // Prüfen, ob es Zeit für einen Kaffee wäre
			var nr = Courses.getTotalNumberOfRatings();
			if (nr>300) 
			{
				//alert("Sie scheinen Bienchen häufiger zu Verwenden!");
				$scope.buyPro();
			}
	});	
	$scope.$on('$ionicView.beforeEnter', function(){
		calcRatings();
	});
	


		
	if($scope.firstRun=='0') {
	   	Courses.setFirstRun(d);
		
	}
	
	// Setze Datum
	Courses.setLastRun(d);
	
	
	var mytoggle = true;
	
	var delCourse = function(course) {
	        $scope.courses.splice($scope.courses.indexOf(course), 1);
            
			// Inefficient, but save all the subjects
            Courses.save($scope.courses);
            
            // Prüfe, ob kein Kurs da
            firstCourse();
            
	}
	

	// A confirm dialog
   $scope.showConfirm = function(course) {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Kurs ' + course.title + ' hat Schüler',
       template: 'Sind Sie sicher, dass Sie den Kurs löschen wollen?'
     });
     confirmPopup.then(function(res) {
       if(res) {	         
			delCourse(course);
			
       } else {
         console.log('You are not sure');
		 
       }
     });
   };

   
	

	$scope.showHowto = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: $scope.consts.detailViewTitle,
	     template: $scope.consts.detailViewText
	   });
	
	   alertPopup.then(function(res) {
	     console.log('Thank you for not eating my delicious ice cream cone');
	   });
	};



	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: $scope.consts.welcome,
	     template: $scope.consts.welcomeText
	   });
	
	   alertPopup.then(function(res) {
	     console.log('Thank you for not eating my delicious ice cream cone');
	      $scope.showHowto();
	   });
	};

	$scope.buyPro = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Update to Pro-Version!',
	     template: 'Schön, dass Sie <b>Bienchen</b> nutzen. Kaufen Sie die Pro-Version, um diese Meldung nicht mehr zu sehen und um zusätzliche Funktionen freizuschalten!'
	   });
	
	   alertPopup.then(function(res) {
	     console.log('Thank you for not buying my bienchen app');
		 newStart=false;
	      
	   });
   };

   
	
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

		
		// Called to select the given course
	$scope.selectCourse = function(course, index) {
		console.log("selectCourse " + index);
			$scope.activeCourse = course;
			Courses.setLastActiveIndex(index);
			Courses.save($scope.courses);

	};
		

    $scope.createCourse = function(title) {
			console.log("Erzeuge Kurs " + title);
    	if (title) {
    			var nc = Courses.newCourse(title);
    			$scope.courses.push(nc);
					console.log("selectCourse");

        	$scope.selectCourse(nc, $scope.courses.length-1);

    			// Nicht effinzient ...
        	Courses.save($scope.courses);
        	
   		}
    }
	
		var firstCourse = function() {
			// 
			// Noch keine Kurse, bei soteam Kurs automatisch anlegen
			//
			if($scope.courses.length == 0) {
				if ($scope.consts.appname=="soteam-dochnicht") {
					console.log("soteam und keine Kurse");
					// soteam wird ein Kurs angelegt
					$scope.createCourse($scope.consts.courseName);
				} 
				else {
					$scope.showAlert();
					$scope.noCourses=true;
				}		
			} else {
				$scope.noCourses=false;
			}
		}

	// Prüfe, ob erster Kurs
	firstCourse();
	
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
    
	// Utility function: checks if no courses and
	// show help
     

	

    // Kurs löschen
    $scope.deleteCourse = function(course) {

        // Sicherheitsabfrage, falls Schüler vorhanden sind
        if($scope.courses[$scope.courses.indexOf(course)].pupils.length !== 0) {
			$scope.showConfirm(course);
        }
        else {
			// Lösche Kurs
			delCourse(course);
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
		 $scope.showAddCourse = function() {
		   $scope.data = {}
		
		   // An elaborate, custom popup
		   var myPopup = $ionicPopup.show({
		     template: '<input type="text" ng-model="data.neuerKurs">',
		     title: $scope.consts.popupTitle,
		     subTitle: $scope.consts.subTitle,
		     scope: $scope,
		     buttons: [
		       { text: 'Abbruch' },
		       {
		         text: '<b>Speichern</b>',
		         type: 'button-positive',
		         onTap: function(e) {
				   
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
				
				$scope.showReorder=false;
			
				// Show the action sheet
		   		var hideSheet = $ionicActionSheet.show({
		     		buttons: [
		       			{ text: 'Nach Name' }
									
		     		],
		     	// destructiveText: 'Delete',
		     	titleText: $scope.consts.sortierenDerKurse,
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
		
		$scope.showReor = function() {
			$scope.orderByMe('');			
			$scope.toggle('showReorder');
		};
		
		// Action Sheet "Mehr"
	$scope.showMore = function() {

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
          		{ text: '<div class="icon ion-happy-outline"></div>Pro-Version kaufen' },
				{ text: '<div class="icon ion-pie-graph"></div>Liste per Email schicken (Pro)' },
			    { text: '<div class="icon ion-help"></div> Tutorial'}
			],
	     	// destructiveText: 'Delete',
	     	titleText: 'Mehr',
	     	cancelText: 'Abbruch',
	     	cancel: function() {
	        	  // add cancel code..
	        },
	     	buttonClicked: function(index) {
	     	   	switch (index) {
		  		case 0:
					console.log("Pro-Version kaufen");
				  	break;
				case 1:
					console.log("CSV-Export");
					$state.go('csv');
					
					break;
				case 2:
					$state.go('tour');
	
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



.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicPopup', '$ionicModal', '$state',   // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicPopup, $ionicModal, $state, uiFieldState) {


	$scope.courses =  Courses.all();
	$scope.consts = Courses.getVariables();

  $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];
	$scope.totalNumberOfRatings = Courses.getTotalNumberOfRatings();
	

 $scope.modalData = { "msg" : "Test!" };
	$scope.showNormal = true;
	var mytoggle=true;
	
	
	/*
		Buchungsdatum für Bienchen auf heutiges Datum setzen
	*/
	  $scope.buchungsDatum = {
         datum: new Date()
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
	
	

	$scope.showDone = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Gratulation!',
	     template: $scope.consts.showDoneTemplate
	   });
	
	   alertPopup.then(function(res) {
	   	
	     console.log('Thank you for not eating my delicious ice cream cone');
	   });
	};


	$scope.showHowto = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: $scope.consts.bienchenErfassen,
	     template: $scope.consts.bienchenErfassenTemplate
	   });
	
	   alertPopup.then(function(res) {
	     console.log('Thank you for not eating my delicious ice cream cone');
	   });
	};



	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: $scope.consts.erfassenSieTeilnehmer,
	     template: $scope.consts.erfassenSieTeilnehmerTemplate
	   });
	
	   alertPopup.then(function(res) {
	   $scope.showHowto();
	     console.log('Thank you for not eating my delicious ice cream cone');
	     // $scope.showHowto();
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
	
	function addDays(date, days, add) {
	  var result = new Date(date);
	  if (add) {
		  result.setDate(result.getDate() + days);
	  }
	  else {
		result.setDate(result.getDate() - days);  
	  }
	  
	  console.log("1: " + date + " 2: " + result);
	  return result;
	}
	
	
	

	
	

    function daysInMonth (month, year) {
      return new Date(year, month, 0).getDate();
    }
    $scope.setNewDatumFilter = function(von,bis,set_monat) {
    	$scope.datumfilter = true;
    	console.log("dat_wahl : " +$scope.activeCourse.dat_wahl);
		console.log("von : " +von);
		
		var heute = new Date(); // aktuelles Datum und aktuelle Zeit	
		
		switch($scope.activeCourse.dat_wahl) {
			case 'Monat':
				var monat = ("0" + (heute.getMonth() + 1)).slice(-2)
		        var jahr = heute.getFullYear();
		        var von = jahr + "-" + monat + "-01";
		        var bis = jahr + "-" + monat + "-" + daysInMonth(monat,jahr);
		        var d = new Date(von);
		        var e = new Date(bis);
		
		        
				break;
			case 'Woche':
				var d = addDays(heute, heute.getDay(), false);
				var e = addDays(d, 7, true);
				
				break;
			case 'Tag':
				var d = new Date();
				var e = new Date();
								
				break;
			case 'Datum':
				var d = new Date(von);
				var e = new Date(bis);
				
				
				
		}
		// Von auf 0.00 Uhr setzen
		d.setHours(0);
		d.setMinutes(1);
		
		// Bis auf 23:59 Uhr setzen
		e.setHours(23);
		e.setMinutes(59);		
		
		
	    $scope.activeCourse.vonDatum = new Date(d);
	    $scope.activeCourse.bisDatum = new Date(e);
		
		console.log("vonDatum : " + $scope.activeCourse.vonDatum);
	    $scope.activeCourse.datumfilter=true;
		
    	$scope.datumModal.hide();


    //	Inefficient, but save all the subjects'
		Courses.save($scope.courses);

    }
    $scope.closeNewDatumFilter = function() {

      $scope.datumfilter = false;
      $scope.activeCourse.vonDatum = "";
    	$scope.vonDatum="";
      $scope.activeCourse.bisDatum = "";
    	$scope.bisDatum="";
      $scope.datumModal.hide();

      // Inefficient, but save all the subjects
		  Courses.save($scope.courses);

    }
	
	
	// Action Sheet "Mehr"
	$scope.showMore = function() {

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
          		{ text: '<div class="icon ion-happy-outline"></div>Pro-Version kaufen' },
				{ text: '<div class="icon ion-pie-graph"></div>Liste per Email schicken (Pro)' },
					{ text: '<div class="icon ion-help"></div> Tutorial'},
					{ text: '<div class="icon ion-calendar"></div> Buchungsdatum setzen'}
			],
	     	// destructiveText: 'Delete',
	     	titleText: 'Mehr',
	     	cancelText: 'Abbruch',
	     	cancel: function() {
	        	  // add cancel code..
	        },
	     	buttonClicked: function(index) {
	     	   	switch (index) {
										
		  		case 0:
					console.log("Pro-Version kaufen");
				  	break;
				case 1:
					console.log("CSV-Export");
					break;
				case 2:
					$state.go('tour');	
					break;
				case 3:
					mytoggle=!mytoggle;
					if (mytoggle) {
						$scope.showBuchungsdatum=false;
					}
					else {
						$scope.showBuchungsdatum=true;
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
		$scope.showReorder=false;
		

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
       			{ text: 'Nach Name' },
				{ text: $scope.consts.nachBienchen }				
     		],
     	// destructiveText: 'Delete',
     	titleText: $scope.consts.sortierenDerTeilnehmer,
     	cancelText: 'Abbruch',
     	cancel: function() {
        	  // add cancel code..
        	  $scope.orderByMe('');
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
    
    if ($scope.nopupils && $scope.first) {
    		
    		$scope.showHowto();
    }
	
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
			erledigt : false, // bei soteam werden nur nicht erledigte angezeigt
            teufelchen : []
        });



        // Nicht effinzient ...
        Courses.save($scope.courses);
    };


		 // Kurs löschen
		 $scope.deleteItem = function(item) {

			// Sicherheitsabfrage, falls Item ratings hat		
			if($scope.activeCourse.pupils[$scope.activeCourse.pupils.indexOf(item)].ratings.length !== 0) {
					$scope.showPupilDeleteConfirm(item);
			}
			else {
		// Lösche item
		delPupil(item);
			}
};

    

// A confirm dialog
$scope.showPupilDeleteConfirm = function(pupil) {
	var confirmPopup = $ionicPopup.confirm({
		title: $scope.consts.schueler + ' ' + pupil.name + ' ' + $scope.consts.hatBewertungen,
		template: 'Sind Sie sicher, dass Sie ' + $scope.consts.denSchueler
	});
	confirmPopup.then(function(res) {
		if(res) {	         
	 delPupil(pupil);
	 
		} else {
			console.log('You are not sure');
	
		}
	});
};

// Schüler löschen
delPupil = function(pupil) {			
	$scope.activeCourse.pupils.splice($scope.activeCourse.pupils.indexOf(pupil), 1);
$scope.activeCourse.bienchen = $scope.activeCourse.bienchen - pupil.bienchen;
	// Inefficient, but save all the subjects
	Courses.save($scope.courses);
	};





    // Rating hinzufügen
    $scope.addRating = function(pupil) {

        // var d = new Date();
		
		console.log("buc_datum: " + $scope.buchungsDatum.datum);
		
		var d = $scope.buchungsDatum.datum;
        var now = d.getTime();
		var n = d.toLocaleString();
		console.log("d: " + d);
		console.log("now: " + now);
		
        if(!$scope.activeCourse || !pupil) {
            return;

        }
        
        // Ratings komplett erhöhen
        if ($scope.totalNumberOfRatings == 0) {
			$scope.showDone();
		}
        console.log("Bienchen insgesamt: " + $scope.totalNumberOfRatings);
        $scope.totalNumberOfRatings = $scope.totalNumberOfRatings + 1;
        

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
		Courses.setTotalNumberOfRatings($scope.totalNumberOfRatings);

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

		
		 // Ratings komplett erhöhen
        if ($scope.totalNumberOfRatings == 0) {
			$scope.showDone();
		}
      
        $scope.totalNumberOfRatings = $scope.totalNumberOfRatings + 1;
		

        // Inefficient, but save all the subjects
        Courses.save($scope.courses);
		Courses.setTotalNumberOfRatings($scope.totalNumberOfRatings);

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
		     title: $scope.consts.neuerSchuelerTitle,		     
		     subTitle: $scope.consts.neuerSchuelerSubtitle,
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
		      myPopup.close(); //close the popup after 10 seconds for some reason
		   }, 100000);
		};
		
		 $scope.toggle = function (v) {
		 console.log("toogle in teilnehmerCtrl: " + v);
        $scope[v] = !$scope[v];
    };
	
	$scope.showReor = function() {
		$scope.orderByMe('');
		
		$scope.toggle('showReorder');
	};
	$scope.toggleTaskErledigt = function(pupil) {
		if (pupil.erledigt==false)	{
			pupil.erledigt=true;
		}
		else {
			pupil.erledigt=false;
		}
		
		    	// Nicht effinzient ...
        Courses.save($scope.courses);

	}

}])

.controller('csvCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicPopup', '$ionicModal', '$state',   // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
	// You can include any angular dependencies as parameters for this function
	// TIP: Access Route Parameters for your page via $stateParams.parameterName
	function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicPopup, $ionicModal, $state) {
	
	// Kurse in scope laden
	$scope.courses =  Courses.all();
	
	const rows = [
		["name1", "city1", "some other info"],
		["name2", "city2", "more info"]
	];

	let csvContent = "data:text/csv;charset=utf-8," 
		+ rows.map(e => e.join(",")).join("\n");
	
	var encodedUri = encodeURI(csvContent);
	window.open(encodedUri);
	
    

}])

.controller('tourCtrl', function($scope){
	 $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	  // data.slider is the instance of Swiper
	  $scope.slider = data.slider;
	});
	
	$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
	  console.log('Slide change is beginning');
	});
	
	$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
	  // note: the indexes are 0-based
	  $scope.activeIndex = data.slider.activeIndex;
	  $scope.previousIndex = data.slider.previousIndex;
	});
})

.controller("ModalController", function($scope){
	$scope.showAlert = function(){ alert("I'm a modal window!") }
})


.controller('configCtrl', function($scope){
	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	 // data.slider is the instance of Swiper
	 $scope.slider = data.slider;
 });
 
 $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
	 console.log('Slide change is beginning');
 });
 


 $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
	 // note: the indexes are 0-based
	 $scope.activeIndex = data.slider.activeIndex;
	 $scope.previousIndex = data.slider.previousIndex;
 });
});
angular.module('app.controllers', ['ionic'])

.controller('kursCtrl', ['$scope', '$stateParams', 'Courses', '$ionicModal',  '$timeout', '$ionicPopup', '$ionicPopover', '$ionicActionSheet','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicModal,  $timeout, $ionicPopup, $ionicPopover, $ionicActionSheet,$state) {
	
	$scope.courses =  Courses.all();
	$scope.config = Courses.loadConfig();

	// Prüfe, ob erste Konfiguration, falls, setze neue Konfiguration
	if ($scope.config.length==0) {
		$scope.config = Courses.newConfig();
	}
		
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
	calcPupils = function() {
		console.log("calcPupils-->");
		var schueler = 0;
		var ratings=0;
		var kurse = $scope.courses;
		$scope.courses.forEach(function(course) {
			schueler = schueler + course.pupils.length;
				
			// Kursbienchen deklarieren und intitialisieren
			$scope.courses[$scope.courses.indexOf(course)].bienchen = 0;

			// Iterate durch Ratings
			course.pupils.forEach(function(pupil) {
				
				// Kurs-Ratings, Bienchen und Teufelchen 
				$scope.courses[$scope.courses.indexOf(course)].bienchen = $scope.courses[$scope.courses.indexOf(course)].wertungen + pupil.ratings.length + pupil.teufelchen.length;
				// Kursbienchen erhöhen
				$scope.courses[$scope.courses.indexOf(course)].bienchen = $scope.courses[$scope.courses.indexOf(course)].bienchen + pupil.ratings.length - pupil.teufelchen.length;
					ratings=ratings+pupil.ratings.length;
					ratings=ratings+pupil.teufelchen.length;
					/* Setze Bienchen für den aktuellen Schüler */
					$scope.courses[$scope.courses.indexOf(course)].pupils[$scope.courses[$scope.courses.indexOf(course)].pupils.indexOf(pupil)].bienchen = pupil.ratings.length - pupil.teufelchen.length;
					});
			});
		$scope.ratingsgesamt=ratings;
		$scope.schuelergesamt = schueler;
		console.log("<-- calcPupils");
	}
	
	calcRatings = function() {	

		console.log("calcRatings-->");

		var heute = 0;
		var woche = 0;
		var monat = 0;
		var jahr = 0;
		var newest = new Date(0);
		var oldest = new Date();


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
													
													if (d.getTime() > newest.getTime()) {																				
														newest = d;
													}
													if (d.getTime() < oldest.getTime()  ) {												
														oldest = d;
													}
													if ((d.getDate()==now.getDate()) && (d.getMonth()==now.getMonth()) && (d.getFullYear()==now.getFullYear())) {
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
	$scope.newest = newest;
	$scope.oldest = oldest;


	console.log("<-- calcRatings");
	
	}
	
	// Aktuelles Datum
	var d = new Date();
	
	
	$scope.$on("$ionicView.afterEnter", function(){
		// Anything you can think of
	});

	$scope.$on("$ionicView.loaded", function(event, data){
	   		// handle event
			console.log("loaded");

			// Inefficient, but save all the subjects
            Courses.save($scope.courses);
				 
			// Schüler berechnen
			calcPupils();

			/* Wertungen für Tag, Monat Jahr werden nur berechnet, wenn Gesamtauswertung 
			* oder Tagesauswertung aktiviert sind
			* calcRating() muss auch aufgerufen werden, wenn showUebersicht oder 
			* showTagesübersicht aktiviert wird.
			*/ 
			if ($scope.config.showViewDetail) {
				console.log("$scope.config.showViewDetail");
				calcRatings();

			}
			
			// Prüfen, ob es Zeit für einen Kaffee wäre
			var nr = Courses.getTotalNumberOfRatings();
			if (nr>300) 
			{
				//alert("Sie scheinen Bienchen häufiger zu Verwenden!");
				$scope.buyPro();
			}
	});	
		
	if($scope.firstRun=='0') {
	   	Courses.setFirstRun(d);
		
	}
	
	// Setze Datum
	Courses.setLastRun(d);
	
	
	var mytoggle = true;
	
	var delCourse = function(course) {
		console.log("delCourse");
	        $scope.courses.splice($scope.courses.indexOf(course), 1);
			
			/* Berechne Ratings und Pupils nach dem Löschen, da sich die 
			 * Anzahl hat eventuell verändert hat */ 
			calcPupils();
			calcRatings();  

			// Inefficient, but save all the subjects
            Courses.save($scope.courses);
            
            // Prüfe, ob kein Kurs da
            firstCourse();
            
	}
	

		// An alert dialog
		showAlert = function(text) {
			var alertPopup = $ionicPopup.alert({
			  title: 'Löschen',
			  template: text
			});
		 
			alertPopup.then(function(res) {		
			  $state.go('kurs');
			});
		  };


/* Anfang Confirm-Dialog */
 // Triggered on a button click, or some other target
 $scope.showConfirmDeleteCourse = function(course) {


	$scope.data = {}
	var delkey = course.title;
	
 
	// An elaborate, custom popup
	var myPopup = $ionicPopup.show({
	  template: '<input type="text" ng-model="data.wifi">',
	  title: 'Kurs löschen',
	  subTitle: '<b>Achtung</b>: Kurs unwideruflich löschen, dieser Schritt kann nicht rückgängig gemacht werden. <br><br>Schreiben Sie: <b>' + delkey + ' </b>wenn Sie sicher sind, dass Sie die Daten löschen wollen!</b>',
	  scope: $scope,
	  buttons: [
		{ text: 'Abbruch' },
		{
		  text: '<b>Löschen</b>',
		  type: 'button-assertive',
		  onTap: function(e) {
			if (!$scope.data.wifi) {
			  //don't allow the user to close unless he enters wifi password
			  e.preventDefault();
			} else {
			  return $scope.data.wifi;
			}
		  }
		},
	  ]
	});
	myPopup.then(function(res) {
	  console.log('Tapped!', res);
	  if(res) {
		try {		
			if (res==delkey) {
				delCourse(course);	
				Courses.save($scope.courses);
				showAlert('Kurs ' + course.title + " gelöscht.");
			}	
			else {
				showAlert("Sie haben <b>" + res + "</b> geschrieben und nicht <b>" + delkey + "</b><br> Kurs " + delkey+ " wird <b>nicht</b> gelöscht.");
			}
			
		} catch (e) {
			alert(e);				
		}
	
	} else {
		console.log('You are not sure');
	}
	});
	$timeout(function() {
	   myPopup.close(); //close the popup after 3 seconds for some reason
	}, 50000);
   };
  
/* Ende Confirm-Dialog */



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

   // Info-Dialog für Bienchen - Version
 // An alert dialog
 $scope.showAlertVersion = function() {
	var alertPopup = $ionicPopup.alert({
	  title: 'Über Bienchen App!',
	  templateUrl: 'templates/version.txt'
	});
	alertPopup.then(function(res) {
	  console.log('Thank you for not eating my delicious ice cream cone');
	});
  };

   
	

	$scope.showHowto = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: $scope.consts.detailViewTitle,
	     template: $scope.consts.detailViewText
	   });
	
	   alertPopup.then(function(res) {
	    
	   });
	};


	

	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: $scope.consts.welcome,
	     template: $scope.consts.welcomeText
	   });
	
	   alertPopup.then(function(res) {
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
		

    $scope.createCourse = function(course) {
			console.log("Erzeuge Kurs " + course.title);
    	if (course.title) {
    			var nc = Courses.newCourse(course.title);
    			$scope.courses.push(nc);
					console.log("selectCourse");

        	$scope.selectCourse(nc, $scope.courses.length-1);

    			// Nicht effinzient ...
        	Courses.save($scope.courses);
        	course.title='';
        	
   		}
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
					// $scope.showAlert();
					$scope.showAddCourse();
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
			console.log("Neuer Kurs: " + courseTitle);

			// Kommasepariert mehrere Kurse 			
			var str_array = courseTitle.split(',');
			
			for(var i = 0; i < str_array.length; i++) {
			   // Trim the excess whitespace.
			   str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
			   // Add additional code here, such as:
			   
			   var newCourse = Courses.newCourse(str_array[i]);
				$scope.courses.push(newCourse);
				$scope.selectCourse(newCourse, $scope.courses.length-1);
			   
			   
			}
			
			Courses.save($scope.courses);
	};
    
	// Utility function: checks if no courses and
	// show help
     

	

    // Kurs löschen
    $scope.deleteCourse = function(course) {

        // Sicherheitsabfrage, falls Schüler vorhanden sind
        if($scope.courses[$scope.courses.indexOf(course)].pupils.length !== 0) {
			$scope.showConfirmDeleteCourse(course);
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
			if ($scope.showReorder) {
				$scope.showReorder = false;
			}	
			else {
				$scope.showReorder = true;
			}
			// $scope.toggle('showReorder');
		};
		
		// Action Sheet "Mehr"
	$scope.showMore = function() {

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
          		{ text: '<div class="icon ion-information-circled"></div>Über Bienchen' },
				{ text: '<div class="icon ion-pie-graph"></div>Export / Import' },
				{ text: $scope.config.showCreateText},
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
					$scope.showAlertVersion();	
				   	break;					
				case 1:
					$state.go('csv');
					
					break;
				case 2:
					if ($scope.showCreate) {
						$scope.showCreate=false;
						$scope.config.showCreateText = '<div class="icon ion-toggle"></div> Schnelleingabe';
					}
					else {
						$scope.showCreate=true;
						$scope.config.showCreateText = '<div class="icon ion-toggle-filled"></div> Schnelleingabe';
					}
					break;
				case 3:
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
   
   	// Triggered on a button click, or some other target
	$scope.showPopupArbeitseinheit = function() {
	$scope.data = {}
	 
	// An elaborate, custom popup
	var myPopup = $ionicPopup.show({
	template: '<input type="text" ng-model="azEinheit">',
	title: $scope.consts.neuerSchuelerTitle,		     
	subTitle: $scope.consts.neuerSchuelerSubtitle,
	scope: $scope,
	buttons: [
	{ text: 'Abbruch' },
	{
		text: '<b>Speichern</b>',
		type: 'button-dark',
		onTap: function(e) {
		if (!$scope.azEinheit) {
		             //don't allow the user to close unless he enters wifi password
					 } else {
		             return $scope.azEinheit;
		           }
				   
					 
				   
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

		
		 
// Triggered on a button click, or some other target
$scope.showPopupAz = function() {
  $scope.data = {};
  $scope.data.azEinheit = $scope.azEinheit;

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="number" ng-model="data.azEinheit">',
    title: 'Arbeitseinheit',
    subTitle: 'Eine Stunde entspricht aktuell <strong>' + $scope.azEinheit + ' Arbeitseinheiten</strong>. Neuen Wert eingeben: ',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.azEinheit) {
            //don't allow ser to close unless he enters wifi password
            e.preventDefault();
          } else {
          $scope.azEinheit = $scope.data.azEinheit;
          Courses.setAzEinheit($scope.azEinheit);
            return $scope.azEinheit;
          }
        }
      }
    ]
  });

  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });

  $timeout(function() {
     myPopup.close(); //close the popup after 3 seconds for some reason
  }, 30000);
 };

 
 


 // Info-Dialog für Arbeitseinheiten Bienchen
  $scope.showAlertAz = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Bewertungen',
       template: 'Hier siehst du, wieviele Bewertungen (Bienchen und Teufelchen) du heute für deine Schüler erfasst hast!'
     });
     alertPopup.then(function(res) {
       console.log('Thank you for not eating my delicious ice cream cone');
     });
   };
   
   	// Action Sheet "Anzeige"
	$scope.showViewKurs = function() {

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
			{ text: $scope.config.showViewKompaktText },
			{ text: $scope.config.showViewNormalText },
			{ text: $scope.config.showViewUebersichtText },
			{ text: $scope.config.showViewDetailText }
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
				$scope.config.showViewKompakt = true;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle-filled"></div>Kompakt';
				
	  			$scope.config.showViewNormal = false;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle"></div>Normal';
	  			
				$scope.config.showViewUebersicht = false;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle"></div>Übersicht';
				
				$scope.config.showViewDetail = false;
				$scope.config.showViewDetailText = '<div class="icon ion-toggle"></div>Detail';
			  	break;
			case 1:
				$scope.config.showViewKompakt = false;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle"></div>Kompakt';
				
	  			$scope.config.showViewNormal = true;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle-filled"></div>Normal';
	  			
				$scope.config.showViewUebersicht = false;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle"></div>Übersicht';
				
				$scope.config.showViewDetail = false;
				$scope.config.showViewDetailText = '<div class="icon ion-toggle"></div>Detail';
			  	break;
			case 2:
				
				$scope.config.showViewKompakt = false;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle"></div>Kompakt';
				
	  			$scope.config.showViewNormal = false;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle"></div>Normal';
	  			
				$scope.config.showViewUebersicht = true;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle-filled"></div>Übersicht';
				
				$scope.config.showViewDetail = false;
				$scope.config.showViewDetailText = '<div class="icon ion-toggle"></div>Detail';
			  	break;
			case 3:
				
				$scope.config.showViewKompakt = false;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle"></div>Kompakt';
				
	  			$scope.config.showViewNormal = false;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle"></div>Normal';
	  			
				$scope.config.showViewUebersicht = false;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle"></div>Übersicht';
				
				$scope.config.showViewDetail = true;
				// Bei Wechsel auf Detailanzeige müssen die Detailinformationen geladen werden				
				calcRatings();
				$scope.config.showViewDetailText = '<div class="icon ion-toggle-filled"></div>Detail';
			  	break;
		}
			// Speicher Konfiguration
		Courses.saveConfig($scope.config);
		return true;
		} 	
	});
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
    	 hideSheet();
   }, 20000);
};

/* Info - Popover */
$scope.animation = 'am-fade'

  $ionicPopover.fromTemplateUrl('templates/popoverCourses.html', {
    scope: $scope,
    animation: $scope.animation
  }).then(function(popover) {
	calcRatings();
    $scope.popoverInformationCourses = popover;
  });
  

	
 	


}])



.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicPopup', '$ionicPopover',  '$ionicModal', 'CameraFac', '$state',   // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicPopup, $ionicPopover, $ionicModal, CameraFac, $state, uiFieldState) {

	$scope.courses =  Courses.all();
	$scope.config = Courses.loadConfig();
	$scope.consts = Courses.getVariables();
	$scope.isRealDrive = Courses.isRealDrive();
	$scope.neuerKommentar = undefined;

	$scope.tempURL = null;
	$scope.permFolder = null;
	$scope.oldFile = null;
	$scope.permFile = null;
	$scope.KEY = "OLDfileNAMEkey";

	/*
	 ** Initialisierungen
	 */
		
	 /* Bestenlistefilter */
	 $scope.topFilterClass3  = "button button-small button-positive";
	 $scope.topFilterClass5  = "button button-small button-positive";
	 $scope.topFilterClass10  = "button button-small button-positive";

	if($scope.config.showViewFilterDatePeriod==true) {
		$scope.config.showViewFilterDatePeriodText = '<div class="icon ion-toggle-filled"></div>Datum';
		
		/* Datumfilter Buttons */
		$scope.datumFilterClassTag ="button button-small button-positive";
		$scope.datumFilterClassWoche ="button button-small button-positive";
		$scope.datumFilterClassMonat ="button button-small button-positive";

	
		
	}
	else {
		$scope.config.showViewFilterFilterText = '<div class="icon ion-toggle"></div>Text';
	}

	
	// Ermittle activeCourse
	$scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];	
	

	// Erzeuge Date - Objekte für die als Text gespeicherten Daten	
	if ($scope.activeCourse.vonDatum) {
		$scope.activeCourse.vonDatum = new Date($scope.activeCourse.vonDatum);
	}
	if ($scope.activeCourse.bisDatum) {
		$scope.activeCourse.bisDatum = new Date($scope.activeCourse.bisDatum);
	}

	// Ermittle permFolder
	if($scope.isRealDrive) {
		console.log("isReady --> ");
		getPermFolder();
		var model = device.model;
		console.log("model/permFolder:",model, $scope.permFolder);
	}

	$scope.erledigteAnzeigen=false;
	
    
    // Liste für Trophy Bilder
    $scope.trophiesList = ["icon ion-trophy", "icon ion-trophy", "icon ion-trophy"];
		
    // Prüfe, ob erste Konfiguration, falls, setze neue Konfiguration
	if ($scope.config.length==0) {
		$scope.config = Courses.newConfig();
	}


	$scope.consts = Courses.getVariables();
	console.log("$scope.consts", $scope.consts);
	if ($scope.consts.appname=='soteam') {
		$scope.soteam=true;
	}
	else {
		$scope.soteam=false;
	}


 $scope.modalData = { "msg" : "Test!" };
	$scope.showNormal = true;
	var mytoggle=true;
	
	
	/*
		Buchungsdatum für Bienchen auf heutiges Datum setzen
	*/
	  $scope.buchungsDatum = {
         datum: new Date()
	 };
	
	 /*
	  * Info_popover - neue Version 
	  */
	 $ionicPopover.fromTemplateUrl('templates/popoverPupils.html', {
		scope: $scope
	 }).then(function(popover) {		 
		$scope.popover = popover;
	 });
  
	 $scope.openPopover = function($event) {
		calcRatings();
		calcPupils();
		$scope.popover.show($event);
	 };
  
	 $scope.closePopover = function() {
		$scope.popover.hide();
	 };
  
	 //Cleanup the popover when we're done with it!
	 $scope.$on('$destroy', function() {
		$scope.popover.remove();
	 });
  
	 // Execute action on hide popover
	 $scope.$on('popover.hidden', function() {
		// Execute action
	 });
  
	 // Execute action on remove popover
	 $scope.$on('popover.removed', function() {
		// Execute action
	 });
	

	/**
	 * Mache Änderungen Rückgängig
	 */
	$scope.closeModalPupil = function() {				
		$scope.activeCourse.activePupil.name = $scope.tmpName;
		$scope.activeCourse.activePupil.image = $scope.undoURL;
		console.log("closeModalPupil ($scope.undoURL): ", $scope.undoURL);

		$scope.pupilModal.hide();
	}
	
	$scope.movePupil = function(pupil) {
		console.log("-> movePupil()");
		$scope.movePupilModal.show();
	}
	
	/* Klick auf Details */	
	$scope.detailPupil = function(pupil) {
		console.log("detailPupil: ", $scope.tempURL);
		$scope.activeCourse.activePupil = pupil;	
		/* Speichere Name und Bildpfad, um Änderungen rückgängig machen zu können */
		$scope.tmpName = pupil.name;
		$scope.tempURL = pupil.image;
		$scope.undoURL = pupil.image;
		console.log("changePupil ($scope.undoURL): ", $scope.undoURL);
		$scope.detailModal.show();

	}

	/* Kommentar zu Schüler hinzufügen */
	$scope.addPupilComment = function(pupil) {
		console.log("addPupilComment: ", pupil.name);
		$scope.activeCourse.activePupil = pupil;	
	    $scope.addPupilCommentModal.show();

	}

	/* Klick auf Ändern */	
	$scope.changePupil = function(pupil) {
		console.log("changePupil: ", pupil.name);
		$scope.activeCourse.activePupil = pupil;	
		/* Speichere Name und Bildpfad, um Änderungen rückgängig machen zu können */
		$scope.tmpName = pupil.name;
		$scope.tempURL = pupil.image;
		$scope.undoURL = pupil.image;
		console.log("changePupil ($scope.undoURL): ", $scope.undoURL);
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

	function getPermFolder()  {
		let path = cordova.file.dataDirectory;

		console.log("getPermFolder: [" + path + "]");

		//save the reference to the folder as a global app property
		resolveLocalFileSystemURL(
		  path,
		  function (dirEntry) {
			//create the permanent folder
			dirEntry.getDirectory(
			  "images",
			  { create: true },
			  function (permDir)  {
				$scope.permFolder = permDir;
				console.log("Created or opened", permDir.nativeURL);			
			  },
			  function (err) {
				console.warn("failed to create or open permanent image dir");
			  }
			);
		  },
		  function (err) {
			console.warn("We should not be getting an error yet");
		  }
		);
	  }

	  $scope.takePictureTP = function (options) {
		var options = {
		   quality : 75,
		   targetWidth: 200,
		   targetHeight: 200,
		   sourceType: 1
		};
  
		Camera.getPicture(options).then(function(imageData) {
		   $scope.picture = imageData;;
		}, function(err) {
		   console.log(err);
		});
	 };


	
	  /* Funktion zum Aufnehmen des Bildes bzw. Fotogalerie */
	   $scope.takePic = function(selection) {
		
			console.log("--> takePic()");

			// Das modale Fenster schließen.
			$scope.pupilModal.hide();

			// Sichere aktuelles Bild als oldfile
			$scope.oldFile = $scope.activeCourse.activePupil.image;

			var options = {
				quality : 75,
				allowEdit: false, /* true tut nicht */
				saveToPhotoAlbum: false,
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType: selection,
				correctOrientation: true
			};

			console.log(options);
			
			// Camera-Factoy / Service wie bei https://www.tutorialspoint.com/ionic/ionic_camera.htm beschrieben
			CameraFac.getPicture(options).then(function(imageData) {
				$scope.tempURL = imageData;
				console.log("tempURL:",$scope.tempURL);

				// Das modale Fenster wieder anzeigen
				$scope.pupilModal.show();

			}, function(err) {
				console.log(err);
			});
		}

	  // Hilfsfunktion: Kopiert tempURL nach permFolder	  
	  function copyImage()  {
		  console.log("copyImage -->");
		  
		 // Ermittle Verzeichnis
		permFolder = getPermFolder();

		if($scope.tempURL != "img/No_image_available-de.svg.png") {		
		console.log("copyImage tempURL ", $scope.tempURL);
		console.log("permFolder:",$scope.permFolder);
		
		//copy the temp image to a permanent location
		let fileName = Date.now().toString() +  ".jpg";
	
		resolveLocalFileSystemURL(
		  $scope.tempURL,
		  entry => {
			//we have a reference to the temp file now
			console.log("Enter...")
			console.log(entry);
			console.log("copying", entry.name);
			console.log(
			  "copy",
			  entry.name,
			  "to",
			  $scope.permFolder.nativeURL + fileName
			);
			//copy the temp file to app.permFolder
			entry.copyTo(
			  $scope.permFolder,
			  fileName,
			  function (permFile) {
				//the file has been copied				
				$scope.permFile = permFile;
				console.log(permFile);
				console.log("add", permFile.nativeURL, "to the 2nd image");
				
				// Speicher Pfad zum Bild
				$scope.activeCourse.activePupil.image = permFile.nativeURL;
		
				
				
				//delete the old image file in the app.permFolder
				// removeFile();
				/* if ($scope.oldFile !== null) {
				  $scope.oldFile.remove(
					function ()  {
					  console.log("successfully deleted old file");
					  //save the current file as the old file
					  $scope.oldFile = permFile;
					},
					function (err) {
					  console.warn("Delete failure", err);
					}
				  );
				} */
			  },
			  function (fileErr){
				console.warn("Copy error", fileErr);
			  }
			);
		  },
		  function (err) {
			console.error(err);
		  }
		);
		} 
		else {
			$scope.activeCourse.activePupil.image = "img/No_image_available-de.svg.png";
		}	

		console.log("<-- copyImage");
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


	function removeFile() {
		var type = window.TEMPORARY;
		var size = 5*1024*1024;
		window.requestFileSystem(type, size, successCallback, errorCallback)
	 
		function successCallback(fs) {
		   fs.root.getFile($scope.oldFile, {create: false}, function(fileEntry) {
	 
			  fileEntry.remove(function() {
				 alert('File removed.');
			  }, errorCallback);
		   }, errorCallback);
		}
	 
		function errorCallback(error) {
		   alert("ERROR: " + error.code)
		}
	 }	

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
	   });
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


		 /* Schülername ändern */
		 $scope.showPopupChangeName = function(pupil) {
			$scope.data = {}
		 
			// An elaborate, custom popup
			var myPopup = $ionicPopup.show({
			  template: '<input type="text" ng-model="data.neuerschueler">',
			  title: pupil.name,		     
			  subTitle: "Umbennenen",
			  scope: $scope,
			  buttons: [
				{ text: 'Abbruch' },
				{
				  text: '<b>Speichern</b>',
				  type: 'button-dark',
				  onTap: function(e) {				   
					 console.log("Umbenennen:", $scope.data.neuerschueler);	
					 $scope.activeCourse.activePupil.name = $scope.data.neuerschueler;				
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
		


	// 
	// Noch keine Schüler
	//
	if($scope.activeCourse.pupils.length == 0) {
		// An alert dialog
		// $scope.showAlert();
		$scope.showPopup();
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
	
	
	/* Setze Sortierung auf Bienchen */
	$scope.setOrderByBienchen = function() {		
		$scope.orderByMe('-(ratings.length-teufelchen.length)')
	}


	
	

    function daysInMonth (month, year) {
      return new Date(year, month, 0).getDate();
    }
    $scope.setNewDatumFilter = function(von,bis,set_monat) {
    	$scope.datumfilter = true;
    	console.log("dat_wahl : " +$scope.activeCourse.dat_wahl);
		console.log("von : " +von);	
		console.log("set_monat : " +set_monat);

		if(set_monat) {
			console.log("set_monat gesetzt auf ", set_monat);
			$scope.activeCourse.dat_wahl = set_monat;
		}

		var heute = new Date(); // aktuelles Datum und aktuelle Zeit	
		
		switch($scope.activeCourse.dat_wahl) {
			case 'Monat':
				var monat = ("0" + (heute.getMonth() + 1)).slice(-2)
		        var jahr = heute.getFullYear();
		        var von = jahr + "-" + monat + "-01";
		        var bis = jahr + "-" + monat + "-" + daysInMonth(monat,jahr);
		        var d = new Date(von);
				var e = new Date(bis);
				$scope.datumFilterClassTag ="button button-small button-positive";
				$scope.datumFilterClassWoche ="button button-small button-positive";
				$scope.datumFilterClassMonat ="button button-small button-positive active";
		
		        
				break;
			case 'Woche':
				var d = addDays(heute, heute.getDay(), false);
				var e = addDays(d, 7, true);
				$scope.datumFilterClassTag ="button button-small button-positive";
				$scope.datumFilterClassWoche ="button button-small button-positive active";
				$scope.datumFilterClassMonat ="button button-small button-positive";
			
				
				break;
			case 'Tag':
				var d = new Date();
				var e = new Date();
				$scope.datumFilterClassTag ="button button-small button-positive active";
				$scope.datumFilterClassWoche ="button button-small button-positive";
				$scope.datumFilterClassMonat ="button button-small button-positive";
								
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
		
		
		$scope.activeCourse.vonDatum= new Date(d);
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
	
	
	// Action Sheet "Mehr" bei Teilnehmer
	$scope.showMore = function() {

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
          		{ text: '<div class="icon ion-happy-outline"></div>Pro-Version kaufen' },
					{ text: '<div class="icon ion-help"></div> Tutorial'},
					{ text: $scope.config.showBuchungsdatumText },
					{ text: $scope.config.showCreateText},
					{ text : '<div class="icon ion-help"></div> Zufallsgenerator'}
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
					$state.go('tour');	
					break;
				case 2:
					if ($scope.config.showBuchungsdatum) {
						$scope.config.showBuchungsdatum=false;
						$scope.config.showBuchungsdatumText = '<div class="icon ion-toggle"></div> Buchungsdatum setzen';
						$scope.buchungsDatum.datum = new Date();
					}
					else {
						$scope.config.showBuchungsdatum=true;
						$scope.config.showBuchungsdatumText = '<div class="icon ion-toggle-filled"></div> Buchungsdatum setzen';
					}
					break;
					case 3:
					if ($scope.showCreate) {
						$scope.showCreate=false;
						$scope.config.showCreateText = '<div class="icon ion-toggle"></div> Schnelleingabe';
					}
					else {
						$scope.showCreate=true;
						$scope.config.showCreateText = '<div class="icon ion-toggle-filled"></div> Schnelleingabe';
					}
					break;
					case 4:
					// Zufallsgenerator
					$scope.showZufallsgeneratorConfirm();
			}
			return true;
			}
			});
	   // For example's sake, hide the sheet after two seconds
	   $timeout(function() {
	    	 hideSheet();
	   }, 20000);
	};

	/**
	 * Action Sheet "Teilnehmer mehr"
	 */
	$scope.showTeilnehmerMehr = function(pupil) {
		$scope.showReorder=false;
		

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
				   { text: '<div class="icon ion-android-contact"></div>Details' },
				   { text: '<div class="icon ion-android.contact"></div>Kommentar'},
				   { text: '<div class="icon ion-arrow-move"></div>Verschieben' },
				   { text: '<div class="icon ion-trash-a"></div>Löschen'}			
     		],
     	// destructiveText: 'Delete',
     	titleText: 'Teilnehmer Aktionen',
     	cancelText: 'Abbrechen',
     	cancel: function() {
        	  // add cancel code..
        	  $scope.orderByMe('');
        },
     	buttonClicked: function(index) {
     	   	switch (index) {
			  case 0:	
				$scope.detailPupil(pupil);
				  break;
				case 1:	
				  $scope.addPupilComment(pupil);
					break;
				
			case 2:
				$scope.changePupil(pupil);
				break;
			case 3:
				$scope.deleteItem(pupil);
				break;
			default: 
				console.log("Nichts zu tun");

			}
			    
			return true;
		}
	});
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
    	 hideSheet();
   }, 20000);
};


	// Action Sheet "Foto aufnehmen"
	$scope.showTakePic = function() {
		$scope.showReorder=false;
		

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
				   { text: 'Kamera' },
				   { text: 'Fotogalerie' },
				   { text: 'Avatar löschen' }				
     		],
     	// destructiveText: 'Delete',
     	titleText: 'Profil-Avatar festlegen',
     	cancelText: 'Abbrechen',
     	cancel: function() {
        	  // add cancel code..
        	  $scope.orderByMe('');
        },
     	buttonClicked: function(index) {
     	   	switch (index) {
	  		case 0:
				$scope.takePic(1);				
		  		break;
				
			case 1:
				$scope.takePic(0);				
				break;
			case 2:
				$scope.tempURL = "img/No_image_available-de.svg.png";
				   console.log("Soll Avatar löschen");
				   break;
			default: 
				console.log("Nichts zu tun");

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
			{ text: $scope.config.showViewKompaktText },
			{ text: $scope.config.showViewNormalText },
			{ text: $scope.config.showViewUebersichtText },
			{ text: $scope.config.showViewDetailText }
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
				$scope.config.showViewKompakt = true;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle-filled"></div>Kompakt';
				
	  			$scope.config.showViewNormal = false;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle"></div>Normal';
	  			
				$scope.config.showViewUebersicht = false;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle"></div>Übersicht';
				
				$scope.config.showViewDetail = false;
				$scope.config.showViewDetailText = '<div class="icon ion-toggle"></div>Detail';
			  	break;
			case 1:
				$scope.config.showViewKompakt = false;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle"></div>Kompakt';
				
	  			$scope.config.showViewNormal = true;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle-filled"></div>Normal';
	  			
				$scope.config.showViewUebersicht = false;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle"></div>Übersicht';
				
				$scope.config.showViewDetail = false;
				$scope.config.showViewDetailText = '<div class="icon ion-toggle"></div>Detail';
			  	break;
			case 2:
				if ($scope.activeCourse.pupils.length==0) {
					$scope.myAlert("Übersicht", "Für Übersichtansicht zunächst Schüler erfassen.");
					break;
				}
				$scope.config.showViewKompakt = false;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle"></div>Kompakt';
				
	  			$scope.config.showViewNormal = false;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle"></div>Normal';
	  			
				$scope.config.showViewUebersicht = true;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle-filled"></div>Übersicht';
				
				$scope.config.showViewDetail = false;
				$scope.config.showViewDetailText = '<div class="icon ion-toggle"></div>Detail';
			  	break;
			case 3:
				if ($scope.activeCourse.pupils.length==0) {
					$scope.myAlert("Details", "Für Detailansicht zunächst Schüler erfassen.");
					break;
				}
				$scope.config.showViewKompakt = false;
				$scope.config.showViewKompaktText = '<div class="icon ion-toggle"></div>Kompakt';
				
	  			$scope.config.showViewNormal = false;
				$scope.config.showViewNormalText = '<div class="icon ion-toggle"></div>Normal';
	  			
				$scope.config.showViewUebersicht = false;
	  			$scope.config.showViewUebersichtText = '<div class="icon ion-toggle"></div>Übersicht';
				
				$scope.config.showViewDetail = true;
				$scope.config.showViewDetailText = '<div class="icon ion-toggle-filled"></div>Detail';
			  	break;
		}
			// Speicher Konfiguration
		Courses.saveConfig($scope.config);
		return true;
		} 	
	});
   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
    	 hideSheet();
   }, 20000);
};



	

	// Action Sheet "Sortierung" bei Teilnehmer
	$scope.showOrder = function() {
		$scope.showReorder=false;
		

		// Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
       			{ text: $scope.consts.sortierenDerTeilnehmerNameText },
				{ text: $scope.consts.sortierenDerTeilnehmerBienchenText }				
     		],
     	// destructiveText: 'Delete',
     	titleText: $scope.consts.sortierenDerTeilnehmer,
     	cancelText: 'Abbruch',
     	cancel: function() {
        	  // add cancel code..
        	  $scope.orderByMe('');
        },
     	buttonClicked: function(index) {
			 /* Deaktiviere Bestenliste, da Sortierung ausgewählt wurde */
			$scope.config.showFilterBestlist=false;
			console.log("config.showFilterBestlist",$scope.config.showFilterBestlist);
			
			// Speicher Konfiguration
			Courses.saveConfig($scope.config);	
			
			switch (index) {
	  		case 0:
				mytoggle=!mytoggle;
				if (mytoggle) {
					$scope.consts.sortierenDerTeilnehmerNameText = '<div class="icon ion-arrow-up-c"></div>Nach Name';
					$scope.consts.sortierenDerTeilnehmerBienchenText = '<div class="icon  ion-arrow-up-c"></div><div class="icon  ion-arrow-down-c"></div>Nach Bienchen',
					$scope.orderByMe('name');
					
				}
				else {
					$scope.consts.sortierenDerTeilnehmerNameText = '<div class="icon ion-arrow-down-c"></div>Nach Name';
					$scope.consts.sortierenDerTeilnehmerBienchenText = '<div class="icon  ion-arrow-up-c"></div><div class="icon  ion-arrow-down-c"></div>Nach Bienchen';
					$scope.orderByMe('-name');
				}				
		  		break;
				
			case 1:
				mytoggle	=!mytoggle;
				if (mytoggle) {
					$scope.consts.sortierenDerTeilnehmerBienchenText = '<div class="icon  ion-arrow-up-c"></div>Nach Bienchen';
					$scope.consts.sortierenDerTeilnehmerNameText = '<div class="icon  ion-arrow-up-c"></div><div class="icon  ion-arrow-down-c"></div>Nach Name';
					$scope.orderByMe('ratings.length-teufelchen.length');
				}
				else {
					$scope.consts.sortierenDerTeilnehmerBienchenText = '<div class="icon  ion-arrow-down-c"></div>Nach Bienchen';
					$scope.consts.sortierenDerTeilnehmerNameText = '<div class="icon  ion-arrow-up-c"></div><div class="icon  ion-arrow-down-c"></div>Nach Name',
					$scope.orderByMe('-(ratings.length-teufelchen.length)')
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


/* Auf Button Top3 geklickt */
$scope.clickFilterBestlist = function(x) {
	$scope.activeCourse.myLimit=x; 
	$scope.orderByMe('-(ratings.length-teufelchen.length)');
	switch(x) {
		case 3: 
			$scope.topFilterClass3 ="button button-small button-positive active";
			$scope.topFilterClass5 ="button button-small button-positive";
			$scope.topFilterClass10 ="button button-small button-positive";
		break;
		case 5:
			$scope.topFilterClass3 ="button button-small button-positive";
			$scope.topFilterClass5 ="button button-small button-positive active";
			$scope.topFilterClass10 ="button button-small button-positive";
		break;
		case 10:
			$scope.topFilterClass3 ="button button-small button-positive";
			$scope.topFilterClass5 ="button button-small button-positive";
			$scope.topFilterClass10 ="button button-small button-positive active";
		break;

	}
}

// Action Sheet "Filter"
	$scope.showViewFilter = function() {

		/* Besteliste Buttons */
		$scope.topFilterClass3 ="button button-small button-positive";
		$scope.topFilterClass5 ="button button-small button-positive";
		$scope.topFilterClass10 ="button button-small button-positive";
		
		/* Setze toggles */
		if($scope.config.showFilterBestlist==true) {
			$scope.config.showViewFilterBestlistText = '<div class="icon ion-toggle-filled"></div>Bestenliste';
		}
		else {
			$scope.config.showViewFilterBestlistText = '<div class="icon ion-toggle"></div>Bestenliste';
		}
		if($scope.config.showViewFilterFilter==true) {
			$scope.config.showViewFilterFilterText = '<div class="icon ion-toggle-filled"></div>Text';
		}
		else {
			$scope.config.showViewFilterFilterText = '<div class="icon ion-toggle"></div>Text';
		}
		



        // Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
			{ text: $scope.config.showViewFilterFilterText},
			{ text: $scope.config.showViewFilterDatePeriodText },
			{ text: $scope.config.showViewFilterBestlistText }
			],
     	// destructiveText: 'Delete',
     	titleText: 'Filter',
     	cancelText: 'Abbruch',
     	cancel: function() {
        	  // add cancel code..
        },
     	buttonClicked: function(index) {
     	   	switch (index) {
	  		case 0:
				if($scope.config.showViewFilterFilter==true) {
					$scope.config.showViewFilterFilter = false;
					$scope.config.showViewFilterFilterText = '<div class="icon ion-toggle"></div>Text1';
					delete $scope.activeCourse.textsearch;
				
				}
				else {
					$scope.config.showViewFilterFilter = true;
					$scope.config.showViewFilterFilterText = '<div class="icon ion-toggle-filled"></div>Text2';
				
				}				
	  			break;
			case 1:
				if ($scope.config.showViewFilterDatePeriod) {
					$scope.config.showViewFilterDatePeriod=false;
					$scope.config.showViewFilterDatePeriodText = '<div class="icon ion-toggle"></div>Datum';
					delete $scope.activeCourse.vonDatum;
					delete $scope.activeCourse.bisDatum;
				}
				else {
					$scope.config.showViewFilterDatePeriod=true;
					$scope.config.showViewFilterDatePeriodText = '<div class="icon ion-toggle-filled"></div>Datum';
					$scope.datumFilterClassTag ="button button-small button-positive";
					$scope.datumFilterClassWoche ="button button-small button-positive";
					$scope.datumFilterClassMonat ="button button-small button-positive";
				}
				break;
			case 2:
				if ($scope.config.showFilterBestlist) {
					$scope.config.showFilterBestlist = false;
					$scope.config.showViewFilterBestlistText = '<div class="icon ion-toggle"></div>Bestenliste';
					delete $scope.myOrderBy;
					delete $scope.activeCourse.myLimit;
				
				}
				else {
					$scope.config.showFilterBestlist=true;
					$scope.config.showViewFilterBestlistText = '<div class="icon ion-toggle-filled"></div>Bestenliste';
					// $scope.myOrderBy='-bienchen';
					$scope.orderByMe('-(ratings.length-teufelchen.length)')
					
			}
				
			  	break;
		}
		// Speicher Konfiguration
		Courses.saveConfig($scope.config);
		
		 // Inefficient, but save all the subjects
		 Courses.save($scope.courses);

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
		console.log("orderByMe aufgerufen");
	        $scope.myOrderBy = x;
	    };


		// Triggered on a button click, or some other target
	 $scope.editPupil = function(pupil) {
		 pupil.isExistent = true;
		 $scope.pupilModal.show();

	};


	function displayFileData(data){
		alert(data);
		}

		function onErrorCreateFile() {
			console.log("Create file fail...");}
		
		function onErrorLoadFs() {
			console.log("File system fail...");
		}



	function createNewFileEntry(imgUri) {
		console.log("a");
		window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {
			console.log("b");
			// JPEG file
			dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {
	
				// Do something with it, like write to it, upload it, etc.
				writeFile(fileEntry, imgUri);
				console.log("got file: " + fileEntry.fullPath);
				displayFileData(fileEntry.fullPath, "File copied to");
	
			}, onErrorCreateFile);
	
		}, onErrorResolveUrl);
	}

	function getFileEntry(imgUri) {
		window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
	
			// Do something with the FileEntry object, like write to it, upload it, etc.
			// writeFile(fileEntry, imgUri);
			console.log("got file: " + fileEntry.fullPath);
			// displayFileData(fileEntry.nativeURL, "Native URL");
	
		}, function () {
		  // If don't get the FileEntry (which may happen when testing
		  // on some emulators), copy to a new FileEntry.
			createNewFileEntry(imgUri);
		});
	}


	

	function setOptions(srcType) {
		var options = {
			quality: 50,
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE
		}
		return options;
	}	
    
	

	
	/* Modales Fenster zum Anzeigen der Schülerdetails */
	$ionicModal.fromTemplateUrl('templates/modal-detail-pupil.html', function(modal)
	{
    	$scope.detailModal = modal;
    	}, {
    		scope: $scope
	  });


	  /* Modales Fenster für Kommentarfunktion */
	  $ionicModal.fromTemplateUrl('templates/modal-addpupilcomment.html', function(modal)
	{
		
    	$scope.addPupilCommentModal = modal;
    	}, {
    		scope: $scope
	  });
	  $scope.saveAddPupilCommentModal = function() {
		
		console.log("$scope.activeCourse.activePupil.newcomment)", $scope.activeCourse.activePupil.newcomment);
		// Schließe das modale Fenster
		$scope.addPupilCommentModal.hide();

			// Kommentar hinzufügen
			$scope.addKommentar($scope.activeCourse.activePupil,$scope.activeCourse.activePupil.newcomment);

			// Array löschen
			$scope.activeCourse.activePupil.newcomment  = "";
			

	  }
	  $scope.cancelAddPupilCommentModal = function() {
		 
		// Schließe das modale Fenster
		$scope.addPupilCommentModal.hide();


	  }

	   // Modales Fenster ändern von Schülern
	$ionicModal.fromTemplateUrl('templates/modal-pupil.html', function(modal)
	{
    	$scope.pupilModal = modal;
    	}, {
    		scope: $scope
	  });
	  



	$scope.closeNewPupil = function() {	
		$scope.pupilModal.hide();
	}

	$scope.closeEditPupil = function() {
		
		console.log("Starte closeEditPupil");		

		/* Bild wird nur kopiert auf echtem Device */
		console.log("isRealdrive: ", $scope.isRealDrive);
		if($scope.isRealDrive) {
			console.log("Rufe copyImage auf");
			copyImage();
			console.log("zurück von copyImage");
		}
	
		$scope.pupilModal.hide();		

		//code before the pause
		setTimeout(function(){
			//do what you need here
			console.log("setTimeout: ",$scope.courses);
			// Inefficient, but save all the subjects
			Courses.save($scope.courses);

		}, 2000);
		
		console.log("... Ende closeEditPupil");
	}	
	
	 $scope.uploadFile = function(){
        var file = event.target.files[0];
		var imgURL = URL.createObjectURL(file);
		
		$scope.activeCourse.activePupil.image = imgURL;
    };

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
		// Kommasepariert spliiten
		var str = 'Hello, World, etc';
		var str_array = pupilName.split(',');
	
		for(var i = 0; i < str_array.length; i++) {
		   // Trim the excess whitespace.
		   str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
		   // Add additional code here, such as:
			console.log("Neuer Schüler: " + str_array[i]);
	        if (!$scope.activeCourse || !str_array[i]) {
	            return;
	        }
	
			
	        $scope.activeCourse.pupils.push({
	            name : str_array[i],
	            bienchen : 0, // ratings - teufelchen
	            ratings : [],
				isExistent : true, // bei false wird pupil geändert, nicht neu angelegt
				erledigt : false, // bei soteam werden nur nicht erledigte angezeigt
	            teufelchen : [],
				image : "img/No_image_available-de.svg.png",
				kommentare : [],
				zufaelle : [],
				wertungen : 0
	        });
			
		  
		  
	  
	   }
		
		
	   


        // Nicht effinzient ...
        Courses.save($scope.courses);
    };


		 // Teilnehmer löschen
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
		title: pupil.name + ' löschen',
		template: pupil.name + ' unwiderruflich löschen!'
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

	// Schülername ändern 
	$scope.make = function(e) {
		// ...  your function code
		// e.preventDefault();   // use this to NOT go to href site
		$scope.showPopupChangeName();
    }


	// Rating entfernen
	$scope.deleteRating = function(item,rating) {
	$scope.activeCourse.pupils[$scope.activeCourse.pupils.indexOf(item)].ratings.splice($scope.activeCourse.pupils[$scope.activeCourse.pupils.indexOf(item)].ratings.indexOf(rating),1);
			
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);
	}
	
	// Teufelchen entfernen
	$scope.deleteTeufelchen = function(item,teufelchen) {
		$scope.activeCourse.pupils[$scope.activeCourse.pupils.indexOf(item)].teufelchen.splice($scope.activeCourse.pupils[$scope.activeCourse.pupils.indexOf(item)].teufelchen.indexOf(teufelchen),1);
				
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);
	}
	// Zufall hinzufügen
	$scope.addZufall = function(pupil) {
	
		var d = new Date();
		var now = d.getTime();
		pupil.zufaelle.push({datum : now});
		
		// Inefficient, but save all the subjects
        Courses.save($scope.courses);
		
		}
	
    // Rating hinzufügen
    $scope.addRating = function(pupil,type) {

        // var d = new Date();
		// type : 0 = Bienchen
		// type : 1 = Teufelchen

		console.log("buc_datum: " + $scope.buchungsDatum.datum);
		
		var d = $scope.buchungsDatum.datum;
        var now = d.getTime();
		var n = d.toLocaleString();
		console.log("d: " + d);
		console.log("now: " + now);
		
        if(!$scope.activeCourse || !pupil) {
            return;

        }
        
        // Erfolgsnachricht, falls das das erste Rating war
        if ($scope.ratingsgesamt == 0) {
			$scope.showDone();
		}
		
		if (type==1) {
			pupil.teufelchen.push({
				datum : now
			});
			$scope.activeCourse.wertungen = $scope.activeCourse.wertungen + 1;
		}
		else {
			// Rating hinzufügen
			pupil.ratings.push({
				datum : now
			});
			$scope.activeCourse.wertungen = $scope.activeCourse.wertungen + 1;
		}
		
        

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
	
	
	$scope.toggle = function (v) {
		console.log("toogle in teilnehmerCtrl: " + v);
        $scope[v] = !$scope[v];
    };
    $scope.toggleErledigteAnzeigen = function() {
        if ($scope.config.showErledigteAnzeigen==true) {
            $scope.config.showErledigteAnzeigen=false;
        }
        else {
            $scope.config.showErledigteAnzeigen=true;
        }
        
        // Speicher Konfiguration
		Courses.saveConfig($scope.config);
		
    }
	
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
		
		// Entferne letzte Buchung, da sie durch anklicken 
		// von erledigen gesetzt wurde.
		pupil.ratings.pop();
	
		// Nicht effinzient ...
        Courses.save($scope.courses);

	}
	$scope.setzeUnerledigt = function(pupil) {
		pupil.erledigt=false;
		
		// Nicht effinzient ...
        Courses.save($scope.courses)
		
		
	}
	
		// Kommentar hinzufügen
    $scope.addKommentar = function(pupil, kommentar) {

        var d = new Date();
        var now = d.getTime();
        var n = d.toLocaleString();
		
		
        if(!$scope.activeCourse || !pupil) {
            return;

        }
        
        // Kpmmentar hinzufügen
        pupil.kommentare.push({
            datum : now,
            kommentar : kommentar
        });
       
       // Inefficient, but save all the subjects
		Courses.save($scope.courses);
		
		// Lösche Kommenta im Eingabefeld
		$scope.neuerKommentar='';

    }
    
    // Kommtar entfernen
	$scope.deleteKommentar = function(item,kommentar) {
	$scope.activeCourse.pupils[$scope.activeCourse.pupils.indexOf(item)].kommentare.splice($scope.activeCourse.pupils[$scope.activeCourse.pupils.indexOf(item)].kommentare.indexOf(kommentar),1);
			
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);
	}
    
    
    // Generischer Alert
    $scope.myAlert = function(title, template) {
	   var alertPopup = $ionicPopup.alert({
	     title: title,
	     template: template
	   });
	
	   alertPopup.then(function(res) {
	     console.log('Thank you for not eating my delicious ice cream cone');
	     
	   });
	};
	
	
 // A confirm dialog
 $scope.showZufallsgeneratorConfirm = function() {
 	var min = 0;
	var max = $scope.activeCourse.pupils.length;
	var x = Math.floor(Math.random() * (max - min)) + min;

   var confirmPopup = $ionicPopup.confirm({
     title: 'Zufallsgenerator',
     template: $scope.activeCourse.pupils[x].name + ' (' + $scope.activeCourse.pupils[x].zufaelle.length + ')',
     cancelText : 'Neu'
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('Speichere Zufallsauswahl bei Schüler');
       $scope.addZufall($scope.activeCourse.pupils[x]);
     } else {
       x = Math.floor(Math.random() * (max - min)) + min;
       console.log('Neuer Schüler : ' + $scope.activeCourse.pupils[x].name);
       $scope.showZufallsgeneratorConfirm();

     }
   });
 };
	
	$scope.zufallsgenerator = function() {
	
	var min = 0;
	var max = $scope.activeCourse.pupils.length;
	var x = Math.floor(Math.random() * (max - min)) + min;

		alert("Hello : " + $scope.activeCourse.pupils[x].name);
			
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);
	}
	
	$scope.settingsList = [
		{ text: "Bienchen", checked: true },
		{ text: "Teufelchen", checked: false },
		{ text: "Zufalssauswahlen", checked: false },
		{ text: "Kommentare", checked: false }

	  ];
	
	  $scope.onDoubleTap = function() {
		  alert("on-double-tap");
	  }


}])

.controller('csvCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicPopup', '$ionicModal', 'LoaderService', '$state',   // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
	// You can include any angular dependencies as parameters for this function
	// TIP: Access Route Parameters for your page via $stateParams.parameterName
	function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicPopup, $ionicModal, LoaderService, $state) {
	

	$scope.notice = {text: ""}

	// Kurse in scope laden
	$scope.courses =  Courses.all();
	$scope.consts = Courses.getVariables();
        $scope.exportformat = 'csv';
        $scope.jsonstr = angular.toJson($scope.courses);
    
		$scope.csvstr  = 'kurs,name,bienchen,teufelchen%0D%0A';
		$scope.courses.forEach((course, index, array) => {
			// str += course.title;
			course.pupils.forEach((pupil, iPupil, aPupil) => {
				$scope.csvstr += course.title + ',' + pupil.name + ',' + pupil.ratings.length + ',' + pupil.teufelchen.length + '%0D%0A';
			});
		});
        
	  
		
		// Datei mittels cordova erzeugen
		$scope.createFile = function() {
			var type = window.TEMPORARY;
			var size = 5*1024*1024;
			window.requestFileSystem(type, size, successCallback, errorCallback)
		 
			function successCallback(fs) {
			   fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
				  alert('File creation successfull!')
			   }, errorCallback);
			}
		 
			function errorCallback(error) {
			   alert("ERROR: " + error.code)
			}
			 
		 }
	
	
	buildCsvString = function() {
		var str = '';
		$scope.courses.forEach((course, index, array) => {
			// str += course.title;
			course.pupils.forEach((pupil, iPupil, aPupil) => {
				str += course.title + ',' + pupil.name + ',' + pupil.ratings.length + ',' + pupil.teufelchen.length + '\n';
			});
		});
		console.log("str: " + str);
		return str;
	
	}
	$scope.buildCsvStringEx = function() {
		buildCsvString();
	}
	
		
	$scope.downloadCsvEx = function() {
	   //var str = buildCsvString();
        var str = angular.toJson($scope.courses);
        var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'})



            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
              window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };

        var link = document.createElement('a');
        link.setAttribute('download', 'info.txt');
        link.href = makeTextFile(str);
        document.body.appendChild(link);

        // wait for the link to be added to the document
        window.requestAnimationFrame(function () {
          var event = new MouseEvent('click');
          link.dispatchEvent(event);
          document.body.removeChild(link);
        });


	}
	
	
	

	// Kopiert Daten inZwischenablage
	$scope.addToClipboard = function() {
		var text = angular.toJson($scope.courses);
		cordova.plugins.clipboard.copy(text);
		var alertPopup = $ionicPopup.alert({
			title: 'Zwischenablage',
			template: text
		  });
		  alertPopup.then(function(res) {
			console.log('Text in Zwischenablage kopiert.');
		  });
		
	
	}
    
    // Export-Funktion, Paramter: 'json' und 'csv' möglich
    $scope.downloadFile = function(exportformat) {
        if (exportformat=='csv') {
             var str = buildCsvString();
        }
        else if (exportformat=='json') {
             var str = angular.toJson($scope.courses);
        }
        else {
            alert("Ungültiger Parameter " + exportformat + " !");
            return;
        }
	  
       
        var textFile = null,
        makeTextFile = function (text) {
            var data = new Blob([text], {type: 'text/plain'})



            // If we are replacing a previously generated file we need to
            // manually revoke the object URL to avoid memory leaks.
            if (textFile !== null) {
              window.URL.revokeObjectURL(textFile);
            }

            textFile = window.URL.createObjectURL(data);

            return textFile;
        };

        var link = document.createElement('a');
        link.setAttribute('download', 'info.txt');
        link.href = makeTextFile(str);
        document.body.appendChild(link);

        // wait for the link to be added to the document
        window.requestAnimationFrame(function () {
          var event = new MouseEvent('click');
          link.dispatchEvent(event);
          document.body.removeChild(link);
        });


	}
    
     
    $scope.jsonExport = function() {
        console.log("Json export");
	}
	
	$scope.clearTextArea = function() {
		$scope.notice.text = "";
	}
	$scope.pasteClipboard = function() {
		cordova.plugins.clipboard.paste(function (text) { 
		var alertPopup = $ionicPopup.alert({
			title: 'Zwischenablage',
			template: text
			});
		
			alertPopup.then(function(res) {
			console.log('Thank you for not eating my delicious ice cream cone');
			$scope.notice.text = text;
			});
		
		
			
		});


	}
    $scope.importJsonFromTextarea = function() {  
		// Hide overlay when done
		LoaderService.show();
		if($scope.notice.text) {
			 
		   		$scope.showConfirmImport();    	
             }
             else {
			 // Hide overlay when done
			 LoaderService.hide();
				alert("Es werden keine Daten importiert!");
			 
			}
		}

	// An alert dialog
	$scope.showAlertJsonError = function(text) {
		var alertPopup = $ionicPopup.alert({
		  title: 'Daten konnten nicht importiert werden!',
		  template: text
		});
	 
		alertPopup.then(function(res) {
		  console.log('Thank you for not eating my delicious ice cream cone');
		});
	  };

/* Anfang Confirm-Dialog */
 // Triggered on a button click, or some other target
 $scope.showConfirmImport = function() {

	// Hide overlay when done
	LoaderService.hide();

	$scope.data = {}
	var delkey = "Lösche!";
 
	// An elaborate, custom popup
	var myPopup = $ionicPopup.show({
	  template: '<input type="text" ng-model="data.wifi">',
	  title: 'Daten importieren',
	  subTitle: '<b>Achtung</b>: Alle bestehenden Daten (Kurse, Teilnehmer, Bienchen) werden werden unwiderruflich <b>gelöscht!</b> Dieser Schritt kann nicht rückgängig gemacht werden!<br><br>Schreiben Sie: <b>' + delkey + ' </b>wenn Sie sicher sind, dass Sie die Daten überschreiben wollen!</b>',
	  scope: $scope,
	  buttons: [
		{ text: 'Abbruch' },
		{
		  text: '<b>Speichern</b>',
		  type: 'button-assertive',
		  onTap: function(e) {
			if (!$scope.data.wifi) {
			  //don't allow the user to close unless he enters wifi password
			  e.preventDefault();
			} else {
			  return $scope.data.wifi;
			}
		  }
		},
	  ]
	});
	myPopup.then(function(res) {
	  console.log('Tapped!', res);
	  if(res) {
		try {		
			if (res==delkey) {
				$scope.courses = angular.fromJson($scope.notice.text);
				Courses.save($scope.courses);
				showAlert('Daten erfolgreich importiert.');
			}	
			else {
				showAlert("Sie haben <b>" + res + "</b> geschrieben und nicht <b>" + delkey + "</b><br> Daten werden <b>nicht</b> importiert");
			}
			
		} catch (e) {
			$scope.showAlertJsonError(e);				
		}
	
	} else {
		console.log('You are not sure');
	}
	});
	$timeout(function() {
	   myPopup.close(); //close the popup after 3 seconds for some reason
	}, 50000);
   };
  
/* Ende Confirm-Dialog */


	// An alert dialog
	showAlert = function(text) {
		var alertPopup = $ionicPopup.alert({
		  title: 'Import',
		  template: text
		});
	 
		alertPopup.then(function(res) {		
		  $state.go('kurs');
		});
	  };
	
	
}])

.controller('tourCtrl', function($scope){
	 $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	  // data.slider is the instance of Swiper
	  $scope.slider = data.slider;
	  cordova.getAppVersion.getVersionNumber().then(function (version) {
		$scope.appversionxml = version;
	});
	cordova.getAppVersion.getAppName().then(function (version) {
		$scope.appnamexml = version;
	});
	
	});
	
	$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
	  console.log('Slide change is beginning');
	  console.log("Text: (" + $scope.consts.teilnehmerHinzufuegen + ")");
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

.controller("profilCtrl", function($scope){

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
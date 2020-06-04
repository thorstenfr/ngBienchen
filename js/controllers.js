angular.module('app.controllers', ['ionic'])

.controller('kursCtrl', ['$scope', '$stateParams', 'Courses', '$ionicModal',  '$timeout', '$ionicPopup', '$ionicActionSheet','$state', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicModal,  $timeout, $ionicPopup, $ionicActionSheet,$state) {
	
	$scope.courses =  Courses.all();
	$scope.config = Courses.loadConfig();

	// Prüfe, ob erste Konfiguration, falls, setze neue Konfiguration
	if ($scope.config.length==0) {
		$scope.config = Courses.newConfig();
	}
	
	// Setze, ob Inline-Kursanlage input-feld angezeigt werden soll
	if ($scope.courses.length==0) {
		$scope.showCreateCourse=true;
	}
	else {
		$scope.showCreateCourse=false;
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
		var schueler = 0;
		var ratings=0;
		var kurse = $scope.courses
		$scope.courses.forEach(function(course) {
			schueler = schueler + course.pupils.length;
			// Iterate durch Ratings
			course.pupils.forEach(function(pupil) {
					ratings=ratings+pupil.ratings.length;
						ratings=ratings+pupil.teufelchen.length;
					});
			});
			$scope.ratingsgesamt=ratings;
		$scope.schuelergesamt = schueler;
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
	}
	
	// Aktuelles Datum
	var d = new Date();
	
	
	$scope.$on("$ionicView.afterEnter", function(){
		// Anything you can think of
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
		if ($scope.config.showUebersicht || $scope.config.showTagesUebersicht) {		
			calcRatings();
			calcPupils();
		}
	
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
				{ text: '<div class="icon ion-pie-graph"></div>Export / Import' },
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
          { text: $scope.config.uebersichtText },
				  { text: $scope.config.tagesUebersichtText }
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
				if ($scope.config.showUebersicht) {
					$scope.config.showUebersicht = false;
					$scope.config.uebersichtText = '<div class="icon ion-toggle"></div>Gesamtauswertung';					
				}
				else {
					calcRatings();
					$scope.config.showUebersicht = true;					
					$scope.config.uebersichtText = "Gesamtauswertung verbergen";
					$scope.config.uebersichtText = '<div class="icon ion-toggle-filled"></div>Gesamtauswertung';	
			
				}
	  		  	break;
			case 1:
				if ($scope.config.showTagesUebersicht) {
					$scope.config.showTagesUebersicht=false;
					$scope.config.tagesUebersichtText = '<div class="icon ion-toggle"></div>Tagesauswertung';
					
				}
				else {
					calcRatings();
					$scope.config.showTagesUebersicht=true;
					$scope.config.tagesUebersichtText = '<div class="icon ion-toggle-filled"></div>Tagesauswertung';
				}
				
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


	
 	


}])



.controller('teilnehmerCtrl', ['$scope', '$stateParams', 'Courses', '$ionicActionSheet', '$timeout', '$ionicPopup', '$ionicModal', '$state',   // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, Courses, $ionicActionSheet, $timeout, $ionicPopup, $ionicModal, $state, uiFieldState) {

	$scope.courses =  Courses.all();
	$scope.config = Courses.loadConfig();
	$scope.neuerKommentar = undefined;

	$scope.tempURL = null;
	$scope.permFolder = null;
	$scope.oldFile = null;
	$scope.permFile = null;
	$scope.KEY = "OLDfileNAMEkey";

	// Ermittle permFolder
	if(Courses.isRealdrive()) {
		getPermFolder();
		var model = device.model;
		console.log("model:",model);
	}

	$scope.erledigteAnzeigen=false;
	
    
    // Liste für Trophy Bilder
    $scope.trophiesList = ["icon ion-trophy", "icon ion-trophy", "icon ion-trophy"];
		
    // Prüfe, ob erste Konfiguration, falls, setze neue Konfiguration
	if ($scope.config.length==0) {
		$scope.config = Courses.newConfig();
	}


	$scope.consts = Courses.getVariables();
	if ($scope.consts.appname=='soteam') {
		$scope.soteam=true;
	}
	else {
		$scope.soteam=false;
	}
	
	

  $scope.activeCourse = $scope.courses[Courses.getLastActiveIndex()];
	$scope.totalNumberOfRatings = Courses.getTotalNumberOfRatings();
	if ($scope.activeCourse.pupils.length==0) {
	$scope.showCreate=true;
	}
	else {
		$scope.showCreate=false;
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
	

	$scope.closeModalPupil = function() {		
		$scope.pupilModal.hide();
	}
	
	
	$scope.changePupil = function(pupil) {
		$scope.activeCourse.activePupil = pupil;
		$scope.tempURL = pupil.image;
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

	$scope.loadOldImage = function() {
		let oldFilePath = $scope.activeCourse.activePupil.image;
		if (oldFilePath) {
			resolveLocalFileSystemURL(
				oldFilePath,
				function oldFileEntry() {
					$scope.oldFileEntry = oldFileEntry;
				},
				function err() {
					console.warn(err);
				}
			);
		}
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

				//check for an old image from last time app ran
				$scope.loadOldImage();
			
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


	   $scope.takePic = function(selection) {
		
		// Das modale Fenster schließen.
		$scope.pupilModal.hide();

		// Sichere aktuelles Bild als oldfile
		$scope.oldFile = $scope.activeCourse.activePupil.image;

		let options = {
			quality: 50,
			allowEdit: true,
			saveToPhotoAlbum: false,
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.JPG,		
			sourceType: selection,
			mediaType: Camera.MediaType.PICTURE,
			cameraDirection: Camera.Direction.FRONT
		};
		console.log(options);
		navigator.camera.getPicture(gotImage, failImage, options);
	  }
	
	  function gotImage(uri) {
		$scope.tempURL = uri;
		console.log("tempURL:",$scope.tempURL);		

		// Das modale Fenster wieder anzeigen.
		$scope.pupilModal.show();	

	  }

	  function failImage(err) {
		console.warn(err);
	  }


	  // Hilfsfunktion: Kopiert tempURL nach permFolder	  
	  function copyImage()  {
		  console.log("copyImage -->");

		if($scope.tempURL != "img/No_image_available-de.svg.png") {		
		console.log("copyImage tempURL ", $scope.tempURL);
		console.log("permFolder:",$scope.permFolder);
		
		//copy the temp image to a permanent location
		let fileName = "aaa" + Date.now().toString() +  ".jpg";
	
		resolveLocalFileSystemURL(
		  $scope.tempURL,
		  entry => {
			//we have a reference to the temp file now
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
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);

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
					$scope.orderByMe('ratings.length-teufelchen.length');
				}
				else {
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


// Action Sheet "Filter"
	$scope.showViewFilter = function() {
        // Initales setzen der Werte 
        $scope.config.showFilterBestlistText = $scope.consts.showFilterBestlistTextFalse;
		
        // Show the action sheet
   		var hideSheet = $ionicActionSheet.show({
     		buttons: [
			{ text: $scope.config.showViewFilterFilterText },
			{ text: $scope.config.showViewFilterDatePeriodText },
			{ text: $scope.config.showFilterBestlistText }
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
				if($scope.config.showViewFilterFilter) {
					$scope.config.showViewFilterFilter = false;
					$scope.config.showViewFilterFilterText = '<div class="icon ion-toggle"></div>Text';
				 delete $scope.activeCourse.textsearch;
				
				}
				else {
					$scope.config.showViewFilterFilter = true;
					$scope.config.showViewFilterFilterText = '<div class="icon ion-toggle-filled"></div>Text';
				
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
				}
				break;
			case 2:
				if ($scope.config.showFilterBestlist) {
					$scope.config.showFilterBestlist = false;
					$scope.config.showFilterBestlistText = $scope.consts.showFilterBestlistTextFalse;
					delete $scope.myOrderBy;
					delete $scope.activeCourse.myLimit;
				
				}
				else {
					$scope.config.showFilterBestlist=true;
					$scope.config.showFilterBestlistText = $scope.consts.showFilterBestlistTextTrue;
					$scope.myOrderBy='-bienchen';
					
			}
				
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

	$scope.takephoto = function(selection) {

		// Das modale Fenster schließen.
		$scope.pupilModal.hide();
	
		let opts = {
			quality: 80,
			allowEdit: true,
			saveToPhotoAlbum: false,
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.JPG,
			sourceType: selection,
			mediaType: Camera.MediaType.PICTURE,
			cameraDirection: Camera.Direction.FRONT,
			targetWidth: 32,
			targetHeight: 32
		};
		navigator.camera.getPicture(ftw, wtf, opts);
	}
	function ftw(imgURI) {
		// Speicher Pfad zum Bild
		$scope.activeCourse.activePupil.image = imgURI;
		
		// Inefficient, but save all the subjects
		Courses.save($scope.courses);

		// Das modale Fenster wieder anzeigen.
		$scope.pupilModal.show();

	}
	function wtf(msg) {
		// document.getElementById('msg').textContent = msg;
		console.log("Problem beim Bild aufnehmen",msg);

	}

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

	$scope.closeEditPupilEx = function() {
		
		console.log("Starte closeEditPupil");

		// Inefficient, but save all the subjects
		Courses.save($scope.courses);

		console.log("Rufe copyImage auf");
		copyImage();
		console.log("zurück von copyImage");
		
			$scope.pupilModal.hide();		

			console.log("... Ende closeEditPupil");
	}
	$scope.closeEditPupil = function(pupil) {	
			console.log("closeEditPupil ",pupil.name);
			// Kopiere neue Bilddatei um
			console.log("Rufe copyImage auf");
			copyImage();
			console.log("zurück von copyImage");
		
		if (typeof pupil !== "undefined") {
			if (typeof pupil.name !== "undefined") {
				$scope.activeCourse.activePupil.name = pupil.name;
			}
			if (typeof pupil.kommentar !== "undefined") {
				$scope.addKommentar($scope.activeCourse.activePupil, $scope.neuerKommentar);
				$scope.neuerKommentar = '';
			}
		
			// pupil resetten, um keine Historiendaten anzuzeigen
			delete pupil.name, pupil.kommentar;
			
			// Inefficient, but save all the subjects
			Courses.save($scope.courses);

			console.log("... Ende closeEditPupil");
			
			
		}
				
		$scope.pupilModal.hide();

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
				zufaelle : []
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

		// A confirm dialog
	$scope.showConfirmImport = function() {

			 // Hide overlay when done
			 LoaderService.hide();
		
		var confirmPopup = $ionicPopup.confirm({
		title: 'Folgende Daten importieren',
		template: $scope.notice.text
		});
	
		confirmPopup.then(function(res) {
		if(res) {
			try {			
				$scope.courses = angular.fromJson($scope.notice.text);
				Courses.save($scope.courses);
				showAlert();
			} catch (e) {
				$scope.showAlertJsonError(e);				
			}
		
		} else {
			console.log('You are not sure');
		}
		});
	};

	// An alert dialog
	showAlert = function() {
		var alertPopup = $ionicPopup.alert({
		  title: 'Import',
		  template: 'Daten erfolgreich importiert.'
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
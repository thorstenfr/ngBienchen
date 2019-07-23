angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('kurs', {
    url: '/page1',
    templateUrl: 'templates/kurs.html',
    controller: 'kursCtrl'
  })

  .state('teilnehmer', {
    url: '/page4',
    templateUrl: 'templates/teilnehmer.html',
    controller: 'teilnehmerCtrl'
  })
  .state('tour', {
    url: '/tour',
    templateUrl: 'templates/tour.html',
    controller: 'tourCtrl'
	})	
  .state('csv', {
    url: '/csv',
    templateUrl: 'templates/csv.html',
    controller: 'csvCtrl'
  })
  .state('app-config', {
    url: '/tour',
    templateUrl: 'templates/app-config.html',
    controller: 'configCtrl'
	})	
  
$urlRouterProvider.otherwise('/page1')



});

angular.module('app.filters', ['ionic'])

.filter('datumFilter', function(){
  return function(input, von, bis){
    var out = [];
    angular.forEach(input, function(wertung){
    if((wertung.datum > von) || !angular.isDate(von) ){
        if( (wertung.datum < bis) || !angular.isDate(bis) ) {
        	out.push(wertung);
        }
      }

    })

    return out;
  }
})
.filter("datumFilterStateful", function() {
  return function(input, von, bis){
    var out = [];
    angular.forEach(input, function(wertung){
    if((wertung.datum > von) || !angular.isDate(von) ){
        if( (wertung.datum < bis) || !angular.isDate(bis) ) {
        	out.push(wertung);
        }
      }

    })

    return out;
  }
})
.filter('datumFilterCount', function(){
  return function(input, von, bis){
    var anzahl = 0;
    angular.forEach(input, function(wertung){
    if((wertung.datum > von) || !angular.isDate(von) ){
        if( (wertung.datum < bis) || !angular.isDate(bis) ) {
        	anzahl = anzahl + 1;
        }
      }

    })

    return anzahl;
  }
})
.filter('countFilter', function(){
  console.log("CountFilter");
  return function(input){
    var anzahl = 0;
    angular.forEach(input, function(wertung){
    
        	anzahl = anzahl + 1;   
    })
    console.log("Anzahl: " + anzahl);
    return anzahl;
  }
})


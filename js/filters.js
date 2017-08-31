angular.module('app.filters', ['ionic'])

.filter('datumFilter', function(){
  return function(input, von, bis){
    var out = [];
    angular.forEach(input, function(wertung){
    if((wertung.datum > von) || !angular.isDate(von) ){
        if( (wertung.datum < bis) || !angular.isDate(bis) ) {
        	out.push(wertung)
        }
      }
    })
    return out;
  }
})
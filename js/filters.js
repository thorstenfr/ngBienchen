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
.filter("datumFilterStateful", function() {


  function datumFilterStateful(input,von,bis) {




       var out = [];
    angular.forEach(input, function(wertung){
    
   // wertung.dateAsString = $filter('date')(wertung.datum, "yyyy-MM-dd");  // for type="date" binding

    var created_time = new Date(wertung.datum);
          if(!angular.isDate(created_time)) {
        console.log("wertung.datum ist KEIN Datum: " + created_time);
      }
      
      var filter_von = new Date(von);
      
      if (!angular.isDate(filter_von)) {
       console.log("von ist KEIN Datum: " + von);
      }
  

    if((created_time > filter_von) || !angular.isDate(filter_von) ){
        if( (created_time < bis) || !angular.isDate(bis) ) {
        	out.push(wertung)
        }
      }

    })

    return out;
  }

    datumFilterStateful.$stateful = true;

  return datumFilterStateful;
})



var whatever = function (pourcent){
    var p = (pourcent)? pourcent : 0;
    console.log(p);

    if (p  < 100)
        setTimeout(function(){ whatever( p + 10 )}, 1000);
}

setTimeout(whatever, 1000);


function totalFine( fare ) {
    // You have to write your code here
    if( typeof fare !== "number" ) {
        return "Invalid"
    }

    if( fare <0 ) return "Invalid"

    return fare * 1.2 +30;

}



function  onlyCharacter( str ) {
    // You have to write your code here
    if( typeof str !== "string" ) return "Invalid"

    let myarray = str.split(" ")

    let mystring = myarray.join("")

    return mystring.toUpperCase()


}



function  bestTeam( player1, player2 ) {
    // You have to write your code here

    if( typeof player1 !== 'object' || typeof player2 !== 'object' ) return "Invalid";

    if( player1.foul + player1.cardY + player1.cardR < player2.foul + player2.cardY + player2.cardR  ) return player1.name;
    else if( player1.foul + player1.cardY + player1.cardR > player2.foul + player2.cardY + player2.cardR  ) return player2.name;
    else return "Tie";

    
}


function  isSame(arr1 , arr2 ) {
    // You have to write your code here

    if( !Array.isArray(arr1) || !Array.isArray(arr2) ) return "Invalid"

    let flag = true ;

    for (let i= 0 ; i< arr1.length ; i++ )
    {
        if( arr1[i] !== arr2[i] ) flag=false;
    }

    return flag;


}



function  resultReport( marks ) {
    // You have to write your code here

    let result ={ finalScore: 0, pass: 0, fail: 0 }

    if(!Array.isArray( marks ) ) return "Invalid";


    for( let i =0; i<marks.length; i++ ) {
        result.finalScore+= marks[i];
        if( marks[i] >=40 ) result.pass++;
        else result.fail++;
    }

    result.finalScore /= marks.length; 

    result.finalScore += 0.5;

    result.finalScore = Math.floor( result.finalScore );

    return result;
}










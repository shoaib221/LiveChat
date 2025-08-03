

var area = 800;

console.log(area/2);


var money = 10000;

if(money >= 25000) console.log("Laptop");
else if( money >= 10000 ) console.log("Cycle");
else console.log( "Chocolate" );


var lastDay = 6;

for( var i=1; i<=lastDay; i++ )
{
    if( i%3===0 ) console.log( i+' - medicine' )
    else console.log( i+" - rest" )
}


var fileName= "pdfData.jpg";

//console.log( fileName.length, fileName[0] )

var length = fileName.length;

if( fileName[0]==='#' ) console.log( 'Store' );
else if( length >=4 && fileName.substring( length-4, length ) === ".pdf" ) console.log( 'Store' );
else if( length>=5 && fileName.substring( length-5, length ) === ".docx" ) console.log( "Store" );
else console.log( "Delete" );


var student= { name: "jhankar" , roll: 1014 ,department: "cse" };

var email = ""
email =  email.concat( student.name ).concat( student.roll ).concat(".").concat( student.department ).concat("@ph.ac.bd")

console.log(email);

var experience = 30;
var startingSalary = 45000;

var currentSalary =  Math.pow( 1.05, experience ) * startingSalary ;

console.log( currentSalary.toFixed(2) )


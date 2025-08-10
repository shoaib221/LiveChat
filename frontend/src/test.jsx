// My Submission failed due to the wrong format. Here is the new submission. 



/** Problem -01 ( Divide the Asset ) */
var area = 800;
//write your code here
console.log(area/2);



/** Problem -02 ( Cycle or Laptop ) */
var money = 10000;
//write your code here
if(money >= 25000) console.log("Laptop");
else if( money >= 10000 ) console.log("Cycle");
else console.log( "Chocolate" );



/** Problem -03 ( Medicine Planner ) */
var lastDay = 11 ;
//write your code here
for( var i=1; i<=lastDay; i++ )
{
    if( i%3===0 ) console.log( i+' - medicine' )
    else console.log( i+" - rest" )
}



/** Problem 04 - (Delete / Store) */
var fileName= "pdfData.jpg";
//write your code here
//console.log( fileName.length, fileName[0] )
var length = fileName.length;
if( fileName[0]==='#' ) console.log( 'Store' );
else if( length >=4 && fileName.substring( length-4, length ) === ".pdf" ) console.log( 'Store' );
else if( length>=5 && fileName.substring( length-5, length ) === ".docx" ) console.log( "Store" );
else console.log( "Delete" );



/** Problem 05 - ( PH Email Generator )  */
var student= { name: "jhankar" , roll: 1014 ,department: "cse" };
//write your code here
var email = ""
email = email.concat( student.name ).concat( student.roll ).concat(".").concat( student.department ).concat("@ph.ac.bd")
console.log(email);



/** Problem 06 :  (Current Salary )  */
var experience = 30;
var startingSalary = 45000;
//write your code here
var currentSalary = Math.pow( 1.05, experience ) * startingSalary ;
console.log( currentSalary.toFixed(2) )



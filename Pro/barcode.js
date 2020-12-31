/* Creates virtua barcode from given information */

{
	var errormode = new Boolean(false);
	console.log("errormode initialized, state: " + errormode);
	var errorcode;
	
	/* errorcodes: TO BE IMPLEMENTED!
	1. 
	2.
	3.
	4.
	5.
	6.
	
	*/
}

function generate_barcode() {
	//initialize stuff
	var startcode = "" ;
	//was "105" but should not be printed!;
	var version = "4";
	var account = document.getElementById('account').value; // 16 numbers - need to be formed
	var ref = document.getElementById('reference').value; //20 numbers fill zeroes on front
	var sum_eur = "12451"; // 6 numbers
	var sum_cnt = "4";
	var reserve = "000";
	var duedate; //YYMMDD, formed with tempdate later on so no sense define here
//	var duedate = "214914"; //YYMMDD

	//*****************************	
	//make sure all information is in sane format
	//*****************************
		
	/*just example, this is hardcoded stuff that should not be changed ever
	if (startcode != "105") {
		console.log("shit gonna go wrong do something!");

	}
	*/
	//*****************************
	//1. account number check
	//*****************************
	
	/*IBAN check. This should vaildate the whole account number so no further checks needed.
	
	1. move first 4 chars to end
	2. replace alphabets with numbers. A=10, B=11 etc Z=35
	3. divide with 97.
	4. var chekcsum = number % 97
	4.1: cannot calculate 20 long int because of limitations, rework calculation to split calculations into smaller chunks and combine end result.
	5. if checksum = 1 -> all ok
	
	how to replace alphabets with numbers.
	function alphabetPosition(text) {
		for (var i = 0; i < text.length; i++) {
		var code = text.toUpperCase().charCodeAt(i)
	}}
	*/
	
	if (!account) {
		alert("Tilinumeroa ei täytetty!");
		errormode = true;
		console.log("errormode set at: no account number defined");
	}
	// step x + 1 = remove all blanks
	account = account.replaceAll(/\s/g, "");
	console.log("account number with blanks removed: " + account);
	
	//step x + 2 = to uppercase
	account.toUpperCase();
	console.log("account number chars changed to upper case (just in case) :" + account);
	
	//step x + 3 = iban validation check 1 -> move first 4 chars to end
	
	var acc_moved = account.substr(4,) + account.substr(0,4);
	console.log("iban validation format phase 1: " + acc_moved);
	
	//step x + 4 = replace aphabet with numbers A=10, B=11 etc..
	
	/* unicode:
	space = 20
	0 = 48
	1 = 49
	...
	9 = 57
	
	A = 65
	B = 66
	...
	
	*/
	
	var offset;
	var offset_number = -48;
	var offset_letter = -55;
	var acc_checksum = "";
	var j;
	for (j=0; j < acc_moved.length;j++) {
		var charcode = acc_moved.charCodeAt(j)
		// unnecessary: console.log("charcode at " + j + " is " + charcode);
		if (charcode > 60) {
			offset = offset_letter;
		}
		if (charcode < 60) {
			offset = offset_number;
		}
		//fix the offset
		charcode = charcode + offset;
		console.log("character " + acc_moved.charAt(j) + " converted to " + charcode);
		acc_checksum = acc_checksum + charcode;
	}
	console.log("account number: " + account + " and checksum for calculation: " + acc_checksum);
	
	
	/*
	working example:
	function isIBAN(s){
    const rearranged = s.substring(4,s.length) + s.substring(0,4);
    const numeric   = Array.from(rearranged).map(c =>(isNaN(parseInt(c)) ? (c.charCodeAt(0)-55).toString() : c)).join('');
    const remainder = Array.from(numeric).map(c => parseInt(c)).reduce((remainder, value) => (remainder * 10 + value) % 97,0);

    return  remainder === 1;}
	
	This works because Modulo is distributive over addition, substraction and multiplication:

		(a+b)%m = ((a%m)+(b%m))%m
		(a-b)%m = ((a%m)-(b%m))%m
		(ab)%m = ((a%m)(b%m))%m
	
	*/
	
	//split checksum to half and calculate modulo, see more detailed description below.
	
	var splitlen = 10;
	var multip = Number("1"+filler(splitlen));
	console.log("first part split length: " + splitlen);
	console.log("first part multiplier to make number smaller: " + multip);

	var acc_checksum_start = Number(acc_checksum.substr(0,splitlen));

	console.log("reconstructed first number: " + acc_checksum_start * multip);
	var acc_checkstum_end = Number(acc_checksum.substr(splitlen,));
	console.log("split checksum: " + acc_checksum_start + " with multiplier " + multip + ", and : " + acc_checkstum_end);
	
	var control = 97;
	
	/*
	(ab+c)%m
	a = multiplier
	b= first part of checksum
	c= second part of checksum
	(((a%m)(b%m)%m)+(b%m))%m
	*/
	var remainder = (((multip % control)*(acc_checksum_start % control))%control+(acc_checkstum_end % control)) % control;
	console.log("remainder: " + remainder);
	
	if (remainder != 1) {
		console.log("Errormode set: account number check failed!");
		alert("Tarkasta tilinumero!");
		errormode = true;
	}
	
	
	// x + 99999 -> formulate account numbber correctly for barcode (remove first 2 chars)
	
	account = account.substr(2,);
	console.log("Account number for barcode: " + account);
	
	if (account.length != 16) {
		console.log("errormode set: account number has some strange issues with length.");
		alert("Outo virhe tilinumeron kanssa, jaa-a.");
		errormode = true;
	}
	
	//*****************************
	// 2. reference number check
	//*****************************
	
	if (!ref) {
		alert("Viitenumeroa ei täytetty!");
		errormode = true;
		console.log("errormode set: no reference number");
	}
	
	//TODO = REMOVE BLANKS!
	ref = ref.replaceAll(/\s/g, "");
	
	if (ref.length <= 20) {
		//do something
		var diff = 20 - ref.length;
		var filling = filler(diff);
		
		/*= "";
		var i;
		for (i=1;i<= diff;i++) {
			filler = filler + "0";
		}*/
	console.log("whole reference number : " + filling + ref);
	ref = filling + ref;
		
	}
	if (ref.length > 20 ) {
		alert("Tarkasta viitenumero, se on liian pitkä!");
		errormode = true;
		console.log("errormode set: too long reference number");
	}
	
	//*****************************
	// 3. money sum euro + cnt separated
	//*****************************
	var totalsum = String(document.getElementById('sum').value);
	console.log("Total sum: " + totalsum);
	
	totalsum = totalsum.split('.');
	
	console.log("Split sum: " + totalsum[0] + " and " + totalsum[1]);
	sum_eur = totalsum[0];
	sum_cnt = totalsum[1];
	
	if (sum_eur.length > 6) {
		alert("Liian iso euromääräinen summa! Max 999999,99€!");
		errormode = true;
		console.log("errormode set, too large euro sum");
	}
	if (sum_cnt.length > 2) {
		alert("Tarkasta summa, senttien määrä väärä! Todennäköisesti bugi tässä koodissa");
		errormode = true;
		console.log("errormode set, cnt sum does not match");
	}
	
	if (sum_eur.length < 6) {
		console.log("Need " + String(6-sum_eur.length) + " longer number for euro sum");
		var filling = filler(6-sum_eur.length);
		sum_eur = filling + sum_eur;
		//add filler here later
	}
	console.log("Euros: " + sum_eur);
	
	if (sum_cnt.length < 2) {
		console.log("Need " + String(2-sum_cnt.length) + " longer number for cnt sum");
		var filling = filler(2-sum_cnt.length);
		sum_cnt = sum_cnt + filling;
	}
	console.log("Cents: " +sum_cnt);
	
	
	//*****************************
	// 4. duedate
	//*****************************
	 
	var tempdate = document.getElementById('date').value;
	
	if (Date.parse(tempdate)-Date.parse(new Date())< 0) {
		alert("Päivämäärä menneisyydessä!");
		errormode = true;
		console.log("errormode set, due date in past");
	}
	tempdate = tempdate.split("-");
	
	/*
	console.log("date components: " + tempdate[0] +" & " + tempdate[1] + " & " + tempdate[2]);
	console.log("Year testing: " + tempdate[0].charAt(2) + tempdate[0].charAt(3));
	*/
	
	duedate = tempdate[0].charAt(2) + tempdate[0].charAt(3) + tempdate[1] + tempdate[2]
	console.log("final YY MM DD format:" + duedate);
	
	//note: this is not full barcode yet! checksum missing
	
	//format: startcode [3] + version [1] + account number [16] + euro [6] + cnt [2] + spare [3] + ref [20] + duedate [6] YYMMDD + checksum. total: 54 (from version to due date)
	var barcode = startcode + version + account + sum_eur + sum_cnt + reserve + ref + duedate;
	
	console.log("full barcode w/o checksum: " + barcode);
	
	//*****************************
	// calculate checksum for barcode
	//*****************************
	
	
	var i;
	var weightedsum = 0;
	var barcodetemp = barcode.slice(startcode.length); //remove starting code here
//	var barcodechunks = barcode.split(/(.{2}/);
	var barcodechunks = splitString(barcodetemp, 2);
	for (i=0; i <= 27; i++) {
		if (i < 1) {
			//calculate starting character with different logic because 3 chars and different weight!
			weightedsum = weightedsum + 105 * 1;
			console.log("Weighted sum: " + weightedsum);
		}
		if (i >= 1) {
		var j = i-1;
		weightedsum = weightedsum + Number(barcodechunks[i-1]) * i;
		console.log("Weighted sum: " + weightedsum);
	} }
	
	
	console.log("Weighted sum: " + weightedsum);
	var checksum = weightedsum % 103;
	console.log("Checksum: " + checksum);
	//output and something
	
	//barcode = barcode + checksum; NOTE: virtual barcode does not even require that checksum!
	
	uimessage(barcode);
	
	//put it also to clipboard:
	var range = document.createRange();
	range.selectNode(document.getElementById("status"));
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
	document.execCommand("copy");
	window.getSelection().removeAllRanges();
	
	uimessage("Viivakoodi kopioitu leikepöydälle")
	setTimeout(() => {  uimessage(barcode); }, 2000);
	//uimessage(barcode);
	
	//this errormode shit does not work, to be done later on.
	
	
	/*if (errormode = false) {
		//no errors, output barcode 
	}
	if (errormode = true) {
		uimessage("Virhe tapahtunut, viivakoodia ei voida muodostaa!");
		
	}*/
	//reset any possible errors
	
	console.log("Errormode before reset: " + errormode);
	errormode = false;
	
}

function reset_form() {
	uimessage(" ");
	document.getElementById('account').value = "";
	document.getElementById('reference').value = "";
}

function uimessage(message, time = 1000) {
	var status = document.getElementById('status');
	if (!message){
		console.log("No message specified internal error");
		message = "ERRRORORORORORORORO";
	}
	status.textContent = message;
}


function filler(qty) {
	var i;
	var fill = "";
	for (i=1; i<= qty; i++) {
		fill = fill + "0";
	}
	console.log("filler: " + fill + " asked.");
	return fill;
}
	
	/**
https://gist.github.com/hendriklammers/5231994#file-splitstring-js-L7
 * Split a string into chunks of the given size
 * @param  {String} string is the String to split
 * @param  {Number} size is the size you of the cuts
 * @return {Array} an Array with the strings
 */
function splitString (string, size) {
	var re = new RegExp('.{1,' + size + '}', 'g');
	console.log("splitting chunk: " + string.match(re));
	return string.match(re);
}
	
//document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('generate').addEventListener('click', generate_barcode);
document.getElementById('reset').addEventListener('click', reset_form);
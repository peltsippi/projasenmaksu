/* Creates virtua barcode from given information */


function save_options() {
	console.log("save button pressed");
  var f_rate = document.getElementById('rate').value;
  if (!f_rate) {
	  console.log("rate field empty, issue warning and revert to default");
	  window.alert("Prosenttiosuus tyhjä, palautetaan vakioarvo");
	  document.getElementById('rate').value = default_fee;
	  f_rate = default_fee;
  }
  console.log("rate set from form:");
  console.log(f_rate);
  var f_max = document.getElementById('max').value;   
  if (!f_max) {
	  console.log("max sum field empty issue warning and revert to default");
	  window.alert("Maksimisumma tyhjä, palautetaan vakioarvo");
	  document.getElementById('max').value = default_max;
	  f_max = default_max;
  }
  console.log("Storing values: " + f_rate + " & " + f_max);
  chrome.storage.sync.set({	
    fee_rate: f_rate,
	fee_max: f_max  }, 
	function() {
		uimessage("Tallennettu.", "1000");
  });
}
/*
 Restores select box and checkbox state using the preferences
 stored in chrome.storage.
*/
function restore_options() {
  console.log("Haetaan chromesta aikaisemmin asetettuja arvoja");
  chrome.storage.sync.get({
    fee_rate: "1.25",
    fee_max: "49"
  }, function(items) {
      console.log("haettu arvot: " + items.fee_rate + " & " + items.fee_max + ". ,asetetaan ne formiin");
	  
	  document.getElementById('rate').value = items.fee_rate;
	  document.getElementById('max').value = items.fee_max;

  });
}



function generate_barcode() {
	//get all required information
	var startcode = "105";
	var version = "4";
	var account = document.getElementById('account').value; // 16 numbers - need to be formed
	var ref = document.getElementById('reference').value; //20 numbers fill zeroes on front
	var sum_eur = "12451"; // 6 numbers
	var sum_cnt = "4";
	var reserve = "000";
	var duedate = "214914"; //YYMMDD
	
	//make sure all information is in sane format
	
	//just example, this is hardcoded stuff that should not be changed ever
	if (startcode != "105") {
		console.log("shit gonna go wrong do something!");

	}
	
	if (!account) {
		alert("Account field not filled!");
	}
	// step x + 1 = remove all blanks
	account.replace(/\s/g, "");
	console.log("account number with blanks removed: " + account);
	
	//step x + 2 = to uppercase
	account.toUpperCase();
	console.log("account number chars changed to upper case :" + account);
	
	/*first check: IBAN check. This should vaildate the whole account number so no further checks needed.
	
	1. move first 4 chars to end
	2. replace alphabets with numbers. A=10, B=11 etc Z=35
	3. divide with 97.
	4. var chekcsum = number % 97
	5. if checksum = 1 -> all ok
	
	how to replace alphabets with numbers.
	function alphabetPosition(text) {
		for (var i = 0; i < text.length; i++) {
		var code = text.toUpperCase().charCodeAt(i)
	}}
	*/
	
	/*
	Unnecessary due to IBAN check!
	if (account.length != 16) {
		console.log("account lenght bad, shit gonna go wrong do something!");
	}
	
	*/
	
	
	// collect stuff here
	
	//reference number check
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
	}
	
	if (sum_eur.length > 6) {
		alert("Liian iso euromääräinen summa!");
	}
	if (sum_cnt.length > 2) {
		alert("Tarkasta summa, senttien määrä väärä!");
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
		var filling = filler
	}
	//note: this is not full barcode yet! checksum missing
	//format: startcode [3] + version [1] + account number [16] + euro [6] + cnt [2] + spare [3] + ref [20] + duedate [6] YYMMDD + checksum. total: 54 (from version to due date)
	var barcode = startcode + version + account + ref + sum_eur + sum_cnt + reserve + duedate;
	
	console.log("full barcode w/o checksum: " + barcode);
	
	//calculate checksum
	
	
	var i;
	var weightedsum = 0;
	var barcodetemp = barcode.slice(3); //remove first 3 starting code here
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
	console.log("filler: " + fill);
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
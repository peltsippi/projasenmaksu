	  setInterval(lookForChange, 100);
	  var oldVal = document.getElementById("income").value;
	  var oldVal2 = document.getElementById("ref").value;

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('settings').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});
  
	  function lookForChange() {
		var calc = 0;
		var newVal = document.getElementById("income").value;
		var selec = document.getElementById('ref');
		var newVal2 = selec.selectedIndex;
		if (newVal != oldVal) {
			oldVal = newVal;
			calc = 1;
		}
		if (newVal2 != oldVal2) {
			oldVal2 = newVal2;
			calc = 1;
		}
		if (calc == 1) {
			calculateTotal();     // do whatever you need to do
			calc = 0;
		}
}
  function calculateTotal()
{
  
  let rate= 0.0125;
  let maxtotal = document.getElementById('maxtotal').value;
  
  let rate_percent = rate * 100;
  
  document.getElementById("rate_field").value = rate_percent;  
  
  let total = document.getElementById("income").value * rate;
  
  total = Math.round((total) * 100) / 100;
  
  if (total > maxtotal) {total = maxtotal};
 
  document.getElementById("total_value").textContent = total + " €";
  createBarCode(total);
}

   function createBarCode(total) 
{
  var sel = document.getElementById('ref');
  //console.log(sel);
  var opt = sel.options[sel.selectedIndex];
  //var textt = opt;
  console.log(opt);
  
  if (sel.selectedIndex == -1) {
	  console.log("cancelling");
	  return;
  }	
  var dateref = opt.value;
  var datereftemp = dateref.split(";");
  var date = datereftemp[0];
  date = date.split("-");
  var year = date[0];
  var month = date[1];
  var day = date[2];
  //console.log("y: " + year + " month: " + month + " day: " + day);
  var refer = datereftemp[1];
  //console.log("ref: " + refer);
  var acco = document.getElementById("acco").value;
  //console.log("account: " + acco);
  var moneysum = String(total);
  moneysum = moneysum.split(".");
  var euros = moneysum[0];
  var cents = moneysum[1];
  //console.log("Eurot: " + euros);
  
  var barcodeAcco = checkAccNo(acco); //lets just separate these just in case...
  var barcodeRefer = checkRefNo(refer); //convert to barcode ok format
  var barcodeSum = checkMoneySum(euros, cents);
  var barcodeDate = year.substr(2,) + month + day;
  //console.log("barcode date: " + barcodeDate);
  //console.log("barcode sum: " + barcodeSum);

  var startcode = "";
  var version = "4";
  var spare = filler(3);

  var barcodeFinal = startcode + version + barcodeAcco + barcodeSum + spare + barcodeRefer + barcodeDate;
  
  document.getElementById("barcode").value = barcodeFinal;
  
  //format: startcode [3] + version [1] + account number [16] + euro [6] + cnt [2] + spare [3] + ref [20] + duedate [6] YYMMDD + checksum. total: 54 (from version to due date)
  //document.getElementById("barcode").value = String(year) + String(month) + String(day)+ String(barcodeRefer) + String(euros) + String(cents)+barcodeAcco;
}	

function checkMoneySum(euros, cents) {

	
	if (euros.length > 6) {
		//alert("Liian iso euromääräinen summa! Max 999999,99€!");
		//errormode = true;
		console.log("errormode set, too large euro sum");
	}
	if (cents.length > 2) {
		//alert("Tarkasta summa, senttien määrä väärä! Todennäköisesti bugi tässä koodissa");
		//errormode = true;
		console.log("errormode set, cnt sum does not match");
	}
	
	if (euros.length < 6) {
		console.log("Need " + String(6-euros.length) + " longer number for euro sum");
		var filling = filler(6-euros.length);
		euros = filling + euros;
		//add filler here later
	}
	console.log("Euros: " + euros);
	
	if (cents.length < 2) {
		//console.log("Need " + String(2-sum_cnt.length) + " longer number for cnt sum");
		var filling = filler(2-cents.length);
		cents = cents + filling;
	}
	console.log("Cents: " + cents);
	
	return euros + cents;
}

function checkAccNo(acco) {
	//IBAN CHECK
  acco = acco.replaceAll(/\s/g, ""); //remove blanks
  acco.toUpperCase(); //convert to uppercase (just in case)
  var acco_modif = acco.substr(4,) + acco.substr(0,4); //move 4 first digits to end
  //step x + 4 = replace aphabet with numbers A=10, B=11 etc..
  var offset;
	var offset_number = -48;
	var offset_letter = -55;
	var acc_checksum = "";
	var j;
	for (j=0; j < acco_modif.length;j++) {
		var charcode = acco_modif.charCodeAt(j)
		if (charcode > 60) {
			offset = offset_letter;
		}
		if (charcode < 60) {
			offset = offset_number;
		}
		//fix the offset
		charcode = charcode + offset;
		console.log("character " + acco_modif.charAt(j) + " converted to " + charcode);
		acc_checksum = acc_checksum + charcode;
	}
	console.log("account number: " + acco + " and checksum for calculation: " + acc_checksum);
  
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
		//console.log("Errormode set: account number check failed!");
		//alert("Tarkasta tilinumero!");
		//errormode = true;
		return 8888888888888888;
	}
	
	
	// x + 99999 -> formulate account numbber correctly for barcode (remove first 2 chars)
	
	acco = acco.substr(2,);
	console.log("Account number for barcode: " + acco);
	
	if (acco.length != 16) {
		//console.log("errormode set: account number has some strange issues with length.");
		//alert("Outo virhe tilinumeron kanssa, jaa-a.");
		//errormode = true;
		return 9999999999999999; //not figuring this out yet, just dump this instead of acc no.
	}
	
	return acco;
}

function checkRefNo(ref) {
	ref = ref.replaceAll(/\s/g, ""); //remove blanks
	if (ref.length <= 20) {
		var filling = filler(20 - ref.length);
		ref = filling + ref;
	}
	
	if (ref.length > 20) {
		return 99999999999999999999;
	}
	
	return ref;
}
//todo: this function is twice in the codebase, do something later on!
function restore_options() {
  console.log("Haetaan chromesta aikaisemmin asetettuja arvoja");
  chrome.storage.sync.get({
    fee_rate: "1.25",
    fee_max: "49",
	accno: "FI76 1521 3000 1039 47",
	list: []
  }, function(items) {
      console.log("haettu arvot: " + items.fee_rate + " & " + items.fee_max + ". ,asetetaan ne formiin");
	  
	  document.getElementById('rate_field').value = items.fee_rate;
	  document.getElementById('maxtotal').value = items.fee_max;
	  
	  refnos = items.list;
	  var selection = document.getElementById('ref');
	  for (var i = 0; i < refnos.length; i ++) {
		  var options = document.createElement("option");
		  options.text = refnos[i].replace(";", " - ");
		  options.value = refnos[i];
		  selection.add(options)
	  }		 
	document.getElementById("acco").value = items.accno;

  });
  console.log("sit vielä lasketaan ekan kerran");
  calculateTotal;
}

async function restore_data() {
	//console.warn("restore_data function started");
	chrome.storage.sync.get({
    fee_rate: "1.25",
    fee_max: "49",
	accno: "FI76 1521 3000 1039 47",
	list: []
  }, function(items) {
      //console.log("haettu arvot: " + items.fee_rate + " & " + items.fee_max + ".");
	  fee = items.fee_rate;
	  //console.warn("Fee: " + fee);
	  document.getElementById('rate').value = fee;
	  maxsum = items.fee_max;
	  //console.warn("Maxsum: " + maxsum);
	  document.getElementById('max').value = maxsum;
	  accno = items.accno;
	  //console.warn("Accno: " + accno);
	  document.getElementById('accno').value = accno;
	  refnos = items.list;
	  //console.warn("Refno list length: " + refnos.length);
	  populateRefList(refnos);
	  for (var i = 0; i < refnos.length; i++) {
		  //console.warn("Ref no#" + i+1 + " is " + refnos[i]);
	  }
	  
  });
  
  return true;
}

function filler(qty) { //returns desired amounts of zeroes for the barcode
	var i;
	var fill = "";
	for (i=1; i<= qty; i++) {
		fill = fill + "0";
	}
	console.log("filler: " + fill + " asked.");
	return fill;
}
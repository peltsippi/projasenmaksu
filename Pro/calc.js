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
  
  var sel = document.getElementById('ref');
  //console.log(sel);
  var opt = sel.options[sel.selectedIndex];
  //var textt = opt;
  console.log(opt);
  
  var dateref = opt.value;
  console.log("dateref: " + dateref);
  //console.log("Valittu elementti: " + selection.selectedIndex);
  //console.log("teksti: " + textt);
  //var dateref = selection.options[0].text;
  
  var datereftemp = dateref.split(";");
  var date = datereftemp[0];
  date = date.split("-");
  var year = date[0];
  var month = date[1];
  var day = date[2];
  //console.log("date: " + date);
  console.log("y: " + year + " month: " + month + " day: " + day);
  
  
  var refer = datereftemp[1];
  console.log("ref: " + refer);
  var acco = document.getElementById("acco").value;
  console.log("account: " + acco);
  var moneysum = String(total);
  moneysum = moneysum.split(".");
  var euros = moneysum[0];
  var cents = moneysum[1];
  console.log("Eurot: " + euros);
  
  //document.getElementById("barcode").value = date & " - " & refer & " - " & acco & " - " & total; 
  document.getElementById("barcode").value = String(year) + String(month) + String(day)+ String(refer) + String(euros) + String(cents) + String(acco).substring(1,); //euros & cents;
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

/* Saves options to chrome.storage */


{
var default_fee = "1.25";
var default_max = "49";
}

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

function reset_to_default() {
	console.log("Resetoidaan vakiot takaisin (fee + max):");
	console.log(default_fee);
	console.log(default_max);
	document.getElementById('rate').value = default_fee;
	document.getElementById('max').value = default_max;
	uimessage("Vakiot palautettu",750);
	//wait for sec and 
	setTimeout(save_options,760);

}

function uimessage(message, time = 1000) {
	var status = document.getElementById('status');
	if (!message){
		console.log("No message specified internal error");
		message = "ERRRORORORORORORORO";
	}
	status.textContent = message;
    setTimeout(function() {
      status.textContent = 'Odottaa käyttäjän toimia';
    }, time);
}
	
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_to_default);
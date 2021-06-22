	  setInterval(lookForChange, 100);
	  var oldVal = document.getElementById("income").value;

document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('settings').addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});
  
	  function lookForChange()
{
		var newVal = document.getElementById("income").value;
		if (newVal != oldVal) {
        oldVal = newVal;
        calculateTotal();     // do whatever you need to do
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
  
}	
//todo: this function is twice in the codebase, do something later on!
function restore_options() {
  console.log("Haetaan chromesta aikaisemmin asetettuja arvoja");
  chrome.storage.sync.get({
    fee_rate: "1.25",
    fee_max: "49"
  }, function(items) {
      console.log("haettu arvot: " + items.fee_rate + " & " + items.fee_max + ". ,asetetaan ne formiin");
	  
	  document.getElementById('rate_field').value = items.fee_rate;
	  document.getElementById('maxtotal').value = items.fee_max;

  });
  console.log("sit vielä lasketaan ekan kerran");
  calculateTotal;
}
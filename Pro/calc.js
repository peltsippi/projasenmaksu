  function calculateTotal()
{
  
  let rate= 0.0125;
  let maxtotal = 45;
  
  let rate_percent = rate * 100;
  
  document.getElementById("rate_field").value = rate_percent;  
  
  let total = document.getElementById("income").value * rate;
  
  total = Math.round((total) * 100) / 100;
  
  if (total > maxtotal) {total = maxtotal};
 
  document.getElementById("total_value").textContent = total + " €";
  
}
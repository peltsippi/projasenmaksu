/* Saves options to chrome.storage */



var default_fee = "1.25";
var default_max = "49";
var default_accno = "FI76 1521 3000 1039 47";
//FI76 1521 3000 1039 47   NDEAFIHH

var fee = "";
var maxsum = "";
var accno = "";
var refnos= [];

var testing_fee = "";
var testing_max = "";
var testing_accno = "";
var testing_refnos = ["xxxx-xx-xx;215122515999"];


function save_options() {
	console.log("save button pressed");
	fee = checkvalidity('rate', "Rate ", default_fee);
	maxsum = checkvalidity('max', "Maximum sum ", default_max);
	accno = checkvalidity('accno', "Account no ", default_accno);
	console.log("Storing values: " + fee + " & " + maxsum + " & " + accno + " plus array");	
	readUitoArray();
	console.log("Printing out array info from save_options");
	console.log("Array length: " + refnos.length);
	for (var i = 0; i < refnos.length; i++) {
		console.log("Array pos " + i + " and data: " + refnos[i]);	
	}
	//populateRefList(refnos);
	
	sync_data();
	//sync_test_data();
  
}

function sync_data() {
	 chrome.storage.sync.set({	
    fee_rate: fee,
	fee_max: maxsum,  
	acc_no: accno,
	list: refnos}, 
	function() {
		uimessage("Saved.", "1000");
  });
}

function sync_test_data() {
	testing_fee = fee;
	testing_max = maxsum;
	testing_accno = accno;
	console.log("array length: " + refnos.length);
	testing_refnos = [];
	testing_refnos = refnos;
	console.log("test array length: " + testing_accno.length);	
}

function restore_test_data() {
	fee = testing_fee;
	max = testing_max;
	accno = testing_accno;
	refnos = [];
	refnos = testing_refnos;
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

async function restore_options() {
	//console.warn("restore_data called async");
	let result = await restore_data();
	//restore_test_data();
	if (!(result)) {
	console.warn("Fetching values failed somehow!");
	
	}
	
}

function populateRefList(refnos) {
	//first clear all and then fetch from array. ?!?
	
	var table = document.getElementById('refnos');
	console.log("Table rows total: " + table.rows.length);
	//for (var i = 0; i < table.rows.length; i++) {
	for (var i = table.rows.length-1; i > 0; i--) {
		console.log("Deleting row " + i);
		table.deleteRow(i);
	}
	
	console.log("refnos length: " + refnos.length);
	for (var i = 0; i < refnos.length; i++) {
		  var dump = refnos[i].split(";");
		  var date = dump[0];
		  console.log("retrieved date: " + date);
		  var refno = dump[1];
		  console.log("retrieved refno: " + refno);
		  add_ref_field("",date,refno);
	  }
}

function readUitoArray() {
	refnos = []; //clear the array
	//now read rows from the table to the array
	var table = document.getElementById('refnos');
	var rowcount = table.rows.length;
	//window.alert("Detected " + rowcount + " rows in table");
	for (var i = 1; i < rowcount; i ++) {
		//throw("Error # " + i);
		console.log("adding row " + i + " to array");
		var column1 = table.rows[i].cells[0].innerHTML;
		var column2 = table.rows[i].cells[1].innerHTML;
		var output = column1 + ";" + column2;
		console.log("Output: " + output);
		//throw(output);
		refnos.push(output);
	}
	console.log("Final array composition: ");
	console.log("Lenght: " + refnos.length);
	console.log("So this should be ok now");
}

function reset_to_default() {
	console.log("Resetoidaan vakiot takaisin (fee + max):");
	console.log(default_fee);
	console.log(default_max);
	document.getElementById('rate').value = default_fee;
	document.getElementById('max').value = default_max;
	
	refnos= [];
	populateRefList(refnos);
	uimessage("Vakiot palautettu",750);
	//wait for sec and 
	setTimeout(save_options,750);
	//save_options();

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

function checkvalidity(elementname, errormsg, defaultvalue) {
	var teststring = document.getElementById(elementname).value;
//	console.log("Check validity called wit parameters " + elementname + " " + errormsg + " " + defaultvalue);
	if (!teststring) {
		uimessage(errormsg + " value missing, reverting to defaults!");
//		setTimeout(function() {	document.getElementById(elementname).value = defaultvalue; }, 1500):
		document.getElementById(elementname).value = defaultvalue;
	}
	return document.getElementById(elementname).value;
}

function add_ref_field(action, field1, field2) {
	console.log("add ref field called with param " + action + " & " + field1 + " & " + field2);
	var table = document.getElementById('refnos');
	var rowcount = table.rows.length;
	var row = table.insertRow(rowcount);
	var rowid = "ID-" + rowcount + 1;
	row.id = rowid;
	//console.log("date field: " + document.getElementById('sdate').value);
	var column1 = row.insertCell(0);
	if (!field1) {
		field1 = document.getElementById('sdate').value;			
		if (!field1) {
			field1 = "xxxx-xx-xx";
		}
	}
	column1.innerHTML = field1;
	
	var column2 = row.insertCell(1);
	if (!field2) {
		field2 = document.getElementById('refno').value;
		if (!field2) {
			field2 = "12345678";
		}
	}
	column2.innerHTML = field2;
	
	var column3 = row.insertCell(2);
	var element1 = document.createElement("input");
	element1.type = "button";
	var name = "Button-" + (rowcount + 1);
	console.log("Added button " + name);
	element1.name = name;
	element1.setAttribute('value', '-');
	element1.onclick = function() { removeRow(rowid) }
	column3.appendChild(element1);	
	
	save_options();

}

function removeRow(rowName) {
	console.log("Deletoitavan rivin nimi: " + rowName);
	try {
		var table = document.getElementById('refnos');
		var rowcount = table.rows.length;
		for (var i = 0; i < rowcount; i++) {
			var row = table.rows[i];

			if (row.id == rowName)
			{
				//console.log("deletoidaan mätsäävä");
				table.deleteRow(i);
				rowcount--;
			}
		
		}
	}
		
	catch (e) {
		alert(e);
	}
	save_options();
}

	
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_to_default);
document.getElementById('addrefno').addEventListener('click', add_ref_field);
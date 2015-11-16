/**************************************************************************************************

						Functions Used for Loading and Saving Files
									(scFileFunction.js)

**************************************************************************************************/
/* 
Function manual: 
	Provides easy access to the user manual.
	Opens the html document "manual.html" in a new window.
*/
function manual(){
	helpwindow = window.open('manual.html','User Manual');
	helpwindow.focus();
};

/* 
Function save: 
	Saves an HTML document with a comma separated array of memory and input boxes.
	Note: This will work in any modern browser.
*/
function save(){
	page=
	"<!DOCTYPE html>"+
		"<HTML>"+
			"<HEAD>"+
				"<meta charset='UTF-8'>"+
				"<TITLE>Load Simple Computer Program</TITLE>"+
				"<link href='sc.css' rel='stylesheet' type='text/css'>"+
				"<SCRIPT LANGUAGE='JavaScript'>"+
					"Memory = new Array(";
	for (i=1;i<=98;i++){
		cellNo = (i.toString().length==1? "0"+i: i.toString());
		page= page+ "'"+ document.Memory['M'+cellNo].value+ "',";
	};
	page= page+ "'"+ document.Memory['M99'].value+ "')\;"+
					"Input = new Array(";
	for (i=1;i<=14;i++){
		cardNo = (i.toString().length==1? "0"+i: i.toString());
		page= page+ "'"+ document.Input['I'+cardNo].value+ "',";
	};
	page= page+ "'"+ document.Input['I15'].value+ "')\;"+
				"<"+"/SCRIPT>"+
			"</HEAD>"+
			"<BODY>"+
			"<br><br>"+
				"<FORM>"+
					"<CENTER>"+
						"<INPUT TYPE=BUTTON VALUE='Load Simple Computer Program' onClick='SC.loadfile();'></INPUT><BR>"+
					"</CENTER>"+
				"</FORM>"+
			"</BODY>"+
		"</HTML>";

	var save = new Blob([page], {type: "text/html;charset=utf-8"});
	saveAs(save, "myProgram.html");
};


/* 
Function fileLoader: 
	Opens a new HTML window that allows a user to select a test case program or a 
	file from their local machine.
	Note: This will not work in IE or Safari due to security precautions. It will function normally
	in Mozilla Firefox. It will also work in Chrome (if flag --allow-file-access-from-files is set)
*/
function fileLoader(){
	lastindex = self.location.href.lastIndexOf("/");
	pURL = self.location.href.substring(0,lastindex+1);
	loaderHTML = 
		"<!DOCTYPE html>"+
			"<HTML>"+
				"<HEAD>"+
					"<meta charset='UTF-8'>"+
					"<TITLE>Simple Computer Program Select</TITLE>"+
					"<link href='"+ pURL+ "sc.css' rel='stylesheet' type='text/css'>"+
				"</HEAD>"+
				"<BODY>"+
				"<CENTER>"+
				"<br><br>"+
					"<FORM NAME='select'>"+
						"<INPUT TYPE=TEXT NAME='file' value='"+ pURL+ "' SIZE=100><INPUT TYPE=BUTTON VALUE='Select File' onClick='SC.selectfile();'>"+
						"<h3>Test Cases</h3>"+
						"<font size='4'>"+
						"<TABLE CELLPADDING=5 CELLSPACING=0 BORDER=0 ALIGN=CENTER>"+
							"<TR><TD HEIGHT=175 VALIGN=TOP ALIGN=CENTER>"+
								"<A HREF='DIVISION.html' onClick=\"document.select.file.value='"+ pURL+ "DIVISION.html';return false;\">DIVISION [Program 5]</A><BR>"+
								"<A HREF='SHIFTING.html' onClick=\"document.select.file.value='"+ pURL+ "SHIFTING.html';return false;\">SHIFTING DIGITS [Program 6]</A><BR>"+
								"<A HREF='ABSOLUTE.html' onClick=\"document.select.file.value='"+ pURL+ "ABSOLUTE.html';return false;\">ABSOLUTE VALUE [Program 9]</A><BR>"+
								"<A HREF='BOOTSTRAP.html' onClick=\"document.select.file.value='"+ pURL+ "BOOTSTRAP.html';return false;\">Bootstrap the Loader</A><BR>"+
								"<A HREF='myProgram.html' onClick=\"document.select.file.value='"+ pURL+ "myProgram.html';return false;\">TestProgram.html</A><BR>"+
							"</TD></TR>"+
						"</TABLE>"+
					"</font>"+
					"</FORM>"+
				"</CENTER>"+
				"</BODY>"+
			"</HTML>";
	filewindow = window.open('javascript:opener.loaderHTML','files');
	filewindow.focus();
	filewindow.SC=self;
};

/* 
Function selectFile: 
	Called from within fileLoader()
	The same browser limitation exists.
*/
function selectfile(){
	programwindow = window.open(filewindow.document.select.file.value,'programs');
	programwindow.focus();
	programwindow.SC=self;
	filewindow.close();
};

/* 
Function loadfile: 
	Loops through the comma separated array stored in the HTML document that save() generates
	Adds any populated value in memory or input card to the current window.
*/
function loadfile(){
	for (i=1;i<=99;i++){
		cellNo = (i.toString().length==1? "0"+i: i.toString());
		document.Memory['M'+cellNo].value=programwindow.Memory[i-1];
	};
	for (i=1;i<=15;i++){
		cardNo = (i.toString().length==1? "0"+i: i.toString());
		document.Input['I'+cardNo].value=programwindow.Input[i-1];
	};
	programwindow.close();
};

function fileLoader(){
	lastindex = self.location.href.lastIndexOf("/");
	programURL = self.location.href.substring(0,lastindex+1);
	loaderHTML = 
		"<!DOCTYPE html>"+
			"<HTML>"+
				"<HEAD>"+
					"<meta charset='UTF-8'>"+
					"<TITLE>Simple Computer Program Select</TITLE>"+
					"<link href='"+ programURL+ "sc.css' rel='stylesheet' type='text/css'>"+
				"</HEAD>"+
				"<BODY>"+
				"<CENTER>"+
				"<br><br>"+
					"<FORM NAME='select'>"+
						"<INPUT TYPE=TEXT NAME='file' value='"+ programURL+ "' SIZE=100><INPUT TYPE=BUTTON VALUE='Select File' onClick='SC.selectfile();'>"+
						"<h3>Test Cases</h3>"+
						"<font size='4'>"+
						"<TABLE CELLPADDING=5 CELLSPACING=0 BORDER=0 ALIGN=CENTER>"+
							"<TR><TD HEIGHT=175 VALIGN=TOP ALIGN=CENTER>"+
								"<A HREF='DIVISION.html' onClick=\"document.select.file.value='"+ programURL+ "DIVISION.html';return false;\">DIVISION [Program 5]</A><BR>"+
								"<A HREF='SHIFTING.html' onClick=\"document.select.file.value='"+ programURL+ "SHIFTING.html';return false;\">SHIFTING DIGITS [Program 6]</A><BR>"+
								"<A HREF='ABSOLUTE.html' onClick=\"document.select.file.value='"+ programURL+ "ABSOLUTE.html';return false;\">ABSOLUTE VALUE [Program 9]</A><BR>"+
								"<A HREF='BOOTSTRAP.html' onClick=\"document.select.file.value='"+ programURL+ "BOOTSTRAP.html';return false;\">Bootstrap the Loader</A><BR>"+
								"<A HREF='myProgram.html' onClick=\"document.select.file.value='"+ programURL+ "myProgram.html';return false;\">TestProgram.html</A><BR>"+
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

function selectfile(){
	programwindow = window.open(filewindow.document.select.file.value,'programs');
	programwindow.focus();
	programwindow.SC=self;
	filewindow.close();
};

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

function savefile(){
	savefilepage=
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
		savefilepage= savefilepage+ "'"+ document.Memory['M'+cellNo].value+ "',";
	};
	savefilepage= savefilepage+ "'"+ document.Memory['M99'].value+ "')\;"+
					"Input = new Array(";
	for (i=1;i<=14;i++){
		cardNo = (i.toString().length==1? "0"+i: i.toString());
		savefilepage= savefilepage+ "'"+ document.Input['I'+cardNo].value+ "',";
	};
	savefilepage= savefilepage+ "'"+ document.Input['I15'].value+ "')\;"+
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

	var save = new Blob([savefilepage], {type: "text/html;charset=utf-8"});
	saveAs(save, "myProgram.html");
};

function manual(){
	helpwindow = window.open('manual.html','User Manual');
	helpwindow.focus();
};

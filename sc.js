
/* 
Function Initialize: 
	Called on page load to initialize Program Counter, input cards, output cards,
	and highlight images.
*/
function initialize(){
	document.CPU.PC.value='00';
	inCardNo="01";
	outCardNo="01";
};

/* 
Function Cycle: 
	The main CPU cycle, including fetch(), decode(), and execute()
	Parameters:
		N: The number of memory cells to cycle through. If the user presses step, N = 1.
			If the user presses Run, N = 100.
*/
function cycle(N){
	for (i=1; i<=N; i++){
		if (fetch()) break;
		if (decode()) break;
		if (execute()) break;
	};
};

/* 
Function Fetch: 
	Fetches the value of the memory cell pointed to by PC and inserts it into the
	instruction register. Increments the program counter.
*/
function fetch(){
	// Insert the value in memory cell pointed to by PC into IR
	IR = document.Memory["M"+document.CPU.PC.value].value;
	// Error checking
	if (IR.length <4) {
		alert('Error: Memory cell being fetched is empty.');
		return 1;
	};
	if (IR<=0) {
		alert('Error: Memory cell being fetched is less than zero.');
		return 1;
	};
	// Update the IR input box in index.html
	document.CPU.IR.value = IR;
	// Store the current value of the PC text box in index.html in the variable PC
	PC = document.CPU.PC.value;
	// Increment Program Counter
	PC++;
	// Update the PC input box in index.html
	document.CPU.PC.value = 
	// Convert PC to a string, if length is less than 1 (ie. PC < 10), add "0" to the front
	(PC.toString().length==1? "0"+PC:
	// Else PC is greater than 10 so simply convert to string
	PC.toString());
	return 0;
};

function decode(){
	// Separate opCode (equivalent to opCode = IR % 100
	opCode = IR.charAt(1);
	operand = IR.substring(2,4);
	return 0;
};

function execute(){
	if(opCode=="0"){return input(operand);};
	if(opCode=="1"){return OUT(operand);};
	if(opCode=="2"){return ADD(operand);};
	if(opCode=="3"){return SUB(operand);};
	if(opCode=="4"){return LDA(operand);};
	if(opCode=="5"){return STA(operand);};
	if(opCode=="6"){return JMP(operand);};
	if(opCode=="7"){return TAC(operand);};
	if(opCode=="8"){return SHF(operand);};
	if(opCode=="9"){return HLT(operand);};
	return 1;
};

/* 
Function Input:
	Loads the value of the current input card into the memory cell specified in the operand.
	The input function is called when opCode = 0.
*/
function input(operand){
	In = document.Input["I"+inCardNo].value;
	if (In.length <4) {
		alert('Execution Halted: Input card is empty.');
		return 1;
	};
	document.Memory["M"+operand].value = In;
	inCardNo++;
	inCardNo = (inCardNo.toString().length==1? "0"+inCardNo: inCardNo.toString());
	return 0;
};

function OUT(operand){
	document.Output["Out"+outCardNo].value = document.Memory["M"+operand].value;
	outCardNo++;
	outCardNo = (outCardNo.toString().length==1? "0"+outCardNo: outCardNo.toString());
	return 0;
};

function ADD(operand){
	// subtract zero to force type conversion.
	sum = (document.CPU.AC.value-0) + (document.Memory["M"+operand].value-0);
	if(sum>999){
		document.CPU.CARRY.value = "1";
		sum = sum.toString().substring(1,4) - 999;
	}else{
		if(sum<-999){
			document.CPU.CARRY.value = "1";
			sum = 999 - sum.toString().substring(2,5);
		}else{
			document.CPU.CARRY.value = "0";
		};
	};
	document.CPU.AC.value = format(sum.toString());
	return 0;
};

function SUB(operand){
	diff = document.CPU.AC.value - document.Memory["M"+operand].value;
	if(diff>999){
		document.CPU.CARRY.value = "1";
		diff = diff.toString().substring(1,4) - 999;
	}else{
		if(diff<-999){
			document.CPU.CARRY.value = "1";
			diff = 999 - diff.toString().substring(2,5);
		}else{
			document.CPU.CARRY.value = "0";
		};
	};
	document.CPU.AC.value = format(diff.toString());
	return 0;
};

function LDA(operand){
	document.CPU.CARRY.value = "0";
	document.CPU.AC.value = document.Memory["M"+operand].value;
	return 0;
};

function STA(operand){
	document.Memory["M"+operand].value = document.CPU.AC.value;
	return 0;
};

function JMP(operand){
	document.Memory["M99"].value = " 0" + document.CPU.PC.value;
	document.CPU.PC.value = operand;
	return 0;
};

function TAC(operand){
	if(document.CPU.AC.value < 0){
		document.CPU.PC.value = operand;
	};
	return 0;
};

function SHF(XY){
	x = XY.charAt(0);
	y = XY.charAt(1);
	if(x!=0 || y!=0){
		if(x!=0){
			index = x;
			document.CPU.CARRY.value = (x<4? document.CPU.AC.value.charAt(index): '0');
			AC1 = (x<3? document.CPU.AC.value.charAt(++index): '0');
			AC2 = (x<2? document.CPU.AC.value.charAt(++index): '0');
			AC3 = '0';
			magnitude = AC1 + AC2 + AC3;
			document.CPU.AC.value = document.CPU.AC.value.charAt(0) + magnitude;
		};
		if(y!=0){
			index = 3-y;
			AC3 = (y<3? document.CPU.AC.value.charAt(index): (y==3? document.CPU.CARRY.value: '0'));
			AC2 = (y<2? document.CPU.AC.value.charAt(--index): (y==2? document.CPU.CARRY.value: '0'));
			AC1 = (y<2? document.CPU.CARRY.value: '0');
			document.CPU.CARRY.value = '0';
			magnitude = AC1 + AC2 + AC3;
		};
		sign = (magnitude =='000'? ' ': document.CPU.AC.value.charAt(0));
		document.CPU.AC.value = sign + magnitude;
	};
	return 0;
};

function HLT(operand){
	document.CPU.PC.value = operand;
	resetInput();
	alert('Program terminated normally');
	return 1;
};

/* 
Function Format:
	Formats any given value (memory, input, AC, IC, or other) to the strict three digit decimal
	format required by the simple computer.
*/
function format(value){
	// Remove spaces
	value = value.split(' ').join('');
	// If the value is greater than zero, assign to temp for further processing
	if(value.length >0){
		temp = value;
	// Else return a blank value
	} else {
		return '';
	};
	for (i=0; i<value.length; i++){
		if(((value.charAt(i)!='-') || i!=0) && ((value.charAt(i) >'9') || (value.charAt(i) <'0'))){
			temp = temp.split(value.charAt(i)).join('0');
		};
	};
	if(temp.length<4){
		if(temp.charAt(0)=='-'){
			temp = temp.substring(1,temp.length);
			if(temp.length==1){
			formattedvalue="-00"+temp;
			};
			if(temp.length==2){
			formattedvalue="-0"+temp;
			};
		} else {
			if(temp.length==1){
			formattedvalue=" 00"+temp;
			};
			if(temp.length==2){
			formattedvalue=" 0"+temp;
			};
			if(temp.length==3){
			formattedvalue=" "+temp;
			};
		};
	} else {
		if(temp.charAt(0)=='-'){
			formattedvalue = temp;
		} else {
			formattedvalue = " " + temp.substring(1,4);
		};
	};
	return formattedvalue;
};

function formatPC(value){
	if(value.length >0){
		if(value.length<2) value = "0" + value;
		if((value.charAt(0) >'9') || (value.charAt(0) <'0')) value = '0' + value.charAt(1);
		if((value.charAt(1) >'9') || (value.charAt(1) <'0')) value = value.charAt(0) + '0';
	} else {
		value = '00';
	};
	return value;
};

function resetInput(){
	inCardNo='01';
};

function clearOutput(){
	outCardNo='01';
};

function clearAll(){
	document.CPU.reset();
	document.Memory.reset();
	resetInput();
	document.Input.reset();
	clearOutput();
	document.Output.reset();
};

function fileLoader(){
	lastindex = self.location.href.lastIndexOf("/");
	programURL = self.location.href.substring(0,lastindex+1);
	loaderHTML = 
		"<!DOCTYPE html>"+
			"<HTML>"+
				"<HEAD>"+
					"<TITLE>File Loader</TITLE>"+
				"</HEAD>"+
				"<BODY>"+
					"<FORM NAME='select'>"+
						"<INPUT TYPE=TEXT NAME='file' SIZE=40></INPUT><INPUT TYPE=BUTTON VALUE='Select' onClick='DC.selectfile();'>"+
						"<TABLE CELLPADDING=5 CELLSPACING=0 WIDTH=100% BORDER=0>"+
							"<TR><TD>"+ programURL+ "</TD></TR>"+
							"<TR><TD BGCOLOR='#FFFFFF' HEIGHT=175 VALIGN=TOP>"+
								"<A HREF='DIVISION.html' onClick=\"document.select.file.value='"+ programURL+ "DIVISION.html';return false;\">DIVISION.html</A><BR>"+
								"<A HREF='SHIFTING.html' onClick=\"document.select.file.value='"+ programURL+ "SHIFTING.html';return false;\">SHIFTING.html</A><BR>"+
								"<A HREF='ABSOLUTE.html' onClick=\"document.select.file.value='"+ programURL+ "ABSOLUTE.html';return false;\">ABSOLUTE.html</A><BR>"+
								"<A HREF='BOOTSTRAP.html' onClick=\"document.select.file.value='"+ programURL+ "BOOTSTRAP.html';return false;\">BOOTSTRAP.html</A><BR>"+
								"<A HREF='MINNUMBER.html' onClick=\"document.select.file.value='"+ programURL+ "MINNUMBER.html';return false;\">MINNUMBER.html</A><BR>"+
								"<A HREF='myProgram.html' onClick=\"document.select.file.value='"+ programURL+ "myProgram.html';return false;\">myProgram.html</A><BR>"+
							"</TD></TR>"+
						"</TABLE>"+
					"</FORM>"+
				"</BODY>"+
			"</HTML>";
	filewindow = window.open('javascript:opener.loaderHTML','files','width=400,height=250');
	filewindow.focus();
	filewindow.DC=self;
};

function selectfile(){
	programwindow = window.open(filewindow.document.select.file.value,'programs','width=350,height=150,menubar');
	programwindow.focus();
	programwindow.DC=self;
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
		"<HTML>"+
			"<HEAD>"+
				"<TITLE>Simple Computer Program</TITLE>"+
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
				"<FORM>"+
					"<CENTER>"+
						"Click to <INPUT TYPE=BUTTON VALUE='Load' onClick='DC.loadfile();'></INPUT><BR>"+
						"-- OR --<BR>"+
						"Select \"File\", \"Save As\" from the<BR>menu to save program to disk."+
					"</CENTER>"+
				"</FORM>"+
			"</BODY>"+
		"</HTML>";

	var save = new Blob([savefilepage], {type: "text/html;charset=utf-8"});
	saveAs(save, "myProgram.html");
		
	//programwindow = window.open('javascript:opener.savefilepage','programs','width=300,height=150,menubar');
	//programwindow.focus();
	//programwindow.DC=self;
};

function help(){
	helpwindow = window.open('help.html','help','width=500,height=400,scrollbars');
	helpwindow.focus();
};


/* 
Function Boot: 
	Called on page load to initialize Program Counter, input cards, output cards,
	and highlight images.
*/
function boot(){
	document.CPU.PC.value='00';
	inCardNo="01";
	outCardNo="01";
};

/* 
Function Cycle: 
	The main CPU cycle, consisting of fetch(), decode(), and execute()
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

/* 
Function Decode: 
	Separates the instruction currently in the instruction register into
	opCode and operand.
*/
function decode(){
	// Separate opCode (equivalent to opCode = IR % 100
	opCode = IR.charAt(1);
	// Separate operand
	operand = IR.substring(2,4);
	return 0;
};

/* 
Function Execute: 
	With fetch() and decode() completed, execute() simply matches the opCode
	to the correct machine language code.
*/
function execute(){
	if(opCode=="0"){return INP(operand);};
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
function INP(operand){
	temp = document.Input["I"+inCardNo].value;
	if (temp.length <4) {
		alert('Erorr: Input card is empty. Try clearing input to reset.');
		return 1;
	};
	document.Memory["M"+operand].value = temp;
	inCardNo++;
	inCardNo = (inCardNo.toString().length==1? "0"+inCardNo: inCardNo.toString());
	return 0;
};

/* 
Function Output:
	Fills the next available output card with the value operand.
	The output function is called when opCode = 1.
*/
function OUT(operand){
	document.Output["Out"+outCardNo].value = document.Memory["M"+operand].value;
	outCardNo++;
	// Format if the value to be outputted is only 1 character
	if(outCardNo.toString().length==1){
		outCardNo = "0"+outCardNo;
	}
	else{
		outCardNo = outCardNo.toString();
	}
	return 0;
};

/* 
Function Add:
	Adds the contents of memory at the given operand to the value of the Accumulator
	The add function is called when opCode = 2.
*/
function ADD(operand){
	// Store value of AC as integer
	var currentAC = (document.CPU.AC.value-0);
	// Store memory location specified by the operand
	var cellToAdd = (document.Memory["M"+operand].value-0);
	// Preform addition operation
	var sum = currentAC + cellToAdd;
	// Set carry flag if sum is greater than 999
	if(sum>999){
		document.CPU.CARRY.value = "1";
		// Truncate sum to three digits
		sum = sum.toString().substring(1,4) - 999;
	// Set carry flag if sum is less than 999
	}else{
		if(sum<-999){
			document.CPU.CARRY.value = "1";
			// Truncate sum to three digits
			sum = 999 - sum.toString().substring(2,5);
		}else{
			document.CPU.CARRY.value = "0";
		};
	};
	// Update the value of AC text box
	document.CPU.AC.value = format(sum.toString());
	return 0;
};

/* 
Function Subtract:
	Subtracts the contents of memory at the given operand from the value of the Accumulator
	The subtract function is called when opCode = 3.
*/
function SUB(operand){
	var currentAC = document.CPU.AC.value;
	var cellToSub = document.Memory["M"+operand].value;
	// Preform subtraction operation
	var difference = currentAC - cellToSub;
	// Set carry flag if necessary
	if(difference>999){
		document.CPU.CARRY.value = "1";
		difference = difference.toString().substring(1,4) - 999;
	}else{
		if(difference<-999){
			document.CPU.CARRY.value = "1";
			difference = 999 - difference.toString().substring(2,5);
		}else{
			document.CPU.CARRY.value = "0";
		};
	};
	// Update the value of AC text box
	document.CPU.AC.value = format(difference.toString());
	return 0;
};

/* 
Function Load:
	Loads the memory location at operand into the AC
	The Load function is called when opCode = 4.
*/
function LDA(operand){
	// Reset the carry flag
	document.CPU.CARRY.value = "0";
	// Replace the value in AC with the contents of memory location at operand
	document.CPU.AC.value = document.Memory["M"+operand].value;
	return 0;
};

/* 
Function Store:
	Stores the AC in the memory location specified by operand.
	The Store function is called when opCode = 5.
*/
function STA(operand){
	document.Memory["M"+operand].value = document.CPU.AC.value;
	return 0;
};

/* 
Function Jump:
	Stores the current value of PC in cell 99 then jumps the PC to operand
	The jump function is called when opCode = 6.
*/
function JMP(operand){
	// Store PC value in memory cell 99
	document.Memory["M99"].value = " 0" + document.CPU.PC.value;
	// Set PC to operand
	document.CPU.PC.value = operand;
	return 0;
};

/* 
Function Test Accumulator:
	Jumps only if the current value of the AC is negative.
	The TAC function is called when opCode = 7.
*/
function TAC(operand){
	// Is AC less than zero?
	if(document.CPU.AC.value < 0){
		// Set PC to operand
		document.CPU.PC.value = operand;
	};
	// If AC is positive, do nothing.
	return 0;
};

/* 
Function Shift(xy):
	Shifts the AC left x digits and then the result right y digits.
	The SHF function is called when opCode = 8.
*/
function SHF(XY){
	// First digit of operand is x
	var x = XY.charAt(0);
	// Second digit of operand is y
	var y = XY.charAt(1);
	
	if(x!=0 || y!=0){
		var index;
		var ac1;
		var ac2;
		var ac3;
		var magnitude;
		var sign;
		
		if(x!=0){
			index = x;
			if (x<4){
				document.CPU.CARRY.value = document.CPU.AC.value.charAt(index);
			}else{
				document.CPU.CARRY.value = '0';
			};
			if (x<3){
				ac1 = document.CPU.AC.value.charAt(++index);
			}else{
				ac1 = '0';
			};
			if (x<2){
				ac2 = document.CPU.AC.value.charAt(++index);
			}else{
				ac2 = '0';
			};
			ac3 = '0';
			magnitude = ac1 + ac2 + ac3;
			document.CPU.AC.value = document.CPU.AC.value.charAt(0) + magnitude;
		};
		if(y!=0){
			index = 3-y;
			if (y<3){
				ac3 = document.CPU.AC.value.charAt(index);
			}else if(y==3){
				ac3 = document.CPU.CARRY.value;
			}else{
				ac3 = '0';
			};
			if (y<2){
				ac2 = document.CPU.AC.value.charAt(--index);
			}else if(y==2){
				ac2 = document.CPU.CARRY.value;
			}else{
				ac2 = '0';
			};
			if (y<2){
				ac1 = document.CPU.CARRY.value;
			}else{
				ac1 = '0';
			};
			document.CPU.CARRY.value = '0';
			magnitude = ac1 + ac2 + ac3;
		};
		if (magnitude == '000'){
			sign = ' ';
		}else{
			sign = document.CPU.AC.value.charAt(0);
		}
		// Update AC value
		document.CPU.AC.value = sign + magnitude;
	};
	return 0;
};

/* 
Function Halt:
	Replace the value of the program counter with operand and halt the simple computer.
	The HLT function is called when opCode = 9.
*/
function HLT(operand){
	document.CPU.PC.value = operand;
	resetInput();
	alert('Succesful Halt!');
	return 1;
};

/* 
Function Format:
	Formats any given value (memory, input, AC, IC, or other) to make processing simpler
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
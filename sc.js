
			function initialize(){
				document.CPU.PC.value='00';
				document.images["M00"].src = "highlight.gif";
				inCardNo="01";
				document.images["I01"].src = "highlight.gif";
				outCardNo="01";
			};

			function cycle(N){
				for (i=1; i<=N; i++){
					if (fetch()) break;
					if (document.CPU.Exec[0].checked){
						if (signExecute()) break;
					} else {
						if (tensExecute()) break;
					};
				};
			};

			function fetch(){
				IR = document.Memory["M"+document.CPU.PC.value].value;
				if (IR.length <4) {
					alert('Execution Halted: Memory location being fetched is empty.');
					return 1;
				};
				if (IR<=0) {
					alert('Execution Halted: Memory location being fetched is <= zero.');
					return 1;
				};
				document.CPU.IR.value = IR;
				document.images["M"+document.CPU.PC.value].src = "blank.gif";
				PC = document.CPU.PC.value;
				PC++;
				document.CPU.PC.value = (PC.toString().length==1? "0"+PC: PC.toString());
				document.images["M"+document.CPU.PC.value].src = "highlight.gif";
				return 0;
			};

			function signExecute(){
				opCode = IR.charAt(1);
				address = IR.substring(2,4);
				if(opCode=="0"){return INP(address);};
				if(opCode=="1"){return OUT(address);};
				if(opCode=="2"){return ADD(address);};
				if(opCode=="3"){return SUB(address);};
				if(opCode=="4"){return LDA(address);};
				if(opCode=="5"){return STA(address);};
				if(opCode=="6"){return JMP(address);};
				if(opCode=="7"){return TAC(address);};
				if(opCode=="8"){return SHF(address);};
				if(opCode=="9"){return HLT(address);};
				return 1;
			};

			function tensExecute(){
				opCode = IR.charAt(1);
				address = IR.substring(2,4);
				if(opCode=="0"){return INP(address);};
				if(opCode=="1"){return OUT(address);};
				if(opCode=="2"){return ADD10(address);};
				if(opCode=="3"){return SUB10(address);};
				if(opCode=="4"){return LDA(address);};
				if(opCode=="5"){return STA(address);};
				if(opCode=="6"){return JMP(address);};
				if(opCode=="7"){return TAC10(address);};
				if(opCode=="8"){return SHF(address);};
				if(opCode=="9"){return HLT(address);};
				return 1;
			};

			function INP(address){
				In = document.Input["I"+inCardNo].value;
				if (In.length <4) {
					alert('Execution Halted: Input card is empty.');
					return 1;
				};
				document.Memory["M"+address].value = In;
				document.images["I"+inCardNo].src = "blank.gif";
				inCardNo++;
				inCardNo = (inCardNo.toString().length==1? "0"+inCardNo: inCardNo.toString());
				document.images["I"+inCardNo].src = "highlight.gif";
				return 0;
			};

			function OUT(address){
				document.Output["Out"+outCardNo].value = document.Memory["M"+address].value;
				outCardNo++;
				outCardNo = (outCardNo.toString().length==1? "0"+outCardNo: outCardNo.toString());
				return 0;
			};

			function ADD(address){
				// subtract zero to force type conversion.
				sum = (document.CPU.AC.value-0) + (document.Memory["M"+address].value-0);
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
				document.CPU.AC.value = stripNpad(sum.toString());
				return 0;
			};

			function ADD10(address){
				// subtract zero to force type conversion.
				sum = (document.CPU.AC.value-0) + (document.Memory["M"+address].value-0);
				if(sum>999){
					document.CPU.CARRY.value = "1";
					sum = sum.toString().substring(1,4);
				};
				document.CPU.AC.value = stripNpad(sum.toString());
				return 0;
			};

			function SUB(address){
				diff = document.CPU.AC.value - document.Memory["M"+address].value;
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
				document.CPU.AC.value = stripNpad(diff.toString());
				return 0;
			};

			function SUB10(address){
				diff = (document.CPU.AC.value - 0) + (1000 - document.Memory["M"+address].value);
				if(diff>999){
					document.CPU.CARRY.value = "1";
					diff = diff.toString().substring(1,4);
				};
				document.CPU.AC.value = stripNpad(diff.toString());
				return 0;
			};

			function LDA(address){
				document.CPU.CARRY.value = "0";
				document.CPU.AC.value = document.Memory["M"+address].value;
				return 0;
			};

			function STA(address){
				document.Memory["M"+address].value = document.CPU.AC.value;
				return 0;
			};

			function JMP(address){
				document.Memory["M99"].value = " 0" + document.CPU.PC.value;
				document.images["M"+document.CPU.PC.value].src = "blank.gif";
				document.CPU.PC.value = address;
				document.images["M"+document.CPU.PC.value].src = "highlight.gif";
				return 0;
			};

			function TAC(address){
				if(document.CPU.AC.value < 0){
					document.images["M"+document.CPU.PC.value].src = "blank.gif";
					document.CPU.PC.value = address;
					document.images["M"+document.CPU.PC.value].src = "highlight.gif";
				};
				return 0;
			};

			function TAC10(address){
				if(document.CPU.AC.value >= 500){
					document.images["M"+document.CPU.PC.value].src = "blank.gif";
					document.CPU.PC.value = address;
					document.images["M"+document.CPU.PC.value].src = "highlight.gif";
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

			function HLT(address){
				document.images["M"+document.CPU.PC.value].src = "blank.gif";
				document.CPU.PC.value = address;
				document.images["M"+document.CPU.PC.value].src = "highlight.gif";
				resetInput();
				alert('Program terminated normally');
				return 1;
			};

			function stripNpad(cellvalue){
				cellvalue = cellvalue.split(' ').join('');
				if(cellvalue.length >0){
					strippedvalue = cellvalue;
				} else {
					return '';
				};
				for (i=0; i<cellvalue.length; i++){
					if(((cellvalue.charAt(i)!='-') || i!=0) && ((cellvalue.charAt(i) >'9') || (cellvalue.charAt(i) <'0'))){
						strippedvalue = strippedvalue.split(cellvalue.charAt(i)).join('0');
					};
				};
				if(strippedvalue.length<4){
					if(strippedvalue.charAt(0)=='-'){
						strippedvalue = strippedvalue.substring(1,strippedvalue.length);
						if(strippedvalue.length==1){paddedvalue="-00"+strippedvalue;};
						if(strippedvalue.length==2){paddedvalue="-0"+strippedvalue;};
					} else {
						if(strippedvalue.length==1){paddedvalue=" 00"+strippedvalue;};
						if(strippedvalue.length==2){paddedvalue=" 0"+strippedvalue;};
						if(strippedvalue.length==3){paddedvalue=" "+strippedvalue;};
					};
				} else {
					if(strippedvalue.charAt(0)=='-'){
						paddedvalue = strippedvalue;
					} else {
						paddedvalue = " " + strippedvalue.substring(1,4);
					};
				};
				return paddedvalue;
			};

			function stripNpadPC(cellvalue){
				if(cellvalue.length >0){
					if(cellvalue.length<2) cellvalue = "0" + cellvalue;
					if((cellvalue.charAt(0) >'9') || (cellvalue.charAt(0) <'0')) cellvalue = '0' + cellvalue.charAt(1);
					if((cellvalue.charAt(1) >'9') || (cellvalue.charAt(1) <'0')) cellvalue = cellvalue.charAt(0) + '0';
				} else {
					cellvalue = '00';
				};
				return cellvalue;
			};

			function clearCPU(){
				document.images["M"+document.CPU.PC.value].src = "blank.gif";
				document.M00.src = "highlight.gif";
			};

			function resetInput(){
				document.images['I'+inCardNo].src='blank.gif';
				inCardNo='01';
				document.images['I01'].src='highlight.gif';
			};

			function clearOutput(){
				outCardNo='01';
			};

			function clearAll(){
				clearCPU();
				document.CPU.reset();
				document.Memory.reset();
				resetInput();
				document.Input.reset();
				clearOutput();
				document.Output.reset();
			};

			function listfiles(){
				lastindex = self.location.href.lastIndexOf("/");
				programURL = self.location.href.substring(0,lastindex+1);
				listfilespage = 
					"<HTML>"+
						"<HEAD>"+
							"<TITLE>Files</TITLE>"+
						"</HEAD>"+
						"<BODY LINK='#000000' VLINK='#000000' BGCOLOR='#CCCCCC'>"+
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
									"</TD></TR>"+
								"</TABLE>"+
							"</FORM>"+
						"</BODY>"+
					"</HTML>";
				filewindow = window.open('javascript:opener.listfilespage','files','width=400,height=250');
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
							"<TITLE>DC Program</TITLE>"+
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

				var blob = new Blob([savefilepage], {type: "text/html;charset=utf-8"});
				saveAs(blob, "myProgram.html");
					
				//programwindow = window.open('javascript:opener.savefilepage','programs','width=300,height=150,menubar');
				//programwindow.focus();
				//programwindow.DC=self;
			};

			function help(){
				helpwindow = window.open('help.html','help','width=500,height=400,scrollbars');
				helpwindow.focus();
			};

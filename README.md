SimpleComputerProject
=====================

Creating a Simple Computer Emulator was the CS3A (Computer Organization and Assembly Langauge) first semester Final Project.

#Simple Computer Emulator: The User Manual
 
#I.      Introduction
The Simple Computer is a learning tool designed to aid in the understanding of how real computers operate at a low level.  The Simple Computer, abbreviated SC, is a virtual computer. SC is a virtual computer because it is software that acts as a completely separate machine from the computer it is being used on.  That is, it acts as a real computer, with its own input, output, memory, and CPU.
 
When a software based application, that runs on a real computer, acts as a separate virtual computer, it is called an emulator. The simple computer is an emulator because it illustrates the functions of a computer via software without any of the physical equipment normally associated with a computer.
 
     The purpose of the Simple Computer Emulator is to introduce users to the concepts of the machine language and assembly language levels of computing without the risk of overwhelming them with the reality of assembly language programming.
 
#II.    Components of the Simple Computer
(See Figure 1: A-F for the location of each component in the emulator)
Memory {Figure 1.A}:
Every computer application runs in a component of the computer called memory, often referred to as Random Access Memory (RAM). The Simple Computer abstracts this concept in a set number of input boxes. Memory cells 01-99 can be modified freely by the user. Each memory cell holds a three digit decimal value that serves as an instruction word or a unit of data. Memory cell 00 is reserved and cannot be modified. Memory that cannot be modified is called Read Only Memory (ROM). In the simple computer, cell 00 can be used for bootstrapping the loader, a technique that allows a program to be loaded into memory using only the input cards.
Input Cards {Figure 1.B}:
The input device of the simple computer is not up to par with those found on modern personal computers (keyboard, mouse, etc.). The simple computer can only take in three decimal digits at a time. Input cards can be thought of like punch cards.
Output Cards {Figure 1.C}:
The output cards of the Simple Computer act in the same way as the input cards. However, they cannot be modified by the user. The output cards are filled only when the OUT (OPcode 1) is used.
Instruction Register [IR] {Figure 1.D}:
The IR is a storage location very similar to those found in memory, however it is located in the central processing unit. The IR stores the instruction that is about to be executed by the CPU. Thus, the instruction register serves as a communication link between the control unit and main memory.
Accumulator [AC] {Figure 1.E}:
The accumulator is very a crucial register located in the CPU. The AC a central part of the Simple Computer’s Arithmetic Logic Unit (ALU). In the AC, numbers are added or subtracted. The AC is very useful for program control flow as it allows the user to preform logic instructions such as testing for a negative value.
Program Counter [PC] {Figure 1.F}:
Last but not least, the program counter makes it possible for the simple computer to run through programs stored in memory. The PC keeps track of what memory cell is next in line to be loaded in the instruction register.
 
Figure 1 (A-F): The Components of the Simple Computer Emulator

 
#III.   The Simple Computer Instruction Set
The instruction set of the Simple Computer, that is, the functions that make it possible to create programs, are outlined in Figure 2. The Simple Computer uses a three decimal digit system. The left most digit is known as the OpCode and corresponds to the operation that is to be performed. The two right most digits are known as the operand. An operand is often associated with a memory cell, but each OpCode differs.
 
Figure 2: The Simple Computer Instruction Set
Machine Language Code

Assembly Language Mnemonic

Description

0 _ _

INP

INPut - Copies the current input card into cell number_ _ and advances the input device to the next input card. If the input card is blank, then the input device is advanced, the contents of the program counter is set to 00, and the SC machine is halted.

1 _ _

OUT

OUTput – Copies the contents of cell number _ _ onto the current output card and advances the output device one card.

2 _ _

ADD

ADD – Adds the contents of cell number _ _ to the value of the accumulator. Sets a Carry Flag on overflow.

3 _ _

SUB

SUBtract – Subtracts the contents of cell number _ _ from the current value of the accumulator. Sets a Carry Flag on overflow.

4 _ _

LDA

LoaD Accumulator – Clears the accumulator and carry flag, then copies the contents of cell number _ _ into the accumulator.

5 _ _

STA

STore Accumulator – Copies the three digits of the accumulator into cell number _ _.

6 _ _

JMP

JuMP – Places the current value of the program counter into cell 99. Then changes the value of the program counter to correspond to cell number _ _.

7 _ _

TAC

Test ACumulator – If the value of the accumulator is negative, the value of the program counter is changed to correspond to cell number _ _.

8 x y

SHF

SHiFt – Shifts the accumulator left x digits, and then shifts the result right y digits. With all left shifts, digits shift through the carry flag and zeros enter the accumulator on the right. Similarly, with right shifts, zeros enter the carry flag and the accumulator on the left.

9 _ _

HLT

HaLT – Replace the value of the program counter with cell number _ _ and then halt the SC processor.

 
 
#IV.    Information About This Version of The Simple Computer Emulator
 
This version of the Simple Computer Emulator is written completely in JavaScript and HTML. The Emulator itself will run in nearly any browser that supports JavaScript, however if you wish to save and load programs to your hard-drive, you will have to use Mozilla Firefox. This is because recent versions of Google Chrome, Internet Explorer, and Safari do not allow web based scripts to access files by default.
 
 

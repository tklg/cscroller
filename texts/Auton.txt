//###################################################################################//
//
//								2013-2014 Autonomous Code
//							 Team 3983 - Highlands Robotics
//						  Code by T. Kluge & Music by J. Harnett
//
//###################################################################################//

//referenced files here -- DRIVER LOAD ORDER MATTERS

#include "../drivers/JoystickDriver_CustomNoSplash.c"
#include "../PixelArt/Arrows.c"
#include "MenuSelector.c"
#include "BatterySelector.c"
//#include "MenusAndIcons.c"
#include "../drivers/hitechnic-sensormux.h"
#include "../drivers/hitechnic-irseeker-v2.h"
#include "../drivers/hitechnic-gyro.h"
#include "../drivers/hitechnic-accelerometer.h"
#include "../drivers/lego-light.h"
#include "../music/James_Music.c"
#include "../GlobalFunctions/GlobalFunctions.c"
#include "../AUTONDUM.c"
//#include "Auton_ORIGINAL.c"

//variables + functions here

void scoreCube();
void killall();
void initializeRobot();
void displayText(int nLineNumber, const string cChar, int nValueDC, int nValueAC);
void displayText3(int nLineNumber, const string cChar, int nValueDC, int nValueAC, int nValueEnh);
void driveToEnd(int motorPower, int distanceToEdge);
void pushOffRamp();
void turnTowardsRobot();
void turnTowardsCenter();

bool searching = true;
bool searchingForBot = false;
bool koth = false;
bool goToEnd = true;
bool turnedLeft = false;
bool turnedRight = false;
bool FORWARD_SCORE_FORWARD_LINE_1 = false;
bool FORWARD_SCORE_FORWARD_LINE_2 = false;
bool FORWARD_SCORE_BACKWARD_LINE_1 = false;
bool FORWARD_SCORE_BACKWARD_LINE_2 = false;
bool canFindWhite = true;
bool canFindBlack = false;

int roundTime = 0;
int timeToEnd = 4300;
int kothAttackDistance = 50; //distance in cm (ultrasonic sensor)
int irFindVal = 150; //edit this to match the ultrasonic sensor read value for the correct distance
int sizeOfFile = 400;
int accelTurnMax = 20;
int accelTurnMin = -20;
int USScanVal;
int degFirstTurn = 88; //87//if you do anything to this, do the opposite to the other (46)
int degFirstTurnForRev = 86; //87
int degSecondTurn = 48; //47//same for this one - should add up to 46 (0)
int degSecondTurnForRev = 120;
int degToUse;
int linesToFind = 0;
int linesFound = 0;
int WHITE_LINE_VALUE = 280;
int BLACK_MAT_VALUE = 200; //pointless
float rotSpeed = 0;
float heading = 92;

string sTextLines[8];
string fileName = "IRvals.txt";
string irvalres = "";


const tMUXSensor LEGOLS = msensor_S3_1; //Light sensor
//const tMUXSensor HTACCEL = msensor_S3_2; //Accel Sensor
const tMUXSensor HTGYRO = msensor_S3_3; //Gyro Sensor

//=============================================================================================================================================
//---------------------------------------------------BEGIN INITIALIZATION CODE-----------------------------------------------------------------
task main() {

	//Initialize the display with the program choices
	LSsetInactive(LEGOLS);
	chooseProgram();
	//setBatPower();

	switch (PROGID) {
	case 1:
		FORWARD_SCORE_FORWARD_LINE_1 = true;
		linesToFind = 1;
		break;
	case 2:
		FORWARD_SCORE_FORWARD_LINE_2 = true;
		linesToFind = 2;
		break;
	case 3:
		FORWARD_SCORE_BACKWARD_LINE_1 = true;
		linesToFind = 1;
		break;
	case 4:
		FORWARD_SCORE_BACKWARD_LINE_2 = true;
		linesToFind = 2;
		break;
	case 6:
		useDummyAutonomous();
		break;
	case 5:
		//useOriginalAutonomous();
		PlaySoundFile("Woops.rso");
		break;
	}

	if ((externalBatteryAvg / (float) 1000) >= 13) {
		degFirstTurn = 89; //87//if you do anything to this, do the opposite to the other (46)
		degFirstTurnForRev = 87; //87
		degSecondTurn = 47; //47//same for this one - should add up to 46 (0)
		degSecondTurnForRev = 115;
		PlayTone(500, 10);
		wait1Msec(300);
		PlayTone(700, 10);
		wait1Msec(300);
		PlayTone(900, 10);
		wait1Msec(300);
		PlayTone(1100, 10);
		wait1Msec(300);
		PlayTone(1300, 10);
		} else if ((externalBatteryAvg / (float) 1000) >= 12 && (externalBatteryAvg / (float) 1000) < 13) {
		degFirstTurn = 88; //87//if you do anything to this, do the opposite to the other (46)
		degFirstTurnForRev = 86; //87
		degSecondTurn = 48; //47//same for this one - should add up to 46 (0)
		degSecondTurnForRev = 120;
		PlayTone(500, 10);
		wait1Msec(300);
		PlayTone(700, 10);
		wait1Msec(300);
		PlayTone(900, 10);
		wait1Msec(300);
		PlayTone(1100, 10);
		} else if ((externalBatteryAvg / (float) 1000) >= 11 && (externalBatteryAvg / (float) 1000) < 12) {
		degFirstTurn = 88; //87//if you do anything to this, do the opposite to the other (46)
		degFirstTurnForRev = 86; //87
		degSecondTurn = 48; //47//same for this one - should add up to 46 (0)
		degSecondTurnForRev = 120;
		PlayTone(500, 10);
		wait1Msec(300);
		PlayTone(700, 10);
		wait1Msec(300);
		PlayTone(900, 10);
		} else if ((externalBatteryAvg / (float) 1000) >= 10 && (externalBatteryAvg / (float) 1000) < 11) {
		degFirstTurn = 88; //87//if you do anything to this, do the opposite to the other (46)
		degFirstTurnForRev = 86; //87
		degSecondTurn = 48; //47//same for this one - should add up to 46 (0)
		degSecondTurnForRev = 120;
		PlayTone(500, 10);
		wait1Msec(300);
		PlayTone(700, 10);
		} else if ((externalBatteryAvg / (float) 1000) >= 9 && (externalBatteryAvg / (float) 1000) < 10) {
		degFirstTurn = 88; //87//if you do anything to this, do the opposite to the other (46)
		degFirstTurnForRev = 86; //87
		degSecondTurn = 48; //47//same for this one - should add up to 46 (0)
		degSecondTurnForRev = 120;
		PlayTone(500, 10);
		} else {
		//keep default values
	}

//---------------------------------------------------------END INITIALIZATION CODE-------------------------------------------------------------
//=============================================================================================================================================

TFileHandle irFileHandle;
TFileIOResult IOResult;
//PlaySound(soundBlip);
//wait1Msec((2 * PI) * 1000); //TAUUUU
//wait1Msec(10000);//wait 10 seconds for other teams who **might** have better autonomous code
//PlaySound(soundFastUpwardTones);

//_________________________________BLOCK TO GET SENSORVALUES FROM IRSEEKER_________________________
//=================================================================================================
int _dirDCL = 0;
int _dirACL = 0;
int dcS1L, dcS2L, dcS3L, dcS4L, dcS5L = 0;
int acS1L, acS2L, acS3L, acS4L, acS5L = 0;
int _dirEnhL, _strEnhL;

// the default DSP mode is 1200 Hz.

initializeRobot();
HTGYROstartCal(HTGYRO);
servo[servoLift] = 123;
servo[servoSweep] = 199;
waitForStart();
LSsetActive(LEGOLS);
ClearTimer(T1);
OpenWrite(irFileHandle, IOResult, fileName, sizeOfFile);

// FULLY DYNAMIC CODE W/ SCORING OF CUBE
while(searching)
{

	_dirDCL = HTIRS2readDCDir(HTIRS2L);
	if (_dirDCL < 0)
		break; // I2C read error occurred

	_dirACL = HTIRS2readACDir(HTIRS2L);
	if (_dirACL < 0)
		break; // I2C read error occurred

	//===========LEFT SIDE
	// Read the individual signal strengths of the internal sensors
	// Do this for both unmodulated (DC) and modulated signals (AC)
	if (!HTIRS2readAllDCStrength(HTIRS2L, dcS1L, dcS2L, dcS3L, dcS4L, dcS5L))
		break; // I2C read error occurred
	if (!HTIRS2readAllACStrength(HTIRS2L, acS1L, acS2L, acS3L, acS4L, acS5L ))
		break; // I2C read error occurred

	//=================Enhanced IR Values (Left and Right)===========
	// Read the Enhanced direction and strength
	if (!HTIRS2readEnhanced(HTIRS2L, _dirEnhL, _strEnhL))
		break; // I2C read error occurred

	//______________END SENSORVAL BLOCK________________________________________________________________
	//=================================================================================================

	if (acS3L < irFindVal) { //While sensor is heading towards beacon: acs3 = side
		motor[motorLeft] = -80;
		motor[motorRight] = -80;

		if (time1[T1] > timeToEnd) {
			searching = false;
			koth = true;
			goToEnd = false;
			//if it doesnt find the beacon, dont bother returning to start if it has been set to
		}
	}

	//===================================BLOCK FOR IR DETECTION=====================
	if (acS3L > irFindVal) { //if sensor is directly in front of beacon

		if (time1[T1] < 2000) {
			wait1Msec(600);
		}

		motor[motorLeft] = 0;
		motor[motorRight] = 0;
		//irOnLeft = true;
		searching = false;
		koth = true;
		goToEnd = true;
	}

	//==================END IR DETECTION BLOCK========================

	wait1Msec(30);
}//while searching

//Close(irFileHandle, IOResult);
roundTime = time1[T1]; //probably unnecessary, is to cut out the time from the cube scorer

scoreCube();

if (goToEnd) {
	if (FORWARD_SCORE_FORWARD_LINE_1 || FORWARD_SCORE_FORWARD_LINE_2) {
		driveToEnd(-80, timeToEnd - roundTime);//drive to end of ramp
	}
	if (FORWARD_SCORE_BACKWARD_LINE_1 || FORWARD_SCORE_BACKWARD_LINE_2) {
		driveToEnd(80, roundTime - 600);
	}
}

wait1Msec(300);
//=======================================================================================================================================
//------------------------BEGIN 90 DEGREE TURNS------------------------------------------------------------------------------------------

//HTGYROstartCal(HTGYRO);
ClearTimer(T3);

while (true) {

	wait1Msec(20);

	//if (abs(rotSpeed) > 3) {
	rotSpeed = HTGYROreadRot(HTGYRO);//find gyro rotation speed
	heading += (rotSpeed * 0.02);//find gyro heading in degrees??

	motor[motorLeft] = 60;
	motor[motorRight] = -60;

	if (FORWARD_SCORE_FORWARD_LINE_2 || FORWARD_SCORE_FORWARD_LINE_1) {
		degToUse = degFirstTurn;
		} else {
		degToUse = degFirstTurnForRev;
	}

	if (heading <= degToUse) {

		motor[motorLeft] = 0;
		motor[motorRight] = 0;
		ClearTimer(T3);
		//---------------LINE DETECTOR--------------------------
		//LSsetActive(LEGOLS);
		while (linesFound < linesToFind) {
			motor[motorLeft] = -10;
			motor[motorRight] = -10;
			wait1Msec(10);
			if (LSvalRaw(LEGOLS) >= WHITE_LINE_VALUE && canFindWhite) {
				canFindWhite = false;
				linesFound++;
			}

			if (LSvalRaw(LEGOLS) <= WHITE_LINE_VALUE && !canFindWhite) {
				canFindWhite = true;
			}

			if (linesFound >= linesToFind) {
				break;
			}

			if (time1[T3] > 3800) {
				break;
			}
		}
		LSsetInactive(LEGOLS);

		//if (linesToFind == 2 && FORWARD_SCORE_FORWARD_LINE_2 && linesFound == 2) {
		//		moveBackward(700, 100);
		//	}

		if (FORWARD_SCORE_FORWARD_LINE_1 || FORWARD_SCORE_FORWARD_LINE_2) {

			while (true) {
				wait1Msec(20);
				rotSpeed = HTGYROreadRot(HTGYRO);//find gyro rotation speed
				heading += (rotSpeed * 0.02);//find gyro heading in degrees??

				motor[motorLeft] = 60;
				motor[motorRight] = -60;

				if (heading <= degSecondTurn) {
					motor[motorLeft] = 0;
					motor[motorRight] = 0;

					moveForward(3.8, 100);
					break;
				}
			}
			} else {
			while (true) {
				wait1Msec(20);
				rotSpeed = HTGYROreadRot(HTGYRO);//find gyro rotation speed
				heading += (rotSpeed * 0.02);//find gyro heading in degrees??

				motor[motorLeft] = -60;
				motor[motorRight] = 60;

				if (heading >= degSecondTurnForRev) {
					motor[motorLeft] = 0;
					motor[motorRight] = 0;

					moveForward(3.8, 100);
					break;
				}
			}
		}
		break;
	}
}

//==================================================================================

//Begin KotH routine
servo[servoUSSeeker] = 92;
USScanVal = 92;
float heading = 92;
LSsetInactive(LEGOLS);
HTGYROstartCal(HTGYRO);

while (koth) {

	//wait1Msec(1000);
	//SCAN LEFT==========================
	while(true) {

		servo[servoUSSeeker] = ServoValue[servoUSSeeker] + 5;
		USScanVal += 5;
		wait1Msec(100);

		if (SensorValue[US1] < kothAttackDistance && nPgmTime < 27000) { //if something is in range AND program time is less than 27 seconds
			PlaySound(soundFastUpwardTones);
			searchingForBot = true;
			turnedLeft = true;
			turnedRight = false;
			turnTowardsRobot();
			pushOffRamp();
			turnTowardsCenter();
		}
		if (USScanVal > 135) {
			break;
		}
	}
	//SCAN RIGHT=========================
	while(true) {
		servo[servoUSSeeker] = ServoValue[servoUSSeeker] - 5;
		USScanVal -= 5;
		wait1Msec(100);
		if (USScanVal < 40) {
			break;
		}
		if (SensorValue[US1] < kothAttackDistance && nPgmTime < 27000) { //if something is in range AND program time is less than 27 seconds
			PlaySound(soundFastUpwardTones);
			searchingForBot = true;
			turnedLeft = false;
			turnedRight = true;
			turnTowardsRobot();
			pushOffRamp();
			turnTowardsCenter();
		}
	}

	if (nPgmTime > 29000) {
		koth = false;
	}
}//while koth
MissionImpossible();
}
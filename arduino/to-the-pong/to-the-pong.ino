#include "OneButton.h"

/* 
 *  This sketch is for the Bluefruit Feather 32u4
 *  
 */

bool gameActive = false;
int ledState = LOW;
int buttonPin = A1;
int button2Pin = A2;
OneButton button1(buttonPin, true);
OneButton button2(button2Pin, true);

void setup() {
    Serial.begin(9600);
    pinMode(buttonPin, INPUT_PULLUP);
    pinMode(button2Pin, INPUT_PULLUP);
    button1.attachClick(button1press);
    button1.attachDoubleClick(button1doublePress);
    button1.attachLongPressStart(button1longPress);
    button2.attachClick(button2press);
    button2.attachDoubleClick(button2doublePress);
    button2.attachLongPressStart(button2longPress);
}

void loop() {
    button1.tick();
    button2.tick();
}

void button1press() {
    Serial.println("button 1 pressed");
}

void button1doublePress() {
    Serial.println("button 1 double-pressed");
}

void button1longPress() {
    Serial.println("button 1 long-pressed");
}

void button2press() {
    Serial.println("button 2 pressed");
}

void button2doublePress() {
    Serial.println("button 2 double-pressed");
}

void button2longPress() {
    Serial.println("button 2 long-pressed");
}

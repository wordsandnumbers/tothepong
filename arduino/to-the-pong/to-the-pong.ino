
/* 
 *  This sketch is for the Bluefruit Feather 32u4
 *  
 */
 
#include <Arduino.h>
#include <SPI.h>
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_SPI.h"
#include "Adafruit_BluefruitLE_UART.h"

#include "BluefruitConfig.h"

#if SOFTWARE_SERIAL_AVAILABLE
  #include <SoftwareSerial.h>
#endif

#include "OneButton.h"

#define FACTORYRESET_ENABLE         1
#define MINIMUM_FIRMWARE_VERSION    "0.6.6"
#define MODE_LED_BEHAVIOUR          "MODE"

Adafruit_BluefruitLE_SPI ble(BLUEFRUIT_SPI_CS, BLUEFRUIT_SPI_IRQ, BLUEFRUIT_SPI_RST);


bool gameActive = false;
int ledState = LOW;
int buttonPin = A1;
int button2Pin = A2;
OneButton button1(buttonPin, true);
OneButton button2(button2Pin, true);

// A small helper
void error(const __FlashStringHelper*err) {
  Serial.println(err);
  while (1);
}

void setup(void) {
    Serial.begin(9600);
    pinMode(buttonPin, INPUT_PULLUP);
    pinMode(button2Pin, INPUT_PULLUP);
    button1.attachClick(button1press);
    button1.attachDoubleClick(button1doublePress);
    button1.attachLongPressStart(button1longPress);
    button2.attachClick(button2press);
    button2.attachDoubleClick(button2doublePress);
    button2.attachLongPressStart(button2longPress);

    while (!Serial);  // required for Flora & Micro
    delay(500);
  
    Serial.begin(115200);
    Serial.println(F("Adafruit Bluefruit Command Mode Example"));
    Serial.println(F("---------------------------------------"));
  
    /* Initialise the module */
    Serial.print(F("Initialising the Bluefruit LE module: "));
  
    if ( !ble.begin(VERBOSE_MODE) )
    {
      error(F("Couldn't find Bluefruit, make sure it's in CoMmanD mode & check wiring?"));
    }
    Serial.println( F("OK!") );
  
    if ( FACTORYRESET_ENABLE )
    {
      /* Perform a factory reset to make sure everything is in a known state */
      Serial.println(F("Performing a factory reset: "));
      if ( ! ble.factoryReset() ){
        error(F("Couldn't factory reset"));
      }
    }
  
    /* Disable command echo from Bluefruit */
    ble.echo(false);
  
    Serial.println("Requesting Bluefruit info:");
    /* Print Bluefruit information */
    ble.info();
  
    Serial.println(F("Please use Adafruit Bluefruit LE app to connect in UART mode"));
    Serial.println(F("Then Enter characters to send to Bluefruit"));
    Serial.println();
  
    ble.verbose(false);  // debug info is a little annoying after this point!
  
    /* Wait for connection */
    while (! ble.isConnected()) {
        delay(500);
    }
  
    // LED Activity command is only supported from 0.6.6
    if ( ble.isVersionAtLeast(MINIMUM_FIRMWARE_VERSION) )
    {
      // Change Mode LED Activity
      Serial.println(F("******************************"));
      Serial.println(F("Change LED activity to " MODE_LED_BEHAVIOUR));
      ble.sendCommandCheckOK("AT+HWModeLED=" MODE_LED_BEHAVIOUR);
      Serial.println(F("******************************"));
    }
}

void loop() {
    button1.tick();
    button2.tick();

    // Check for user input
    char inputs[BUFSIZE+1];
    
    // Check for incoming characters from Bluefruit
    ble.println("AT+BLEUARTRX");
    ble.readline();
    if (strcmp(ble.buffer, "OK") == 0) {
      // no data
      return;
    }
    // Some data was found, its in the buffer
    Serial.print(F("[Recv] ")); Serial.println(ble.buffer);
    ble.waitForOK();
}

void sendMessage(char message[]) {
    Serial.println(message);
    ble.print("AT+BLEUARTTX=");
    ble.println(message);
}

void button1press() {
  sendMessage("{\"b\":1, \"type\":\"SP\"}");
} 

void button1doublePress() {
  sendMessage("{\"b\":1, \"type\":\"DP\"}");
}

void button1longPress() {
  sendMessage("{\"b\":1, \"type\":\"LP\"}");
}

void button2press() {
  sendMessage("{\"b\":2, \"type\":\"SP\"}");
}

void button2doublePress() {
  sendMessage("{\"b\":2, \"type\":\"DP\"}");
}

void button2longPress() {
  sendMessage("{\"b\":2, \"type\":\"LP\"}");
}

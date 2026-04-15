// PIN SETUP
#define TRIG_PIN 12
#define ECHO_PIN 13

#define LED_GREEN 27
#define LED_YELLOW 26
#define LED_RED 25
#define BUZZER 14

#define RAIN_SENSOR 33  

long duration;
float distance;
String statusBanjir;

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_YELLOW, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER, OUTPUT);
}

float readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  duration = pulseIn(ECHO_PIN, HIGH);
  distance = duration * 0.034 / 2;

  return distance;
}

void loop() {
  float d = readDistance();
  int rainValue = analogRead(RAIN_SENSOR); // 0 - 4095

  String rainStatus;

  // KATEGORI HUJAN
  if (rainValue < 1000) {
    rainStatus = "Tidak Hujan";
  } else if (rainValue < 2500) {
    rainStatus = "Hujan Ringan";
  } else {
    rainStatus = "Hujan Deras";
  }

  // LOGIKA BANJIR (kombinasi)
  if (rainValue < 1000 && d > 200) {
    statusBanjir = "Aman";
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, LOW);
    noTone(BUZZER);

  } else if (rainValue >= 1000 && d > 200) {
    statusBanjir = "Hujan";
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);
    noTone(BUZZER);

  } else if (d <= 200 && d > 100) {
    statusBanjir = "Siaga";
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);
    noTone(BUZZER);

  } else {
    statusBanjir = "Bahaya (Banjir)";
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER, 1000);
  }

  // OUTPUT SERIAL
  Serial.print("Distance: ");
  Serial.print(d);
  Serial.print(" cm | Rain: ");
  Serial.print(rainValue);
  Serial.print(" (");
  Serial.print(rainStatus);
  Serial.print(") | Status: ");
  Serial.println(statusBanjir);

  delay(1000);
}
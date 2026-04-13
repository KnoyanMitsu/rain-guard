// PIN SETUP (PIN ATAS ESP32)
#define TRIG_PIN 12
#define ECHO_PIN 13

#define LED_GREEN 27
#define LED_YELLOW 26
#define LED_RED 25
#define BUZZER 14

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

  // LOGIKA BANJIR
  if (d > 200) {
    statusBanjir = "Aman";
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, LOW);
    noTone(BUZZER);

  } else if (d > 100) {
    statusBanjir = "Siaga";
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, HIGH);
    digitalWrite(LED_RED, LOW);
    noTone(BUZZER);

  } else {
    statusBanjir = "Bahaya";
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_RED, HIGH);
    tone(BUZZER, 1000);
  }

  // OUTPUT KE SERIAL (buat debug & demo)
  Serial.print("Distance: ");
  Serial.print(d);
  Serial.print(" cm | Status: ");
  Serial.println(statusBanjir);

  delay(1000);
}
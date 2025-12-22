# 1. ใช้ Java 17 (หรือเวอร์ชันที่คุณใช้)
FROM eclipse-temurin:21-jdk-alpine

# 2. ตั้งค่าตัวแปร
WORKDIR /app

# 3. Copy ไฟล์ Gradle ทั้งหมดก่อน (เพื่อให้ Docker จำ Cache ได้ ถ้า Code ไม่เปลี่ยนจะไม่ต้องโหลด lib ใหม่)
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 4. ให้สิทธิ์รันไฟล์ gradlew
RUN chmod +x ./gradlew

# 5. Copy Source Code (Backend)
COPY src src

# 6. สั่ง Build ด้วย Gradle (ข้าม Test เพื่อความไว)
RUN ./gradlew clean build -x test

# 7. แตกไฟล์ Jar ออกมาใช้งาน (Gradle จะสร้างไฟล์ไว้ที่ build/libs)
# ตรงนี้สำคัญ: ชื่อไฟล์ jar อาจจะเปลี่ยนไปตาม version ใน build.gradle
# ใช้ * เพื่อดึงไฟล์อะไรก็ได้ที่นามสกุล .jar
RUN find build/libs -name "*.jar" -type f ! -name "*plain.jar" -exec cp {} app.jar \;

# 8. สั่งรัน
ENTRYPOINT ["java","-jar","app.jar"]
# LINE OA Flex Message Rating

ระบบประเมินความพึงพอใจผ่าน LINE OA ด้วย Flex Message และ Postback Event ใช้ Node.js, Express และ LINE Messaging API โดยไม่ใช้ n8n, LIFF หรือฐานข้อมูล

## ความสามารถ

- ส่ง Flex Message แบบประเมินไปยัง `userId` ที่กำหนดผ่าน API `/send-rating`
- ลูกค้ากดคะแนนใน LINE แล้วส่ง `postback` กลับเข้า `/webhook`
- ตรวจสอบ signature ของ LINE webhook ด้วย `@line/bot-sdk`
- คะแนน `4` สุ่มลิงก์ Google Review หรือ Facebook Review แล้วส่ง Flex Message พร้อมปุ่ม `ไปรีวิวให้เรา`
- คะแนน `2` หรือ `3` ส่ง Flex Message ขอบคุณ พร้อมข้อความ `ขอบคุณมากครับ`
- คะแนน `1` ส่ง Flex Message ขอโทษ พร้อมข้อความ `ขออภัยที่บริการยังไม่ดีพอ รบกวนแจ้งรายละเอียดเพิ่มเติมเพื่อให้เราปรับปรุงบริการ`
- มี endpoint `/health` สำหรับเช็กสถานะระบบ

## โครงสร้างไฟล์

```text
.
├── package.json
├── server.js
├── .env.example
├── README.md
└── flex
    ├── ratingFlex.js
    ├── reviewFlex.js
    └── lowScoreFlex.js
```

## วิธีติดตั้ง

ต้องใช้ Node.js เวอร์ชัน 18 ขึ้นไป

```bash
npm install
```

บน Windows PowerShell ถ้า `npm` ถูกบล็อก ให้ใช้:

```powershell
npm.cmd install
```

สร้างไฟล์ `.env`:

```bash
cp .env.example .env
```

บน Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

ตั้งค่าใน `.env`:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret
PORT=3000
GOOGLE_REVIEW_URL=https://movekub.com
FACEBOOK_REVIEW_URL=https://facebook.com/movekub
```

รันระบบ:

```bash
npm start
```

บน Windows PowerShell:

```powershell
npm.cmd start
```

เช็กระบบ:

```text
http://localhost:3000/health
```

## วิธีตั้งค่า LINE Developers

1. เข้า [LINE Developers Console](https://developers.line.biz/console/)
2. เลือก Provider และ Messaging API Channel ของ LINE OA
3. ไปที่แท็บ `Messaging API`
4. เปิด `Use webhook`
5. คัดลอก `Channel access token` มาใส่ใน `.env`
6. ไปที่ `Basic settings` แล้วคัดลอก `Channel secret` มาใส่ใน `.env`
7. ปิด Auto-reply หรือ Greeting message ถ้าไม่ต้องการให้ชนกับ webhook ของระบบ

## วิธีตั้ง Webhook URL

Webhook ต้องเป็น HTTPS และลงท้ายด้วย `/webhook`

ตัวอย่าง production:

```text
https://your-domain.com/webhook
```

ตัวอย่าง Render:

```text
https://your-render-service.onrender.com/webhook
```

หลังใส่ URL ใน LINE Developers แล้วให้กด `Verify` ถ้าระบบตอบถูกต้อง LINE จะแสดงว่าสำเร็จ

## วิธีทดสอบส่ง Flex Message

เรียก API `/send-rating` โดยส่ง `userId` ของ LINE ที่บอทสามารถ push message ถึงได้

```http
POST /send-rating
Content-Type: application/json
```

Body:

```json
{
  "to": "Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

ตัวอย่างบนเครื่อง:

```bash
curl -X POST http://localhost:3000/send-rating \
  -H "Content-Type: application/json" \
  -d "{\"to\":\"Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\"}"
```

เมื่อลูกค้ากดปุ่ม คะแนนจะส่ง postback data กลับมาแบบนี้:

```text
action=rating&score=1
action=rating&score=2
action=rating&score=3
action=rating&score=4
```

ระบบยังรองรับการพิมพ์คำว่า `ประเมิน` หรือ `rating` ในแชท เพื่อให้บอทตอบกลับด้วย Flex Message แบบประเมินทันที

## วิธี Deploy บน Render

1. อัปโหลดโปรเจกต์ขึ้น GitHub
2. เข้า [Render](https://render.com/)
3. กด `New` แล้วเลือก `Web Service`
4. เชื่อมต่อ repository ของโปรเจกต์นี้
5. ตั้งค่า service:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
```

6. เพิ่ม Environment Variables ใน Render:

```env
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret
GOOGLE_REVIEW_URL=https://movekub.com
FACEBOOK_REVIEW_URL=https://facebook.com/movekub
```

ไม่จำเป็นต้องตั้ง `PORT` บน Render เพราะ Render จะกำหนดค่า port ให้ผ่าน environment variable เอง

7. Deploy แล้วนำ URL ของ Render ไปตั้งใน LINE Developers:

```text
https://your-render-service.onrender.com/webhook
```

8. กด `Verify` และเปิด `Use webhook`

## หมายเหตุ

- ระบบนี้ไม่บันทึกคะแนนลงฐานข้อมูล
- `Channel access token` และ `Channel secret` เป็นข้อมูลลับ ไม่ควรเผยแพร่ใน GitHub สาธารณะ
- ถ้า token หลุด ควรออก token ใหม่ใน LINE Developers แล้วแก้ค่าใน `.env` หรือ Render Environment Variables

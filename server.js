require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");
const path = require("path");
const createRatingFlex = require("./flex/ratingFlex");
const { createReviewFlex, createThankYouFlex } = require("./flex/reviewFlex");
const createLowScoreFlex = require("./flex/lowScoreFlex");

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

const requiredEnvs = [
  "LINE_CHANNEL_ACCESS_TOKEN",
  "LINE_CHANNEL_SECRET",
  "GOOGLE_REVIEW_URL",
  "FACEBOOK_REVIEW_URL",
  "ADMIN_TOKEN"
];

// ตรวจตั้งแต่ตอนเริ่มระบบ เพื่อให้รู้ทันทีว่าขาดค่า .env ตัวไหน
for (const key of requiredEnvs) {
  if (!process.env[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "LINE OA Flex Rating API is running."
  });
});

// หน้าเว็บแอดมินสำหรับกรอก userId แล้วกดส่งแบบประเมิน
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Endpoint สำหรับเช็กว่า server ยังทำงานอยู่ ใช้ได้ทั้งตอนทดสอบและตอน deploy
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "line-oa-flex-rating"
  });
});

// Endpoint สำหรับทดสอบหรือให้ระบบภายนอกเรียกส่งแบบประเมินไปยัง userId/groupId/roomId
// ตัวอย่าง body: { "to": "Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
app.post("/send-rating", express.json(), async (req, res) => {
  try {
    if (!isAuthorizedAdmin(req)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: "Missing required field: to" });
    }

    await client.pushMessage(to, createRatingFlex());
    return res.json({ success: true });
  } catch (error) {
    console.error("Failed to send rating Flex Message:", error);
    return res.status(500).json({ error: "Failed to send rating Flex Message" });
  }
});

// LINE webhook ต้องใช้ middleware ของ LINE SDK เพื่อยืนยัน signature จาก LINE
app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    return res.status(200).end();
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).end();
  }
});

async function handleEvent(event) {
  // กรณีลูกค้าพิมพ์คำว่า "ประเมิน" ในแชท ระบบจะตอบกลับด้วยแบบประเมิน
  if (event.type === "message" && event.message.type === "text") {
    const text = event.message.text.trim();

    if (text === "ประเมิน" || text.toLowerCase() === "rating") {
      return client.replyMessage(event.replyToken, createRatingFlex());
    }

    return null;
  }

  // รับคะแนนจาก postback ของปุ่มใน Flex Message
  if (event.type === "postback") {
    const params = new URLSearchParams(event.postback.data);
    const action = params.get("action");
    const score = Number(params.get("score"));

    if (action !== "rating" || !Number.isInteger(score) || score < 1 || score > 4) {
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ไม่พบคะแนนที่ถูกต้อง กรุณาลองใหม่อีกครั้ง"
      });
    }

    if (score === 4) {
      const reviewUrl = getRandomReviewUrl();
      return client.replyMessage(event.replyToken, createReviewFlex(reviewUrl));
    }

    if (score === 2 || score === 3) {
      return client.replyMessage(event.replyToken, createThankYouFlex());
    }

    return client.replyMessage(event.replyToken, createLowScoreFlex());
  }

  return null;
}

function getRandomReviewUrl() {
  const reviewUrls = [
    process.env.GOOGLE_REVIEW_URL,
    process.env.FACEBOOK_REVIEW_URL
  ];

  const randomIndex = Math.floor(Math.random() * reviewUrls.length);
  return reviewUrls[randomIndex];
}

function isAuthorizedAdmin(req) {
  const adminToken = process.env.ADMIN_TOKEN;
  const tokenFromHeader = req.get("x-admin-token");
  const tokenFromBody = req.body && req.body.adminToken;

  // ถ้าไม่ได้ตั้ง ADMIN_TOKEN จะไม่อนุญาตให้เรียก /send-rating เพื่อกัน endpoint เปิดสาธารณะ
  return Boolean(adminToken && (tokenFromHeader === adminToken || tokenFromBody === adminToken));
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`LINE OA Flex Rating API is running on port ${port}`);
});

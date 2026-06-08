// Flex Message สำหรับลูกค้าที่ให้คะแนนดี เพื่อเชิญไปรีวิวต่อ
function createReviewFlex(reviewUrl) {
  return {
    type: "flex",
    altText: "ขอบคุณสำหรับคะแนนของคุณ",
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#1DB446",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "ขอบคุณสำหรับคะแนนของคุณ",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
            wrap: true
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "เราดีใจมากที่คุณพึงพอใจกับบริการของเรา หากสะดวก รบกวนช่วยรีวิวให้เราเพิ่มเติมได้เลย",
            size: "md",
            color: "#333333",
            wrap: true
          }
        ]
      },
      footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          {
            type: "button",
            style: "primary",
            color: "#1DB446",
            action: {
              type: "uri",
              label: "ไปรีวิวให้เรา",
              uri: reviewUrl
            }
          }
        ]
      }
    }
  };
}

// Flex Message สำหรับคะแนน 2 หรือ 3 ใช้ตอบขอบคุณโดยไม่ส่งไปหน้ารีวิว
function createThankYouFlex() {
  return {
    type: "flex",
    altText: "ขอบคุณมากครับ",
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#2563EB",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "ขอบคุณมากครับ",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF",
            wrap: true
          }
        ]
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "ขอบคุณมากครับ",
            size: "md",
            color: "#333333",
            wrap: true
          }
        ]
      }
    }
  };
}

module.exports = {
  createReviewFlex,
  createThankYouFlex
};

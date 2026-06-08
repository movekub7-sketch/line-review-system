// Flex Message สำหรับส่งแบบประเมินความพึงพอใจให้ลูกค้ากดคะแนนใน LINE
function createRatingFlex() {
  const scores = [
    { score: 1, label: "⭐ ต้องปรับปรุง" },
    { score: 2, label: "⭐⭐ ปานกลาง" },
    { score: 3, label: "⭐⭐⭐ พอใจ" },
    { score: 4, label: "⭐⭐⭐⭐⭐ ดีมาก" }
  ];

  return {
    type: "flex",
    altText: "ประเมินความพึงพอใจ",
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
            text: "ประเมินความพึงพอใจ",
            weight: "bold",
            size: "xl",
            color: "#FFFFFF"
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
            text: "ขอบคุณที่ใช้บริการกับเรา กรุณาให้คะแนนการบริการครั้งนี้",
            size: "md",
            color: "#333333",
            wrap: true
          },
          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            margin: "lg",
            contents: scores.map((item) => ({
              type: "button",
              style: item.score >= 4 ? "primary" : "secondary",
              color: item.score >= 4 ? "#1DB446" : "#F2F4F7",
              height: "sm",
              // เมื่อกดปุ่ม LINE จะส่งข้อมูลนี้กลับเข้า webhook เป็น Postback Event
              action: {
                type: "postback",
                label: item.label,
                data: `action=rating&score=${item.score}`,
                displayText: item.label
              }
            }))
          }
        ]
      }
    }
  };
}

module.exports = createRatingFlex;

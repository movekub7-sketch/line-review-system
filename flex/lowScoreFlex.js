// Flex Message สำหรับลูกค้าที่ให้คะแนน 1 เพื่อขอโทษและขอรายละเอียดเพิ่มเติม
function createLowScoreFlex() {
  return {
    type: "flex",
    altText: "ขออภัยสำหรับประสบการณ์ที่ไม่ดี",
    contents: {
      type: "bubble",
      size: "mega",
      header: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#F97316",
        paddingAll: "20px",
        contents: [
          {
            type: "text",
            text: "ขออภัยสำหรับประสบการณ์ที่ไม่ดี",
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
            text: "ขออภัยที่บริการยังไม่ดีพอ รบกวนแจ้งรายละเอียดเพิ่มเติมเพื่อให้เราปรับปรุงบริการ",
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
            color: "#F97316",
            action: {
              type: "message",
              label: "แจ้งรายละเอียดเพิ่มเติม",
              text: "แจ้งรายละเอียดเพิ่มเติม"
            }
          }
        ]
      }
    }
  };
}

module.exports = createLowScoreFlex;

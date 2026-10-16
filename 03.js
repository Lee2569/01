
const form = document.getElementById("borrowForm");
const list = document.getElementById("borrowList");
const message = document.getElementById("message");

let records = [];

try {
  records = JSON.parse(
    localStorage.getItem("bookRecords") || "[]"
  );
  if (!Array.isArray(records)) records = [];
} catch {
  records = [];
}

function showRecords() {
  list.replaceChildren();

  records.forEach(record => {
    const row = document.createElement("tr");

    [
      record.name,
      record.studentId,
      record.bookCode,
      record.date,
      record.time
    ].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    list.appendChild(row);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const now = new Date();

  records.unshift({
    name: document.getElementById("studentName").value.trim(),
    studentId: document.getElementById("studentId").value.trim(),
    bookCode: document.getElementById("bookCode").value.trim(),
    date: now.toLocaleDateString("th-TH"),
    time: now.toLocaleTimeString("th-TH", {
      hour12: false
    })
  });

  try {
    localStorage.setItem("bookRecords", JSON.stringify(records));
    showRecords();
    form.reset();
    message.textContent = "บันทึกข้อมูลสำเร็จ!";
  } catch {
    records.shift();
    message.textContent = "บันทึกไม่สำเร็จ พื้นที่จัดเก็บอาจเต็ม";
  }
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const header = [
    "ชื่อ", "รหัสนักเรียน", "รหัสหนังสือ", "วันที่ยืม", "เวลายืม"
  ];

  const rows = records.map(r => [
    r.name, r.studentId, r.bookCode, r.date, r.time
  ]);

  const csvCell = value =>
    '"' + String(value).replace(/"/g, '""') + '"';

  const csv = [header, ...rows]
    .map(row => row.map(csvCell).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "book-borrow.csv";
  link.click();
  URL.revokeObjectURL(url);
});

showRecords();

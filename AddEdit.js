function calcTotal() {
    let total = 0;
    const rows = document.querySelectorAll("#Asset tbody tr");
    rows.forEach(row => {
      const price = parseFloat(row.cells[1].innerText);
      if (!isNaN(price)) {
        total += price;
      }
    });
    document.getElementById("totalPrice").innerText = total.toLocaleString();
  }
  calcTotal();
	
	  // ฟังก์ชันเช็ควันเกิด / วันสำคัญ
  function checkBirthdayToday() {
    let today = new Date();
    let tDay = today.getDate();
    let tMonth = today.getMonth() + 1; // เดือน JS เริ่มที่ 0

    let table = document.getElementById("birthdayTable");
    let announce = document.getElementById("announceArea");
    let messages = [];

    for (let i = 1; i < table.rows.length; i++) {
      let name = table.rows[i].cells[0].innerText.trim();
      let dateStr = table.rows[i].cells[1].innerText.trim();

      let parts = dateStr.split("/");
      if (parts.length !== 3) continue;

      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10);

      // ถ้าวันและเดือนตรงกัน
      if (day === tDay && month === tMonth) {
        messages.push("วันนี้เป็นวันพิเศษของ 🎉 " + name);
      }
    }

    if (messages.length > 0) {
      announce.innerHTML = messages.join("<br>");
      announce.style.display = "block";
    }
  }

  // เรียกใช้งาน
  checkBirthdayToday();

	
  let sortConfig = { key: null, asc: true };

  function getItems() {
    const rows = document.querySelectorAll("#birthdayTable tbody tr");
    return Array.from(rows).map(row => {
      return {
        name: row.cells[0].textContent.trim(),
        date: row.cells[1].textContent.trim(),
        year: row.cells[2].textContent.trim(),
        row: row
      };
    });
  }

  function parseDate(d) {
    if (!d) return null;
    let parts = d.split("/");
    if (parts.length !== 3) return null;
    return new Date(parts[2], parts[1] - 1, parts[0]); // yyyy,mm,dd
  }

  document.querySelectorAll("th[data-key]").forEach(th => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (sortConfig.key === key) {
        sortConfig.asc = !sortConfig.asc;
      } else {
        sortConfig.key = key;
        sortConfig.asc = true;
      }

      let items = getItems();
      items.sort((a, b) => {
        let va, vb;
        if (key === "date") {
          va = parseDate(a.date);
          vb = parseDate(b.date);
        } else if (key === "year") {
          va = a.year === "-" ? NaN : Number(a.year);
          vb = b.year === "-" ? NaN : Number(b.year);
        } else {
          va = a[key];
          vb = b[key];
        }

        if (va < vb) return sortConfig.asc ? -1 : 1;
        if (va > vb) return sortConfig.asc ? 1 : -1;
        return 0;
      });

      const tbody = document.querySelector("#birthdayTable tbody");
      tbody.innerHTML = "";
      items.forEach(it => tbody.appendChild(it.row));
    });
  });

  // ฟังก์ชันคำนวณอายุ
  function calculateAge(dateStr) {
    let parts = dateStr.split("/");
    if (parts.length !== 3) return "-";

    let day = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1;
    let year = parseInt(parts[2], 10);

    let birthDate = new Date(year, month, day);
    let today = new Date();

    // ถ้าวันเกิดอยู่ในอนาคต => return "-"
    if (birthDate > today) return "-";

    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // วนลูปทุกแถวแล้วคำนวณอายุ
  let table = document.getElementById("birthdayTable");
  for (let i = 1; i < table.rows.length; i++) {
    let dateStr = table.rows[i].cells[1].innerText.trim();
    table.rows[i].cells[2].innerText = calculateAge(dateStr);
  }

	  // กำหนดชื่อเพจและไฟล์
  const pages = {
    "หน้าแรก": "index.html",
    "ปฏิทิน": "calendar.html",
    "คำนวณปันผล": "dividend.html",
    "คำนวณดอกเบี้ย": "loan.html",
    "เครื่องคิดเลข": "calculator.html",
    "คำนวณค่าใช้จ่าย": "CostSaving.html",
    "หุ้นที่ถือ": "Nasdaq.html",
    "performent": "DIME.html",
    "เว็บแมว": "generic.html"
  };

  function showSuggestions(value) {
    const suggestions = document.getElementById("suggestions");
    suggestions.innerHTML = "";

    if (!value) return;

    value = value.toLowerCase();
    for (let key in pages) {
      if (key.toLowerCase().includes(value)) {
        const li = document.createElement("li");
        li.textContent = key;
        li.onclick = () => {
          document.getElementById("query").value = key;
          suggestions.innerHTML = "";
          goSearch();
        };
        suggestions.appendChild(li);
      }
    }
  }

  function goSearch() {
    const input = document.getElementById("query").value.trim();
    if (pages[input]) {
      window.location.href = pages[input];
    } else {
      alert("ไม่พบหน้าที่ค้นหา: " + input);
    }
    return false; // ป้องกัน submit reload
  }
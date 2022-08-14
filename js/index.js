// style lại cho thẻ span nè :))
let tagname = document.getElementsByTagName("span");
[...tagname].forEach((element) => {
  element.style.display = "block";
});

function Staff(id, name, email, password, calendar, wage, position, time) {
  this.id = id;
  this.name = name;
  this.email = email;
  this.password = password;
  this.calendar = calendar;
  this.wage = wage;
  this.position = position;
  this.time = time;
}

Staff.prototype.calcSore = function () {
  let position = this.position;
  let wage = this.wage;
  if (position === "Sếp") {
    return wage * 3;
  } else if (position === "Trưởng Phòng") {
    return wage * 2;
  } else {
    return wage * 1;
  }
};

Staff.prototype.getRank = function () {
  let score = this.time;
  if (score >= 192) {
    return "Xuất Xắc";
  } else if (score >= 176) {
    return "Giỏi";
  } else if (score >= 160) {
    return " Khá";
  } else {
    return "Trung Bình";
  }
};

let staffs = [];
// khi chương trình chạy thì mặc định nó chạy
init();

// ================================================================

function init() {
  //lấy dữ liệu từ localStorage
  staffs = JSON.parse(localStorage.getItem("staffs")) || [];
  console.log("staffs trước khi map :", staffs);

  staffs = staffs.map((staff) => {
    return new Staff(
      staff.id,
      staff.name,
      staff.email,
      staff.password,
      staff.calendar,
      staff.wage,
      staff.position,
      staff.time
    );
  });
  console.log("staffs sau khi map :", staffs);

  display(staffs);
}

function updateStaff() {
  // B1 : DOM lấy thông tin của thằng input
  let id = dom("#tknv").value;
  let name = dom("#name").value;
  let email = dom("#email").value;
  let password = dom("#password").value;
  let calendar = dom("#datepicker").value;
  let wage = dom("#luongCB").value;
  let position = dom("#chucvu").value;
  let time = dom("#gioLam").value;
  // B2 : tạo 1 object chứa các thông tin trên
  let staff = new Staff(
    id,
    name,
    email,
    password,
    calendar,
    wage,
    position,
    time
  );
  console.log(staff);

  // b3 : cập nhật thông tin nhân viên và lưu trữ nó vào localStorage
  let index = staffs.findIndex((item) => item.id === staff.id);
  staffs[index] = staff;

  localStorage.setItem("staffs", JSON.stringify(staffs));

  // B4 : hiển thị ra giao diện
  display(staffs);

  // B5 : reset form
  resetForm();
}

function selectStaff(staffId) {
  let staff = staffs.find((staff) => {
    return staff.id === staffId;
  });
  if (!staff) {
    return;
  }

  // dùng cái ofject staff này đi dưa 9 thông tin đã lưu lên các input
  dom("#tknv").value = staff.id;
  dom("#name").value = staff.name;
  dom("#email").value = staff.email;
  dom("#password").value = staff.password;
  dom("#datepicker").value = staff.calendar;
  dom("#luongCB").value = staff.wage;
  dom("#chucvu").value = staff.position;
  dom("#gioLam").value = staff.time;

  dom("#tknv").disabled = true;
  dom("#btnThem").disabled = true;
}

function searchStaff() {
  let searchValue = dom("#searchName").value;
  let newstaffs = staffs.filter((staff) => {
    return staff.getRank() === searchValue;
  });

  display(newstaffs);
}

function deleteStaff(staffID) {
  staffs = staffs.filter((staff) => {
    return staff.id !== staffID;
  });

  // lưu trữ nó vào localStorage sau khi xóa nó khỏi cái danh sách nhân viên
  localStorage.setItem("staffs", JSON.stringify(staffs));

  display(staffs);
}

function addStaff() {
  // B1 : DOM lấy thông tin của thằng input
  let id = dom("#tknv").value;
  let name = dom("#name").value;
  let email = dom("#email").value;
  let password = dom("#password").value;
  let calendar = dom("#datepicker").value;
  let wage = dom("#luongCB").value;
  let position = dom("#chucvu").value;
  let time = dom("#gioLam").value;

  let Valida = ValidateForm();
  if (!Valida) {
    return;
  }

  // B2 : tạo 1 object chứa các thông tin trên
  let staff = new Staff(
    id,
    name,
    email,
    password,
    calendar,
    wage,
    position,
    time
  );
  console.log(staff);
  // B3 : hiển thị thông tin ra table và thêm nó vào localstorage
  staffs.push(staff);

  localStorage.setItem("staffs", JSON.stringify(staffs));
  // B4 : hiển thị ra giao diện
  display(staffs);
  // B5 : reset form
  resetForm();
}

// ================================================================

// hàm reset các input về chuỗi rỗng
function resetForm() {
  dom("#tknv").value = "";
  dom("#name").value = "";
  dom("#email").value = "";
  dom("#password").value = "";
  dom("#datepicker").value = "";
  dom("#luongCB").value = "";
  dom("#chucvu").value = "";
  dom("#gioLam").value = "";
}

// dùng array này dể hiển thị thông tin ra table
function display(staffs) {
  let html = staffs.reduce((result, staff) => {
    return (
      result +
      `
    <tr>
        <td>${staff.id}</td>
        <td>${staff.name}</td>
        <td>${staff.email}</td>
        <td>${staff.calendar}</td>
        <td>${staff.position}</td>
        <td>${staff.calcSore()}</td>
        <td>${staff.getRank()}</td>
        <td>
        <button class="btn btn-success" onclick="selectStaff('${
          staff.id
        }')"> Edit</button>
            <button class="btn btn-danger" onclick="deleteStaff('${
              staff.id
            }')"> Delete </button>
        </td>
    </tr>
    `
    );
  }, "");
  dom("#tableDanhSach").innerHTML = html;
}

function dom(selector) {
  return document.querySelector(selector);
}

// =============================== Validation =================================

function ValidateID() {
  let id = dom("#tknv").value;
  let spanEl = dom("#tbTKNV");

  if (!id) {
    spanEl.innerHTML = " Mã nhân viên không được để trống ";
    return false;
  }

  if (id.length < 4 || id.length > 8) {
    spanEl.innerHTML = " Mã nhân viên từ 4 đến 8 kí tự ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

function ValidateName() {
  let name = dom("#name").value;
  let spanEl = dom("#tbTen");

  if (!name) {
    spanEl.innerHTML = " Họ và Tên không được để trống ";
    return false;
  }

  if (name.length < 8) {
    spanEl.innerHTML = " Điền đầy đủ Họ và Tên ";
    return false;
  }

  let regex = /(?=.*\d)/;
  if (regex.test(name)) {
    spanEl.innerHTML = " Họ và Tên chỉ nhập chữ ";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}
function ValidateEmail() {
  let email = dom("#email").value;
  let spanEl = dom("#tbEmail");

  if (!email) {
    spanEl.innerHTML = " Email không được để trống ";
    return false;
  }
  let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!regex.test(email)) {
    spanEl.innerHTML = " Email không đúng định dạng ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

function ValidatePassword() {
  let password = dom("#password").value;
  let spanEl = dom("#tbMatKhau");

  if (!password) {
    spanEl.innerHTML = " Password không được để trống ";
    return false;
  }
  let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    spanEl.innerHTML = " Password không đúng định dạng ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

function ValidateCalendar() {
  let calendar = dom("#datepicker").value;
  let spanEl = dom("#tbNgay");

  if (!calendar) {
    spanEl.innerHTML = " Lịch không được để trống ";
    return false;
  }

  let regex = /(?=.*\d).{9,}/;
  if (!regex.test(calendar)) {
    spanEl.innerHTML = " Hãy nhập đúng định dạng mm/dd/yyyy ";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidateWage() {
  let wage = dom("#luongCB").value;
  let spanEl = dom("#tbLuongCB");

  if (!wage) {
    spanEl.innerHTML = " CÓ LỖI VỚI BẢN THÂN LẮM :)) ";
    return false;
  }

  if (wage < 1000000 || wage > 20000000) {
    spanEl.innerHTML = " ẨU RỒI ĐÓ 3 -.-";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidatePosition() {
  let position = dom("#chucvu").value;
  let spanEl = dom("#tbChucVu");

  if (!position) {
    spanEl.innerHTML = " Chọn chức vụ ";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidateTime() {
  let time = dom("#gioLam").value;
  let spanEl = dom("#tbGiolam");

  if (!time) {
    spanEl.innerHTML = " Có muốn lấy lương không ??? ";
    return false;
  }

  if(time < 80 || time > 200) {
    spanEl.innerHTML = " Nhập sai giờ làm ";
    return false;
  }

  spanEl.innerHTML = "";
  return true;
}

function ValidateForm() {
  let isValid = true;

  isValid =
    ValidateID() &
    ValidateName() &
    ValidateEmail() &
    ValidatePassword() &
    ValidateCalendar() &
    ValidateWage() &
    ValidatePosition() &
    ValidateTime();

  if (!isValid) {
    alert("ĐIỀN CHƯA ĐÚNG");
    return false;
  }
  return true;
}

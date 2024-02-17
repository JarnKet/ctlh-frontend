import React, { Component } from "react";
export default class Empty extends Component {
  render() {
    return (
      <div>
        <div
          className="container"
          style={{ textAlign: "center", marginTop: "20%", marginBottom: "20%" }}
        >
           <img
            src="https://cdn.dribbble.com/users/598368/screenshots/3890110/dribble_no_data.jpg"
            width="220px"
            height="140px"
            style={{ textAlign: "center", opacity: "20%" }}
          />
          <br />
          <br /> 
          <h4>
            <strong style={{ color: "#ccc" }}>
              ຍັງບໍ່ມີຂໍ້ມູນທີ່ຈະສະແດງເທື່ອ !
            </strong>
          </h4>
          {/* <strong>
            ລາຍຊື່ນັກສຶກສາທີ່ລໍຖ້າການລົງທະບຽນເຂົ້າຄະນະຈະປະກົດທີ່ບ່ອນນີ້
          </strong> */}
        </div>
      </div>
    );
  }
}

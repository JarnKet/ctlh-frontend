import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Navbar, Nav, Form, Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { USER_KEY } from "../consts";

export default function NavBar() {
  const history = useHistory();
  const [userData, setUserData] = useState({});
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const _resData = localStorage.getItem(USER_KEY);
    const _localJson = JSON.parse(_resData);
    if (!_localJson?.data) {
      history.push(`/`);
    } else {
      setUserData(_localJson);
      console.log(_localJson);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    history.push(`/`);
  };

  return userData?.data?.role === "STAFF" ? (
    <div />
  ) : (
    <div className="theme-red">
      <Navbar
        style={{
          backgroundColor: "#FFF",
          boxShadow: "3px 0px 3px rgba(0, 0, 0, 0.16)",
          color: "#ffffff!important",
          width: "100%",
          height: 64,
          position: "fixed",
          // marginLeft: userData?.data?.role === "STAFF" || isMobileOrTablet ? 0 : 60,
          paddingRight: 80,
          zIndex: 1001,
        }}
        variant="dark"
      >
        <Navbar.Brand style={{ color: "black", marginLeft: isMobileOrTablet ? 20 : 80, fontWeight: "bold" }} href="/">
          <img src="/assets/image/banner.jpg" alt="banner" height={60} style={{ marginRight: 10 }} />
          {!isMobileOrTablet ? "ບໍລິສັດ ຈັນທະລັກຮຸ່ງເຮືອງ ຂາເຂົ້າ-ຂາອອກ ຈຳກັດ" : null}
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ml-auto" />
          <Form className="w-100 d-flex  justify-content-end" style={{ alignItems: "center" }}>
            <div className="avartar"></div>
            <Dropdown>
              <Dropdown.Toggle style={{ color: "#96acc4" }} variant="">
                {userData ? (userData?.data?.fullName ? userData?.data?.fullName : "") : ""}
              </Dropdown.Toggle>

              <Dropdown.Menu align="end">
                {/* <NavDropdown.Divider /> */}
                <Dropdown.Item style={{ color: "#909090" }} onClick={() => _onLogout()}>
                  <FontAwesomeIcon icon={faClipboardList} style={{ color: "#ff5059" }} /> ອອກຈາກລະບົບ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <Image
              src={userData?.data?.profileImage ? `${Constans?.URL_FOR_SHOW_PHOTO}${userData?.data?.profileImage}` : ImageProfile}
              width={50}
              height={50}
              roundedCircle
            /> */}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

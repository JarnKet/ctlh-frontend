import { Navbar, Nav, Form, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "@uidotdev/usehooks";

export default function NavBarPublic() {
  const isMobile = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <div className="theme-red">
      <Navbar
        style={{
          backgroundColor: "#FFF",
          //   border: "1px solid red",
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
        <Navbar.Brand style={{ color: "#909090", marginLeft: 20, fontWeight: "bold" }} href="/">
          <img src="/assets/image/banner.jpg" alt="banner" height={60} style={{ marginRight: 10 }} />
          {!isMobile ? "ບໍລິສັດ ຈັນທະລັກຮຸ່ງເຮືອງ ຂາເຂົ້າ-ຂາອອກ ຈຳກັດ" : null}
        </Navbar.Brand>
      </Navbar>
    </div>
  );
}

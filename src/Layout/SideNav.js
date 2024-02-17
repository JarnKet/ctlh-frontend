import React, { useState, useEffect } from "react";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCog,
  faCube,
  faMoneyBillTransfer,
  faArrowRightToCity,
  faPercent,
  faMoneyBillTrendUp,
  faChartLine,
  faPersonHiking,
  faStore,
  faBoxesStacked,
} from "@fortawesome/free-solid-svg-icons";

import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import "./sidenav.css";
import { USER_KEY } from "../consts";
import { PAGE_GINATION } from "../consts/router";

const UN_SELECTED_TAB = "#FFF";
const SELECTED_TAB = "#96acc4";
const APP_COLOR_FOCUS = "#FFF";

export default function Sidenav({ location, history }) {
  const [selectStatus, setSelectStatus] = useState(location.pathname.split("/")[1].split("-")[0]);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    getDataFromLocal();
  }, []);

  const getDataFromLocal = async () => {
    try {
      const _resData = await localStorage.getItem(USER_KEY);
      const _localJson = JSON.parse(_resData);

      if (_localJson?.data) {
        setUserData(_localJson?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return userData?.role === "STAFF" ? (
    <div />
  ) : (
    <SideNav
      style={{
        background: "#ff5059",
        height: "100vh",
        display: "block",
        position: "fixed",
        zIndex: 10000,
      }}
      onSelect={(selected) => {
        // setSelectStatus(selected.split("/")[0].split("-")[0]);
        setSelectStatus(selected.split("-")[0]);
        let selectedMenu;
        if (selected === "bill") {
          selectedMenu = selected;
        } else if (selected === "history") {
          selectedMenu = selected + "/" + PAGE_GINATION;
        } else if (selected === "category") {
          selectedMenu = selected + "-list";
        } else if (selected === "product") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "receive") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "export") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "categoryService") {
          selectedMenu = selected;
        } else if (selected === "service") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "expenditure") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "dashboard") {
          selectedMenu = selected;
        } else if (selected === "agent") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "sell-product") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "store") {
          selectedMenu = selected;
        } else if (selected === "user") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "customer") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "entryexit") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "promotion") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "duty") {
          selectedMenu = selected;
        } else if (selected === "duty") {
          selectedMenu = selected;
        } else if (selected === "absent") {
          selectedMenu = selected + "-list/" + PAGE_GINATION;
        } else if (selected === "entry-exit") {
          selectedMenu = selected;
        }
        const to = "/" + selectedMenu;
        if (location.pathname !== to) {
          history.push(to);
        }
      }}
    >
      <SideNav.Toggle style={{ color: "white" }} />
      <SideNav.Nav defaultSelected={selectStatus}>
        {/* <NavItem disabled>
          <NavText
            style={{
              color: SELECTED_TAB,
              fontSize: "17px",
              marginLeft: 5,
            }}
          >
            ໜ້າຮ້ານ
          </NavText>
        </NavItem> */}

        {/* {userData?.manageFuntion?.includes("DASHBOARD") ? (
          <NavItem eventKey={`dashboard`} style={{ backgroundColor: selectStatus === "dashboard" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                icon={faChartLine}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "dashboard" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "dashboard" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ລາຍງານ
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("BILL") ? (
          <NavItem eventKey={`bill`} style={{ backgroundColor: selectStatus === "bill" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                // icon={faClipboardList}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "bill" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "bill" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ເປີດບິນ
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}

        {/* <NavItem eventKey={`store`} style={{ backgroundColor: selectStatus === "store" ? SELECTED_TAB : "transparent" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faStore}
              style={{
                fontSize: "20px",
                color: selectStatus === "store" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selectStatus === "store" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              fontSize: "17px",
            }}
          >
            ໜ້າຮ້ານ
          </NavText>
        </NavItem> */}
        <NavItem eventKey={`agent`} style={{ backgroundColor: selectStatus === "agent" ? SELECTED_TAB : "transparent" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faUserCog}
              style={{
                fontSize: "20px",
                color: selectStatus === "agent" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selectStatus === "agent" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              fontSize: "17px",
            }}
          >
            ຕົວແທນຈຳໜ່າຍ
          </NavText>
        </NavItem>
        <NavItem eventKey="product">
          <NavIcon>
            <FontAwesomeIcon
              icon={faCube}
              style={{
                fontSize: "20px",
                color:
                  selectStatus === "category" || selectStatus === "product" || selectStatus === "receive" || selectStatus === "export"
                    ? APP_COLOR_FOCUS
                    : UN_SELECTED_TAB,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selectStatus === "category" || selectStatus === "product" || selectStatus === "receive" || selectStatus === "export"
                  ? APP_COLOR_FOCUS
                  : UN_SELECTED_TAB,
              fontSize: 17,
            }}
          >
            ຈັດການຂໍ້ມູນສິນຄ້າ
          </NavText>
          <NavItem eventKey="category" style={{ backgroundColor: selectStatus === "category" ? SELECTED_TAB : "transparent" }}>
            <NavText>ປະເພດສິນຄ້າ</NavText>
          </NavItem>
          <NavItem eventKey="product" style={{ backgroundColor: selectStatus === "product" ? SELECTED_TAB : "transparent" }}>
            <NavText>ສິນຄ້າ</NavText>
          </NavItem>
          <NavItem eventKey="product" style={{ backgroundColor: selectStatus === "product" ? SELECTED_TAB : "transparent" }}>
            <NavText>ຂອງແຖມ</NavText>
          </NavItem>
          {/* <NavItem eventKey="receive" style={{ backgroundColor: selectStatus === "receive" ? SELECTED_TAB : "transparent" }}>
            <NavText>ນຳສິນຄ້າເຂົ້າ</NavText>
          </NavItem>
          <NavItem eventKey="export" style={{ backgroundColor: selectStatus === "export" ? SELECTED_TAB : "transparent" }}>
            <NavText>ເບີກສິນຄ້າ</NavText>
          </NavItem> */}
        </NavItem>
        {/* <NavItem eventKey={`sell-product`} style={{ backgroundColor: selectStatus === "sell-product" ? SELECTED_TAB : "transparent" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faBoxesStacked}
              style={{
                fontSize: "20px",
                color: selectStatus === "sell-product" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selectStatus === "sell-product" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              fontSize: "17px",
            }}
          >
            ສິນຄ້າທັງໝົດ
          </NavText>
        </NavItem> */}
        {/* {userData?.manageFuntion?.includes("CUSTOMER") ?
          <NavItem eventKey={`customer`}
            style={{ backgroundColor: selectStatus === "customer" ? SELECTED_TAB : "transparent" }}
          >
            <NavIcon>
              <FontAwesomeIcon
                icon={faUserPlus}
                style={{
                  fontSize: "20px",
                  color:
                    selectStatus === "customer"
                      ? APP_COLOR_FOCUS
                      : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selectStatus === "customer"
                    ? APP_COLOR_FOCUS
                    : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ຈັດການສະມາຊິກ
            </NavText>
          </NavItem>
          : <></>
        } */}
        {/* <hr style={{ borderTop: '2px dashed #fff' }} />
        <NavItem disabled>
          <NavText
            style={{
              color: SELECTED_TAB,
              fontSize: "17px",
              marginLeft: 5
            }}
          >
            ຫຼັງຮ້ານ
          </NavText>
        </NavItem> */}

        {/* {userData?.manageFuntion?.includes("PRODUCT") ? (
          <NavItem eventKey="product">
            <NavIcon>
              <FontAwesomeIcon
                icon={faCube}
                style={{
                  fontSize: "20px",
                  color:
                    selectStatus === "category" || selectStatus === "product" || selectStatus === "receive" || selectStatus === "export"
                      ? APP_COLOR_FOCUS
                      : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selectStatus === "category" || selectStatus === "product" || selectStatus === "receive" || selectStatus === "export"
                    ? APP_COLOR_FOCUS
                    : UN_SELECTED_TAB,
                fontSize: 17,
              }}
            >
              ຈັດການຂໍ້ມູນສິນຄ້າ
            </NavText>
            <NavItem eventKey="category" style={{ backgroundColor: selectStatus === "category" ? SELECTED_TAB : "transparent" }}>
              <NavText>ປະເພດສິນຄ້າ</NavText>
            </NavItem>
            <NavItem eventKey="product" style={{ backgroundColor: selectStatus === "product" ? SELECTED_TAB : "transparent" }}>
              <NavText>ສິນຄ້າ</NavText>
            </NavItem>
            <NavItem eventKey="receive" style={{ backgroundColor: selectStatus === "receive" ? SELECTED_TAB : "transparent" }}>
              <NavText>ນຳສິນຄ້າເຂົ້າ</NavText>
            </NavItem>
            <NavItem eventKey="export" style={{ backgroundColor: selectStatus === "export" ? SELECTED_TAB : "transparent" }}>
              <NavText>ເບີກສິນຄ້າ</NavText>
            </NavItem>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("SERVICE") ? (
          <NavItem eventKey="service">
            <NavIcon>
              <FontAwesomeIcon
                // icon={faPeopleArrows}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "categoryService" || selectStatus === "service" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>

            <NavText
              style={{
                color: selectStatus === "categoryService" || selectStatus === "service" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: 17,
              }}
            >
              ຈັດການຂໍ້ມູນບໍລິການ
            </NavText>
            <NavItem eventKey="categoryService" style={{ backgroundColor: selectStatus === "categoryService" ? SELECTED_TAB : "transparent" }}>
              <NavText>ປະເພດບໍລິການ</NavText>
            </NavItem>

            <NavItem eventKey="service" style={{ backgroundColor: selectStatus === "service" ? SELECTED_TAB : "transparent" }}>
              <NavText>ບໍລິການ</NavText>
            </NavItem>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("EXPENDITURE") ? (
          <NavItem eventKey={`expenditure`} style={{ backgroundColor: selectStatus === "expenditure" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                icon={faMoneyBillTransfer}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "expenditure" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "expenditure" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ບັນຊີ
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("USER") ? (
          <NavItem eventKey={`user`} style={{ backgroundColor: selectStatus === "user" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                icon={faUserCog}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "user" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "user" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ຜູ້ໃຊ້ລະບົບ
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("ENTRY_EXIT") ? (
          <NavItem eventKey={`entryexit`} style={{ backgroundColor: selectStatus === "entryexit" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                icon={faArrowRightToCity}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "entryexit" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "entryexit" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ການເຂົ້າ-ອອກ
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("ABSENT") ? (
          <NavItem eventKey={`absent`} style={{ backgroundColor: selectStatus === "absent" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                icon={faPersonHiking}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "absent" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "absent" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ການຂອບພັກວຽກ
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("PROMOTION") ? (
          <NavItem eventKey={`promotion`} style={{ backgroundColor: selectStatus === "promotion" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                icon={faPercent}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "promotion" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "promotion" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              Promotion
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* {userData?.manageFuntion?.includes("DUTY") ? (
          <NavItem eventKey={`duty`} style={{ backgroundColor: selectStatus === "duty" ? SELECTED_TAB : "transparent" }}>
            <NavIcon>
              <FontAwesomeIcon
                icon={faMoneyBillTrendUp}
                style={{
                  fontSize: "20px",
                  color: selectStatus === "duty" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selectStatus === "duty" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
                fontSize: "17px",
              }}
            >
              ຈັດການ ອ.ມ.ພ
            </NavText>
          </NavItem>
        ) : (
          <></>
        )} */}
        {/* <NavItem eventKey={`entry-exit`} style={{ backgroundColor: selectStatus === "entry" ? SELECTED_TAB : "transparent" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faArrowRightToCity}
              style={{
                fontSize: "20px",
                color: selectStatus === "entry" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selectStatus === "entry" ? APP_COLOR_FOCUS : UN_SELECTED_TAB,
              fontSize: "17px",
            }}
          >
            ໝາຍເຂົ້າ-ອອກວຽກ
          </NavText>
        </NavItem> */}
      </SideNav.Nav>
    </SideNav>
  );
}

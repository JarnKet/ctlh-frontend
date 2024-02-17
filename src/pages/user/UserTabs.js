import React from "react";
import { useHistory,useLocation,useParams } from "react-router-dom";
import { Card, Nav } from "react-bootstrap";
import {
  USER_LIST,
  CUSTOMER_LIST,
  PAGE_GINATION
} from "../../consts/router";
export default function UserTabs() {
  const history = useHistory();
  const location = useLocation();
  const Params = useParams();
  const _historyPaymentList = (routpath) => {
    history.push(routpath+"/"+ PAGE_GINATION);
  };
  return (
    <div>
      <div style={{ paddingLeft: 19 }}>
        <Nav
          variant="tabs"
          style={{ fontWeight: "bold" }}
          defaultActiveKey={location?.pathname}
        >
          <Nav.Item>
            <Nav.Link
              eventKey={ location?.pathname ===USER_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/' ? USER_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/':USER_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip}
              onClick={() => _historyPaymentList(USER_LIST)}
              style={{ color: "#476FBC" }}
            >
              ພະນັກງານ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey={ location?.pathname ===CUSTOMER_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/' ? CUSTOMER_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip+'/':CUSTOMER_LIST+"/limit/"+ Params?.limit+"/skip/"+Params?.skip}
              onClick={() => _historyPaymentList(CUSTOMER_LIST)}
              style={{ color: "#476FBC" }}
            >
              ສະມາຊິກ
            </Nav.Link>
          </Nav.Item>
        </Nav>
        </div>
    </div>
  );
}

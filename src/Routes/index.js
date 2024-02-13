import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { useMediaQuery } from "@uidotdev/usehooks";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Navbar from "../Layout/Navbar";
import NavBarPublic from "../Layout/NavbarPublic";
import CustomSideNav from "../Layout/SideNav";
import Routers from "../consts/router";

import Login from "../pages/login/Login";
// USER
import UserAdd from "../pages/user/UserAdd";
import UserEdit from "../pages/user/UserEdit";
import UserList from "../pages/user/UserList";
import CustomerList from "../pages/user/CustomerList";
import UserDetail from "../pages/user/UserDetail";
import CustomerDetail from "../pages/user/CustomerDetail";
import DashboardPage from "../pages/dashboard";

//RECEIVE
import ReceiveList from "../pages/receive/ReceiveList";
//RECEIVE
import ExportList from "../pages/export/ExportList";
import ExportAdd from "../pages/export/ExportAdd";
//MEMBER
import MemberList from "../pages/member/MemberList";
import MemberAdd from "../pages/member/MemberAdd";
import MemberEdit from "../pages/member/MemberEdit";
import MemberDetail from "../pages/member/MemberDetail";
import HistoryBoilAlcohol from "../pages/member/HistoryBoilAlcohol";
import HistoryBoilAlcoholDetail from "../pages/member/HistoryBoilAlcoholDetail";

// Store
import Store from "../pages/store/Store";

// Sell Product
import SellProduct from "../pages/sell-product/SellProduct";

//Category
import CategoryList from "../pages/category/CategoryList";
//Product
import ProductList from "../pages/product/ProductList";
import ProductAdd from "../pages/product/ProductAdd";
import ProductEdit from "../pages/product/ProductEdit";
import ProductDetail from "../pages/product/ProductDetail";

// =====> expenditure ===>
import Expenditure from "../pages/expenditure/ExpenditureList";
import ExpenditureAdd from "../pages/expenditure/ExpenditureAdd";
import ExpenditureDetail from "../pages/expenditure/ExpenditureDetail";
import Income from "../pages/expenditure/Income";

// service
import CategoryService from "../pages/service/CategoryService";
import ServiceList from "../pages/service/ServiceList";

import Sell from "../pages/sell/Sell";
import OpenBill from "../pages/sell/OpenBill";
import HistoryBill from "../pages/sell/HistoryBill";

import Entry from "../pages/entry-exit/entry";
import Exit from "../pages/entry-exit/exit";
import ExpenditureCategoryList from "../pages/expenditure/ExpenditureCategoryList";
import EntryExitHome from "../pages/entry-exit/home";
import EntryExitList from "../pages/entry-exit/entryExitList";
import PromotionList from "../pages/promotion/promotionList";
import PromotionAdd from "../pages/promotion/promotionAdd";
import PromotionDetail from "../pages/promotion/promotionDetail";
import PromotionEdit from "../pages/promotion/promotionEdit";

import DutyList from "../pages/duty/DutyList";
import LeavePage from "../pages/entry-exit/leave";
import AbsentList from "../pages/entry-exit/absentList";
import SellCourse from "../pages/sell/SellCourse";
import IncomeDetail from "../pages/expenditure/IncomeDetail";

import AgentDetail from "../pages/agent/AgentDetail";
import AgentList from "../pages/agent/AgentList";
import AddAgent from "../pages/agent/AddAgent";

const Main = styled.main`
  /* position: relative; */
  overflow: hidden;
  transition: all 0.15s;
  background-color: #e5e5e5;
  margin-left: ${(props) => (props.expanded ? 160 : 5)}px;
`;

function Routes() {
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");
  const [expanded, setExpanded] = useState(false);
  const _onToggle = (exp) => {
    setExpanded(exp);
  };

  return (
    <Router>
      <Switch>
        {/* <Navbar /> */}

        <Main expanded={expanded}>
          <NavBarPublic />

          <div
            style={{
              marginTop: 60,
              // marginLeft: 60,
              backgroundColor: "#E5E5E5",
              minHeight: "100vh",
            }}
          >
            <PublicRoute exact path="/" component={AgentList} />
            <PrivateRoute path={Routers.AGENT_DETAIL + "/:id"} exact component={(props) => <AgentDetail />} />
            <PrivateRoute path={"/add-agent"} exact component={(props) => <AddAgent />} />
          </div>
        </Main>
        <Route
          render={({ location, history }) => (
            <React.Fragment>
              <Navbar />
              {!isMobileOrTablet ? <CustomSideNav location={location} history={history} onToggle={(exp) => _onToggle(exp)} /> : null}
              <Main expanded={expanded}>
                <div
                  style={{
                    marginTop: 60,
                    marginLeft: 60,
                    backgroundColor: "#E5E5E5",
                    minHeight: "100vh",
                  }}
                >
                  <PrivateRoute exact path={Routers.ENTRY_EXIT_HOME} component={(props) => <EntryExitHome />} />
                  <PrivateRoute exact path={Routers.ENTRY} component={(props) => <Entry />} />
                  <PrivateRoute exact path={Routers.EXIT} component={(props) => <Exit />} />
                  <PrivateRoute exact path={Routers.LEAVE} component={(props) => <LeavePage />} />
                  <PrivateRoute exact path={Routers.ENTRY_EXIT_LIST + "/limit/:limit/skip/:skip"} component={(props) => <EntryExitList />} />
                  <PrivateRoute exact path={Routers.ABSENT_LIST + "/limit/:limit/skip/:skip"} component={(props) => <AbsentList />} />
                  <PrivateRoute path={Routers.DASHBOARD_PAGE} exact component={(props) => <DashboardPage />} />
                  {/* RECEIVE */}
                  <PrivateRoute path={Routers.RECEIVE_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <ReceiveList />} />

                  {/* EXPORT */}
                  <PrivateRoute path={Routers.EXPORT_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <ExportList />} />
                  <PrivateRoute path={Routers.EXPORT_ADD} exact component={(props) => <ExportAdd />} />

                  {/* AGENT */}
                  <PrivateRoute path={Routers.AGENT_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <AgentList />} />
                  <PrivateRoute path={Routers.AGENT_DETAIL + "/:id"} exact component={(props) => <AgentDetail />} />
                  <PrivateRoute path={"/add-agent"} exact component={(props) => <AddAgent />} />

                  {/* USER */}
                  <PrivateRoute path={Routers.USER_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <UserList />} />
                  <PrivateRoute path={Routers.CUSTOMER_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <CustomerList />} />
                  <PrivateRoute path={Routers.USER_ADD} exact component={(props) => <UserAdd />} />
                  <PrivateRoute path={Routers.USER_EDIT + "/:id"} exact component={(props) => <UserEdit />} />
                  <PrivateRoute path={Routers.USER_DETAIL + "/:id/limit/:limit/skip/:skip"} exact component={(props) => <UserDetail />} />
                  <PrivateRoute path={Routers.CUSTOMER_DETAIL + "/:id"} exact component={(props) => <CustomerDetail />} />

                  {/* STORE */}
                  <PrivateRoute path={Routers.STORE} exact component={(props) => <Store />} />

                  {/* SELL PRODUCT */}
                  <PrivateRoute path={Routers.SELL_PRODUCT_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <SellProduct />} />

                  {/* MEMBER */}
                  <PrivateRoute path={Routers.MEMBER_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <MemberList />} />
                  <PrivateRoute path={Routers.MEMBER_ADD} exact component={(props) => <MemberAdd />} />
                  <PrivateRoute path={Routers.MEMBER_EDIT + "/:id"} exact component={(props) => <MemberEdit />} />
                  <PrivateRoute path={Routers.MEMBER_DETAIL + "/:id"} exact component={(props) => <MemberDetail />} />
                  <PrivateRoute path={Routers.HISTORY_BOIL_ALCOHOL} exact component={(props) => <HistoryBoilAlcohol />} />
                  <PrivateRoute path={Routers.HISTORY_BOIL_ALCOHOL_DETAIL + `/:id`} exact component={(props) => <HistoryBoilAlcoholDetail />} />

                  {/* CATEGORY */}
                  <PrivateRoute path={Routers.CATEGORY} exact component={(props) => <CategoryList />} />

                  {/* PRODUCT */}
                  <PrivateRoute path={Routers.PRODUCT_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <ProductList />} />
                  <PrivateRoute path={Routers.PRODUCT_ADD} exact component={(props) => <ProductAdd />} />
                  <PrivateRoute path={Routers.PRODUCT_EDIT + "/:id"} exact component={(props) => <ProductEdit />} />
                  <PrivateRoute path={Routers.PRODUCT_DETAIL + "/:id"} exact component={(props) => <ProductDetail />} />

                  {/* Service */}
                  <PrivateRoute path={Routers.CATEGORY_SERVICE} exact component={(props) => <CategoryService />} />
                  <PrivateRoute path={Routers.SERVICE_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <ServiceList />} />

                  <PrivateRoute path={Routers.OPEN_BILL + Routers.SELL_PAGE + "/:id"} exact component={(props) => <Sell />} />

                  <PrivateRoute path={Routers.OPEN_BILL} exact component={(props) => <OpenBill />} />

                  <PrivateRoute path={Routers.SELL_COURSE + "/:id"} exact component={(props) => <SellCourse />} />

                  <PrivateRoute path={Routers.HISTORY_BILL + "/limit/:limit/skip/:skip"} exact component={(props) => <HistoryBill />} />
                  {/* =====> Expenditure <===== */}
                  <PrivateRoute path={Routers.INCOME_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <Income />} />
                  <PrivateRoute path={Routers.INCOME_DETAIL + "/:id"} exact component={(props) => <IncomeDetail />} />
                  <PrivateRoute path={Routers.EXPENDITURE_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <Expenditure />} />
                  <PrivateRoute path={Routers.EXPENDITURE_ADD} exact component={(props) => <ExpenditureAdd />} />
                  <PrivateRoute path={Routers.EXPENDITURE_DETAIL + "/:id"} exact component={(props) => <ExpenditureDetail />} />
                  <PrivateRoute
                    path={Routers.EXPENDITURE_CATEGORY + "/limit/:limit/skip/:skip"}
                    exact
                    component={(props) => <ExpenditureCategoryList />}
                  />

                  <PrivateRoute path={Routers.PROMOTION_LIST + "/limit/:limit/skip/:skip"} exact component={(props) => <PromotionList />} />
                  <PrivateRoute path={Routers.PROMOTION_ADD} exact component={(props) => <PromotionAdd />} />
                  <PrivateRoute path={Routers.PROMOTION_DETAIL + "/:id"} exact component={(props) => <PromotionDetail />} />
                  <PrivateRoute path={Routers.PROMOTION_EDIT + "/:id"} exact component={(props) => <PromotionEdit />} />
                  <PrivateRoute path={Routers.DUTY} exact component={(props) => <DutyList />} />
                </div>
              </Main>
            </React.Fragment>
          )}
        />
      </Switch>
    </Router>
  );
}

export default Routes;

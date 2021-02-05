import React from "react";
import "react-pro-sidebar/dist/css/styles.css";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import { Route } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileInvoice } from "@fortawesome/free-solid-svg-icons";

export default class PageSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Route
        render={({ location, history }) => (
          <React.Fragment>
            <SideNav
              onSelect={(selected) => {
                const to = "/" + selected;
                if (location.pathname !== to) {
                  history.push(to);
                }
              }}
            >
              <SideNav.Toggle />
              <SideNav.Nav defaultSelected="create_invoice">
                <NavItem
                  eventKey="create_invoice"
                  style={{ fontSize: "1.75em" }}
                >
                  <NavIcon>
                    <FontAwesomeIcon icon={faPlus} />
                  </NavIcon>
                  <NavText>Wprowadź fakturę</NavText>
                </NavItem>
                <NavItem eventKey="invoices" style={{ fontSize: "1.75em" }}>
                  <NavIcon>
                    <FontAwesomeIcon icon={faFileInvoice} />
                  </NavIcon>
                  <NavText>Faktury</NavText>
                </NavItem>
              </SideNav.Nav>
            </SideNav>
          </React.Fragment>
        )}
      />
    );
  }
}

import {
  default as React,
  Component,
  PropTypes,
  Children,
} from "react";

import {
  Link,
} from "react-router";

import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from "react-bootstrap";

import {
  LinkContainer,
} from "react-router-bootstrap";

import {
  ToastContainer,
  ToastMessage,
} from "react-toastr";

export default class Application extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  handleToast = this.handleToast.bind(this);

  handleToast(title, message) {
    this.refs.toast.success(title, message);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="full-height">
        {false &&
        <Navbar fluid>
          <Nav>
            <NavDropdown id="examples-dropdown" title="Examples">
              <LinkContainer to="/basics/simple-map"><MenuItem>Simple map</MenuItem></LinkContainer>
              <MenuItem divider />
              <LinkContainer to="/places/search-box"><MenuItem>Adding a places search box</MenuItem></LinkContainer>
            </NavDropdown>
          </Nav>
        </Navbar>
       }

        <div className="container-fluid full-height">
          <div className="row full-height">
            <div style={{ height: `100%` }}>
              {React.cloneElement(Children.only(this.props.children), {
                toast: this.handleToast,
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

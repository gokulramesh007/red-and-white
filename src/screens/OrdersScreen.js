import React from "react";
import {
  Header,
  Container,
  FeaturesList,
  Button,
  OrderList,
  Loader
} from "../components";
import { Strings } from "../constants";
import { features } from "../Services";
import "./OrdersScreen.scss";

export default class OrdersScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      data: [],
      cartItems: []
    };
  }

  /**** LIFECYCLE METHODS START ****/

  componentDidMount = () => {
    let params =
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.cartItems,
      cartItems = [];
    if (params) {
      cartItems = JSON.parse(params);
    }
    this.setState({
      cartItems: cartItems
    });
    this._fetchFeatures();
  };

  /**** LIFECYCLE METHODS END ****/

  /**** SERVICE CALLS START ****/

  _fetchFeatures = () => {
    features
      .fetchFeatures()
      .then(response => {
        this.setState({
          isLoading: false
        });
        if (response && response.status === 200) {
          this.setState({
            data: response.data
          });
        } else {
          console.log(response.statusText);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  /**** SERVICE CALLS END ****/

  /**** HELPER FUNCTIONS START ****/

  _renderContent = () => {
    let content = [];
    content.push(
      <div className="orders-container" key={0}>
        <div className="order-info-wrapper">
          <Container size="large">
            {this._renderOrderDetails()}
          </Container>
        </div>
        <FeaturesList data={this.state.data} />
        <Button
          size="small"
          text={Strings.APPLICATION.ORDERS_SCREEN.BUTTON.CONTINUE_SHOPPING}
          onClick={() => {
            this.props.history.push(Strings.APPLICATION.ROUTES.HOME_SCREEN);
          }}
        />
      </div>
    );
    return content;
  };

  _renderOrderDetails = () => {
    return this.state.cartItems.length > 0
      ? <div className="order-info">
          <div className="details">
            <h1>Order Placed</h1>
            <p>Your Order has been successfully placed.</p>
            <div>
              You can track your orders online through the Invoice Number.
            </div>
            <div>Thank you for shopping with us.</div>
          </div>
          <OrderList data={this.state.cartItems} type="row" disabled={true} />
        </div>
      : <div className="order-info">
          <div className="details">
            <h3>Kindly purchase some items to check out!</h3>
          </div>
        </div>;
  };

  /**** HELPER FUNCTIONS END ****/

  render() {
    const { isLoading } = this.state;
    return (
      <div>
        <Header />
        <Container size="large" padding="padding-large">
          {this._renderContent()}
        </Container>
        {isLoading ? <Loader /> : null}
      </div>
    );
  }
}

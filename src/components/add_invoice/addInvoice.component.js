import React from "react";
import "./addInvoice.styles.css";
import AddInvoiceForms from "./invoice_form/invoiceForm.component";
import ProductTable from "./product_list/productLists.component";
import ContextStore from "../../ContextStore";

export default class AddInvoice extends React.Component {
  static contextType = ContextStore;
  constructor(props) {
    super(props);
    this.state = {
      invoiceStatus: false,
      invoiceDescription: "",
      invoiceContractor: {},
      invoiceIssuer: {},
      invoicePaymentMethod: {},
    };
    this.handleStatusValue = this.handleStatusValue.bind(this);
    this.handleDescriptionValue = this.handleDescriptionValue.bind(this);
    this.handleIssuerValue = this.handleIssuerValue.bind(this);
    this.handleContractorValue = this.handleContractorValue.bind(this);
    this.handlePaymentMethodValue = this.handlePaymentMethodValue.bind(this);
  }

  handleStatusValue(val) {
    this.setState({ invoiceStatus: val });
  }
  handleDescriptionValue(val) {
    this.setState({ invoiceDescription: val });
  }
  handleIssuerValue(val) {
    this.setState({ invoiceIssuer: val });
  }
  handleContractorValue(val) {
    this.setState({ invoiceContractor: val });
  }
  handlePaymentMethodValue(val) {
    this.setState({ invoicePaymentMethod: val });
  }

  render() {
    const invoiceProductList = this.context.invoiceProducts.map((product) => ({
      id: product.id,
      name: product.name,
      base_price: product.base_price,
      vat_rate: product.vat_rate,
      gross_price: product.gross_price,
      quantity: product.quantity,
    }));
    
      return (
        <div className="add_invoice_container d-flex flex-column">
          <AddInvoiceForms
            handleStatusValue={this.handleStatusValue}
            handleDescriptionValue={this.handleDescriptionValue}
            handleIssuerValue={this.handleIssuerValue}
            handleContractorValue={this.handleContractorValue}
            handlePaymentMethodValue={this.handlePaymentMethodValue}
          />
          <ProductTable products={invoiceProductList} />
        </div>
      );
    
  }
}

import React from "react";
import { Form, Col, Button } from "react-bootstrap";
import Select from "react-select";
import ContextStore from "../../../ContextStore";
import Services from "../../../services/Serivces";

export default class AddInvoiceForms extends React.Component {
  static contextType = ContextStore;
  constructor(props) {
    super(props);
    this.state = {
      productToAdd: "",
      qntToAdd: "",
      products: [],
      invoiceStatus: false,
      invoiceDescription: "",
      invoiceIssuer: null,
      invoiceContractor: null,
      invoicePayment: null,
    };
  }
  onProductSubmit = () => {
    const { productToAdd, qntToAdd } = this.state;
    if (qntToAdd === null && productToAdd === "")
      alert("Proszę wybrać produkt i określić ilość");
    else if (productToAdd === "") alert("Proszę wybrać produkt");
    else if (qntToAdd === "") alert("Proszę określić ilość");
    else if (qntToAdd <= 0) alert("Ilość musi być większa od zera");
    else this.context.addProduct(productToAdd, qntToAdd);
  };
  handleProductChange = (selectedOption) => {
    this.setState({ productToAdd: selectedOption });
  };
  handleContractorChange = (selectedOption) => {
    this.setState({ invoiceContractor: selectedOption });
    this.context.clearProducts();
  };
  handleIssuerChange = (selectedOption) => {
    this.setState({ invoiceIssuer: selectedOption });
  };
  handleStatusChange = (selectedOption) => {
    this.setState({ invoiceStatus: selectedOption });
  };
  handlePaymentChange = (selectedOption) => {
    this.setState({ invoicePayment: selectedOption });
  };
  handleQuantityProductChange = (e) => {
    var value = parseInt(e.target.value);
    var number = value || "";
    this.setState({ qntToAdd: number });
  };
  onInvoiceSubmit = () => {
    const {
      invoiceStatus,
      invoiceDescription,
      invoiceIssuer,
      invoiceContractor,
      invoicePayment,
    } = this.state;
    if (invoiceIssuer && invoiceContractor && invoicePayment) {
      var dataToSend = {
        ContractorId: invoiceContractor.value,
        IssuerId: invoiceIssuer.value,
        PaymentStatus: invoiceStatus,
        Description: invoiceDescription,
        PaymentMethodId: invoicePayment.value,
      };
      this.context.addInvoice(dataToSend);
    } else {
      alert("Brak uzupełnionych pól danych");
    }
  };

  productsSelectOption = (arr) => {
    if (this.state.invoiceContractor !== null) {
      const selectOptions = arr.map((val) => ({
        value: val.ID,
        label: val.Nazwa,
      }));
      return selectOptions;
    }
  };

  contractorsSelectOption = (arr) => {
    const selectOptions = arr.map((val) => ({
      value: val._id,
      label: val.nazwa_kontrachenta,
      nip: val.nip,
      adres: val.adres,
    }));
    return selectOptions;
  };
  issuersSelectOption = (arr) => {
    const selectOptions = arr.map((val) => ({
      value: val.issuerId,
      label: val.email.substring(0, val.email.lastIndexOf("@")),
      nip: val.nip,
      adres: val.adress,
    }));
    return selectOptions;
  };

  payentMethodSelectOption = (arr) => {
    const selectOptions = arr.map((val) => ({
      value: val.paymentMethodId,
      label: val.paymentMethodName,
    }));
    return selectOptions;
  };
  render() {
    const { qntToAdd, invoiceContractor, invoiceIssuer } = this.state;
    return (
      <div className="invoice_forms d-flex justify-content-space-between mb-4">
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
              <Form.Label>Sprzedawca</Form.Label>
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: ".25rem",
                })}
                onChange={this.handleIssuerChange}
                options={this.issuersSelectOption(this.context.issuers)}
              />
              {invoiceIssuer && (
                <div className="d-flex flex-column mt-2">
                  <span>NIP: {invoiceIssuer.nip}</span>
                  <span>Adres: {invoiceIssuer.adres}</span>
                </div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
              <Form.Label>Nabywca</Form.Label>
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: ".25rem",
                })}
                onChange={this.handleContractorChange}
                options={this.contractorsSelectOption(this.context.contractors)}
              />
              {invoiceContractor && (
                <div className="d-flex flex-column mt-2">
                  <span>NIP: {invoiceContractor.nip}</span>
                  <span>Adres: {invoiceContractor.adres}</span>
                </div>
              )}
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridAddress2">
              <Form.Label>Opis zdarzenia gosp.</Form.Label>
              <Form.Control
                onChange={(e) =>
                  this.setState({ invoiceDescription: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group as={Col} controlId="exampleForm.ControlSelect1">
              <Form.Label>Metoda płatności</Form.Label>
              <Select
                theme={(theme) => ({
                  ...theme,
                  borderRadius: ".25rem",
                })}
                onChange={this.handlePaymentChange}
                options={this.payentMethodSelectOption(
                  this.context.paymentMethod
                )}
              />
              <div className="ml-2 mt-2">
                <Form.Check
                  type={"checkbox"}
                  label={`Status płatności`}
                  onChange={(e) =>
                    this.setState({ invoiceStatus: e.currentTarget.checked })
                  }
                />
              </div>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Label>Wybierz produkt lub usługę</Form.Label>
          </Form.Row>
          <Form.Row className="align-items-baseline">
            <Select
              theme={(theme) => ({
                ...theme,
                borderRadius: ".25rem",
              })}
              onChange={this.handleProductChange}
              onMenuOpen={() => {
                if (invoiceContractor === null) {
                  alert("Proszę wybrać pierw kontrahenta");
                }
              }}
              options={this.productsSelectOption(this.context.products)}
            />
            <Form.Group controlId="formGridAddress2">
              <Form.Control
                className="ml-3"
                placeholder="Ilość"
                value={qntToAdd}
                onChange={this.handleQuantityProductChange}
              />
            </Form.Group>
            <Button
              onClick={this.onProductSubmit}
              className="ml-5"
              variant="primary"
            >
              Dodaj produkt
            </Button>
          </Form.Row>
          <Form.Row className="d-flex justify-content-center">
            <Button variant="primary" onClick={this.onInvoiceSubmit}>
              Utwórz fakturę
            </Button>
          </Form.Row>
        </Form>
      </div>
    );
  }
}

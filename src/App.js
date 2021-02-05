import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import PageSidebar from "./components/sidebar/sidebar.component";
import AddInvoice from "./components/add_invoice/addInvoice.component";
import Invoices from "./components/invoices/invoices.component";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ContextStore from "./ContextStore";
import Services from "./services/Serivces";
import Products from "./data/Products.json";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectProductOptions: [],
      products: [],
      issuers: [],
      contractors: [],
      companies: [],
      invoiceProducts: [],
      isLoaded: false,
      currentInvoiceNetworth: null,
      invoices: [],
      invoices2: [],
      paymentMethod: [],
      error: "",
    };
  }

  // getProducts = () => {
  //   const proxyurl = "https://cors-anywhere.herokuapp.com/";
  //   const url = "https://invoicingmodulepipdproject.azurewebsites.net/api/Pas";
  //   fetch(url, {
  //     credentials: "include",
  //     mode: "no-cors",
  //   })
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         this.setState({
  //           isLoaded: true,
  //           products: result,
  //         });
  //       },
  //       (error) => {
  //         this.setState({
  //           isLoaded: true,
  //           error,
  //         });
  //       }
  //     );
  // };

  componentDidMount() {
    Services.getInvoices().then((data) => {
      this.setState({
        invoices: data,
        isLoaded: true,
      });
    });
    Services.getContractors().then((data) => {
      this.setState({
        contractors: data.kontrahenci,
        isLoaded: true,
      });
    });
    Services.getPaymentMethods().then((data) => {
      this.setState({
        paymentMethod: data,
        isLoaded: true,
      });
    });
    Services.getIssuers().then((data) => {
      this.setState({
        issuers: data,
        isLoaded: true,
      });
    });
    this.setState({
      products: Products,
    });
  }

  addProduct = (product, qnt) => {
    if (this.state.products.length !== 0) {
      let singleProduct = this.state.products.find(
        (element) => element.ID === product.value
      );
      let products = this.state.invoiceProducts;
      let currentProduct = products.find(
        (exist) => exist.id === Number(product.value)
      );
      if (currentProduct) {
        currentProduct.quantity += +qnt;
      } else {
        let productToAdd = {
          id: Number(singleProduct.ID),
          name: singleProduct.Nazwa,
          base_price: Number(singleProduct.Cena_netto),
          vat_rate: Number(singleProduct.Procent_vat),
          gross_price: singleProduct.Cena_brutto,
          quantity: qnt,
        };
        products.push(productToAdd);
      }
      this.setState({ invoiceProducts: products });
      this.cashToPay(products);
    }
  };

  clearProducts = () => {
    this.setState({ invoiceProducts: [] });
  };

  cashToPay = (items) => {
    let products = [...items];
    var total = 0;
    for (var i = 0; i < products.length; i++) {
      total += products[i].quantity * products[i].gross_price;
    }
    if (total > 0) this.setState({ currentInvoiceNetworth: total });
  };

  addInvoice = (invoiceData) => {
    let currentInvoiceProducts = this.state.invoiceProducts;

    var today = new Date(),
      date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

    if (currentInvoiceProducts.length > 0) {
      let invoiceToAdd = {
        ContractorId: invoiceData.ContractorId,
        IssuerId: invoiceData.IssuerId,
        invoiceNumber: Math.floor(Math.random() * 100000 + 1),
        CreationDate: date,
        PaymentDate: date,
        PaymentStatus: invoiceData.PaymentStatus,
        Description: invoiceData.Description,
        PaymentMethodId: invoiceData.PaymentMethodId,
      };

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoiceToAdd),
      };
      fetch(
        "https://invoicingmodulepipdproject.azurewebsites.net/api/Invoices/",
        requestOptions
      )
        .then(alert("Pomyslnie dodano fakture"))
        .then(
          Services.getInvoices().then((data) => {
            const newArray = data.map((item) => item.invoiceId);
            const lastInvoice = Math.max.apply(Math, newArray);
            console.log(lastInvoice);
            this.state.invoiceProducts.map((product) => {
              console.log(product);
              var productToAdd = {
                InvoiceId: lastInvoice,
                ProductOrServiceId: product.id,
                Amount: product.quantity,
              };
              Services.postProduct(productToAdd, lastInvoice);
              let filteredArray = this.state.invoiceProducts.filter(
                (item) => item.id !== product.id
              );
              this.setState({ invoiceProducts: filteredArray });
            });
          })
        )
    } else {
      alert("Pusta lista produktów");
    }
  };

  removeProduct = (id) => {
    let products = this.state.invoiceProducts.filter(
      (product) => product.id !== id
    );
    this.setState({ invoiceProducts: products });
  };

  removeInvoice = (id) => {
    Services.deleteInvoice(id)
      .then(alert("Pomyslnie usunieto fakture"))
      .then(
        Services.getInvoices().then((data) => {
          window.location.reload(false);
          this.setState({
            invoices: data,
            isLoaded: true,
          });
        })
      );
  };

  componentDidUpdate(prevProps, prevState) {
    const { invoices } = this.state;
    if (prevState.invoices !== invoices) {
      if (invoices.length > 0) {
        invoices.map((invoice, key) => {
          const url = `https://invoicingmodulepipdproject.azurewebsites.net/api/Invoices/${invoice.invoiceId}?includeItems=true`;
          fetch(url)
            .then((res) => res.json())
            .then((result) => {
              var tmp = result;
              var total = 0;

              tmp.invoiceItems.map((item, key) => {
                let tmpProduct = this.state.products.find(
                  (element) => parseInt(element.ID) === item.productOrServiceId
                );
                total += item.amount * tmpProduct.Cena_brutto;
              });

              var invoiceToAdd = {
                invoiceId: tmp.invoiceId,
                invoiceNumber: tmp.invoiceNumber,
                contractorName: tmp.contractor.nazwa_kontrachenta,
                paymentStatus: tmp.paymentStatus,
                paymentDate: tmp.paymentDate.substring(
                  0,
                  tmp.paymentDate.lastIndexOf("T")
                ),
                invoiceGrossPrice: total,
              };
              this.setState({
                isLoaded: true,
                invoices2: [...this.state.invoices2, invoiceToAdd],
              });
            });
        });
      }
    }
  }

  render() {
    const { invoices } = this.state;
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Błąd: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Ładowanie...</div>;
    } else {
      return (
        <Router>
          <ContextStore.Provider
            value={{
              products: this.state.products,
              issuers: this.state.issuers,
              contractors: this.state.contractors,
              companies: this.state.companies,
              invoices: this.state.invoices,
              invoices2: this.state.invoices2,
              addProduct: this.addProduct,
              invoiceProducts: this.state.invoiceProducts,
              removeProduct: this.removeProduct,
              removeInvoice: this.removeInvoice,
              paymentMethod: this.state.paymentMethod,
              currentInvoiceNetworth: this.state.currentInvoiceNetworth,
              addInvoice: this.addInvoice,
              clearProducts: this.clearProducts,
            }}
          >
            <div className="App">
              <PageSidebar />
              <Switch>
                <Route path="/create_invoice" exact component={AddInvoice} />
                <Route
                  path="/invoices"
                  render={() => <Invoices invoices={invoices} />}
                />
              </Switch>
            </div>
          </ContextStore.Provider>
        </Router>
      );
    }
  }
}

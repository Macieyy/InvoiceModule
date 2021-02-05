export default {
  getInvoices: () => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://invoicingmodulepipdproject.azurewebsites.net/api/Invoices/";
    return fetch( url).then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else return { message: { msgBody: " Unauthorized" }, msgError: true };
    });
},
postInvoice: (invoice) => {
  const url = "https://invoicingmodulepipdproject.azurewebsites.net/api/Invoices/"
  return fetch(url,{
    method: "POST",
    body: JSON.stringify(invoice),
    headers: {
      "Content-Type": "application/json",
      "Accept": 'application/json',
    },
  })
},
deleteInvoice: (invoiceId) => {
  const url = `https://invoicingmodulepipdproject.azurewebsites.net/api/Invoices/${invoiceId}/`
  return fetch(url,{
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": 'application/json',
    },
  })
},
postProduct: (product, invoiceId) => {
  const url = `https://invoicingmodulepipdproject.azurewebsites.net/api/Invoices/${invoiceId}/InvoiceItems/`
  return fetch(url,{
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
      "Accept": 'application/json',
    },
  })
},
  getPaymentMethods: () => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url =
      "https://invoicingmodulepipdproject.azurewebsites.net/api/PaymentMethods";
    return fetch( url).then((response) => {
      if (response.status !== 401) {
        return response.json().then((data) => data);
      } else return { message: { msgBody: " Unauthorized" }, msgError: true };
    });
},
getIssuers: () => {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://invoicingmodulepipdproject.azurewebsites.net/api/Issuers";
   return fetch( url).then((response) => {
    if (response.status !== 401) {
      return response.json().then((data) => data);
    } else return { message: { msgBody: " Unauthorized" }, msgError: true };
  });
},
getContractors: () => {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    "https://invoicingmodulepipdproject.azurewebsites.net/api/Contractors";
  return fetch( url).then((response) => {
    if (response.status !== 401) {
      return response.json().then((data) => data);
    } else return { message: { msgBody: " Unauthorized" }, msgError: true };
  });
},
getProductsByNIP: (nip) => {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url =
    `https://invoicingmodulepipdproject.azurewebsites.net/api/Pas/${nip}`;
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.status !== 401) {
      return response.json().then((data) => data);
    } else return { message: { msgBody: " Unauthorized" }, msgError: true };
  });
},
}
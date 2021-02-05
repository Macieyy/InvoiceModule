import React, { useContext } from "react";
import InvoiceList from "../invoices/invoiceList.component";
import ContextStore from "../../ContextStore";

const Invoices = (props) => {
  const contextAPI = useContext(ContextStore);



  return (
      <InvoiceList invoices={contextAPI.invoices2} />
  );
};

export default Invoices;

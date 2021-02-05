import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ContextStore from "../../ContextStore";

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const InvoiceList = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.invoices);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <ContextStore.Consumer>
      {(context) => (
        <div className="invoice-list mt-2 mb-4 ml-4">
          <table>
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    onClick={() => requestSort("invoiceNumber")}
                    className={getClassNamesFor("invoiceNumber")}
                  >
                    Numer faktury
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => requestSort("contractorName")}
                    className={getClassNamesFor("contractorName")}
                  >
                    Odbiorca
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => requestSort("paymentStatus")}
                    className={getClassNamesFor("paymentStatus")}
                  >
                    Status faktury
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => requestSort("paymentDate")}
                    className={getClassNamesFor("paymentDate")}
                  >
                    Data płatności
                  </button>
                </th>
                <th>
                  <button
                    type="button"
                    onClick={() => requestSort("invoiceGrossPrice")}
                    className={getClassNamesFor("invoiceGrossPrice")}
                  >
                    Wartość faktury brutto
                  </button>
                </th>
                <th>Usuń</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.invoiceId}>
                  <td className="text-center">{item.invoiceNumber}</td>
                  <td className="text-center">{item.contractorName}</td>
                  <td className="text-center">
                    {item.paymentStatus ? "oplacona" : "nieoplacona"}
                  </td>
                  <td className="text-center">{item.paymentDate}</td>
                  <td className="text-center">{item.invoiceGrossPrice}zł</td>
                  <td className="text-center">
                    <Button
                      variant="primary"
                      onClick={() => context.removeInvoice(item.invoiceId)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ContextStore.Consumer>
  );
};

export default InvoiceList;

import React, { useState } from "react";
import "./productList.styles.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ContextStore from "../../../ContextStore"


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


const ProductTable = (props) => {
  const { items, requestSort, sortConfig } = useSortableData(props.products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <ContextStore.Consumer>
                {
                    context =>
    <div className="product-list mt-2 mb-4">
      <table>
        <thead>
          <tr>
            <th>
              <button
                type="button"
                onClick={() => requestSort("name")}
                className={getClassNamesFor("name")}
              >
                Nazwa
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("base_price")}
                className={getClassNamesFor("base_price")}
              >
                Cena netto
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("vat_rate")}
                className={getClassNamesFor("vat_rate")}
              >
                Stawka vat
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("gross_price")}
                className={getClassNamesFor("gross_price")}
              >
                Cena brutto
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("quantity")}
                className={getClassNamesFor("quantity")}
              >
                Ilość
              </button>
            </th>
            <th>
              <button
                type="button"
                onClick={() => requestSort("sum")}
                className={getClassNamesFor("sum")}
              >
                Wartość brutto
              </button>
            </th>
            <th>Usuń</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="text-center">{item.name}</td>
              <td className="text-center">{item.base_price}zł</td>
              <td className="text-center">{item.vat_rate}%</td>
              <td className="text-center">{Number((item.base_price + (item.base_price * (item.vat_rate * 0.01))).toFixed(2))}zł</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">{Number((item.quantity * (item.base_price + (item.base_price * (item.vat_rate * 0.01)))).toFixed(2))}zł</td>
              <td className="text-center">
                <Button variant="primary" onClick={() => context.removeProduct(item.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        {context.currentInvoiceNetworth > 0 && <tfoot>
          <tr>
            <th id="total" colSpan="5" className="text-right">
              Wartość brutto faktury:
            </th>
            <td className="text-center">{items.length > 0 && <span>{Number(context.currentInvoiceNetworth).toFixed(2)}zł</span>}</td>
          </tr>
        </tfoot>}
      </table>
    </div>
    }
    </ContextStore.Consumer>
  );

};

export default ProductTable;

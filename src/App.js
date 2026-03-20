import React, { useEffect, useState } from "react";

function App() {

  const [customers, setCustomers] = useState({});
  const [itemsDB, setItemsDB] = useState({});

  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [date, setDate] = useState("");

  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [rate, setRate] = useState("");
  const [unit, setUnit] = useState("");

  const [items, setItems] = useState([]);

  // -----------------------
  // LOAD DATA FROM BACKEND
  // -----------------------
  useEffect(() => {

  fetch("https://billing-backend.onrender.com/customers")
  fetch("https://billing-backend.onrender.com/items")
  fetch("https://billing-backend.onrender.com/generate")
  
      // auto date
      const today = new Date().toISOString().split("T")[0];
      setDate(today);

  }, []);

  // -----------------------
  // AUTO FILL CUSTOMER
  // -----------------------
  const handleCustomer = (name) => {
    setCustomer(name);
    setAddress(customers[name] || "");
  };

  // -----------------------
  // AUTO FILL ITEM
  // -----------------------
  const handleItem = (val) => {
    setItem(val);
    if (itemsDB[val]) {
      setRate(itemsDB[val][0]);
      setUnit(itemsDB[val][1]);
    }
  };

  // -----------------------
  // ADD ITEM
  // -----------------------
  const addItem = () => {
    const newItem = {
      item,
      qty: Number(qty),
      rate: Number(rate),
      unit
    };
    setItems([...items, newItem]);
    setItem(""); setQty(""); setRate(""); setUnit("");
  };

  const deleteItem = (i) => {
    setItems(items.filter((_, x) => x !== i));
  };

  const total = items.reduce((s, i) => s + i.qty * i.rate, 0);

  // -----------------------
  // PDF
  // -----------------------
  const generatePDF = async () => {

    const res = await fetch("https://billing-backend.onrender.com/generate", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        items,
        customer,
        address,
        invoice_no: invoiceNo,
        date
      })
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoice.pdf";
    a.click();
  };

  return (
    <div style={{padding:20}}>

      <h2>Billing Software</h2>

      {/* INVOICE */}
      <input placeholder="Invoice No" value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} />
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} />

      <br/><br/>

      {/* CUSTOMER */}
      <select onChange={e=>handleCustomer(e.target.value)}>
        <option>Select Customer</option>
        {Object.keys(customers).map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />

      <br/><br/>

      {/* ITEM */}
      <select onChange={e=>handleItem(e.target.value)}>
        <option>Select Item</option>
        {Object.keys(itemsDB).map(i => (
          <option key={i}>{i}</option>
        ))}
      </select>

      <input placeholder="Qty" value={qty} onChange={e=>setQty(e.target.value)} />
      <input placeholder="Unit" value={unit} onChange={e=>setUnit(e.target.value)} />
      <input placeholder="Rate" value={rate} onChange={e=>setRate(e.target.value)} />

      <button onClick={addItem}>Add</button>

      {/* TABLE */}
      <table border="1" width="100%" style={{marginTop:20}}>
        <thead>
          <tr>
            <th>SR</th><th>Item</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r,i)=>(
            <tr key={i}>
              <td>{i+1}</td>
              <td>{r.item}</td>
              <td>{r.qty}</td>
              <td>{r.unit}</td>
              <td>{r.rate}</td>
              <td>{r.qty*r.rate}</td>
              <td><button onClick={()=>deleteItem(i)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Total: ₹ {total}</h2>

      <button onClick={generatePDF}>Generate PDF</button>

    </div>
  );
}

export default App;

import React from "react";

const Invoice = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-sm my-6" id="invoice">
      <div className="grid grid-cols-2 items-end">
        <div className="flex items-end">
          <img
            src={Logo}
            alt="company-logo"
            height="50"
            width="50"
          /><h2 className="text-3xl font-bold">UrbanAura</h2>
        </div>

        <div className="text-right">
          
          <p className="text-gray-500 text-sm">info@urbanaura.com</p>
          <p className="text-gray-500 text-sm mt-1">+91-9879879870</p>
          
        </div>
      </div>

      <div className="grid grid-cols-2 items-center mt-8">
        <div>
          <p className="font-bold text-gray-800">Bill to :</p>
          <p className="text-gray-500">
          {selectedOrder.shipping_detail.firstName}{" "}
                {selectedOrder.shipping_detail.lastName}
            <br />
            {selectedOrder.shipping_detail.address},{" "}
                {selectedOrder.shipping_detail.city},{" "}
                {selectedOrder.shipping_detail.state},{" "}
                {selectedOrder.shipping_detail.postal_code},{" "}
                {selectedOrder.shipping_detail.countryName}
          </p>
          {/* <p className="text-gray-500">info@laravel.com</p> */}
        </div>

        <div className="text-right">
          {/* <p>
            Invoice number: <span className="text-gray-500">INV-2023786123</span>
          </p> */}
          <p>
            Invoice date: <span className="text-gray-500">{selectedOrder.created_at}</span>
      
            
          </p>
        </div>
      </div>

      <div className="-mx-4 mt-8 flow-root sm:mx-0">
        <table className="min-w-full">
          <thead className="border-b border-gray-300 text-gray-900">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Items</th>
              <th className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                Quantity
              </th>
              <th className="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell">
                Price
              </th>
              <th className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">Amount</th>
            </tr>
          </thead>
          <tbody>
          {selectedOrder.order_details?.length > 0 ? (
                selectedOrder.order_details.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
                <div className="font-medium text-gray-900"> {item.product?.brand?.name || "Unknown Brand"} {item.product?.name || "Unknown Product"}</div>
                
              </td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{item.quantity}</td>
              <td className="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{item.quantity}*{item.price}</td>
              <td className="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">{item.price}</td>
            </tr>)):<></>)}

            
          </tbody>
          <tfoot>
            <tr>
              <th className="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Subtotal
              </th>
              <td className="pl-3 pr-6 pt-6 text-right text-sm text-gray-500 sm:pr-0">$10,500.00</td>
            </tr>
            <tr>
              <th className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Tax
              </th>
              <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">$1,050.00</td>
            </tr>
            <tr>
              <th className="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0">
                Discount
              </th>
              <td className="pl-3 pr-6 pt-4 text-right text-sm text-gray-500 sm:pr-0">- 10%</td>
            </tr>
            <tr>
              <th className="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0">
                Total
              </th>
              <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">$11,550.00</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="border-t-2 pt-4 text-xs text-gray-500 text-center mt-16">
        Please pay the invoice before the due date. You can pay the invoice by logging in to your account from our client portal.
      </div>
    </div>
  );
};

export default Invoice;

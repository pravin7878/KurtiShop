// Cart.jsx
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQty, clearCart } from "../app/slices/cartSlice";

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            Your cart is empty 🛒
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.name}
                      className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-md border"
                    />
                    <div>
                      <h2 className="font-semibold text-gray-800 truncate max-w-[180px] sm:max-w-[220px]">
                        {item.name}
                      </h2>
                      <p className="text-gray-500 text-sm">₹{item.price}</p>
                      <p className="text-xs text-gray-400">
                        In Stock: {item.countInStock}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          updateQty({ _id: item._id, qty: Number(e.target.value) })
                        )
                      }
                      className="border px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="text-red-500 text-sm hover:text-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-6 bg-white rounded-lg shadow-md h-fit sticky top-20">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                <p className="flex justify-between text-sm">
                  <span>Items:</span>
                  <span>{cartItems.length}</span>
                </p>
                <p className="flex justify-between text-base font-semibold">
                  <span>Total:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </p>
              </div>
              <button className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
                Proceed to Checkout
              </button>
              <button
                onClick={() => dispatch(clearCart())}
                className="w-full mt-3 border py-3 rounded-md text-sm hover:bg-gray-100 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartById } from "../../Utils/Cart";
import { RemoveProductFromCard } from "../../Utils/Cart";
import AuthService from "./AuthServices/auth.service";

export default function ShoppingCart() {
  let total = 0;
  const id_user = AuthService.getCurrentUser().id ;

  const [cart, setCart] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const result = await getCartById(id_user);
      setCart(result);
    };
    fetchData();
  }, []);

  const onSubmit = async (e) => {
    console.log(e);
    const result = await RemoveProductFromCard(id_user, e);
    window.location.reload(false);
    //setCart( result);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <table className="table">
              <tbody>
                {cart?.products?.map((product,index) => (
                  <tr className="text-center" key={product._id}>
                    <td className="product-remove">
                      <a>
                        <span
                          className="fa fa-close"
                          onClick={() => onSubmit(product._id)}
                        ></span>
                      </a>
                    </td>
                    <td className="image-prod">
                      <img
                        className="img"
                        src={cart?.products[index].picture[0]}
                        width="150px"
                      />
                    </td>
                    <td className="product-name">
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                    </td>
                    <td className="price">
                      {product.price}DT<p hidden>{(total += product.price)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-4 order-details">
            <div className="section-title text-center">
              <h3 className="title">Your Order </h3>
            </div>
            <div className="order-summary">
              <div className="order-col">
                <div>
                  <strong>PRODUCT</strong>
                </div>
                <div>
                  <strong>TOTAL</strong>
                </div>
              </div>
              <div className="order-products">
                {cart?.products?.map((product) => (
                  <div className="order-col" key={product._id}>
                    <div>{product.name}</div>
                    <div>{product.price}</div>
                  </div>
                ))}
              </div>
              <div className="order-col">
                <div>Shiping</div>
                <div>
                  <strong></strong>
                </div>
              </div>
              <div className="order-col">
                <div>
                  <strong>TOTAL</strong>
                </div>
                <div>
                  <strong className="order-total">{total}DT</strong>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="primary-btn order-submit">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

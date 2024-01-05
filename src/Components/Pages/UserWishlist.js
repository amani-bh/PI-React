import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { removeProductFromWishlist } from '../../Utils/Product'
import { getProductsWishlist } from '../../Utils/Product'
import AuthService from './AuthServices/auth.service';

export default function UserWishlist() {
  const id_user = AuthService.getCurrentUser().id ;

  const [wishlist, setWishlist] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductsWishlist(id_user);
      setWishlist(result);
    };
    fetchData();
  }, []);

  const onSubmit = async (e) => {
    console.log(e);
    const result = await removeProductFromWishlist(id_user, e);
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
              {wishlist?.map((product,index) => (
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
                      src={product.picture[0]}
                      width="150px"
                    />
                  </td>
                  <td className="product-name">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </td>
                  <td className="price">
                    {product.price}DT
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       
      </div>
    </div>
  </div>
  )
}

import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useLocation, useParams } from "react-router-dom";
import { getProductNotSold } from "../../Utils/Product";
import { getProductById } from "../../Utils/Product";

import { deleteProduct } from "../../Utils/Product";
import Exchange from "./Exchange";
import AuthService from "./AuthServices/auth.service";

export default function ProductsToExchange(props) {
  const [products, setProducts] = useState([]);
  const [exchange, setExchange] = useState(false);
  const [productToExchange, setProductToExchange] = useState(null);
  const [myProductToExchange, setMyProductToExchange] = useState(null);

  const id_user = AuthService.getCurrentUser().id;
  const [pageNumber, setPageNumber] = useState(0);
  let { id } = useParams();

  const usersPerPage = 6;
  const pagesVisited = pageNumber * usersPerPage;
  let unsold = 0;
  let sold = 0;
  const c = products?.map((product) =>
    product.sold === true ? sold++ : unsold++
  );

  useEffect(() => {
    const getProductExchange = async () => {
      const result = await getProductById(id);
      setProductToExchange(result);
    };
    getProductExchange();

    const fetchData = async () => {
      const result = await getProductNotSold(id_user);
      console.log("list des produits", result);
      setProducts(result);
    };
    fetchData();
  }, []);
  const [selected, setSelected] = useState(0);
  const handleChange = (e) => {
    setSelected(e.target.value);
  };
  const filterProducts = products.filter(function (result) {
    if (selected == 1) return result.sold === false;
    else if (selected == 2) return result.sold === true;
    else return result;
  });

  const pageCount = Math.ceil(filterProducts?.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  const deleteP = async (e) => {
    const result = await deleteProduct(e);
    window.location.reload(false);
  };

  async function exchangeProduct(e) {
    const result = await getProductById(e);
    console.log(result);

    setMyProductToExchange(result);
    console.log(myProductToExchange);
    setExchange(true);
  }

  return (
    <div className="section">
      {exchange == false ? (
        <div className="container">
          <div className="col-md-1"></div>
          <div className="col-md-9">
            <div className="row">
              {filterProducts
                ?.slice(pagesVisited, pagesVisited + usersPerPage)
                .map((product) => (
                  <div
                    className="col-md-4 col-xs-6"
                    data-aos="fade-in"
                    key={product._id}
                  >
                    <div className="product">
                      <div className="product-img">
                        <img src={product.picture[0]} alt="" />
                        {product.sold === true ? (
                          <div className="product-label">
                            <span className="new">Sold</span>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="product-body">
                        <p className="product-category">{product.category}</p>
                        <h3 className="product-name">
                          <Link to={"/product/" + product._id}>
                            {product.name}
                          </Link>
                        </h3>
                        <h4 className="product-price">{product.price} DT</h4>
                        <div className="product-rating"></div>
                        <div className="product-btns">
                          {product.sold === false ? (
                            <button className="add-to-wishlist">
                              <Link to={"/update-product/" + product._id}>
                                <i className="fa fa-pen"></i>
                                <span className="tooltipp">Update product</span>
                              </Link>
                            </button>
                          ) : (
                            <></>
                          )}

                          <button className="quick-view">
                            <Link to={"/product/" + product._id}>
                              <i className="fa fa-eye"></i>
                              <span className="tooltipp">quick view</span>
                            </Link>
                          </button>
                        </div>
                      </div>
                      {product.sold === false ? (
                        <div className="add-to-cart">
                          <button
                            className="add-to-cart-btn"
                            onClick={() => exchangeProduct(product._id)}
                          >
                            <i className="fa fa-exchange"></i> Exchange
                          </button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="store-filter clearfix">
              <ReactPaginate
                breakLabel="..."
                previousLabel={"<"}
                nextLabel={">"}
                pageCount={pageCount}
                onPageChange={changePage}
                pageRangeDisplayed={5}
                containerClassName={"store-pagination"}
                disabledClassName={"hide"}
                activeClassName={"active"}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Exchange
            myProductToExchange={myProductToExchange}
            productToExchange={productToExchange}
          />
        </>
      )}
    </div>
  );
}

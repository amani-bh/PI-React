import React, { useContext, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthService from "../Pages/AuthServices/auth.service";

import { useEffect } from "react";
import { getProducts } from "../../Utils/Product";
import { Link } from "react-router-dom";
import { addProductToCart } from "../../Utils/Cart";
import ReactPaginate from "react-paginate";
import Slider from "react-slick";
import { SocketContext } from "../../Utils/socketContext";
import { getCartById } from "../../Utils/Cart";
import { addToWishlist } from "../../Utils/Product";
import { getProductsWishlist } from "../../Utils/Product";
export default function Shop() {
  const [products, setProducts] = useState([]);
  const id_user = AuthService.getCurrentUser().id;

  const { socket } = useContext(SocketContext);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProducts();
      setProducts(result);
    };
    fetchData();
  }, []);
  const [cart, setCart] = useState([]);
  const onSubmit = async (e, p) => {
    console.log("io works");

    socket.emit("sendCart", id_user, {
      name: p.name,
      price: p.price,
      _id: p._id,
      picture: p.picture,
    });
    const result = await addProductToCart(id_user, e);

    setCart([...cart, result]);
  };
  useEffect(() => {
    AOS.init({ duration: 1000 });
  });

  /* pagination */
  const [perPage, setPerPage] = useState(9);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = perPage;
  const pagesVisited = pageNumber * usersPerPage;

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  /* sort */
  const [selected, setSelected] = useState(0);
  const handleChange = (e) => {
    setSelected(e.target.value);
  };
  const perPageChange = (e) => {
    setPerPage(e.target.value);
  };

  const sortProducts = products.sort((a, b) => {
    if (selected == 1) return parseFloat(a.price) - parseFloat(b.price);
    else if (selected == 2) return parseFloat(b.price) - parseFloat(a.price);
    else
      return b.createdAt.localeCompare(a.createdAt, undefined, { Date: true });
  });

  const [hover, sethover] = useState(false);
  const settings = {
    dots: false,
    infinite: true,
    autoplaySpeed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true,
    autoplay: hover,
  };
  const filterProducts = sortProducts.filter(function (result) {
    return result.seller != id_user;
  });
  const pageCount = Math.ceil(filterProducts?.length / usersPerPage);
  /* Wishlist */
  const onSubmitWishlist = async (e, p) => {
    const result = await addToWishlist(id_user, e);
    window.location.reload(false);
  };
  const [whishlistProduct, setWhishlistProduct] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductsWishlist(id_user);
      setWhishlistProduct(result);
    };
    fetchData();
  }, []);
  const [userCart, setUserCart] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getCartById(id_user);
      setUserCart(result);
    };
    fetchData();
  }, []);
  /** */
  // const [cartUser,setCartUser]=useState([])
  // useEffect(()=>{
  //   const fetchData = async () => {
  //     const result = await getCartById(id_user);
  //     setCartUser(result);
  //   };
  //   fetchData();

  // },[])
  return (
    <div className="section">
      <div className="container">
        <div className="row">
          <div id="aside" className="col-md-3" data-aos="fade-left">
            <div className="aside">
              <h3 className="aside-title">Categories</h3>
              <div className="checkbox-filter">
                <div className="input-checkbox">
                  <input type="checkbox" id="category-1" />
                  <label className="category-1">
                    <span></span>
                    Laptops
                    <small>(120)</small>
                  </label>
                </div>

                <div className="input-checkbox">
                  <input type="checkbox" id="category-2" />
                  <label className="category-2">
                    <span></span>
                    Smartphones
                    <small>(740)</small>
                  </label>
                </div>

                <div className="input-checkbox">
                  <input type="checkbox" id="category-3" />
                  <label className="category-3">
                    <span></span>
                    Cameras
                    <small>(1450)</small>
                  </label>
                </div>

                <div className="input-checkbox">
                  <input type="checkbox" id="category-4" />
                  <label className="category-4">
                    <span></span>
                    Accessories
                    <small>(578)</small>
                  </label>
                </div>

                <div className="input-checkbox">
                  <input type="checkbox" id="category-5" />
                  <label className="category-5">
                    <span></span>
                    Laptops
                    <small>(120)</small>
                  </label>
                </div>

                <div className="input-checkbox">
                  <input type="checkbox" id="category-6" />
                  <label className="category-6">
                    <span></span>
                    Smartphones
                    <small>(740)</small>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div id="store" className="col-md-9">
            <div className="store-filter clearfix">
              <div className="store-sort">
                <label>
                  Sort By:
                  <select
                    className="input-select"
                    value={selected}
                    onChange={handleChange}
                  >
                    <option value="0" defaultValue="0">
                      Default
                    </option>
                    <option value="1">Price: Low to High</option>
                    <option value="2">Price: High to Low</option>
                  </select>
                </label>

                <label>
                  Show:
                  <select
                    className="input-select"
                    value={perPage}
                    onChange={perPageChange}
                  >
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="20">18</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="row">
              {filterProducts
                ?.slice(pagesVisited, pagesVisited + usersPerPage)
                .map((product) => (
                  <>
                    {product.seller != id_user && (
                      <div
                        className="col-md-4 col-xs-6 product-card"
                        data-aos="fade-in"
                        key={product._id}
                      >
                        <div className="product">
                          <div className="product-img-shop">
                            {product?.picture.length <= 1 ? (
                              <>
                                {product?.picture.map((image, index) => (
                                  <img
                                    src={image}
                                    alt=""
                                    key={index}
                                    style={{ width: "100%", height: "200px" }}
                                  />
                                ))}
                              </>
                            ) : (
                              <Slider {...settings}>
                                {product?.picture.map((image, index) => (
                                  <img
                                    src={image}
                                    alt=""
                                    key={index}
                                    onMouseEnter={() => sethover(true)}
                                    onMouseLeave={() => sethover(false)}
                                    style={{
                                      width: "100%",
                                      height: "200px !important",
                                    }}
                                  />
                                ))}
                              </Slider>
                            )}
                          </div>
                          <div className="product-body">
                            <p className="product-category">
                              {product.category}
                            </p>
                            <h3 className="product-name">
                              <Link to={"/product/" + product._id}>
                                {product.name}
                              </Link>
                            </h3>
                            <h4 className="product-price">
                              {product.price} coins
                            </h4>
                            <div className="product-rating"></div>
                            <div className="product-btns">
                              {whishlistProduct.length != 0 ? (
                                <>
                                  {whishlistProduct.some(
                                    (pr) => pr._id !== product._id
                                  ) && (
                                    <button className="add-to-wishlist">
                                      <i
                                        className="fa fa-heart-o"
                                        onClick={() =>
                                          onSubmitWishlist(product._id)
                                        }
                                      ></i>
                                      <span className="tooltipp">
                                        add to wishlist
                                      </span>
                                    </button>
                                  )}
                                </>
                              ) : (
                                <button className="add-to-wishlist">
                                  <i
                                    className="fa fa-heart-o"
                                    onClick={() =>
                                      onSubmitWishlist(product._id)
                                    }
                                  ></i>
                                  <span className="tooltipp">
                                    add to wishlist
                                  </span>
                                </button>
                              )}
                              {product?.exchange == true && (
                                <button className="add-to-compare">
                                  <Link
                                    to={"/productsToExchange/" + product._id}
                                  >
                                    <i className="fa fa-exchange"></i>
                                    <span className="tooltipp">exchange</span>
                                  </Link>
                                </button>
                              )}
                              <button className="quick-view">
                                <Link to={"/product/" + product._id}>
                                  <i className="fa fa-eye"></i>
                                  <span className="tooltipp">quick view</span>
                                </Link>
                              </button>
                            </div>
                          </div>
                          {userCart?.products?.some(
                            (pr) => pr._id == product._id
                          ) ? (
                            <></>
                          ) : (
                            <div className="add-to-cart">
                              <button
                                className="add-to-cart-btn"
                                onClick={() => onSubmit(product._id, product)}
                              >
                                <i className="fa fa-shopping-cart"></i> add to
                                cart
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
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
      </div>
    </div>
  );
}

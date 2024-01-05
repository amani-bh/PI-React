import React, { useState } from "react";
import { useEffect } from "react";
import { getProducts } from "../../Utils/Product";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { addProductToCart } from "../../Utils/Cart";
import AuthService from "./AuthServices/auth.service";

export default function Home() {
  const [products, setProducts] = useState([]);
  const id_user = AuthService.getCurrentUser().id ;
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProducts();
      setProducts(result);
    };
    fetchData();
  }, []);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    pauseOnHover: true,
  };

  const [cart, setCart] = useState([]);
  const onSubmit = async (e) => {
    const result = await addProductToCart(id_user, e).then(() =>
      window.location.reload(false)
    );
    setCart([...cart, result]);
  };
  /* slider */
  const [selected, setSelected] = useState(0);

  let newDate = new Date();
  let date = newDate.getDate();
  const filterProducts = products.filter(function (result) {
    let d = new Date(result.createdAt);
    if (selected == 0)
      return (
        d.getDate() >= date - 5 && result.category === "Computers & tablets"
      );
    else if (selected == 1)
      return d.getDate() >= date - 5 && result.category === "Cameras & Photo";
    else if (selected == 2)
      return (
        d.getDate() >= date - 5 &&
        result.category === "Computer accessories and peripherals"
      );
  });
  return (
    <>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src="./img/shop01.png" alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Laptop
                    <br />
                    Collection
                  </h3>
                  <a href="#" className="cta-btn">
                    Shop now <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src="./img/shop03.png" alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Accessories
                    <br />
                    Collection
                  </h3>
                  <a href="#" className="cta-btn">
                    Shop now <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 col-xs-6">
              <div className="shop">
                <div className="shop-img">
                  <img src="./img/shop02.png" alt="" />
                </div>
                <div className="shop-body">
                  <h3>
                    Cameras
                    <br />
                    Collection
                  </h3>
                  <a href="#" className="cta-btn">
                    Shop now <i className="fa fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-title">
                <h3 className="title">New Products</h3>
                <div className="section-nav">
                  <ul className="section-tab-nav tab-nav">
                    <li className={selected === 0 ? "active" : null}>
                      <a data-toggle="tab" onClick={() => setSelected(0)}>
                        Laptops
                      </a>
                    </li>
                    <li className={selected === 1 ? "active" : null}>
                      <a data-toggle="tab" onClick={() => setSelected(1)}>
                        Cameras
                      </a>
                    </li>
                    <li className={selected === 2 ? "active" : null}>
                      <a data-toggle="tab" onClick={() => setSelected(2)}>
                        Accessories
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-12">
              <div className="row">
                <div className="products-tabs">
                  <div id="tab1">
                    <div className="products-slick">
                      {filterProducts?.length <= 4 ? (
                        <>
                          {filterProducts?.map((product) => (
                            <div
                              className="col-md-3 col-xs-6"
                              key={product._id}
                            >
                              <div className="product">
                                <div className="product-img-shop product-img">
                                  <img src={product.picture[0]} alt="" />
                                  <div className="product-label">
                                    <span className="new">New</span>
                                  </div>
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
                                    {product.price} DT
                                  </h4>
                                  <div className="product-rating"></div>
                                  <div className="product-btns">
                                    <button className="add-to-wishlist">
                                      <i className="fa fa-heart-o"></i>
                                      <span className="tooltipp">
                                        add to wishlist
                                      </span>
                                    </button>
                                    <button className="add-to-compare">
                                      <i className="fa fa-exchange"></i>
                                      <span className="tooltipp">exchange</span>
                                    </button>
                                    <button className="quick-view">
                                      <Link to={"/product/" + product._id}>
                                        <i className="fa fa-eye"></i>
                                        <span className="tooltipp">
                                          quick view
                                        </span>
                                      </Link>
                                    </button>
                                  </div>
                                </div>
                                <div className="add-to-cart">
                                  <button
                                    className="add-to-cart-btn"
                                    onClick={() => onSubmit(product._id)}
                                  >
                                    <i className="fa fa-shopping-cart"></i> add
                                    to cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <Slider {...settings}>
                          {filterProducts?.map((product) => (
                            <div
                              className="col-md-4 col-xs-6"
                              key={product._id}
                            >
                              <div className="product">
                                <div className="product-img-shop product-img">
                                  <img src={product.picture[0]} alt="" />
                                  <div className="product-label">
                                    <span className="new">New</span>
                                  </div>
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
                                    {product.price} DT
                                  </h4>
                                  <div className="product-rating"></div>
                                  <div className="product-btns">
                                    <button className="add-to-wishlist">
                                      <i className="fa fa-heart-o"></i>
                                      <span className="tooltipp">
                                        add to wishlist
                                      </span>
                                    </button>
                                    <button className="add-to-compare">
                                      <i className="fa fa-exchange"></i>
                                      <span className="tooltipp">exchange</span>
                                    </button>
                                    <button className="quick-view">
                                      <Link to={"/product/" + product._id}>
                                        <i className="fa fa-eye"></i>
                                        <span className="tooltipp">
                                          quick view
                                        </span>
                                      </Link>
                                    </button>
                                  </div>
                                </div>
                                <div className="add-to-cart">
                                  <button
                                    className="add-to-cart-btn"
                                    onClick={() => onSubmit(product._id)}
                                  >
                                    <i className="fa fa-shopping-cart"></i> add
                                    to cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Slider>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="hot-deal" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="hot-deal">
                <ul className="hot-deal-countdown">
                  <li>
                    <div>
                      <h3>02</h3>
                      <span>Days</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>10</h3>
                      <span>Hours</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>34</h3>
                      <span>Mins</span>
                    </div>
                  </li>
                  <li>
                    <div>
                      <h3>60</h3>
                      <span>Secs</span>
                    </div>
                  </li>
                </ul>
                <h2 className="text-uppercase">hot deal this week</h2>
                <p>New Collection Up to 50% OFF</p>
                <a className="primary-btn cta-btn" href="#">
                  Shop now
                </a>
              </div>
            </div>
          </div>
          =
        </div>
      </div>
      <div id="newsletter" className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="newsletter">
                <p>
                  Sign Up for the <strong>NEWSLETTER</strong>
                </p>
                <form>
                  <input
                    className="input"
                    type="email"
                    placeholder="Enter Your Email"
                  />
                  <button className="newsletter-btn">
                    <i className="fa fa-envelope"></i> Subscribe
                  </button>
                </form>
                <ul className="newsletter-follow">
                  <li>
                    <a href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="fa fa-pinterest"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { Children, useContext, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  addToWishlist,
  getProductById,
  getProducts,
  getProductsWishlist,
  getCountProductWishlist,
  getNbrOfViews,
} from "../../Utils/Product";
import Slider from "react-slick";
import { addProductToCart, getCartById, getNbrByIdP } from "../../Utils/Cart";
import { findUserById, chatExist } from "../../Utils/Chat";
import { sendMessage } from "../../Utils/Message";
import { recentVisited } from "../../Utils/Product";
import { getRecentVisitedProductofUser, getPrice } from "../../Utils/Product";

import "./Product.css";

import { SocketContext } from "../../Utils/socketContext";
import {
  EmailIcon,
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { FacebookIcon, TwitterIcon } from "react-share";
import AuthService from "./AuthServices/auth.service";

export default function Product() {
  let { id } = useParams();
  const id_user = AuthService.getCurrentUser().id;
  const navigate = useNavigate();

  const [product, setProduct] = useState();
  const [picture, setPicture] = useState();
  const [nbr, setNbr] = useState(0);
  const [seller, setSeller] = useState(null);
  const [chatExistOrNot, setChatExistOrNot] = useState(false);
  const [message, setMessage] = useState(
    "  Hello, I am interested in this ad. Please contact me if it is still available."
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductById(id);
      const resultSeller = await findUserById(result.seller);
      setSeller(resultSeller);
      setProduct(result);
      const chat = {
        first: id_user,
        second: result.seller,
        product: result._id,
      };
      const resultChatExist = await chatExist(chat);

      setChatExistOrNot(resultChatExist);

      setPicture(result.picture[0]);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getNbrByIdP(id);
      setNbr(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 2000 });
  });
  /* product pictures */
  const changeImage = (image) => {
    setPicture(image);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    pauseOnHover: true,
    vertical: true,
  };
  const settingsPro = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
  };
  /* related product */
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProducts();
      setProducts(result);
    };
    fetchData();
  }, []);
  const filterProducts = products.filter(function (result) {
    return (
      result.category === product?.category &&
      result._id != id &&
      result?.seller != id_user
    );
  });

  const [cart, setCart] = useState([]);
  const { socket } = useContext(SocketContext);
  const onSubmit = async (e, p) => {
    socket.emit("sendCart", id_user, {
      name: p.name,
      price: p.price,
      _id: p._id,
      picture: p.picture[0],
    });
    const result = await addProductToCart(id_user, e);

    setCart([...cart, result]);
  };
  const settingsImg = {
    dots: false,
    infinite: true,
    autoplaySpeed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true,
  };

  const onSubmitMessage = async () => {
    const messageToSend = {
      receiver: product.seller,
      sender: AuthService.getCurrentUser().id,
      product: product._id,
      content: message,
    };

    const result = await sendMessage(messageToSend);
    navigate("/messenger");

    //if (res.data.message != "False") navigate("../shop", { replace: true });
  };

  /* recent visited products */

  const [rProducts, setRProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getRecentVisitedProductofUser(id_user);
      setRProducts(result);
      if (id_user != id) recentVisited(id_user, id);
    };
    fetchData();
  }, []);
  const filterRVisitedProducts = rProducts.filter(function (result) {
    return result._id != id && result?.seller != id_user;
  });
  const onSubmitAddToCart = async (e, p) => {
    socket.emit("sendCart", id_user, {
      name: p.name,
      price: p.price,
      _id: p._id,
      picture: p.picture[0],
    });
    const result = await addProductToCart(id_user, e);

    setCart([...cart, result]);
  };
  /* wishlist */
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
  /* nbr */
  const [nbrW, setWNbr] = useState([]);
  const [nbrViews, setNbrViews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getCountProductWishlist(id);
      setWNbr(result);
      const r = await getNbrOfViews(id);
      setNbrViews(r);
    };
    fetchData();
  }, []);
  /* compare price */
  // const[amazonProduct,setAmazonProduct]=useState()
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await getPrice(product?.name);
  //     console.log(result);
  //     setAmazonProduct(result)
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-md-push-2">
              <div id="product-main-img">
                <div className="product-preview">
                  <img src={picture} alt="" data-aos="zoom-in" />
                </div>
              </div>
            </div>

            <div className="col-md-2  col-md-pull-5">
              <div id="product-img-shops">
                {product?.picture.length <= 2 ? (
                  <div className="product-label">
                    {product?.picture.map((image, index) => (
                      <div className="product-preview prv" key={index}>
                        <img
                          src={image}
                          alt=""
                          onClick={() => changeImage(image)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Slider {...settings}>
                    {product?.picture.map((image, index) => (
                      <div className="product-preview prv" key={index}>
                        <img
                          src={image}
                          alt=""
                          onClick={() => changeImage(image)}
                        />
                      </div>
                    ))}
                  </Slider>
                )}
              </div>
            </div>

            <div className="col-md-5">
              <div className="product-details">
                <h2 className="product-name">{product?.name}</h2>
                <div>
                  <div className="product-rating"></div>
                </div>
                <div>
                  <h3 className="product-price">{product?.price} coins</h3>
                </div>
                <p>{product?.description} </p>
                {product?.seller === id_user ? (
                  <></>
                ) : (
                  <>
                    {userCart?.products?.some(
                      (pr) => pr._id == product?._id
                    ) ? (
                      <div className="add-to-cart">
                        <a href={"/cart"}>
                          <button className="add-to-cart-btn">
                            <i className="fa fa-shopping-cart"></i> View cart
                          </button>
                        </a>
                      </div>
                    ) : (
                      <div className="add-to-cart">
                        <button
                          className="add-to-cart-btn"
                          onClick={() =>
                            onSubmitAddToCart(product._id, product)
                          }
                        >
                          <i className="fa fa-shopping-cart"></i> add to cart
                        </button>
                      </div>
                    )}
                  </>
                )}
                {product?.seller != id_user && (
                  <ul className="product-btns">
                    {whishlistProduct.length != 0 ? (
                      <>
                        {whishlistProduct.some(
                          (pr) => pr._id !== product?._id
                        ) && (
                          <li>
                            <a href="#">
                              <i
                                className="fa fa-heart-o"
                                onClick={() => onSubmitWishlist(product?._id)}
                              ></i>{" "}
                              add to wishlist
                            </a>
                          </li>
                        )}
                      </>
                    ) : (
                      <li>
                        <a href="#">
                          <i
                            className="fa fa-heart-o"
                            onClick={() => onSubmitWishlist(product?._id)}
                          ></i>{" "}
                          add to wishlist
                        </a>
                      </li>
                    )}
                    <li>
                      {product?.exchange.toString() == "true" && (
                        <a href="#">
                          <i className="fa fa-exchange"></i>exchange
                        </a>
                      )}
                    </li>
                  </ul>
                )}

                <ul className="product-links">
                  <li>Category:</li>
                  <li>
                    <a href="#">{product?.category}</a>
                  </li>
                </ul>

                <ul className="product-links">
                  <li>Share:</li>
                  <li>
                    <FacebookShareButton
                      url={product?.picture[0]}
                      quote={product?.name}
                      hashtag={"#TeckTak"}
                      description={product?.description}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </li>
                  <li>
                    <TwitterShareButton
                      title={product?.name}
                      url={product?.picture[0]}
                      hashtags={["TeckTak", "New"]}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                  </li>
                  <li>
                    <EmailShareButton
                      title={product?.name}
                      url={product?.picture[0]}
                      hashtags={["TeckTak", "New"]}
                    >
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </li>
                  <li>
                    <WhatsappShareButton
                      title={product?.name}
                      url={product?.picture[0]}
                      hashtags={["TeckTak", "New"]}
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </li>
                </ul>
                {product?.seller != id_user && (
                  <>
                    {chatExistOrNot ? (
                      <div className="add-to-cart positionCenter">
                        <a href={"/messenger"}>
                          <button className="add-to-cart-btn">
                            <i className="fa fa-shopping-cart"></i> Go to
                            conversation
                          </button>
                        </a>
                      </div>
                    ) : (
                      <div class="form-group">
                        <label for="exampleFormControlTextarea1">
                          Send message to <b>{seller?.firstname}</b>
                        </label>
                        <textarea
                          class="form-control"
                          id="exampleFormControlTextarea1"
                          type="text"
                          name="message"
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          rows="4"
                        ></textarea>
                        <div></div>
                        <div className="add-to-cart positionCenter mt-3">
                          <button
                            className="add-to-cart-btn"
                            onClick={(e) => onSubmitMessage()}
                          >
                            <i className="fa fa-shopping-cart"></i> Send Message
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {product?.seller == id_user && (
                  <div className="emoji-img mt-5 ml-5">
                    {product?.happy < 50 && product?.sad > 0 ? (
                      <>
                        <img
                          src="https://res.cloudinary.com/techtak/image/upload/v1650746900/TechTak/sadgif_wnnyp0.gif"
                          alt="Sad"
                          width="30%"
                        />
                      </>
                    ) : (
                      <img
                        className="emoji-picture"
                        src="https://res.cloudinary.com/techtak/image/upload/v1650746922/TechTak/sad-picture_kosetw.gif"
                        width="18%"
                      />
                    )}
                    {product?.happy == 50 ? (
                      <img
                        className="emoji"
                        src="https://res.cloudinary.com/techtak/image/upload/v1650746900/TechTak/middlegif_xl96u9.gif"
                        width="20%"
                      />
                    ) : (
                      <img
                        className="emoji emoji-picture"
                        src="https://res.cloudinary.com/techtak/image/upload/v1650746921/TechTak/middle-picture_ojfdui.gif"
                        width="18%"
                      />
                    )}

                    {product?.happy > 50 ? (
                      <img
                        className="emoji"
                        src="https://res.cloudinary.com/techtak/image/upload/v1650746901/TechTak/happygif_vudm2b.gif"
                        width="30%"
                      />
                    ) : (
                      <img
                        className="emoji emoji-picture"
                        src="https://res.cloudinary.com/techtak/image/upload/v1650746922/TechTak/happy-picture_tczlgc.gif"
                        width="18%"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            {product?.seller != id_user && (
              <>
                {product?.amazon_name != "" && (
                  <div className="col-md-12">
                    <div id="product-tab">
                      <ul className="tab-nav">
                        <li className="active">
                          <a data-toggle="tab" href="#tab2">
                            Similar Product in Amazon
                          </a>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div>
                          <div className="row">
                            <img
                              src={product?.amazon_picture}
                              width="200px"
                              className="col-3"
                            />
                            <div className="col-1"></div>
                            <p className="col-4 amaz-text-name">
                              {product?.amazon_name}
                            </p>
                            <div className="col-1"></div>
                            <p className="col-3 amaz-text-price">
                              {product?.amazon_price} $
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {product?.seller == id_user && (
              <div className="col-md-12">
                <div id="product-tab">
                  <ul className="tab-nav">
                    <li className="active">
                      <a data-toggle="tab" href="#tab1">
                        Details
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="user-product-dash">
                  <div className="row">
                    <div className="product-dash-elements "></div>
                    <div className="product-dash-elements col-2">
                      <h1>{nbrViews}</h1>
                      <h3>Views</h3>
                    </div>
                    <div className="product-dash-elements col-3 f1">
                      <h1>{nbr}</h1>
                      <h3>Shopping cart</h3>
                    </div>
                    <div className="product-dash-elements col-2 f2">
                      <h1>{nbrW}</h1>
                      <h3>Wishlist</h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {product?.seller != id_user && (
        <div className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title text-center">
                  <h3 className="title">Recent Visited</h3>
                </div>
              </div>
              {filterRVisitedProducts?.length <= 4 ? (
                <>
                  {filterRVisitedProducts?.map((product) => (
                    <div className="col-md-3 col-xs-6" key={product._id}>
                      <div className="product">
                        <div className="product-img-shop">
                          {product?.picture.length <= 1 ? (
                            <>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </>
                          ) : (
                            <Slider {...settingsImg}>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </Slider>
                          )}
                        </div>
                        <div className="product-body">
                          <p className="product-category">{product.category}</p>
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
                            <button className="add-to-wishlist">
                              <i className="fa fa-heart-o"></i>
                              <span className="tooltipp">add to wishlist</span>
                            </button>
                            <button className="add-to-compare">
                              <i className="fa fa-exchange"></i>
                              <span className="tooltipp">exchange</span>
                            </button>
                            <button className="quick-view">
                              <Link to={"/product/" + product._id}>
                                <i className="fa fa-eye"></i>
                                <span className="tooltipp">quick view</span>
                              </Link>
                            </button>
                          </div>
                        </div>
                        {product?.seller != id_user && (
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
                  ))}
                </>
              ) : (
                <Slider {...settingsPro}>
                  {filterRVisitedProducts?.map((product) => (
                    <div className="col-md-4 col-xs-6" key={product._id}>
                      <div className="product">
                        <div className="product-img-shop">
                          {product?.picture.length <= 1 ? (
                            <>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </>
                          ) : (
                            <Slider {...settingsImg}>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </Slider>
                          )}
                        </div>
                        <div className="product-body">
                          <p className="product-category">{product.category}</p>
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
                            <button className="add-to-wishlist">
                              <i className="fa fa-heart-o"></i>
                              <span className="tooltipp">add to wishlist</span>
                            </button>
                            <button className="add-to-compare">
                              <i className="fa fa-exchange"></i>
                              <span className="tooltipp">exchange</span>
                            </button>
                            <button className="quick-view">
                              <Link to={"/product/" + product._id}>
                                <i className="fa fa-eye"></i>
                                <span className="tooltipp">quick view</span>
                              </Link>
                            </button>
                          </div>
                        </div>
                        {product?.seller != id_user && (
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
                  ))}
                </Slider>
              )}
            </div>
          </div>
        </div>
      )}

      {product?.seller != id_user && (
        <div className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title text-center">
                  <h3 className="title">Related Products</h3>
                </div>
              </div>
              {filterProducts?.length <= 4 ? (
                <>
                  {filterProducts?.map((product) => (
                    <div className="col-md-3 col-xs-6" key={product._id}>
                      <div className="product">
                        <div className="product-img-shop">
                          {product?.picture.length <= 1 ? (
                            <>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </>
                          ) : (
                            <Slider {...settingsImg}>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </Slider>
                          )}
                        </div>
                        <div className="product-body">
                          <p className="product-category">{product.category}</p>
                          <h3 className="product-name">
                            <Link to={"/product/" + product._id}>
                              {product.name}
                            </Link>
                          </h3>
                          <h4 className="product-price">{product.price} coins</h4>
                          <div className="product-rating"></div>
                          <div className="product-btns">
                            <button className="add-to-wishlist">
                              <i className="fa fa-heart-o"></i>
                              <span className="tooltipp">add to wishlist</span>
                            </button>
                            <button className="add-to-compare">
                              <i className="fa fa-exchange"></i>
                              <span className="tooltipp">exchange</span>
                            </button>
                            <button className="quick-view">
                              <Link to={"/product/" + product._id}>
                                <i className="fa fa-eye"></i>
                                <span className="tooltipp">quick view</span>
                              </Link>
                            </button>
                          </div>
                        </div>
                        {product?.seller != id_user && (
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
                  ))}
                </>
              ) : (
                <Slider {...settingsPro}>
                  {filterProducts?.map((product) => (
                    <div className="col-md-4 col-xs-6" key={product._id}>
                      <div className="product">
                        <div className="product-img-shop">
                          {product?.picture.length <= 1 ? (
                            <>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </>
                          ) : (
                            <Slider {...settingsImg}>
                              {product?.picture.map((image, index) => (
                                <img src={image} alt="" key={index} />
                              ))}
                            </Slider>
                          )}
                        </div>
                        <div className="product-body">
                          <p className="product-category">{product.category}</p>
                          <h3 className="product-name">
                            <Link to={"/product/" + product._id}>
                              {product.name}
                            </Link>
                          </h3>
                          <h4 className="product-price">{product.price} coins</h4>
                          <div className="product-rating"></div>
                          <div className="product-btns">
                            <button className="add-to-wishlist">
                              <i className="fa fa-heart-o"></i>
                              <span className="tooltipp">add to wishlist</span>
                            </button>
                            <button className="add-to-compare">
                              <i className="fa fa-exchange"></i>
                              <span className="tooltipp">exchange</span>
                            </button>
                            <button className="quick-view">
                              <Link to={"/product/" + product._id}>
                                <i className="fa fa-eye"></i>
                                <span className="tooltipp">quick view</span>
                              </Link>
                            </button>
                          </div>
                        </div>
                        {product?.seller != id_user && (
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
                  ))}
                </Slider>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

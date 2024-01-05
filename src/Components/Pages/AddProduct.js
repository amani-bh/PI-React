import React, { useState } from "react";
import { addProduct } from "../../Utils/Product";
import MapMarker from "../../ComponentsDeliveryOffice/OrderForm/UtilOrder/MapMarker";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { scrapReviewsAmazon,shareFacebookPost } from "../../Utils/Product";
import axios from "axios";

export default function AddProduct(props) {
  const [test, setTest] = useState("");
  const [previewSource, setPreviewSource] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    location: {
      larg: Number(localStorage.getItem("long")),
      long: Number(localStorage.getItem("lat")),
    },
    exchange: false,
  });
  const handleFileChange = ({ target }) => {
    for (let i = 0; i < target.files.length; i++) {
      setFileData((fileData) => [...fileData, target.files[i]]);
    }
    setTest(target.value);
    previewFile(Array.from(target.files));
  };
  const formdata = new FormData();
  for (let i = 0; i < fileData.length; i++) {
    formdata.append("picture", fileData[i]);
  }
  
var id=""
var im=""
  const onSubmit = async (e) => {
    formdata.append("name", product.name);
    formdata.append("description", product.description);
    formdata.append("price", product.price);
    formdata.append("exchange", product.exchange);
    formdata.append("larg", product.location.larg);
    formdata.append("category", product.category);
    formdata.append("long", product.location.long);
    const result = await addProduct(formdata)
      .then((prod) => {
        console.log("added");
        toast.success("Added successfully");
        setStatus({ type: "success" });
         im=prod.picture[0]
         
        /* flask */
        try {
          // console.log("*******",id)
          // console.log("******* id",prod._id)
          id=prod._id
          
          const emotion=scrapAmazon(product.name,prod._id,prod.picture[0])
          
            
        } catch (error) {
          
        }
        

      })
      .catch((error) => {
        toast.error("Please Try Again");
        setStatus({ type: "error", error });
      });
       await axios.get(`${process.env.REACT_APP_CHATBOT}/scrap/` + product.name);


    };

  const previewFile = (files) => {
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSource((previewSource) => [...previewSource, reader.result]);
      };
    });
  };

  const deleteImage = (index) => {
    setPreviewSource((previewSource) =>
      previewSource.filter((img, i) => i !== index)
    );
    setFileData((fileData) => fileData.filter((img, i) => i !== index));
  };

  //location
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const currentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      product.location.larg = pos.coords.latitude;
      product.location.larg = pos.coords.longitude;
    });
  };
  const handlePosition = async (event) => {
    if (event.target.value.includes("current")) currentLocation();
    if (event.target.value.includes("map")) {
      openModal();
    }
  };
  const calculCost = async (l, t) => {};

  /* Scrap amazon*/
  const scrapAmazon=async(name,idP,pic)=>{
    const r= await scrapReviewsAmazon(name,idP,pic)
    return r
  }

  


  return (
    <div className="section">
      <div className="container">
        <div className="row ">
          <div className="billing-details ">
            <div className="section-title">
              <h3 className="title">Add Your Product</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <div className="col-md-6">
                  <input
                    className={`input ${errors.name && "invalid"}`}
                    type="text"
                    {...register("name", {
                      required: "Name is Required",
                      minLength: {
                        value: 5,
                        message: "Minimum Required length is 5",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("name");
                    }}
                    placeholder="Product Name"
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name.message}</small>
                  )}
                </div>
                <div className="col-md-6">
                  <select
                    className={`input ${errors.name && "invalid"}`}
                    {...register("category", {
                      required: "Category is Required",
                    })}
                    onKeyUp={() => {
                      trigger("category");
                    }}
                    onChange={(e) =>
                      setProduct({ ...product, category: e.target.value })
                    }
                  >
                    <option>Select category</option>
                    <option>Computer accessories and peripherals</option>
                    <option>Computer components</option>
                    <option>Computers & tablets</option>
                    <option>Data storage</option>
                    <option>Monitors</option>
                    <option>Servers</option>
                    <option>Networking products</option>
                    <option>Printers</option>
                    <option>Scanners</option>
                    <option>Tablet accessories</option>
                    <option>Laptop accessories</option>
                    <option>Cameras & Photo</option>
                    <option>Video Games & Consoles</option>
                  </select>
                  {errors.category && (
                    <small className="text-danger">
                      {errors.category.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12">
                  <textarea
                    className={`input ${errors.name && "invalid"}`}
                    {...register("description", {
                      required: "Description is Required",
                      minLength: {
                        value: 20,
                        message: "Minimum Required length is 20",
                      },
                      maxLength: {
                        value: 300,
                        message: "Maximum allowed length is 300 ",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("description");
                    }}
                    placeholder="Product description"
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                  ></textarea>
                  {errors.description && (
                    <small className="text-danger">
                      {errors.description.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-6">
                  <input
                    className={`input ${errors.name && "invalid"}`}
                    type="text"
                    {...register("price", {
                      required: "Price is Required",
                      pattern: {
                        value: /^\s*[0-9]+\s*$/,
                        message: "Only number",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("price");
                    }}
                    placeholder="Price"
                    onChange={(e) =>
                      setProduct({ ...product, price: e.target.value })
                    }
                  />
                  {errors.price && (
                    <small className="text-danger">
                      {errors.price.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-6">
                  <select
                    className={`input ${errors.name && "invalid"}`}
                    {...register("location", {
                      required: "Location is Required",
                    })}
                    onKeyUp={() => {
                      trigger("location");
                    }}
                    onChange={handlePosition}
                  >
                    <option value="test">Select </option>
                    <option value="current">Get my current position </option>
                    <option value="map">Get my position from the map</option>
                  </select>
                  {errors.location && (
                    <small className="text-danger">
                      {errors.location.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12">
                  <div className="input-checkbox">
                    <input
                      type="checkbox"
                      id="create-account"
                      {...register("exchange")}
                      value={true}
                      onChange={(e) =>
                        setProduct({ ...product, exchange: e.target.value })
                      }
                    />
                    <label htmlFor="create-account">
                      <span></span>
                      Exchange?
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-6 picture">
                  <input
                    className={`custom-file-input ${errors.name && "invalid"}`}
                    type="file"
                    {...register("picture", {
                      required: "Picture is Required",
                    })}
                    onKeyUp={() => {
                      trigger("picture");
                    }}
                    value={test}
                    accept="image/*"
                    onChange={handleFileChange}
                    draggable
                    multiple
                  />
                  <p>Drag your images here or click in this area</p>
                  {errors.picture && (
                    <small className="text-danger">
                      {errors.picture.message}
                    </small>
                  )}
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-12 preview">
                  {previewSource.map((image, index) => (
                    <span key={index}>
                      <img
                        src={image}
                        alt=""
                        style={{ height: "100px" }}
                        className="preview-images"
                      />
                      <span
                        className="delete-icon"
                        onClick={() => deleteImage(index)}
                      >
                        <i
                          className="fa fa-trash"
                          style={{ marginLeft: "-20px" }}
                        ></i>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <div className="col-md-3 add">
                  <button className="primary-btn order-submit">
                    Add product
                  </button>
                </div>
              </div>
              <Modal
                isOpen={modalIsOpen}
                style={customStyles}
                onRequestClose={closeModal}
                ariaHideApp={false}
                contentLabel="Map Marker"
              >
                <MapMarker closer={closeModal} distance={calculCost} />
                <button onClick={closeModal} className="btn-custom fifth">
                  Close
                </button>
              </Modal>
            </form>
          </div>
        </div>

       
        {status?.type === "error" && <p>Please Try Again</p>}
        <ToastContainer position={toast.POSITION.TOP_RIGHT}/>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { updateProduct } from '../../Utils/Product'
import MapMarker from "../../ComponentsDeliveryOffice/OrderForm/UtilOrder/MapMarker";
import Modal from "react-modal";
import { getProductById } from '../../Utils/Product';

export default function UpdateProduct() {
    let { id } = useParams();
    const [test, setTest] = useState("");
    const [previewSource, setPreviewSource] = useState([]);
    const [fileData, setFileData] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState();
    const [product, setProduct] = useState({
      name: '',
      description: '',
      category: '',
      price: 0,
      location: {
      larg: Number(localStorage.getItem("long")),
      long: Number(localStorage.getItem("lat")),
      },
      exchange: false,
      picture:''
  });
  


    useEffect(() => {
      const fetchData = async () => {
        const result = await getProductById(id);
        setProduct(result)
        result.picture.map((image)=>{
            setPreviewSource((previewSource)=>[...previewSource,image]);

        })
       
      }
      fetchData();
    },[]);

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
    const handleFileChange = ({ target }) => {
        for(let i=0;i<target.files.length;i++){
            setFileData((fileData)=>[...fileData,target.files[i]])

        }
        setTest(target.value)
        previewFile(Array.from(target.files));
      };
    const formdata = new FormData();
    for(let i=0;i<fileData.length;i++){
        formdata.append("picture", fileData[i]);
  
    }
      
    const onSubmit = async (e) => {
        e.preventDefault();
        formdata.append("name", product.name);
        formdata.append("description", product.description);
        formdata.append("price", product.price);
        formdata.append("exchange", product.exchange);
        formdata.append("larg", product.location.larg);
        formdata.append("category", product.category);
        formdata.append("long", product.location.long);
        console.log("form",formdata)
        const result = await updateProduct(formdata,id).then(()=>{console.log("updated");
        setStatus({ type: 'success' });}).catch((error) => {
            setStatus({ type: 'error', error });
        });
        
    }

    const previewFile = (files) => {
        
        files.forEach((file, index) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
            setPreviewSource((previewSource)=>[...previewSource,reader.result]);
            
            };
        });
    };


    const deleteImage=(index)=>{
        setPreviewSource((previewSource)=>previewSource.filter((img,i)=>i!==index));
        setFileData((fileData)=>fileData.filter((img,i)=>i!==index))
    }

    //location
    function openModal() {
        setIsOpen(true);
      }
      function closeModal() {
        setIsOpen(false);
      }
        const currentLocation = () => {
            navigator.geolocation.getCurrentPosition((pos) => {
                
                product.location.larg=pos.coords.latitude;
                product.location.larg=pos.coords.longitude;
            });
        };
        const handlePosition = async (event) => {
            if (event.target.value.includes("current")) currentLocation();
            if (event.target.value.includes("map")) {
            openModal();
            }
        };
        const calculCost = async (l, t) => {
            
        };
  return (
    <div className="section">
    <div className="container">
        <div className="row ">
            <div className="billing-details ">
                <div className="section-title">
                    <h3 className="title">Update Product</h3>
                </div>
                <form onSubmit={onSubmit}>
                <div className="form-group">
                    <div className="col-md-6">
                    <input className="input" type="text" name="name" placeholder="Product Name" value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                        <select className="input" value={product.category} onChange={e => setProduct({ ...product, category: e.target.value })}>
                            <option>Select category</option>
                            <option>Computer accessories and peripherals</option>
                            <option>Computer components</option>
                            <option>Computers & tablets</option>
                            <option>Data storage</option>
                            <option>Monitors</option>
                            <option>Servers</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12">
                    <textarea className="input" name='description' value={product.description} placeholder="Product description" onChange={e => setProduct({ ...product, description: e.target.value })}></textarea>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-6">
                    <input className="input" type="text" name="price" placeholder="Price" value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-6">
                    <select className="input" onChange={handlePosition}>
                            <option value="test">Select </option>
                           <option value="current">Get my current position </option>
                          <option value="map">Get my position from the map</option>
                    </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-12">
                        <div className="input-checkbox">
                        <input type="checkbox" id="create-account" checked={product.exchange} onChange={e => {if (product.exchange == true) setProduct({ ...product, exchange: false }); else setProduct({ ...product, exchange: true }) }} />
                            <label htmlFor="create-account">
                                <span></span>
                                Exchange?
                            </label>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-md-6 picture">
                        <input  className='custom-file-input' type="file" name="picture" value={test} accept="image/*" onChange={handleFileChange} draggable multiple/>
                        <p>Drag your images here or click in this area</p>
                    </div>
                </div>
                <div className="form-group">
                <div className="col-md-12 preview">
                {previewSource.map((image,index) => (
                    <span key={index}>
                    <img
                    
                    src={image}
                    alt=""
                    style={{ height: '100px' }}
                    className="preview-images"
                    />
                    <span
                    className="delete-icon" 
                    onClick={() => deleteImage(index)}
                    
                    ><i className='fa fa-trash' style={{ marginLeft: '-20px'}}></i></span>
                     </span>
                ))}

                    
                     </div>
                     </div>
                <div className="form-group">
                    <div className="col-md-3 add">
                        <button className="primary-btn order-submit">Update product</button>
                    </div>
                    
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    style={customStyles}
                    onRequestClose={closeModal}
                    ariaHideApp={false}
                    contentLabel="Map Marker">
                    <MapMarker closer={closeModal} distance={calculCost} />
                    <button onClick={closeModal} className="btn-custom fifth">
                    Close
                    </button>
                </Modal>
                </form>
                           
            </div>
        </div>
        
    {status?.type === 'success' && <h2 className='btn btn-success'>Update successfully </h2>}
                {status?.type === 'error' && (
                    <p>error</p>
                )}
    </div>
</div>
  )
}

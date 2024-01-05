import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { getProductByIdUser } from '../../Utils/Product'
import { deleteProduct } from '../../Utils/Product';
import AuthService from './AuthServices/auth.service';

export default function UserProduct() {
  const [products, setProducts] = useState([]);
  const id_user = AuthService.getCurrentUser().id ;

  const [pageNumber, setPageNumber] = useState(0);
  
  const usersPerPage = 6;
  const pagesVisited = pageNumber * usersPerPage;
  let unsold=0;
  let sold=0;
  const c = products?.map((product) => product.sold===true 
  ? (sold++)
  : unsold++);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductByIdUser(id_user);
      setProducts(result);
    };
    fetchData();
  }, []);
  const [selected, setSelected] = useState(0);
  const handleChange = (e) => {
    setSelected(e.target.value);
  };
  const filterProducts = products.filter(function(result) {
    if (selected==1)
      return result.sold === false;
    else if (selected==2)
      return result.sold === true;
    else return result
  });

  const pageCount = Math.ceil(filterProducts?.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
 const deleteP= async (e) => {
  const result = await deleteProduct(e);
  window.location.reload(false);

  }
  return (
    <div className="section">
      <div className="container">
        <div className="user-dash">
          <div className="row">
          <div className="dash-elements col-2">
              <h1>{products.length}</h1>
              <h3>Total</h3>
            </div>
            <div className="dash-elements col-2">
              <h1>{sold}</h1>
              <h3>Sold</h3>
            </div>
            <div className="dash-elements col-1">
              <h1>{unsold}</h1>
              <h3>Unsold</h3>
            </div>
            <div className="dash-elements col-3">
              <Link  className="primary-btn "to={"/add-product"}>
                 Add product
                 </Link>
            </div>
          </div>

        </div>
        <div className="col-md-1"></div>
        <div className="col-md-9">
        <div className="store-filter clearfix">
              <div className="store-sort">
                <label>
                  Sort By: 
                  <select className="input-select" value={selected} onChange={handleChange}>
                    <option value="0" defaultValue="0">All</option>
                    <option value="1">Unsold</option>
                    <option value="2">Sold</option>
                  </select>
                </label>

                </div>
             
            </div>


            <div className="row">
              {filterProducts?.slice(pagesVisited, pagesVisited + usersPerPage).map((product) => (
                  <div className="col-md-4 col-xs-6" data-aos="fade-in" key={product._id}>
                    <div className="product">
                      <div className="product-img">
                        <img src={product.picture[0]} alt="" style={{width:'100%',height:'200px'}}/>
                            {
                              product.sold===true ? 
                              <div className="product-label">
                              <span className="new">Sold</span>
                              </div> : <></>
                            } 
                      </div>
                      <div className="product-body">
                        <p className="product-category">{product.category}</p>
                        <h3 className="product-name">
                          <Link to={"/product/" + product._id}>
                            {product.name}
                          </Link>
                        </h3>
                        <h4 className="product-price">
                        {product.price} DT
                        </h4>
                        <div className="product-rating">
                        </div>
                        <div className="product-btns">
                        {
                              product.sold===false ? 
                              <button className="add-to-wishlist">
                              
                              <Link to={"/update-product/" + product._id}>
                              <i className="fa fa-pen"></i>
                              <span className="tooltipp">Update product</span>
                          </Link>
                              
                            </button>: <></>
                            } 
                          
                        
                          <button className="quick-view">
                            
                            <Link to={"/product/" + product._id}><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></Link>
                          </button>
                        </div>
                      </div>
                      {
                              product.sold===false ? 
                              <div className="add-to-cart">
                              <button className="add-to-cart-btn" onClick={() => deleteP(product._id)}>
                              <i className="fa fa-trash"></i> Delete
                              </button>
                        </div> : <></>
                            } 
                      
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
    </div>
  )
}

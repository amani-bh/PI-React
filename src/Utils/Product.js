import axios from "axios";
import AuthService from "../Components/Pages/AuthServices/auth.service";
const url = `${process.env.REACT_APP_URI_IO}/product/`;
export const addProduct = async (product) => {

  if (AuthService.getCurrentUser()){
    const id_user = AuthService.getCurrentUser().id ;

    try {
  
    const { data } = await axios.post(
      url + "addProduct/"+id_user,
      product
    );

    return data;
  } catch (error) {
    console.log(error);
  }
  }
};
export const getProducts = async () => {
  try {
    const { data } = await axios.get(url + "getProducts");
    return data;
  } catch (error) {
    console.log(error);
  }
  
};

export const getProductById = async (id) => {
  
  try {
    const { data } = await axios.get(url + "getOneProduct/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getProductByIdUser = async (id) => {
  try {
    const { data } = await axios.get(url + "getProductsUser/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductNotSold = async (id) => {
  try {
    const { data } = await axios.get(url + "getProductNotSold/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteProduct = async (id) => {
  try {
    const { data } = await axios.get(url + "deleteProduct/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const updateProduct = async (product,id) => {
  try {
    const { data } = await axios.put(
      url +"updateProduct/"+ id,
      product
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const recentVisited= async(idU,idP)=>{
  try {
    const { data } = await axios.get(url + "addRecentProduct/" + idU + "/" + idP);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const getRecentVisitedProductofUser = async (id) => {
  try {
    const { data } = await axios.get(url + "getRecentVisitedProductsUser/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

/* wishlist */
export const addToWishlist= async(idU,idP)=>{
  try {
    const { data } = await axios.get(url + "addToWishlist/" + idU + "/" + idP);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const getProductsWishlist = async (id) => {
  try {
    const { data } = await axios.get(url + "getProductsWishlist/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const removeProductFromWishlist= async(idU,idP)=>{
  try {
    const { data } = await axios.get(url + "removeProductFromWishlist/" + idU + "/" + idP);
    return data;
  } catch (error) {
    console.log(error);
  }
}
export const getCountProductWishlist = async (id) => {
  try {
    const { data } = await axios.get(url + "getCountProductWishlist/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getNbrOfViews = async (id) => {
  try {
    const { data } = await axios.get(url + "getNbrOfViews/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

/* flask */
export const scrapReviewsAmazon = async (name,id,img) => {
  try {
    // console.log("id",id)
    const { data } = await axios.post("http://127.0.0.1:5000/reviews/"+ name+"/"+id,img, {
      headers: {
        'Content-Type': 'application/json' }
    },{data:{image:img}});
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const emotionDetection = async (file_name) => {
  try {
    const { data } = await axios.get("http://127.0.0.1:5000/emotionDetection/"+ file_name);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const shareFacebookPost = async (text,img) => {
  try {
    console.log("img",img)
    const { data } = await axios.post("http://127.0.0.1:5000/sharePost/"+ text,img, {
      headers: {
        'Content-Type': 'application/json' }
    },{data:{image:img}});
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getPrice = async (name) => {
  try {
    const { data } = await axios.get("http://127.0.0.1:5000/getPrice/"+ name);
    return data;
  } catch (error) {
    console.log(error);
  }
};

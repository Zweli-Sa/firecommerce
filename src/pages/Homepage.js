import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { collection, getDocs } from "firebase/firestore";
import fireDB from "../fireConfig";
import { fireproducts } from "../firecommerce-products";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";



function Homepage() {



    const [products, setProducts] = useState([]);
    const { cartItems } = useSelector((state) => state.cartReducer)
    const [loading, setLoading] = useState(false)
    const [searchKey, setSearchKey] = useState('')
    const [filterType, setFilterType] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        getData();
    }, []);

    async function getData() {

        try {
            setLoading(true)
            const product = await getDocs(collection(fireDB, "products"));
            const productsArray = [];
            product.forEach((doc) => {
                const obj = {
                    id: doc.id,
                    ...doc.data(),
                };
                productsArray.push(obj);
                setLoading(false)
            });
            setProducts(productsArray);
            console.log(productsArray);
        } catch (error) {
            console.log(error);
            setLoading(false)
        }

    }
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems])

    const addToCart = (product) => {
        dispatch({ type: 'ADD_TO_CART', payload: product });
    };

    const deleteCart = () => {
        dispatch({ type: 'DELETE_CART' });
    };

    return (
        <Layout loading={loading}>
            <div className="container">
                <div className="d-flex w-50">
                    <input type="text"
                        value={searchKey}
                        onChange={(e) => { setSearchKey(e.target.value) }}
                        className="form-control mx-2"
                        placeholder="search items"
                    />
                    <select
                        className="form-control mt-3"
                        value={filterType}
                        onChange={(e) => { setFilterType(e.target.value) }}
                    >
                        <option value="">All</option>
                        <option value="electronics">Electronics</option>
                        <option value="mobiles">Mobiles</option>
                        <option value="fashion">Fashion</option>
                    </select>
                </div>
                <div className="row">

                    {products
                        .filter(obj => obj.name.toLowerCase().includes(searchKey))
                        .filter(obj => obj.category.toLowerCase().includes(filterType))
                        .map((product) => {
                            return <div className="col-md-4" key={product.id}>
                                <div className="m-2 p-1  product position-relative" >
                                    <div className="product-content" >
                                        <p>{product.name}</p>
                                        <div className="text-center">


                                            <img src={product.imageUrl} alt={product.description} className="product-img" />

                                        </div>
                                    </div>
                                    <div className="product-actions" >
                                        <h2>{product.price} R/-</h2>
                                        <div className="d-flex">
                                            <button onClick={() => addToCart(product)}>ADD TO CART</button>
                                            <button onClick={() => {
                                                navigate(`/productinfo/${product.id}`)
                                            }}>VIEW</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                </div>
            </div>

        </Layout>
    )
}

export default Homepage;

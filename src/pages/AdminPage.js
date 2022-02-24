import React from "react"
import Layout from "../components/Layout"
import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, addDoc, deleteDoc } from "firebase/firestore";
import fireDB from "../fireConfig";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";


function AdminPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([]);
    const [show, setShow] = useState(false)
    const [add, setAdd] = useState(false)

    const [product, setProduct] = useState({
        name: "",
        price: 0,
        imageUrl: "",
        category: "",

    });

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    useEffect(() => {
        getData();
    }, []);

    async function getOrdersData() {

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
        getOrdersData();
    }, []);

    async function getData() {

        try {
            setLoading(true)
            const result = await getDocs(collection(fireDB, "orders"));
            const ordersArray = [];
            result.forEach((doc) => {

                ordersArray.push(doc.data());
                setLoading(false)
            });
            setOrders(ordersArray);
            console.log(ordersArray);
        } catch (error) {
            console.log(error);
            setLoading(false)
        }

    }

    const editHandler = (item) => {
        setProduct(item)
        setShow(true)
    }

    const updateProduct = async () => {
        try {
            setLoading(true)
            await setDoc(doc(fireDB, "products", product.id), product)
            toast.success("Product updated successfully")
            window.location.reload();
            handleClose();
        } catch (error) {
            setLoading(false)
            toast.error('Product update failed')

        }
    }

    const addHandler = () => {
        setAdd(true);
        handleShow()
    }

    const addProduct = async () => {
        try {
            setLoading(true)
            await addDoc(collection(fireDB, "products"), product)
            toast.success("Product added successfully")
            window.location.reload();
            handleClose();
        } catch (error) {
            setLoading(false)
            toast.error('Product add failed')

        }
    }

    const deleteProduct = async (item) => {
        try {
            setLoading(true);
            await deleteDoc(doc(fireDB, "products", item.id));
            toast.success("Product deleted successfully");
            getData();
        } catch (error) {
            toast.failed("Product delete failed");
            setLoading(false);
        }
    }

    return (
        <Layout loading={loading}>

            <Tabs defaultActiveKey="products" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="products" title="Products">
                    <div className="d-flex justify-content-between">
                        <h3>Products List</h3>
                        <button onClick={addHandler}>ADD PRODUCT</button>
                    </div>
                    <table className="table mt-3">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {products.map(item => {
                                return <tr key={item.id}>

                                    <td><img src={item.imageUrl} height="80" width="80" alt={item.name} /></td>

                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <FaTrash color="red" size={20} onClick={() => { deleteProduct(item) }} />
                                        <FaEdit onClick={() => editHandler(item)}
                                            color="blue"
                                            size={20}
                                        />
                                    </td>

                                </tr>
                            })}
                        </tbody>
                    </table>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>{add ? 'Add a product' : 'Edit Product'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {" "}
                            <div className="register-form">
                                <input
                                    type="text"
                                    value={product.name}
                                    className="form-control"
                                    placeholder="name"
                                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={product.imageUrl}
                                    className="form-control"
                                    onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
                                />
                                <input
                                    type="number"
                                    value={product.price}
                                    className="form-control"
                                    placeholder="price"
                                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={product.category}
                                    className="form-control"
                                    placeholder="category"
                                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                                />
                                <hr />
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button>Close</button>
                            {add ? (<button onClick={addProduct}>SAVE</button>) : (<button onClick={updateProduct}>SAVE</button>)}
                        </Modal.Footer>
                    </Modal>
                </Tab>
                <Tab eventKey="orders" title="Orders">
                {orders.map(order => {
            return (
                <table className="table mt-3 order">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.cartItems.map(item => {
                            return <tr key={item.id}>

                                <td><img src={item.imageUrl} height="80" width="80" alt={item.name} /></td>

                                <td>{item.name}</td>
                                <td>{item.price}</td>

                            </tr>
                        })}
                    </tbody>
                </table>
            )
        })}
                </Tab>
                <Tab eventKey="users" title="Users" disabled>

                </Tab>
            </Tabs>



        </Layout>
    )
}

export default AdminPage;
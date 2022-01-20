import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import fireDB from "../fireConfig";
import { PayPalButton } from "react-paypal-button-v2";


function CartPage() {
    const { cartItems } = useSelector((state) => state.cartReducer)

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [pinCode, setPinCode] = useState('')

    const [totalAmount, setTotalAmount] = useState();
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let temp = 0;
        cartItems.forEach((cartItem) => {
            temp = temp + parseInt(cartItem.price) 
        })

        setTotalAmount(temp)
    }, [cartItems])

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems])

    const deleteFromCart = (product) => {
        dispatch({ type: 'DELETE_FROM_CART', payload: product });
    };

    const placeorder = async () => {
        const addressInfo = {
            name,
            address,
            pinCode,
            phoneNumber
        }
        console.log(addressInfo)

        const orderInfo = {
            cartItems,
            addressInfo,
            email: JSON.parse(localStorage.getItem("currentUser")).user.email,
            userid: JSON.parse(localStorage.getItem("currentUser")).user.uid
        }
        console.log(orderInfo)
        try {
            setLoading(true)
            const result = await addDoc(collection(fireDB, "orders"), orderInfo)
            setLoading(false)
            toast.success("order placed succefully")
            handleClose()
        } catch (error) {
            setLoading(false)
            toast.error("order failed")
        }

    };

    return (
        <Layout loading={loading}>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Prive</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => {
                        return <tr key={item.id}>

                            <td><img src={item.imageUrl} height="80" width="80" /></td>

                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td><FaTrash onClick={() => deleteFromCart(item)} /></td>

                        </tr>
                    })}
                </tbody>
            </table>

            <div className="d-flex justify-content-end">
                <h1 className="total-amount">Total Amount = {totalAmount} R/-</h1>
            </div>
            <div className="d-flex justify-conten-ent mt">
                <button onClick={handleShow}>PLACE ORDER</button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Your Address</Modal.Title>
                </Modal.Header>
                <Modal.Body><div className="register-form">

                    <h2>Register</h2>

                    <hr />

                    <input
                        type='text'
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                    />
                    <textarea
                        type='text'
                        className="form-control"
                        placeholder="address"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value)
                        }}
                    />
                    <input
                        type='text'
                        className="form-control"
                        placeholder="phone-number"
                        value={phoneNumber} onChange={(e) => {
                            setPhoneNumber(e.target.value)
                        }}
                    />

                    <input
                        type='text'
                        className="form-control"
                        placeholder="pin-code"
                        type="number"
                        value={pinCode} onChange={(e) => {
                            setPinCode(e.target.value)
                        }}
                    />



                    <hr />



                </div></Modal.Body>
                <Modal.Footer>
                    <button onClick={handleClose}>
                        Close
                    </button>
                    <button onClick={placeorder}>
                        ORDER
                    </button>
                </Modal.Footer>
            </Modal>

            <div >

<input
    type="number"
    value={totalAmount}
    onChange={(e) => setTotalAmount(e.target.value)}
/>

<PayPalButton
    options={{
        clientId:
            "ARhF2Yw8zRq14eftim5dIitGQs6acykO_xl0wFQkxQJZXvxjSY6c1lIHTqjE7GPBsWEVkJXPdgwznMT-",
        currency: "USD",
    }}

    amount={totalAmount}
    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
    onSuccess={(details, data) => {
        alert("Transaction completed by " + details.payer.name.given_name);

        // OPTIONAL: Call your server to save the transaction
        console.log({ details, data });
    }}
/>
</div>            

        </Layout>
    )
}

export default CartPage;

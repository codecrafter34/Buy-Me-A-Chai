"use client"
import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify'; // Make sure react-toastify is installed and imported
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions';

import { useRouter} from "next/navigation";
const PaymentPage = ({ username }) => {
    const [paymentform, setPaymentform] = useState({ name: "", message: "", amount: "" });
    const [currentUser, setcurrentUser] = useState({});
    const [payments, setPayments] = useState([]);
    const searchParams = useSearchParams();
    const router = useRouter();

    
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log("hi chutiye")
        if (searchParams.get("paymentdone") === "true") {
            toast('Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                 theme: "light",
                 transition: Bounce,
            });
        }    
         router.push(`/${username}`)
    }, []);

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    const getData = async () => {
        let u = await fetchuser(username);
        setcurrentUser(u);
        let dbpayments = await fetchpayments(username);
        setPayments(dbpayments);
        // console.log(u)
    };

    const pay = async (amount) => {
        console.log(currentUser)
        // Step 1: Initiate an order from your server
        let a = await initiate(amount, username, paymentform);
        let orderId = a.id;

        // Step 2: Configure Razorpay options
        var options = {
            "key":process.env.NEXT_PUBLIC_KEY_ID, // Enter the Key ID from the Dashboard
            "amount": amount,
            "currency": "INR",
            "name": "Get Me A Chai",
            "description": "Test Transaction",
            "image": "/tea.gif", // A local or hosted image
            "order_id": orderId,
            
            // ✅ **THIS IS THE KEY CHANGE**
            // The handler function runs in the browser after a successful payment.
            "handler": async function (response) {
                try {
                    // Step 3: Send payment details to your API for server-side verification
                    const res = await fetch('/api/razorpay', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(response),
                    });

                    const jsonRes = await res.json();

                    // Step 4: Handle the API response
                    if (jsonRes.success) {
                        // If verification is successful, redirect the user
                        router.push(`/${username}?paymentdone=true`);
                    } else {
                        // If verification fails, show an error message
                        toast.error('Payment verification failed. Please contact support.', {
                            position: "top-right",
                            autoClose: 5000,
                        });
                    }
                } catch (error) {
                    console.error("Failed to verify payment:", error);
                    toast.error('An error occurred during payment verification.', {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            },

            "prefill": {
                "name": paymentform.name || "Anonymous",
                "email": "supporter@example.com",
                "contact": "9999999999"
            },
            "notes": {
                "address": "Support for a great creator"
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        // Step 5: Open the Razorpay payment modal
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
            toast.error("Oops! Payment Failed.", {
                position: "top-right"
            });
            // You can log the error details here
            // console.error(response.error.code);
            // console.error(response.error.description);
        });

        rzp1.open();
    };

    return (
        <>
                    <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
            {/* Same as */}
            <ToastContainer />

            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className='cover w-full relative '>
                <img className='w-full h-[300px] object-cover' src="/das.png" alt="" />
                <div className='absolute top-[200px] right-[44%]'>
                    <img className='w-40 h-40 rounded-xl border-2 border-gray-700 shadow-lg object-cover' src="/das.png" alt="" />
                </div>
                <div className='info flex justify-center items-center my-20 flex-col gap-2 text-xs '>
                    <div className='font-bold text-lg'>
                        {username}
                    </div>
                    <div className='text-slate-300'>
                        Creating animated art for VTT's
                    </div>
                    <div className='text-slate-300'>
                        9,719 members • 82 post • $15,450/release
                    </div>
                    <div className="payment flex gap-3 w-[80%] rounded-lg p-10">
                        <div className="supporter w-1/2 bg-black text-lime-400 border-2 border-lime-400 p-2">
                            <h2 className=' mx-2 text-lg font-bold my-1'>Supporters</h2>
                            <ul>
                                   {payments.length == 0 && <li className="mx-5">No payments yet</li>}
                                {/* Replace with dynamic data from your 'payments' state */}
                                {payments.map((p, i) => (
                                    <li className="mx-5" key={i}> {p.name} donated ${p.amount} with a message "{p.message}"</li>
                                ))}
                            </ul>
                        </div>
                        <div className="makepayment w-1/2 bg-lime-400 text-black border-2 border-gray-700 p-2">
                            <h2 className='text-2xl text-center font-bold my-5'> Make a payment </h2>
                            <div className="flex flex-col justify-center gap-2 px-8 font-bold ">
                                <input onChange={handleChange} value={paymentform.name} name='name' type="text" className='w-full p-3 rounded-lg text-lime-400 bg-black' placeholder='Enter Name' />
                                <input onChange={handleChange} value={paymentform.message} name='message' type="text" className='w-full p-3 rounded-lg bg-black text-lime-400' placeholder='Enter Message' />
                                <input onChange={handleChange} value={paymentform.amount} name='amount' type="text" className='w-full p-3 rounded-lg bg-black text-lime-400' placeholder='Enter Amount' />
                                <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)} className='bg-black p-3 rounded-lg text-white disabled:bg-slate-600' disabled={!paymentform.name || !paymentform.message || !paymentform.amount}>Pay</button>
                            </div>
                            <div className="flex justify-center gap-2 mt-5 font-bold ">
                                <button className='bg-black text-white p-3 rounded-lg' onClick={() => pay(1000)}> Pay ₹10</button>
                                <button className='bg-black text-white p-3 rounded-lg' onClick={() => pay(2000)}> Pay ₹20</button>
                                <button className='bg-black text-white p-3 rounded-lg' onClick={() => pay(3000)}> Pay ₹30</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PaymentPage;
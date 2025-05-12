import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaStar } from "react-icons/fa";
import { FaGem, FaCrown } from "react-icons/fa";
import { GiDiamondTrophy } from "react-icons/gi";
import Cookies from 'js-cookie'
import { FaRegCreditCard } from "react-icons/fa";
import { FaTimesCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';




const Pricing = () => {

    const [loading, setLoading] = useState(false)
    const [loadingAction, setLoadingAction] = useState("")
    const [pageRefresh, setPageRefresh] = useState(false)
    const URL = `${import.meta.env.VITE_REACT_API_URL}`

    let getFreeTrialVerifiedStatusInterval;
    let getOtherPlanVerifiedStatusInterval;

    useEffect(() => {
        console.log("Plan changes")
    }, [pageRefresh])

    const handleSubscription = async (plan) => {
        try {
            setLoading(true)
            setLoadingAction(plan)
            let url;
            let payload;

            if (plan === "Free Trial") {
                url = `${URL}/razorpay_create_checkout_session`
                payload = {
                    "email": Cookies.get("email"),
                }
            } else {

                // If already subscribed
                if (Cookies.get("currentPlan") === "basic" ||
                    Cookies.get("currentPlan") === "premium" ||
                    Cookies.get("currentPlan") === "platinum") {
                    url = `${URL}/switch_plan`
                    payload = {
                        "email": Cookies.get("email"),
                        "plan": plan
                    }
                    // For new subscription
                } else {
                    url = `${URL}/upgrade_subscription`
                    payload = {
                        "email": Cookies.get("email"),
                        "plan": plan
                    }
                }
            }

            console.log("payload", payload)

            const response = await axios.post(url, payload)
            console.log(response)
            if (response) {
                window.open(response.data.checkout_url, "_blank")
                setLoading(false)
                setLoadingAction("")
                if (plan === "Free Trial") {
                    getFreeTrialVerifiedStatus(payload, plan)
                } else {
                    getOtherPlanVerifiedStatus(payload, plan)
                }
            } else {
                console.log("Error")
            }

        } catch (error) {
            setLoading(false)
            setLoadingAction("")
            console.log(error)
        }
    }



    const getFreeTrialVerifiedStatus = async (payload, plan) => {
        const url = `${URL}/update_checkout_status_fortrial`
        try {
            const response = await axios.post(url, payload)
            console.log(response)
            if (response.data.message === "failure") {
                console.log(response.data.message)
                if (!getFreeTrialVerifiedStatusInterval) {
                    getFreeTrialVerifiedStatusInterval = setInterval(() => {
                        console.log("Retrying...");
                        getFreeTrialVerifiedStatus(payload, plan);
                    }, 10000);
                }
            } else {
                console.log(response.data.message)
                setLoading(false)
                setLoadingAction("")
                Cookies.set("currentPlan", plan)
                Cookies.set("isFreeTrialEnabled", true)
                setPageRefresh(!pageRefresh)
                if (getFreeTrialVerifiedStatusInterval) {
                    clearInterval(getFreeTrialVerifiedStatusInterval);
                    console.log("interval cleared")
                    getFreeTrialVerifiedStatusInterval = null;
                }
            }
        } catch (error) {
            setLoading(false)
            setLoadingAction("")
            console.log(error)
        }
    }


    const getOtherPlanVerifiedStatus = async (payload, plan) => {
        const url = `${URL}/update_checkout_status`
        try {
            const response = await axios.post(url, payload)
            if (response.data.message === "failure") {
                console.log(response.data.message)
                if (!getOtherPlanVerifiedStatusInterval) {
                    getOtherPlanVerifiedStatusInterval = setInterval(() => {
                        console.log("Retrying...");
                        getOtherPlanVerifiedStatus(payload, plan);
                    }, 10000);
                }
            } else {
                console.log(response.data.message)
                setLoading(false)
                setLoadingAction("")
                Cookies.set("currentPlan", plan)
                Cookies.set(`is_${plan}_enabled`, true)
                setPageRefresh(!pageRefresh)
                if (getOtherPlanVerifiedStatusInterval) {
                    clearInterval(getOtherPlanVerifiedStatusInterval);
                    console.log("interval cleared")
                    getOtherPlanVerifiedStatusInterval = null;
                }
            }
        } catch (error) {
            setLoading(false)
            setLoadingAction("")
            console.log(error)
        }
    }

    const handleCancelSubscription = async (plan) => {
        console.log("plan", plan)
        try {
            setLoading(true)
            setLoadingAction("Cancel Subscription")

            let url;
            let payload;

            url = `${URL}/cancel_subscription`
            payload = {
                "email": Cookies.get("email"),
                "plan": plan
            }

            const response = await axios.post(url, payload)
            if (response) {
                Cookies.set("previousPlan", plan)
                Cookies.remove("currentPlan")
                setLoading(false)
                setLoadingAction("")
            } else {
                setLoading(false)
                setLoadingAction("")
                console.log("Error")
            }
        } catch (error) {
            setLoading(false)
            setLoadingAction("")
            console.log(error)
        }
    }


    return (
        <div className="container mt-5 ">
            <ToastContainer />
            <h1 className="my-5 text-center">Pricing Plans</h1>
            <div className="d-flex flex-wrap justify-content-md-start justify-content-center ">

                {/* Free Trial */}
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center" >
                    <div className="card mb-3" style={{ maxWidth: "18rem", height: "30rem", background: "linear-gradient(135deg, #f8f9fa, #e0e0e0)", border: "none" }}>
                        <div className="card-body d-flex flex-column align-items-center text-center" style={{ height: "100%" }}>
                            {
                                Cookies.get("isFreeTrialEnabled") && Cookies.get("currentPlan") === "Free Trial" && <span className='text-center text-dark bg-light d-inline-block px-3 rounded-3' style={{ fontSize: '12px' }}>Current plan</span>
                            }
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                <h3 className="card-title">
                                    <FaStar className="me-2 text-warning" /> Free Trial
                                </h3>
                                <p className="card-text mt-4">A simple plan for getting started(Free Trial).</p>
                            </div>
                            <div className="mt-auto">
                                <button
                                    disabled={Cookies.get("isFreeTrialEnabled") && true}
                                    className={`btn btn-outline-dark ${Cookies.get("isFreeTrialEnabled") ? "pe-none opacity-25" : "cup"}`}
                                    onClick={() => handleSubscription("Free Trial")}>
                                    {
                                        loading && loadingAction === "Free Trial" ?
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            :
                                            "Free Trial"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Basic Plan */}
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center" >
                    <div className="card text-light mb-3 " style={{ maxWidth: "18rem", height: "30rem", background: "linear-gradient(135deg, #17a2b8, #007bff)", border: "none" }}>
                        <div className="card-body d-flex flex-column align-items-center text-center" style={{ height: "100%" }}>
                            {
                                (Cookies.get("currentPlan") === "basic" || Cookies.get("previousPlan") === "basic") && <span className='text-center text-dark bg-light d-inline-block px-3 rounded-3' style={{ fontSize: '12px' }}>Current plan</span>
                            }
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                <h3 className="card-title">
                                    <FaGem className="me-2 text-light" /> Basic
                                </h3>
                                <p className="card-text mt-4">Advanced features for growing businesses.</p>
                            </div>
                            <div className="mt-auto">
                                {
                                    Cookies.get("currentPlan") === "basic" ?
                                        <>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleCancelSubscription("basic")}>
                                                {
                                                    loading && loadingAction === "Cancel Subscription" ?
                                                        <div className="spinner-border spinner-border-sm" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                        :
                                                        <div className='d-flex align-items-center gap-2'>
                                                            <FaTimesCircle /> Cancel Subscription
                                                        </div>
                                                }
                                            </button>
                                        </>
                                        :
                                        <button
                                            className="btn btn-light"
                                            onClick={() => handleSubscription("basic")}
                                            disabled={Boolean(Cookies.get("previousPlan") && Cookies.get("previousPlan") === "basic") || Cookies.get("is_basic_enabled") === "true" ? true : false}>
                                            {
                                                loading && loadingAction === "basic" ?
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    :
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <FaRegCreditCard /> Subscribe now
                                                    </div>
                                            }
                                        </button>
                                }
                            </div>
                        </div>

                    </div>
                </div>

                {/* Premium Plan */}
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center" >
                    <div className="card text-light mb-3" style={{ maxWidth: "18rem", height: "30rem", background: "linear-gradient(135deg, #28a745, #218838)", border: "none" }}>
                        <div className="card-body d-flex flex-column align-items-center text-center" style={{ height: "100%" }}>
                            {
                                (Cookies.get("currentPlan") === "premium" || Cookies.get("previousPlan") === "premium") && <span className='text-center text-dark bg-light d-inline-block px-3 rounded-3' style={{ fontSize: '12px' }}>Current plan</span>
                            }
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                <h3 className="card-title">
                                    <FaCrown className="me-2 text-warning" /> Premium
                                </h3>
                                <p className="card-text mt-4">For enterprises needing maximum power.</p>
                            </div>
                            <div className="mt-auto">
                                {
                                    Cookies.get("currentPlan") === "premium" ?
                                        <button className="btn btn-danger" onClick={() => handleCancelSubscription("premium")}>
                                            {loading && loadingAction === "Cancel Subscription" ? (
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                <div className='d-flex align-items-center gap-2'>
                                                    <FaTimesCircle /> Cancel Subscription
                                                </div>
                                            )}
                                        </button>
                                        :
                                        <button
                                            className="btn btn-light"
                                            onClick={() => handleSubscription("premium")}
                                            disabled={Boolean(Cookies.get("previousPlan") && Cookies.get("previousPlan") === "premium") || Cookies.get("is_premium_enabled") === "true" ? true : false}>
                                            {
                                                loading && loadingAction === "premium" ?
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    :
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <FaRegCreditCard /> Subscribe now
                                                    </div>
                                            }
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platinum Plan  */}
                <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center" >
                    <div className="card text-light mb-3" style={{ maxWidth: "18rem", height: "30rem", background: "linear-gradient(135deg, #6f42c1, #4b0082)", border: "none" }}>
                        <div className="card-body d-flex flex-column align-items-center text-center" style={{ height: "100%" }}>
                            {
                                (Cookies.get("currentPlan") === "platinum" || Cookies.get("previousPlan") === "platinum") && <span className='text-center text-dark bg-light d-inline-block px-3 rounded-3' style={{ fontSize: '12px' }}>Current plan</span>
                            }
                            <div className="flex-grow-1 d-flex flex-column justify-content-center">
                                <h3 className="card-title">
                                    <GiDiamondTrophy className="me-2 text-light" /> Platinum
                                </h3>
                                <p className="card-text mt-4">The ultimate plan with premium support.</p>
                            </div>
                            <div className="mt-auto">
                                {
                                    Cookies.get("currentPlan") === "platinum" ?
                                        <button className="btn btn-danger" onClick={() => handleCancelSubscription("platinum")}>
                                            {
                                                loading && loadingAction === "Cancel Subscription" ?
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    :
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <FaTimesCircle /> Cancel Subscription
                                                    </div>
                                            }
                                        </button>
                                        :
                                        <button
                                            className="btn btn-light"
                                            onClick={() => handleSubscription("platinum")}
                                            disabled={Boolean(Cookies.get("previousPlan") && Cookies.get("previousPlan") === "platinum") || Cookies.get("is_platinum_enabled") === "true" ? true : false}>
                                            {
                                                loading && loadingAction === "platinum" ?
                                                    <div className="spinner-border spinner-border-sm" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    :
                                                    <div className='d-flex align-items-center gap-2'>
                                                        <FaRegCreditCard /> Subscribe now
                                                    </div>
                                            }
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Pricing

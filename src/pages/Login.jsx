import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'




const Login = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")


    const handleSubmit = (e) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return;
        }

        Cookies.set("email", email);
        navigate('/pricing');
    };

    return (
        <section className='layout'>

            <div className="container vh-100 d-flex justify-content-center align-items-center" >
                <form className='w-50 border border-1 rounded-3 p-5' style={{ backgroundColor: '#f0f0f0' }}>
                    <h1 className='text-center mb-4'>Login</h1>
                    <div className="mb-3 w-75 d-block mx-auto">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            autoFocus
                            type="email"
                            placeholder='Enter your email'
                            className="form-control"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <button disabled={!email} type="submit" className="btn btn-primary d-block mx-auto w-75 mt-4" onClick={handleSubmit}>Submit</button>
                </form>
            </div>



        </section>
    )
}

export default Login
import  { useState } from "react";
import "./Login.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import notify from "../../utility/useNotifaction";


const Login = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        password: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(user);
        
        // navigate to the dashboard page
        axios.post('http://127.0.0.1:8000/api/token/', user).then((response) => {
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            console.log(response.data);
            notify(" you are logged in", "success")

            setTimeout(
                () => {
                    // navigate('/dashboard', { replace: true });
                    navigate('/dashboard')
                }, 2000
            )

        }).catch(function (error) {
            if (error.response) {
                notify("username or password is incorrect", "error")

                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        })
    }
    return (
        <div className="d-flex loginForm ">
            {/* <Row className=""> */}
                {/* Image prend 1/3 */}
                {/* <Col sm={12} md={6} > */}
                    <div className="image bg-white ">
                        {/* <img src='https://img.freepik.com/free-vector/gradient-luxury-background-with-copy-space_23-2148962647.jpg?w=740&t=st=1678596929~exp=1678597529~hmac=bd2870a9107182c7da930898cdbc09c41be17ee91ed4ad785e259ccf9dd79875' alt="design"  className="containe"/> */}
                    </div>

                    <div className="form ">
                        <div className="form-header">
                        {/* <img src={logo} alt="logo"  /> */}
                            <h2>Sign In</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                        <h6>
                            Username
                        </h6>
                        <div className="form-group">
                                {/* <label htmlFor="username">username</label> */}
                                <div className="input-wrapper">
                            {/* <i className="fa-solid fa-user icon"></i> */}
                                <input type="text"  className="form-input" onChange={(e) => setUser({ ...user, username: e.target.value })} />
                            </div>
                    
                            </div>

                            <h6>
                            Password
                        </h6>

                            <div className="form-group">
                                {/* <label htmlFor="username">username</label> */}
                                <div className="input-wrapper">
                                {/* <i className="fas fa-lock icon"></i> */}
                                <input type="password"  className="form-input" onChange={(e) => setUser({...user, password: e.target.value })} />
                            </div>
                            </div>
                            <div className=" footer">
                        
                        {/* <p  className="text-secondary font-weight-bold  text-center">Forget Password?</p> */}
                        
                        <button type="submit" className="btn btn-default lg:px-9 py-2 mt-4  " >Sign in</button>
                        
                        </div>
                        </form>
                        
                    </div>
                {/* </Col> */}

                {/* Form prend 2/3 */}
                {/* <Col sm={12} md={6}>
                    
                </Col> */}


            {/* </Row> */}

            <ToastContainer />
        </div>
    );

};

export default Login;

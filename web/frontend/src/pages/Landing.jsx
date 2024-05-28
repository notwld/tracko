import '../stylesheets/landing.css'
import logo from '../assets/logo.png'
import pic100 from '../assets/pic100.png'
import poker from '../assets/pokerplainning.jpg'
import functional from '../assets/functional.png'
import What from '../assets/what.png'
import tech1 from '../assets/tech1.png'
import { useNavigate } from 'react-router-dom'
function Landing() {
    const navigate = useNavigate()
    return (
        <>
            <div className="mt-5">
                <nav className="navbar bg-body-tertiary py-2">
                    <div className="container-fluid mx-2">
                        <img className='MainLogo' src={logo} alt="" />
                        <button className='sign-txt mt-1'>Download App</button>
                    </div>
                </nav>

                <div className="container">
                    <div className="d-flex justify-content-center mt-5">
                        <div className="text-center">
                            <h1 className='head-text text-center'> <span className='head-txt'> Great outcomes</span> start with
                            </h1>
                            <div className="head-sectxt">
                                <h1 className='text-center head-text1 '>Tracko</h1>
                                <img className='head-img ' src={pic100} alt="" />
                            </div>
                            <p className='text-center mt-4'>The only project management tool you need to plan and track work across every team.
                            </p>
                            <button onClick={() => {
                                localStorage.clear()
                                navigate('/login')
                            }}className="btn btn-primary">Get Started<i className="fa-solid fa-arrow-right mx-1" ></i></button>
                        </div>
                    </div>
                </div>
                <div className="container mt-5">
                    <div className="row p-4 home-secCont mb-5 d-flex justify-content-center align-items-center">
                        <div className="col-md-6 ">
                            <div className="">

                                <h4>Free Planning Poker App
                                </h4>
                                <p>Free / Open source Planning Poker Web App to estimate user stories for your Agile/Scrum teams. Create a session and invite your team members to estimate user stories efficiently.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <img className='pokerPlainImg' src={poker} alt="" />
                        </div>
                    </div>
                </div>

                <div className="my-3">
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="container">
                            <h2 className='text-center'>Get Everything Done by Poker Planning or Traditional Techniques</h2>
                            <div className="demo_title">
                            </div>
                            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mt-5">

                                <div className='all_card'>
                                    <div>
                                        <h2 >Poker Planning Technqiues</h2>

                                    </div>
                                    <div>

                                    </div>
                                    <div></div>
                                    <div className="tpn_card">
                                        <h5>Function Points </h5>
                                        <p>Calculate Cost, Time and Manpower with Poker Planing by Agile Costing or Traditional Costing</p>
                                    </div>
                                    <div className="tpn_card">
                                        <h5>Story Points</h5>
                                        <p>Calculate Cost, Time and Manpower with Poker Planing by Agile Costing or Traditional Costing</p>
                                    </div>
                                    <div className="tpn_card">

                                        <h5>Use Case </h5>
                                        <p>Calculate Cost, Time and Manpower with Poker Planing by Agile Costing or Traditional Costing</p>

                                    </div>

                                </div>




                            </div>

                            <div className='all_card' style={{ marginTop: "10px" }}>
                                <div>
                                    <h2>Traditional Technqiues</h2>

                                </div>
                                <div>

                                </div>
                                <div></div>

                                <div className="tpn_card">
                                    <h5>Cocomo I Basic</h5>
                                    <p>Calculate Cost, Schedule, Manpower and Effort with Traditional Costing Techniques.</p>
                                </div>
                                <div className="tpn_card">
                                    <h5>Cocomo I Intermediate</h5>
                                    <p>Calculate Cost, Schedule, Manpower and Effort with Traditional Costing Techniques.</p>
                                </div>
                                <div className="tpn_card">

                                    <h5>Cocomo II Advanced</h5>
                                    <p>Calculate Cost, Schedule, Manpower and Effort with Traditional Costing Techniques.</p>

                                </div>
                                <div className="tpn_card">
                                    <h5>Function Points</h5>
                                    <p>Calculate Cost, Schedule, Manpower and Effort with Traditional Costing Techniques.</p>
                                </div>
                                <div className="tpn_card">
                                    <h5>Use Case</h5>
                                    <p>Calculate Cost, Schedule, Manpower and Effort with Traditional Costing Techniques.</p>
                                </div>

                            </div>


                        </div>
                    </div>
                </div>
                <div className="container">

                    <div className="row mt-5 mb-5 planningpoker">
                        <div className="col-md-6">
                            <h4>What is Agile Planning Poker?</h4>
                            <p className=''>In Agile software development, accurate estimation of tasks is crucial for effective planning and project success. Agile Planning Poker is a collaborative technique that leverages the wisdom of the team to estimate effort, complexity, or relative size of user stories or tasks. In this article, we will delve into the details of Agile Planning Poker, its benefits, and how it can revolutionize the estimation process for Agile teams.Agile Planning Poker, also known as Scrum Poker, is a consensus-based estimation technique used in Agile projects. It involves a team of individuals with diverse expertise collectively assigning effort points or story points to user stories, features, or tasks. This technique facilitates discussion, knowledge sharing, and alignment among team members, ensuring a more accurate estimation process.
                            </p>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <img className='image_what' src={What} alt="" />
                        </div>

                    </div>
                </div>
                <div className="container mt-5 mb-5">
                    <h2 className='text-center my-4'>About us</h2>
                    <div className="row planningpoker about-cont shadow px-4 m-1">
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="mt-4">

                                <h4 className=''>Tracko Mission</h4>
                                <p>Our mission is to empower agile software development teams to overcome the challenges of project estimation and resource management with our state-of-the-art Agile Estimation Tool. By integrating diverse estimation techniques—including Lines of Code (LOC), Function Point (FP) Metrics, use cases, and COCOMO II—we offer comprehensive solutions that ensure accurate project sizing, effort prediction, and cost calculation.</p>
                            </div>

                        </div>
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <img className='image_what-2' src={tech1} alt="" />
                        </div>
                    </div>
                </div>
                <div className="container mt-5 mb-5">
                    <div className="row planningpoker about-cont shadow px-4 m-1">
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="mt-4">

                                <h4>Tracko Vision</h4>
                                <p>Empower agile teams with precision and collaboration. Revolutionize project estimation with cutting-edge technology. Deliver high-quality projects on time and within budget. Lead the future of agile project management.</p>
                            </div>

                        </div>
                        <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <img className='image_what-2' src={tech1} alt="" />
                        </div>
                    </div>
                </div>

                <div className="container mb-2">
                    <hr />
                    <p className='text-center'>All Rights Reversed © 2024 | Tracko</p>
                </div>


            </div>
        </>
    )
}

export default Landing

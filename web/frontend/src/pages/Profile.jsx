import React from 'react'
let fakeInterrupt= [
    {
        name: "Sick Leave",
        hours: 4
    },
    {
        name: "Meetings",
        hours: 1
    },
    {
        name: "Calls",
        hours: 4
    }
]
const interruptType =
    [
        'Sick time',
        'Reviews and walk-throughs',
        'Interviewing candidates',
        'Meetings',
        'Demonstrations',
        'Personnel issues',
        'Phone calls',
        'Special projects',
        'Management review',
        'Training Email',
        'Reviews and walk-throughs',
        'Interviewing candidates',
        'Task Switching',
        'Bug fixing in current releases',
        "Others"

    ]
export default function Profile() {
    const [interrupts, setInterrupts] = React.useState(fakeInterrupt)
    const [interrupt, setInterrupt] = React.useState({
        name: "",
        hours: ""
    })
    const [inputEvent, setInputEvent] = React.useState({
        interrupt: false,
        otherInterrupts:false

    })
    const [additionalInterrupt,setAdditionalInterrupt] = React.useState('')
    const onBlurHandle = () => {
        if (inputEvent.interrupt && interrupt.name && interrupt.hours && interrupt.hours>0) {
            interrupts.push({ name: interrupt.name, hours: interrupt.hours })
            setInputEvent(!interrupt)

        }
        setInputEvent({
            ...inputEvent,
            interrupt: false
        })
    }
    const removeItem = (index) => {
        
        setInterrupts((prevInterrupts) => {
            const newInterrupts = [...prevInterrupts];
            newInterrupts.splice(index, 1);
            return newInterrupts;
          });
    };
    return (
        <div className='container my-0 px-0 ps-4' >
            <div className="row mt-4">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Profile</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h1 className="display-5">
                        Profile
                    </h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-container">
                        <div className="row">
                            <div className="col">
                                <div className="mb-2">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" placeholder="Name" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-2">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" placeholder="Email" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-2">
                                    <label htmlFor="phone-num" className="form-label">Phone Number</label>
                                    <input type="text" className="form-control" id="phone" placeholder="Phone Number" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="mb-2">
                                    <label htmlFor="pass" className="form-label">Password</label>
                                    <input type="password" className="form-control" id="password" placeholder="Password" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-4">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <input type="text" className="form-control" id="role" placeholder="Role" />
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <h1 className="display-6 text-center">
                                    Interrupt Hours
                                </h1>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col d-flex justify-content-center align-items-center'>
                                <table className='table' style={{ width: 'fit-content' }}>
                                    <tbody>
                                        {interrupts.length > 0 ? (
                                            interrupts.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td className='px-5'>{item.hours}</td>
                                                    <td >
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <button className="btn btn-danger btn-sm"
                                                            onClick={()=>{removeItem(index)}}
                                                            >
                                                                -</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td>No Interrupts</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            {inputEvent.interrupt ? (
                                <div className='col d-flex justify-content-center align-items-center'>
                                    <div className='mb-3 me-3'>
                                        <select
                                            className='form-select'
                                            defaultValue
                                            onChange={(e) => {
                                                setInterrupt((prevInputEvent) => ({
                                                    ...prevInputEvent,
                                                    name: e.target.value
                                                }));
                                                e.target.value=="Others"?setInputEvent((prevInputEvent) => ({
                                                    ...prevInputEvent,
                                                    otherInterrupts: true
                                                })):setInputEvent((prevInputEvent) => ({
                                                    ...prevInputEvent,
                                                    otherInterrupts: false
                                                }))
                                            }}
                                        // onBlur={onBlurHandle}
                                        >
                                            <option value='' disabled selected>
                                                {interrupt.name ? interrupt.name : "Select Interrupt Type"}

                                            </option>
                                            {interruptType.map((item, index) => (
                                                <option key={index} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                    {
                                        inputEvent.otherInterrupts && <div className='mb-3 mx-2'>
                                            <input
                                                type='text'
                                                className='form-control'
                                                id='interruptName'
                                                placeholder='Type'
                                                onChange={(e) => {setAdditionalInterrupt(e.target.value);}}
                                            />
                                        </div>
                                    }
                                    <div className='mb-3'>
                                        <input
                                            type='number'
                                            className='form-control'
                                            id='interruptHours'
                                            placeholder='Hours'
                                            onBlur={onBlurHandle}
                                            onChange={(e) => {
                                                setInterrupt((prevInputEvent) => ({
                                                    ...prevInputEvent,
                                                    hours: e.target.value
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className='col d-flex justify-content-center align-items-center'>
                                    <span
                                        className='me-4'
                                        onClick={() => {
                                            setInputEvent({
                                                ...inputEvent,
                                                interrupt: true,
                                            });
                                        }}
                                        style={{cursor:"pointer"}}
                                    >
                                        + Add Interrupt
                                    </span>
                                </div>
                            )}
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <h1 className="display-6 text-center">
                                    Velocity
                                </h1>
                            </div>

                        </div>
                        <div className="row mt-3">
                            <div className="col">
                                <div className="mb-3 d-flex justify-content-center align-items-center">
                                    <input type="text" style={{
                                        width: "fit-content"
                                    }} className="form-control" id="velocity" placeholder="Story points per Sprint" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

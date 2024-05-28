import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { doc, updateDoc, deleteDoc, collection,onSnapshot,getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';

const SprintDetailsModal = ({ sprint, show, onClose }) => {
    if (!sprint) return null;

    const handleProgressChange = async (itemId, newProgress) => {
        const collectionRef = collection(database, 'sprint');
        
        // Fetch the snapshot once (instead of listening to real-time updates)
        const querySnapshot = await getDocs(collectionRef);
    
        // Extract the sprint document that matches the sprint ID
        const info = querySnapshot.docs
            .map((doc) => sprint.id === doc.id && doc.data())
            .filter((item) => item !== false);
    
        if (info.length > 0) {
            // Add the new progress to the item
            const item = info[0];
            const itemIndex = item.sprintItems.findIndex(
                (sprintItem) => sprintItem.product_backlog_id === itemId || sprintItem.usecase_id === itemId
            );
    
            if (itemIndex !== -1) {
                item.sprintItems[itemIndex].progress = newProgress;
            }
    
            // Update the sprint document in the database
            const sprintRef = doc(database, 'sprint', sprint.id);
            await updateDoc(sprintRef, {
                sprintItems: item.sprintItems
            });
        }
    };
    

    const handleDeleteSprint = async () => {
        const sprintRef = doc(database, 'sprint', sprint.id);
        await deleteDoc(sprintRef);
        onClose();
    }
    

    return (
        <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" aria-labelledby="sprintDetailsModalLabel" aria-hidden={!show}>
            <div className="modal-dialog modal-lg" style={{ maxWidth: '80%' }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="sprintDetailsModalLabel">Sprint Details</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <h5>Sprint Length: {sprint.sprintLength} weeks</h5>
                        <h5>Working Days: {sprint.workingDays}</h5>
                        <h5>Office Hours per Day: {sprint.officeHoursPerDay}</h5>
                        <h5>Total Availability Hours: {sprint.totalAvailabilityHours.toFixed(2)}</h5>
                        <h5>Story Points per Sprint: {sprint.storyPointsPerSprint}</h5>
                        <h5>Total Story Points: {sprint.totalStoryPoints.toFixed(2)}</h5>
                        <h5>Total Usecase Points: {sprint.totalUsecasePoints}</h5>
                        <h5>Salary As Per Available Days: {sprint.SalaryAsPerAvailableDays}</h5>
                        <h5>Converted Amount: {sprint.convertedAmount}</h5>
                        <h5>Currency Conversion Weight: {sprint.currencyConversionWeight}</h5>
                        <h5>Hours Per Story Point: {sprint.hrsPerStoryPoint}</h5>
                        <h5>Inflation Rate: {sprint.inflationRate}</h5>
                        <h5>PKR Rate: {sprint.pkrRate}</h5>
                        <h5>Second Converted Amount: {sprint.secondConvertedAmount}</h5>
                        <h5>Second Current Currency Rate: {sprint.secondCurrentCurrencyRate}</h5>
                        <h5>Second Selected Currency: {sprint.secondSelectedCurrency}</h5>
                        <h5>Selected Currency: {sprint.selectedCurrency}</h5>

                        <div className="mt-4">
                            <h6>User Stories:</h6>
                            <table className="table table-striped" style={{ marginLeft: "0px" }}>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Story Points</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprint.sprintItems.filter(item => item.product_backlog_id).map(item => (
                                        <tr key={item.product_backlog_id}>
                                            <td>{item.title}</td>
                                            <td>{item.storyPoints}</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    defaultValue={item.progress}
                                                    onChange={(e) => handleProgressChange(item.product_backlog_id, e.target.value)}
                                                >
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <h6>Usecases:</h6>
                            <table className="table table-striped" style={{ marginLeft: "0px" }}>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Points</th>
                                        <th>Description</th>
                                        <th>Steps</th>
                                        <th>Pre Condition</th>
                                        <th>Post Condition</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprint.sprintItems.filter(item => item.usecase_id).map(item => (
                                        <tr key={item.usecase_id}>
                                            <td>{item.usecase.title}</td>
                                            <td>{item.useCasePoints}</td>
                                            <td>{item.usecase.description}</td>
                                            <td>{item.usecase.steps}</td>
                                            <td>{item.usecase.pre_condition}</td>
                                            <td>{item.usecase.post_condition}</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    defaultValue={item.progress}
                                                    onChange={(e) => handleProgressChange(item.usecase_id, e.target.value)}
                                                >
                                                    <option value="Not Started">Not Started</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4">
                            <h6>Team Members:</h6>
                            <table className="table table-striped" style={{ marginLeft: "0px" }}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Availability Days</th>
                                        <th>Interrupt Hours</th>
                                        <th>Per Day Salary</th>
                                        <th>Salary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprint.teamMembers.map((member, index) => (
                                        <tr key={index}>
                                            <td>{member.name}</td>
                                            <td>{member.availabilityDays}</td>
                                            <td>{member.interruptHours}</td>
                                            <td>{member.perDaySalary}</td>
                                            <td>{member.salary}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={handleDeleteSprint}>Delete Sprint</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprintDetailsModal;

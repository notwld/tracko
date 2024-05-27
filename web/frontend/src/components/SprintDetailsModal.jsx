import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SprintDetailsModal = ({ sprint, show, onClose }) => {
    if (!sprint) return null;

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
                            <ul>
                                {sprint.sprintItems.filter(item => item.product_backlog_id).map(item => (
                                    <li key={item.product_backlog_id}>{item.title} - {item.storyPoints} points</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <h6>Usecases:</h6>
                            <ul>
                                {sprint.sprintItems.filter(item => item.usecase_id).map(item => (
                                    <li key={item.usecase_id}>
                                        {item.usecase.title} - {item.useCasePoints} points
                                        <ul>
                                            {item.usecase.actors.map(actor => (
                                                <li key={actor.actor_id}>
                                                    {actor.name} - Weight: {item.actorWeights[actor.name]}
                                                </li>
                                            ))}
                                        </ul>
                                        <p><strong>Description:</strong> {item.usecase.description}</p>
                                        <p><strong>Steps:</strong> {item.usecase.steps}</p>
                                        <p><strong>Pre Condition:</strong> {item.usecase.pre_condition}</p>
                                        <p><strong>Post Condition:</strong> {item.usecase.post_condition}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-4">
                            <h6>Team Members:</h6>
                            <ul>
                                {sprint.teamMembers.map((member, index) => (
                                    <li key={index}>
                                        {member.name} - Availability Days: {member.availabilityDays}, Interrupt Hours: {member.interruptHours}, Per Day Salary: {member.perDaySalary}, Salary: {member.salary}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprintDetailsModal;

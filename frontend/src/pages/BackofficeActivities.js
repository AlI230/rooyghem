import React, { useEffect, useState } from 'react';
import BackofficeMenu from '../components/BackofficeMenu';
import Navbar from '../components/Navbar';
import ActivityListEl from '../components/ActivityListEl';
import '../style/backoffice.css';

const BackofficeActivitiesPage = () => {
    const user = JSON.parse(localStorage.getItem('tokens'));
    console.log("User: ");
    console.log(user);
    const [activities, setActivities] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/activities/me`, { 'credentials': 'include' });
            const json = await res.json();
            if (res.statusCode === 401) {
                setMessage("Authorazation mislukt probeer opnieuw in te loggen");
            }
            setActivities(json.activities);
        }

        fetchData();
    }, [setActivities]);

    if (!activities) {
        return (
            <>
                <Navbar />
                <main class="container" id="backofficecontainer">
                    <BackofficeMenu />
                    {message ? <p>{message}</p> : <p>Aan het laden...</p>}
                </main>
            </>
        );
    }
    return (
        <>
            <Navbar />
            <main class="container" id="backofficecontainer">
                <BackofficeMenu />
                <div class="interface">
                    <h2>Activiteiten</h2>
                    <div className="info">
                        {activities.map(activity => (
                            <ActivityListEl activity={activity} />
                        ))}
                    </div>
                    <a href="/backoffice/activities/create" class="addLink">Nieuwe activiteit</a>
                </div>
            </main>
        </>
    );
}

export default BackofficeActivitiesPage;

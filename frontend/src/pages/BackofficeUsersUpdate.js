import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackofficeMenu from '../components/BackofficeMenu';
import '../style/backoffice.css'
import CreateUsersForm from '../components/CreateUsersForm';

function BackofficeUsersUpdate() {
    const params = useParams();

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:2000/users/single/' + params.user_id, {'credentials': 'include'});
            const json = await res.json();
            setUserInfo(json.user);
            console.log(json.user);
        }

        fetchData();
    }, [setUserInfo, params.user_id]);

    if(!userInfo) {
        return(
            <>
            <Navbar />
            <main className="container" id="backofficecontainer">
                <BackofficeMenu />
                <p>Aan het laden...</p>
            </main>
        </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="container" id="backofficecontainer">
                <BackofficeMenu />
                <CreateUsersForm userInfo={userInfo} />
            </main>
        </>
    )
}

export default BackofficeUsersUpdate;

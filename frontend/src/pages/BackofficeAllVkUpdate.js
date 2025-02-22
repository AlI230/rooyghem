import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BackofficeMenu from '../components/BackofficeMenu';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const BackofficeAllVkUpdate = () => {

    const { group_id } = useParams()

    const [story, setStory] = useState(null);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/vk/allvk/` + group_id, { 'credentials': 'include' });
            const json = await res.json();
            if (res.statusCode === 401) {
                setMessage("Authorisatie mislukt, probeer opnieuw in te loggen");
            } else {
                setStory(json.vk);
            }
        };

        fetchData();
    }, [setStory, setMessage]);

    const updateVk = async e => {
        e.preventDefault();
        const data = {
            story
        }

        const requestOptions = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch(`${process.env.REACT_APP_BACKEND_HOST}/vk/allvk/` + group_id, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.statuscode === 200) {
                    setMessage(data.message)
                } else if (data.statuscode === 401) {
                    console.log(data.error);
                    setMessage("Er is een authorisatiefout: " + data.error);
                } else {
                    console.log(data.error);
                    setMessage("Er is een fout opgetreden: " + data.error);
                }
            })
    };

    if (!story) {
        return (
            <>
                <Navbar />
                <main id="container" id="backofficecontainer">
                    <BackofficeMenu />
                    <p>Aan het laden...</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main id="container" id="backofficecontainer">
                <BackofficeMenu />
                <div id="backofficecreation">
                    <div id="vkForm">
                        <p>{message}</p>
                        <h1>Verhalend kader</h1>
                        <ReactQuill theme="snow" value={story} onChange={setStory} />
                        <button onClick={updateVk}>Post vk</button>

                    </div>
                </div>
            </main>
        </>
    )
}

export default BackofficeAllVkUpdate;

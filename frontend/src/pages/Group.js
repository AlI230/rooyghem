import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GroupOverview from '../components/GroupOverview';
import LeaderOverview from '../components/Leader';
import '../style/group.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styled from '@emotion/styled';

export const StyleWrapper = styled.div`
    .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
        background: #f98d1e;
        border-color: #f98d1e;
        width:  auto;
        padding: 5px 5px 5px 5px
    }

    .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary:focus{
        outline: none;
    }
`

const GroupPage = () => {
    const params = useParams();
    const isAspiranten = params.group_name === "aspiranten";
    const [groupInfo, setGroupInfo] = useState();
    const [locationInfo, setLocationInfo] = useState();
    const [leaderInfo, setLeaderInfo] = useState();
    const [albums, setAlbums] = useState();
    const [activities, setActivities] = useState([]);
    const [aspiranten, setAspiranten] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/groups/` + params.group_name + '/info');
            const json = await res.json();
            setGroupInfo(json.group);
            setLocationInfo(json.location);
            setLeaderInfo(json.leaders);
            if (json.albums) {
                setAlbums(json.albums);
            } else {
                setAlbums([]);
            }
            if (json.activities) {
                setActivities(json.activities);
            } else {
                setActivities([]);
            }
            if(isAspiranten) {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_HOST}/aspiranten/`);
                const json = await res.json();
                setAspiranten(json.aspis);
            }
        }

        fetchData();
    }, [params.group_name, setGroupInfo, setLocationInfo, setLeaderInfo, setAspiranten, isAspiranten]);

    if (!groupInfo || !locationInfo || !leaderInfo || !albums || (isAspiranten && !aspiranten)) {
        return (<div>Aan het laden...</div>);
    }

    return (
        <>
            <Navbar />
            <main class="container" id="groupcontainer">
                <div class="info">
                    <GroupOverview logo={groupInfo.logo} location_name={locationInfo.name} location_adress={locationInfo.adress} contact={groupInfo.contact} />
                    {params.group_name == 'aspiranten' ? (
                            <>
                                <div class="groupleaders">
                                    <div id="groupleaders-title">
                                        <h2>Aspiranten</h2>
                                    </div>
                                    <div id="groupleaders-content">
                                        {aspiranten.map(aspi => (
                                            <LeaderOverview picture={process.env.REACT_APP_BACKEND_HOST + aspi.picture} firstname={aspi.firstname} lastname={aspi.lastname} />
                                        ))}
                                    </div>
                                </div>
                            </>
                    ) : (<>
                        <div id="groupstory">
                        <h3>Verhalend Kader</h3>
                        <div id="vkDiv">
                            <ReactQuill value={groupInfo.story} readOnly={true} theme="bubble" />
                        </div>
                    </div>
                    </>)}
                    <StyleWrapper>
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            themeSystem={"darkly"}
                            height={500}
                            locale="nl"
                            initialView="dayGridMonth"
                            dayMaxEventRows={2}
                            events={activities}
                            eventColor="#f98d1e"
                        />
                    </StyleWrapper>
                </div>
                <div class="albums">
                    <h2>Albums</h2>
                    <div class="interface">
                        {
			 albums.length !== 0 ? (
                                <>
                                    {albums.map(groupedAlbum => (
                                        <>
                                            <h3>{groupedAlbum.date}</h3>
                                            <div class="info">
                                                {groupedAlbum.albums.map(album => (
                                                    <a href={`/albums/groups/${params.group_name}/${album.album_id}`}>
                                                        <div class="interfaceinfo">
                                                            <div class="interfaceinfo-inner">
                                                                <img src={`${process.env.REACT_APP_BACKEND_HOST}/public/images/album1.svg`} width="50" height="auto" />
                                                                <p>{album.name}</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </>
                                    ))}
                                </>
                            ) : (
                                <p>Nog geen albums te zien!</p>
                            )
                        }
                    </div>
                </div>
                <div class="groupleaders">
                    <div id="groupleaders-title">
                        <h2>Leiders</h2>
                    </div>
                    <div id="groupleaders-content">
                        {leaderInfo.map(leader => (
                            <LeaderOverview picture={leader.picture} firstname={leader.firstname} lastname={leader.lastname} contact={leader.email} isBanleader={leader.is_banleader} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default GroupPage;

import React from "react";
import EventList from "../Feed/EventList";
import ChatList from "../Chat/ChatList";
import BirthdayList from "../Feed/BirthdayList";
import Advertisement from "../Feed/Advertisement";
import CommunityChats from "../Chat/CommunityChats";
import GroupChats from "../Chat/GroupChats";

const RightPanel = () => {
  return (
    <>
    <ChatList />
    <EventList />
    {/* <BirthdayList /> */}  
    <CommunityChats />
    <Advertisement />
    {/* <GroupChats /> */}
    </>
  );
};

export default RightPanel;

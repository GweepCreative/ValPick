import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AgentCard, { Agent } from "../components/AgentCard";
import { LinearGradient } from "expo-linear-gradient";
var ws = new WebSocket("ws://192.168.1.33:7890/Echo");
export default function Home() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(null); // [1]
  const [pickedAgent, setPickedAgent] = useState<Agent>(null); // [2]
  const [wsStatus, setWsStatus] = useState<
    "Online" | "Offline" | "Reconnecting"
  >("Offline");
  const getAgents = async () => {
    try {
      const response = await fetch("https://valorant-api.com/v1/agents");
      const data = await response.json();
      var filteredData = data.data.filter((agent) => agent.isPlayableCharacter);
      setAgents(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    startWebSocket();
    getAgents();
  }, []);

  const startWebSocket = () => {
    console.log("Websocket started.");
    ws = new WebSocket(`ws://192.168.1.33:7890/Echo`);
    ws.onopen = () => {
      console.log("Connected");
      setWsStatus("Online");
    };

    ws.onmessage = (e) => {
      console.log(`Received: ${e.data}`);
      handleReceive(e.data);
    };
    ws.onclose = (e) => {
      setWsStatus("Offline");
      console.log("Reconnecting: ", e.message);
      setTimeout(startWebSocket, 5000);
      setWsStatus("Reconnecting");
    };
    ws.onerror = (e) => {
      console.log(`Error: ${e.message}`);
    };
  };

  const handleReceive = (text: string) => {};
  const handleSend = (message) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  const pickAgent = (agent: Agent) => {
    if (pickedAgent?.uuid === agent.uuid) {
      handleSend("unpick");
      return setPickedAgent(null);
    }
    if(pickedAgent) handleSend("unpick");

    setPickedAgent(agent);
    handleSend(agent.uuid);
  };
  return (
    <>
      <StatusBar style="light" backgroundColor="#0E0E0E" />
      <StatusBar style="light" backgroundColor="#0E0E0E" />
      <StatusBar style="light" backgroundColor="#0E0E0E" />
      <View className="bg-background flex-1 ">
        <View className=" flex flex-row justify-center items-center py-3">
          <Text className="text-valred font-bold text-2xl">VAL</Text>
          <Text className="text-white font-bold text-2xl">PICKER</Text>
        </View>
        <View className="flex justify-center items-center w-full">
          <View className="flex-row justify-between w-full px-4">
            <Text className="text-valred font-bold text-xl">Agents</Text>
            <Text
              className={
                "text-sm " +
                (wsStatus === "Online" ? "text-green-500" : " ") +
                (wsStatus === "Reconnecting" ? "text-orange-500" : " ") +
                (wsStatus === "Offline" ? "text-red-500" : " ")
              }
            >
              Server: {wsStatus}
            </Text>
          </View>
          <View className="  w-full px-2 mt-4">
            <FlatList
              data={agents}
              numColumns={5}
              columnWrapperStyle={{
                justifyContent: "space-between",
                padding: 5,
              }}
              key={"_"}
              keyExtractor={(item) => "_" + item.uuid}
              renderItem={({ item }) => (
                <AgentCard
                  agent={item}
                  onSelect={(agent) => setSelectedAgent(agent)}
                  isSelected={selectedAgent?.uuid === item.uuid}
                />
              )}
            />
          </View>
          <View className="w-full p-4 justify-center items-center">
            <Text className="text-white font-bold text-xl mb-4">
              {selectedAgent ? selectedAgent.displayName : ""}
            </Text>
            <View className="justify-center items-center">
              <Image
                src={selectedAgent?.fullPortrait}
                className="w-48 h-48  z-10"
              />
              <Image
                src={selectedAgent?.background}
                className="opacity-25 w-full h-48 absolute -z-50"
              />
            </View>
            {selectedAgent && (
              <LinearGradient
                // Background Linear Gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={[
                  "transparent",
                  `#${selectedAgent.backgroundGradientColors[0]}`,
                ]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  opacity: 0.2,
                  bottom: -25,
                  zIndex: -10,
                  height: 250,
                }}
              />
            )}
            <Pressable
              disabled={!selectedAgent}
              onPress={() => {
                pickAgent(selectedAgent);
              }}
              className={
                "px-4 py-4 bg-valred w-full justify-center items-center my-4" +
                (!selectedAgent ? " opacity-50" : "") +
                (pickedAgent ? " bg-green-500" : "")
              }
            >
              <Text className="text-white font-bold text-xl">
                {pickedAgent ? `PICKED ${pickedAgent.displayName}` : "PICK"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

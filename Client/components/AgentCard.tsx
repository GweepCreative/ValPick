import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

export type Agent = {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  fullPortrait: string;
  displayIcon: string;
  background: string;
  backgroundGradientColors: string[];
};

export default function AgentCard({
  agent,
  onSelect,
  isSelected,
}: {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  isSelected: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(agent)}
      className={
        "w-16 h-16  justify-center items-center bg-button p-2 rounded-lg border-border border-4" +
        (isSelected ? " border-valred/75" : "")
      }
    >
      <Image
        src={agent.displayIcon}
        alt={agent.displayName}
        className="w-14 h-14"
      />
    </TouchableOpacity>
  );
}

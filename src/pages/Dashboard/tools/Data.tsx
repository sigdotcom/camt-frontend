import React, { useState, useEffect } from "react";
import { useListSensors } from "../../../api/sensors";
import { DynamicGraph } from "../../../components/Graph";

const Data: React.FC = () => {
  const { data: sensorData, isLoading: listSensorLoading } = useListSensors();

  if (listSensorLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <DynamicGraph data={sensorData} />
    </div>
  );
};

export default Data;

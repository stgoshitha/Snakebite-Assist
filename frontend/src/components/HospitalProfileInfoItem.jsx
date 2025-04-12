import React from "react";

const HospitalProfileInfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-2 text-gray-700">
      <Icon size={25} />
      <div>
        <div className="font-semibold">{value}</div>
        <div className="text-sm text-gray-500 font-semibold">{label}</div>
      </div>
    </div>
  );
};

export default HospitalProfileInfoItem;

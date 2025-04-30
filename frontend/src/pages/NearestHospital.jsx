import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MdMyLocation } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { BiGlobe } from "react-icons/bi";
import { IoLocationSharp } from "react-icons/io5";
import { GiPathDistance } from "react-icons/gi";
import { FaHospital, FaRegAddressCard } from "react-icons/fa";
import { Ri24HoursLine } from "react-icons/ri";
import { TbCircleDotFilled } from "react-icons/tb";
import { renderToStaticMarkup } from "react-dom/server";
import { capitalizeWords } from "../utils/textUtils";
import ImageSlider from "../components/ImageSlider";
import Loading from "../components/common/Loading";
import Header from "../components/common/Header";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const NearestHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSliderOpen, setSliderOpen] = useState(false);

  const userLocationIcon = new L.DivIcon({
    html: renderToStaticMarkup(
      <MdMyLocation size={40} className="text-red-500 shadow-2xl" />
    ),
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const openIcon = new L.DivIcon({
    html: renderToStaticMarkup(
      <IoLocationSharp size={40} className="text-green-700 shadow-2xl" />
    ),
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const closedIcon = new L.DivIcon({
    html: renderToStaticMarkup(
      <IoLocationSharp size={40} className="text-red-700 shadow-2xl" />
    ),
    className: "",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const handleImageClick = (images) => {
    setSelectedImage(images);
    setSliderOpen(true);
  };

  const closeSlider = () => {
    setSliderOpen(false);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        try {
          const response = await axios.get(
            "http://localhost:3000/api/search/hospitals/nearest",
            {
              params: {
                lat: latitude,
                lng: longitude,
              },
            }
          );
          setHospitals(response.data.data);
        } catch (err) {
          setError("No nearby hospitals found or server error");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location access denied or unavailable");
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header/>
      <div>
      <div className="p-4 max-w-6xl mx-auto">
      <div className="p-6 space-y-2 bg-white rounded-xl shadow-sm mb-6">
      <h2 className="text-3xl font-bold">
        Nearest Hospitals
      </h2>
      </div>

      {userLocation && (
        <MapContainer
          center={userLocation}
          zoom={12}
          style={{ height: "400px", width: "100%" }}
          className="mb-8 rounded shadow relative"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>Your Location</Popup>
          </Marker>

          {hospitals.map((hospital, index) => (
            <Marker
              icon={hospital.isOpenNow ? openIcon : closedIcon}
              key={hospital._id || index}
              position={[
                hospital.location.coordinates[1],
                hospital.location.coordinates[0],
              ]}
            >
              <Popup
                className={`${
                  hospital.isOpenNow
                    ? "bg-green-600 border border-green-800"
                    : "bg-red-600 border border-red-800"
                } p-4 rounded-lg shadow-lg text-white`}
              >
                <strong className="text-xl flex items-center gap-2">
                  <FaHospital />
                  {hospital.hospitalName}
                </strong>
                <br />
                <span className="flex items-center gap-2">
                  <FaRegAddressCard />
                  {hospital.address}
                </span>
                <br />
                <span className="text-red-500 text-lg flex items-center gap-2">
                  <GiPathDistance />
                  {hospital.distanceInKm} km away
                </span>
                <br />
                <span className="flex items-center gap-2">
                  <FiPhone />
                  {hospital.phoneNumber}
                </span>
                <br />
                <div
                  className={`${
                    hospital.isOpenNow ? "bg-green-600" : "bg-red-600"
                  } flex justify-center items-center rounded-full w-[70px] px-2 py-1 shadow-lg text-white`}
                >
                  <div>{hospital.isOpenNow ? "Open" : "Closed"}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {hospitals.map((hospital, index) => (
        <div
          key={hospital._id || index}
          className="bg-white shadow rounded-lg p-6 mb-6"
        >
          <div className="p-4 space-y-2 bg-white rounded-xl shadow-sm mb-6">
            <div className="flex justify-between items-start mb-2">
              <div className="text-2xl font-bold">
                {index + 1}. {capitalizeWords(hospital.hospitalName)} -{" "}
                {capitalizeWords(hospital.city)}
              </div>
              <div
                className={
                  hospital.isOpenNow
                    ? "text-green-600 font-semibold border py-1 px-4 rounded-2xl text-sm"
                    : "text-red-600 font-semibold border py-1 px-4 rounded-2xl text-sm"
                }
              >
                {hospital.isOpenNow ? (
                  <div className="flex items-center gap-2">
                    <TbCircleDotFilled size={20} />
                    <p>Open</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TbCircleDotFilled size={20} />
                    <p>Closed</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-top mb-4 gap-10">
            <div className="flex-1 flex flex-col gap-5">
              <div className="flex items-center gap-2 text-gray-700">
                <div className="flex-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaHospital size={25} />
                    <p>{hospital.hospitalType}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaRegAddressCard size={25} />
                    <p>{hospital.address}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <GiPathDistance size={25} />
                    <p>{hospital.distanceInKm} km</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Ri24HoursLine size={25} />
                    <p>
                      {hospital.is24hrService ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex p-4 pr-20 justify-between bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <FiPhone size={25} />
                  <p>{hospital.phoneNumber}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MdEmail size={25} />
                  <p>{hospital.email}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BiGlobe size={25} />
                  <p>{hospital.webSiteLink || "No link to show"}</p>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps?q=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-800"
              >
                <IoLocationSharp size={20} />
                <span>View on Google Maps</span>
              </a>
            </div>

            <div>
              {hospital.hospitalImages?.[0] && (
                <img
                  src={hospital.hospitalImages[0]}
                  alt="Hospital"
                  className="w-[200px] mt-4 rounded shadow cursor-pointer"
                  onClick={() => handleImageClick(hospital.hospitalImages)}
                />
              )}
            </div>
          </div>
        </div>
      ))}

      {isSliderOpen && (
        <ImageSlider
          images={selectedImage}
          onClose={closeSlider}
          onImageClick={(image) => setSelectedImage([image])}
        />
      )}
    </div>
      </div>
    </div>
  );
};

export default NearestHospital;

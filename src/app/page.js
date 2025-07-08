'use client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import P2PSlider from "../components/P2PSlider";

const Home = () => {
  const handleAccept = () => {
    toast.success("Challenge Accepted!");
    // Here you would trigger the next action in your app
  };

  const handleDecline = () => {
    toast.error("Challenge Declined!");
    // Here you would trigger the next action in your app
  };

  return (
    <main>
      <P2PSlider onAccept={handleAccept} onDecline={handleDecline} />
      <ToastContainer position="top-right" autoClose={3000} />
    </main>
  );
};

export default Home;

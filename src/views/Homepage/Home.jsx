import Navbar from "../../Components/navbar/Navbar";
import './Home.css';
import Header from "../../Components/Header/Header";
import TodaysSpecials from '../../Components/TodaySpecial/TodaySpecial'
import Aboutus from "../../Components/Aboutus/Aboutus";
import Footer from "../../Components/Footer/Footer";



function Home() {
  return (
    <div className="Homeconta">
      <Header/>
      <TodaysSpecials/>
      <Aboutus/>
      <Footer/>

      
    </div>
  );
}

export default Home;


import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-[#2D097F] w-screen  ">
        <div className="grid  gap-4 items-start mt-8 justify-center p-8 ">
          <div className="relative">
            <div className="  inset-0.5   flex flex-col items-center   p-4 rounded-lg leading-none  ">
              <div className="  relative shadow-xl bg-[#693DCE] shadow-[#189AB4] rounded-lg h-32 flex  ">
                <div className="  p-10 flex flex-col  ">
                  <span className="text-xl  font-poppins">
                    Welcome to My Game!
                  </span>
                  <span className="text-gray-600">
                    Get ready for an amazing experience.
                  </span>
                </div>
                <div className="relative w-15  p-10">
                  <button
                    className=" w-20 h-9 bg-[#FF8200] hover:bg-[#FFD68A] text-black font-poppins rounded "
                    onClick={() => navigate("/Classic")}
                  >
                    Play
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" text-black  grid grid-cols-3 p-4  gap-4  ">
          <div className="shadow-lg bg-[#693DCE] flex flex-col shadow-[#189AB4]  rounded-lg">
            <span>Quick Mode</span>
            <img className="self-end" src="bot.png" width={200} height={200} />
            <button
              className="border rounded-lg"
              onClick={() => navigate("/Quick")}
            >
              Play
            </button>
          </div>
          <div className="shadow-lg flex flex-col bg-[#693DCE] shadow-[#189AB4] rounded-lg">
            <span>Classic Mode</span>
            <img className="self-end" src="bot.png" width={200} height={200} />
            <button
              className="border rounded-lg"
              onClick={() => navigate("/Classic")}
            >
              Play
            </button>
          </div>
          <div className="shadow-lg flex flex-col bg-[#693DCE] shadow-[#189AB4] rounded-lg">
            <span>Bot Mode</span>
            <img className="self-end" src="bot.png" width={200} height={200} />
            <button
              className="border rounded-lg"
              onClick={() => navigate("/Bot")}
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;

"use client"

import React from "react";

const VideoGallery = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h3 className="text-white text-lg mb-4">New Stuff</h3>
      <div className="relative w-[360px] h-[640px] overflow-hidden rounded-xl shadow-lg border border-gray-700">
        {/* Subway Surfers Video Card */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gray-900 flex flex-col items-center justify-center">
          <h2 className="text-white text-center mb-2">Subway Surfers</h2>
          <video controls className="w-full h-full object-cover rounded-md">
            <source src="/sample_vid_app2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Minecraft Parkour Video Card */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-900 flex flex-col items-center justify-center">
          <h2 className="text-white text-center mb-2">Minecraft Parkour</h2>
          <video controls className="w-full h-full object-cover rounded-md">
            <source src="/sample_vid_app2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;


//temp
// //maybe vid player? 

// import React from "react";

// const VideoGallery = () => {
//   return (
//     <div>
//         <div className="flex flex-col md:flex-row justify-center gap-4 p-4">
//         {/* Subway Surfers Video Card */}
//         <div className="bg-gray-900 p-4 rounded-xl shadow-lg max-w-md">
//             <h2 className="text-white text-center mb-2">Subway Surfers</h2>
//             <video controls className="w-full rounded-md">
//             <source src="/Users/koushiksarkar/finance-bros/public/sample_vid_app2.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//             </video>
//         </div>

//         {/* Minecraft Parkour Video Card */}
//         <div className="bg-gray-900 p-4 rounded-xl shadow-lg max-w-md">
//             <h2 className="text-white text-center mb-2">Minecraft Parkour</h2>
//             <video controls className="w-full rounded-md">
//             <source src="/Users/koushiksarkar/finance-bros/public/sample_vid_app2.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//             </video>
//         </div>
//         </div>
        
//     </div>
//   );
// };


// export default VideoGallery;
